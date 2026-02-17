// Admin Panel JavaScript with Firebase
import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc,
    query,
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const reflectionForm = document.getElementById('reflectionForm');
const reflectionsList = document.getElementById('reflectionsList');
const loginError = document.getElementById('loginError');
const charCount = document.getElementById('charCount');
const reflectionContent = document.getElementById('reflectionContent');
const clearFormBtn = document.getElementById('clearForm');

// Character counter
if (reflectionContent) {
    reflectionContent.addEventListener('input', () => {
        charCount.textContent = reflectionContent.value.length;
    });
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        showDashboard();
        loadReflections();
    } else {
        showLogin();
    }
});

// Show/Hide screens
function showLogin() {
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    logoutBtn.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'block';
    logoutBtn.style.display = 'block';
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('✓ Logged in successfully');
    } catch (error) {
        loginError.textContent = 'Invalid email or password';
        loginError.classList.add('show');
        setTimeout(() => loginError.classList.remove('show'), 3000);
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        showToast('Logged out');
    } catch (error) {
        showToast('Error logging out');
    }
});

// Create/Update Reflection
reflectionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const type = document.getElementById('reflectionType').value;
    const title = document.getElementById('reflectionTitle').value;
    const content = document.getElementById('reflectionContent').value;
    
    try {
        await addDoc(collection(db, 'reflections'), {
            type,
            title,
            content,
            createdAt: serverTimestamp(),
            published: true
        });
        
        showToast('✓ Reflection published');
        reflectionForm.reset();
        charCount.textContent = '0';
        loadReflections();
    } catch (error) {
        showToast('Error publishing reflection');
        console.error(error);
    }
});

// Clear form
clearFormBtn.addEventListener('click', () => {
    reflectionForm.reset();
    charCount.textContent = '0';
});

// Load reflections
async function loadReflections() {
    try {
        const q = query(collection(db, 'reflections'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            reflectionsList.innerHTML = '<div class="loading">No reflections yet. Create your first one above!</div>';
            return;
        }
        
        reflectionsList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const reflection = docSnap.data();
            const reflectionEl = createReflectionElement(docSnap.id, reflection);
            reflectionsList.appendChild(reflectionEl);
        });
    } catch (error) {
        reflectionsList.innerHTML = '<div class="loading">Error loading reflections</div>';
        console.error(error);
    }
}

// Create reflection element
function createReflectionElement(id, data) {
    const div = document.createElement('div');
    div.className = 'reflection-item';
    
    const date = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : 'Just now';
    
    div.innerHTML = `
        <div class="reflection-header">
            <div class="reflection-meta">
                <h3 class="reflection-title">${escapeHtml(data.title)}</h3>
                <div class="reflection-info">
                    <span class="reflection-type ${data.type}">${data.type === 'current' ? 'Current' : 'Field Note'}</span>
                    <span>${date}</span>
                </div>
            </div>
        </div>
        <div class="reflection-content">${escapeHtml(data.content)}</div>
        <div class="reflection-actions">
            <button class="btn-delete" data-id="${id}">Delete</button>
        </div>
    `;
    
    // Delete button
    const deleteBtn = div.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteReflection(id));
    
    return div;
}

// Delete reflection
async function deleteReflection(id) {
    if (!confirm('Are you sure you want to delete this reflection?')) {
        return;
    }
    
    try {
        await deleteDoc(doc(db, 'reflections', id));
        showToast('✓ Reflection deleted');
        loadReflections();
    } catch (error) {
        showToast('Error deleting reflection');
        console.error(error);
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
