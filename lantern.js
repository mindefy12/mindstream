const STORAGE_KEY = "mindstream_lanterns_v1";

function getLanterns() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLantern(lantern) {
  const existing = getLanterns();
  existing.unshift(lantern);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

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
      parchmentPreview.innerHTML = "A quiet place<br />for what you're holding.";
    } else {
      const snippet = text.length > 80 ? text.slice(0, 77) + "…" : text;
      parchmentPreview.textContent = snippet;
    }
  });
}

function showToast(message) {
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

if (releaseButton) {
  releaseButton.addEventListener("click", () => {
    if (!intentionField) return;
    const text = intentionField.value.trim();
    if (!text) {
      showToast("Add a few words before releasing the lantern.");
      return;
    }

    const lantern = {
      id: Date.now(),
      type: currentLanternType,
      text,
      isPublic: hideToggle ? !hideToggle.checked : true, // Default public, toggle makes private
      createdAt: new Date().toISOString(),
    };

    // Glow + fade animation on parchment
    if (parchment) {
      parchment.classList.remove("glow-fade");
      void parchment.offsetWidth; // force reflow
      parchment.classList.add("glow-fade");
    }

    saveLantern(lantern);

    intentionField.value = "";
    if (parchmentPreview) {
      parchmentPreview.innerHTML = "A quiet place<br />for what you're holding.";
    }

    showToast("Lantern released into the grove.");

    setTimeout(() => {
      window.location.href = "lanterns.html";
    }, 950);
  });
}

/* Grove rendering (lanterns.html) */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("lanternGrid");
  if (!grid) return;

  const lanterns = getLanterns();
  if (!lanterns.length) {
    const empty = document.createElement("div");
    empty.className = "lantern-empty";
    empty.textContent =
      "No lanterns have been released from this browser yet. Place an intention to light the first one.";
    grid.appendChild(empty);
    return;
  }

  const labelMap = {
    amber: "Amber",
    silver: "Silver",
    verdant: "Verdant",
    rose: "Rose",
    azure: "Azure",
    twilight: "Twilight",
  };

  lanterns.forEach((lantern) => {
    const card = document.createElement("div");
    card.className = "lantern-card-item";
    card.dataset.lanternType = lantern.type; // Add data attribute for visual lantern

    const header = document.createElement("div");
    header.className = "lantern-card-header";

    const chip = document.createElement("div");
    chip.className = "lantern-chip";
    chip.dataset.type = lantern.type;
    chip.textContent = labelMap[lantern.type] || "Lantern";

    const meta = document.createElement("div");
    meta.className = "lantern-card-meta";
    const date = new Date(lantern.createdAt);
    meta.textContent = date.toLocaleString();

    header.appendChild(chip);
    header.appendChild(meta);

    const body = document.createElement("div");
    body.className = "lantern-card-body-text";
    body.textContent = lantern.isPublic
      ? "Tap to reveal the intention."
      : "This intention is kept private.";

    const toggle = document.createElement("button");
    toggle.className = "lantern-toggle";
    toggle.type = "button";
    toggle.textContent = lantern.isPublic ? "Show message" : "Message hidden";

    const message = document.createElement("div");
    message.className = "lantern-message";
    message.textContent = lantern.text;
    message.style.display = "none";

    if (lantern.isPublic) {
      toggle.addEventListener("click", () => {
        const isHidden = message.style.display === "none";
        message.style.display = isHidden ? "block" : "none";
        toggle.textContent = isHidden ? "Hide message" : "Show message";
      });
    } else {
      toggle.disabled = true;
      toggle.style.opacity = "0.6";
    }

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(toggle);
    card.appendChild(message);

    grid.appendChild(card);
  });
});
