// Load reflections from Firebase for public display
import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const currentsGrid = document.getElementById('currentsGrid');
const fieldnotesGrid = document.getElementById('fieldnotesGrid');

// Load reflections on page load
window.addEventListener('DOMContentLoaded', () => {
    loadReflections();
});

async function loadReflections() {
    try {
        const q = query(
            collection(db, 'reflections'),
            where('published', '==', true),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        
        const currents = [];
        const fieldnotes = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id; // Store document ID for unique frame IDs
            
            if (data.type === 'current') {
                currents.push(data);
            } else if (data.type === 'fieldnote') {
                fieldnotes.push(data);
            }
        });
        
        displayCurrents(currents);
        displayFieldNotes(fieldnotes);
        
    } catch (error) {
        console.error('Error loading reflections:', error);
        currentsGrid.innerHTML = '<div class="loading">Unable to load currents at this time.</div>';
        fieldnotesGrid.innerHTML = '<div class="loading">Unable to load field notes at this time.</div>';
    }
}

function displayCurrents(currents) {
    if (currents.length === 0) {
        currentsGrid.innerHTML = `
            <div class="reflection-card reflection-placeholder">
                <p class="reflection-placeholder-text">Currents will gather here as they emerge.</p>
            </div>
        `;
        return;
    }
    
    currentsGrid.innerHTML = '';
    
    currents.forEach(current => {
        const card = createReflectionCard(current);
        currentsGrid.appendChild(card);
    });
}

function displayFieldNotes(fieldnotes) {
    if (fieldnotes.length === 0) {
        fieldnotesGrid.innerHTML = `
            <div class="reflection-card reflection-placeholder">
                <p class="reflection-placeholder-text">Field Notes will be added as the work unfolds.</p>
            </div>
        `;
        return;
    }
    
    fieldnotesGrid.innerHTML = '';
    
    fieldnotes.forEach(note => {
        const card = createReflectionCard(note);
        fieldnotesGrid.appendChild(card);
    });
}

function createReflectionCard(data) {
    const card = document.createElement('div');
    card.className = 'reflection-card';
    
    const date = data.createdAt ? 
        new Date(data.createdAt.toDate()).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }) : '';
    
    // Generate unique ID for this reflection
    const frameId = `frame-${data.id || generateUniqueId()}`;
    
    // Regular card HTML with Share button
    card.innerHTML = `
        <h3 class="reflection-title">${escapeHtml(data.title)}</h3>
        ${date ? `<p class="reflection-date">${date}</p>` : ''}
        <div class="reflection-body">${formatContent(data.content)}</div>
        <button class="share-btn" onclick="copyReflectionAsImage('${frameId}')">
            📷 Share as Image
        </button>
    `;
    
    // Create hidden frame for image generation
    const frame = createReflectionFrame(data, frameId);
    document.body.appendChild(frame);
    
    return card;
}

function createReflectionFrame(data, frameId) {
    const frame = document.createElement('div');
    frame.className = 'reflection-frame';
    frame.id = frameId;
    
    frame.innerHTML = `
        <div class="glyph">✧</div>
        <h2>${escapeHtml(data.title)}</h2>
        <p>${escapeHtml(data.content)}</p>
        <div class="footer-tag">mindstream</div>
    `;
    
    return frame;
}

function formatContent(content) {
    // Convert line breaks to paragraphs for better readability
    return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateUniqueId() {
    return 'refl-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
