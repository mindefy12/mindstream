// Compass Quiz Logic
let answers = {
    north: 0,
    south: 0,
    east: 0,
    west: 0,
    center: 0
};

let currentQuestion = 0;
const totalQuestions = 7;

// Result content database
const results = {
    north: {
        direction: "North",
        title: "Clarity & Vision",
        description: "Your compass points toward the horizon. You seek the bigger picture, the path ahead, the purpose that illuminates the way. You are drawn to vision, intention, and the clarity that comes from knowing your direction. Like the North Star, you navigate by what remains constant even as everything else shifts.",
        rituals: [
            "Morning Compass Check — Set your intention before the day begins",
            "Vision Walk — Take a slow walk with one clear question in mind",
            "Purpose Scroll — Write your 'true north' statement once a month"
        ],
        reflection: "What is your true north right now? Not what you think it should be, but where your attention actually wants to rest. That is your compass."
    },
    south: {
        direction: "South",
        title: "Grounding & Rest",
        description: "Your compass points toward earth and roots. You seek stability, embodiment, and the deep rest that comes from being fully grounded. You know that presence begins in the body—in breath, sensation, and the felt sense of being here. Like ancient trees, you draw strength from rootedness.",
        rituals: [
            "Grounding Practice — Place both feet on the earth and breathe for three minutes",
            "Body Scroll — Write three sensations you notice in your body each evening",
            "Rest Ritual — Honor one period of true rest each day, without purpose"
        ],
        reflection: "Where do you feel most at home in your own skin? That is where your compass lives. Return there often."
    },
    east: {
        direction: "East",
        title: "Renewal & Beginning",
        description: "Your compass points toward dawn. You seek fresh starts, new possibilities, and the hope that comes with each beginning. You are drawn to emergence, growth, and the light that breaks after darkness. Like the sunrise, you know that each moment offers a chance to begin again.",
        rituals: [
            "Dawn Lantern — Light a candle at first light and state one new intention",
            "Beginner's Walk — Approach one familiar thing as if seeing it for the first time",
            "Fresh Page — Begin each week by writing on a blank page: 'What wants to emerge?'"
        ],
        reflection: "What new thing is trying to be born through you? Not forced, but invited. Listen for it in the quiet."
    },
    west: {
        direction: "West",
        title: "Reflection & Release",
        description: "Your compass points toward sunset. You seek closure, completion, and the wisdom that comes from reflection. You are drawn to endings, transitions, and the grace of letting go. Like the evening light, you know that release is not loss—it is making space for what comes next.",
        rituals: [
            "Evening Lantern — Light a candle at dusk and name what you're releasing",
            "Gratitude Scroll — Write three completions from your day",
            "Threshold Walk — Walk slowly at sunset and notice what you're ready to leave behind"
        ],
        reflection: "What are you still carrying that you no longer need? Name it. Thank it. Let it go."
    },
    center: {
        direction: "Center",
        title: "Presence & Stillness",
        description: "Your compass points inward. You seek the still point at the center of everything—the place where all directions meet. You are drawn to presence itself, to the quality of simply being here without agenda. Like the eye of the storm, you find clarity not in movement but in rest.",
        rituals: [
            "Center Practice — Sit in silence for five minutes, returning to breath when thoughts arise",
            "Pause Button — Three times today, stop completely and ask: 'Am I here?'",
            "Stillness Scroll — Write one sentence each night: 'Today I was most present when...'"
        ],
        reflection: "You do not need to go anywhere or become anything. Your compass reminds you: presence is not a destination. You are already here."
    }
};

function startQuiz() {
    document.getElementById('quizIntro').style.display = 'none';
    document.getElementById('progressBar').style.display = 'block';
    document.getElementById('q1').classList.add('active');
    updateProgress();
}

function answer(direction, questionNum) {
    // Record answer
    answers[direction]++;
    
    // Hide current question
    document.getElementById('q' + questionNum).classList.remove('active');
    
    // Show next question or results
    if (questionNum < totalQuestions) {
        setTimeout(() => {
            document.getElementById('q' + (questionNum + 1)).classList.add('active');
            currentQuestion = questionNum;
            updateProgress();
        }, 300);
    } else {
        setTimeout(() => {
            showResults();
        }, 300);
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showResults() {
    // Find the direction with most answers
    let maxDirection = 'center';
    let maxCount = 0;
    
    for (let direction in answers) {
        if (answers[direction] > maxCount) {
            maxCount = answers[direction];
            maxDirection = direction;
        }
    }
    
    // Get result content
    const result = results[maxDirection];
    
    // Hide progress bar
    document.getElementById('progressBar').style.display = 'none';
    
    // Populate results
    document.getElementById('resultDirection').textContent = '🧭 ' + result.direction;
    document.getElementById('resultTitle').textContent = result.title;
    document.getElementById('resultDescription').textContent = result.description;
    
    // Add rituals
    const ritualList = document.getElementById('ritualList');
    ritualList.innerHTML = '';
    result.rituals.forEach(ritual => {
        const li = document.createElement('li');
        li.textContent = ritual;
        ritualList.appendChild(li);
    });
    
    // Add reflection
    document.getElementById('reflectionText').textContent = result.reflection;
    
    // Add result image
    const resultImage = document.getElementById('resultImage');
    const imageUrls = {
        north: 'https://www.genspark.ai/api/files/s/p4V3CU4x?cache_control=3600',
        south: 'https://www.genspark.ai/api/files/s/72z4lN6n?cache_control=3600',
        east: 'https://www.genspark.ai/api/files/s/xuIL1DV8?cache_control=3600',
        west: 'https://www.genspark.ai/api/files/s/y9MXXJ4J?cache_control=3600',
        center: 'https://www.genspark.ai/api/files/s/YJCibomT?cache_control=3600'
    };
    
    // Create and load image with error handling
    const img = document.createElement('img');
    img.src = imageUrls[maxDirection];
    img.alt = result.direction + ' Compass';
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
    img.onerror = function() {
        // Fallback to SVG compass if image fails to load
        resultImage.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, var(--parchment-cream), var(--soft-white));"><span style="font-size: 8rem; opacity: 0.8;">🧭</span></div>`;
    };
    resultImage.innerHTML = '';
    resultImage.appendChild(img);
    
    // Show results
    document.getElementById('results').classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store result in localStorage for later reference
    localStorage.setItem('mindstreamCompass', maxDirection);
    localStorage.setItem('mindstreamCompassDate', new Date().toISOString());
}

function restartQuiz() {
    // Reset answers
    answers = { north: 0, south: 0, east: 0, west: 0, center: 0 };
    currentQuestion = 0;
    
    // Hide results
    document.getElementById('results').classList.remove('active');
    
    // Show intro
    document.getElementById('quizIntro').style.display = 'block';
    
    // Reset progress
    document.getElementById('progressFill').style.width = '0%';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Check if user has taken quiz before
window.addEventListener('load', () => {
    const previousCompass = localStorage.getItem('mindstreamCompass');
    const previousDate = localStorage.getItem('mindstreamCompassDate');
    
    if (previousCompass && previousDate) {
        const date = new Date(previousDate);
        const timeSince = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (timeSince < 30) {
            // Show subtle reminder
            console.log(`Your compass last pointed ${previousCompass} (${timeSince} days ago)`);
        }
    }
});