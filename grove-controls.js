// Pause Button Functionality for Mindstream
// Simple, clean version - only the breathing/meditation pause feature

const pauseBtn = document.getElementById('pauseBtn');
const pauseOverlay = document.getElementById('pauseOverlay');
const pauseClose = document.getElementById('pauseClose');
const pauseTimer = document.getElementById('pauseTimer');
const pauseTimeBtns = document.querySelectorAll('.pause-time-btn');

let pauseInterval;
let pauseTimeRemaining = 60; // default 1 minute
let selectedPauseDuration = 60;

// Check if all pause elements exist
if (!pauseBtn || !pauseOverlay || !pauseClose || !pauseTimer) {
    console.log('Pause feature not loaded - elements missing');
} else {
    // Open pause overlay
    pauseBtn.addEventListener('click', () => {
        pauseOverlay.classList.add('active');
        pauseTimeRemaining = selectedPauseDuration;
        updatePauseTimer();
        startPauseTimer();
    });

    // Close pause overlay
    pauseClose.addEventListener('click', () => {
        pauseOverlay.classList.remove('active');
        clearInterval(pauseInterval);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pauseOverlay && pauseOverlay.classList.contains('active')) {
            if (pauseClose) pauseClose.click();
        }
    });

    // Pause time selection buttons
    pauseTimeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            pauseTimeBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Set pause duration
            selectedPauseDuration = parseInt(btn.dataset.time);
        });
    });

    // Timer functions
    function startPauseTimer() {
        clearInterval(pauseInterval);
        pauseInterval = setInterval(() => {
            pauseTimeRemaining--;
            updatePauseTimer();
            if (pauseTimeRemaining <= 0) {
                clearInterval(pauseInterval);
                pauseClose.click(); // Auto-close when time is up
            }
        }, 1000);
    }

    function updatePauseTimer() {
        const minutes = Math.floor(pauseTimeRemaining / 60);
        const seconds = pauseTimeRemaining % 60;
        pauseTimer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
