// Lantern Grove Visual Display
import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const groveLanterns = document.getElementById('groveLanterns');

// Load and display lanterns visually
window.addEventListener('DOMContentLoaded', () => {
    loadVisualLanterns();
});

async function loadVisualLanterns() {
    try {
        const q = query(collection(db, 'lanterns'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            groveLanterns.innerHTML = `
                <div class="grove-empty">
                    <p>The grove awaits its first lantern.</p>
                </div>
            `;
            return;
        }

        groveLanterns.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const lantern = doc.data();
            const visualLantern = createVisualLantern(lantern);
            groveLanterns.appendChild(visualLantern);
        });

    } catch (error) {
        console.error('Error loading lanterns:', error);
        groveLanterns.innerHTML = `
            <div class="grove-empty">
                <p>Unable to load the lantern grove at this time.</p>
            </div>
        `;
    }
}

function createVisualLantern(lantern) {
    const lanternEl = document.createElement('div');
    lanternEl.className = `visual-lantern lantern-${lantern.type}`;
    
    // Random positioning
    const randomX = Math.random() * 80 + 10; // 10-90% from left
    const randomY = Math.random() * 70 + 10; // 10-80% from top
    const randomDelay = Math.random() * 3; // Animation delay
    
    lanternEl.style.left = `${randomX}%`;
    lanternEl.style.top = `${randomY}%`;
    lanternEl.style.animationDelay = `${randomDelay}s`;
    
    // Lantern icon
    const icon = document.createElement('div');
    icon.className = 'lantern-icon';
    icon.textContent = '🏮';
    
    // Tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'lantern-tooltip';
    
    const typeLabel = getLanternTypeLabel(lantern.type);
    const date = lantern.createdAt ? 
        new Date(lantern.createdAt.toDate()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) : 
        'Just now';
    
    tooltip.innerHTML = `
        <div class="tooltip-type">${typeLabel} Lantern</div>
        <div class="tooltip-date">${date}</div>
        <div class="tooltip-message">
            ${lantern.messageHidden ? 
                '<span class="tooltip-hidden">Message hidden by creator</span>' : 
                escapeHtml(lantern.text).substring(0, 120) + (lantern.text.length > 120 ? '...' : '')}
        </div>
    `;
    
    lanternEl.appendChild(icon);
    lanternEl.appendChild(tooltip);
    
    // Mobile: tap to toggle tooltip
    lanternEl.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close all other tooltips
        document.querySelectorAll('.visual-lantern').forEach(el => {
            if (el !== lanternEl) {
                el.classList.remove('show-tooltip');
            }
        });
        // Toggle this tooltip
        lanternEl.classList.toggle('show-tooltip');
    });
    
    // Make draggable on touch devices
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    
    lanternEl.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        
        // Get current position
        const rect = lanternEl.getBoundingClientRect();
        const parentRect = lanternEl.parentElement.getBoundingClientRect();
        initialLeft = ((rect.left - parentRect.left) / parentRect.width) * 100;
        initialTop = ((rect.top - parentRect.top) / parentRect.height) * 100;
        
        lanternEl.style.transition = 'none';
    });
    
    lanternEl.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        const parentRect = lanternEl.parentElement.getBoundingClientRect();
        const deltaXPercent = (deltaX / parentRect.width) * 100;
        const deltaYPercent = (deltaY / parentRect.height) * 100;
        
        let newLeft = initialLeft + deltaXPercent;
        let newTop = initialTop + deltaYPercent;
        
        // Keep within bounds
        newLeft = Math.max(0, Math.min(95, newLeft));
        newTop = Math.max(0, Math.min(90, newTop));
        
        lanternEl.style.left = `${newLeft}%`;
        lanternEl.style.top = `${newTop}%`;
    });
    
    lanternEl.addEventListener('touchend', () => {
        isDragging = false;
        lanternEl.style.transition = '';
    });
    
    return lanternEl;
}

// Close tooltips when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.visual-lantern').forEach(el => {
        el.classList.remove('show-tooltip');
    });
});

function getLanternTypeLabel(type) {
    const labels = {
        amber: 'Amber',
        silver: 'Silver',
        verdant: 'Verdant',
        rose: 'Rose',
        azure: 'Azure',
        twilight: 'Twilight'
    };
    return labels[type] || 'Amber';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
