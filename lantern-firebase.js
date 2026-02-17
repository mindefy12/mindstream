// Lantern System with Firebase Integration
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* Shared elements (only exist on lantern.html) */
const lanternOptions = document.getElementById("lanternOptions");
const lanternTypeLabel = document.getElementById("lanternTypeLabel");
const parchmentPreview = document.getElementById("parchmentPreview");
const releaseButton = document.getElementById("releaseButton");
const intentionField = document.getElementById("intention");
const hideToggle = document.getElementById("hideToggle");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
const parchment = document.getElementById("parchment");

let currentLanternType = "amber";

if (lanternOptions) {
  lanternOptions.addEventListener("click", (e) => {
    const btn = e.target.closest(".lantern-option");
    if (!btn) return;
    document
      .querySelectorAll(".lantern-option")
      .forEach((el) => el.classList.remove("selected"));
    btn.classList.add("selected");
    currentLanternType = btn.dataset.type || "amber";

    const labelMap = {
      amber: "Amber Lantern",
      silver: "Silver Lantern",
      verdant: "Verdant Lantern",
      rose: "Rose Lantern",
      azure: "Azure Lantern",
      twilight: "Twilight Lantern",
    };
    if (lanternTypeLabel) {
      lanternTypeLabel.textContent = labelMap[currentLanternType] || "Amber Lantern";
    }
  });
}

if (intentionField && parchmentPreview) {
  intentionField.addEventListener("input", () => {
    const text = intentionField.value.trim();
    if (!text) {
      parchmentPreview.textContent = "Your words will appear here...";
    } else {
      parchmentPreview.textContent = text.length > 80 ? text.slice(0, 80) + "..." : text;
    }
  });
}

function showToast(message) {
  if (!toast) return;
  if (toastText) toastText.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

if (releaseButton) {
  releaseButton.addEventListener("click", async () => {
    const intention = intentionField?.value.trim();
    if (!intention) {
      showToast("Please write your intention first.");
      return;
    }

    const isMessageHidden = hideToggle?.checked || false;

    const lanternData = {
      type: currentLanternType,
      text: intention,
      messageHidden: isMessageHidden,
      createdAt: serverTimestamp()
    };

    releaseButton.disabled = true;
    releaseButton.textContent = "Releasing...";

    try {
      // Save to Firebase
      await addDoc(collection(db, 'lanterns'), lanternData);

      // Animation
      if (parchment) {
        parchment.style.animation = "parchmentGlow 1s ease";
        setTimeout(() => {
          parchment.style.animation = "";
        }, 1000);
      }

      showToast("Your lantern has been released into the grove.");
      
      setTimeout(() => {
        window.location.href = "/lanterns.html";
      }, 1500);

    } catch (error) {
      console.error('Error releasing lantern:', error);
      showToast("Error releasing lantern. Please try again.");
      releaseButton.disabled = false;
      releaseButton.textContent = "Release the Lantern ✨";
    }
  });
}

/* Grove page (lanterns.html) */
const lanternGrid = document.getElementById("lanternGrid");

if (lanternGrid) {
  loadLanternsFromFirebase();
}

async function loadLanternsFromFirebase() {
  try {
    const q = query(collection(db, 'lanterns'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      lanternGrid.innerHTML = `
        <div class="lantern-card-item lantern-empty">
          <p>No lanterns have been released yet. Be the first to light one.</p>
          <a href="/lantern.html" class="lantern-primary-link">Create a Lantern</a>
        </div>
      `;
      return;
    }

    lanternGrid.innerHTML = '';

    querySnapshot.forEach((doc) => {
      const lantern = doc.data();
      const card = createLanternCard(lantern);
      lanternGrid.appendChild(card);
    });

  } catch (error) {
    console.error('Error loading lanterns:', error);
    lanternGrid.innerHTML = `
      <div class="lantern-card-item lantern-empty">
        <p>Unable to load lanterns at this time.</p>
      </div>
    `;
  }
}

function createLanternCard(lantern) {
  const labelMap = {
    amber: "Amber",
    silver: "Silver",
    verdant: "Verdant",
    rose: "Rose",
    azure: "Azure",
    twilight: "Twilight",
  };

  const typeLabel = labelMap[lantern.type] || "Amber";
  const date = lantern.createdAt ? 
    new Date(lantern.createdAt.toDate()).toLocaleDateString() : 
    'Just now';

  const card = document.createElement("div");
  card.className = `lantern-card-item lantern-type-${lantern.type}`;

  const messageContent = lantern.messageHidden
    ? `<p class="lantern-message-hidden">Message hidden by creator</p>`
    : `
        <div class="lantern-message-toggle">
          <button class="lantern-toggle-btn">Show message</button>
        </div>
        <div class="lantern-message-text" style="display:none;">
          <p>${escapeHtml(lantern.text)}</p>
        </div>
      `;

  card.innerHTML = `
    <div class="lantern-card-header">
      <span class="lantern-chip" data-type="${lantern.type}">${typeLabel}</span>
      <span class="lantern-timestamp">${date}</span>
    </div>
    <div class="lantern-card-body">
      ${messageContent}
    </div>
  `;

  if (!lantern.messageHidden) {
    const toggleBtn = card.querySelector('.lantern-toggle-btn');
    const messageText = card.querySelector('.lantern-message-text');
    
    if (toggleBtn && messageText) {
      toggleBtn.addEventListener('click', () => {
        const isVisible = messageText.style.display === 'block';
        messageText.style.display = isVisible ? 'none' : 'block';
        toggleBtn.textContent = isVisible ? 'Show message' : 'Hide message';
      });
    }
  }

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
