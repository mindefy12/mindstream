// ===================================
// MINDSTREAM WEBSITE INTERACTIONS
// Gentle, intentional, calm
// ===================================

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// === NAVBAR SCROLL EFFECT ===
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolled
    if (currentScroll > 50) {
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// === FADE IN ON SCROLL ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeInObserver.observe(section);
});

// === EMAIL FORM HANDLING ===
const signupForm = document.querySelector('.signup-form');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailInput = signupForm.querySelector('input[type="email"]');
    const submitButton = signupForm.querySelector('button');
    const email = emailInput.value;
    
    // Disable form while processing
    submitButton.disabled = true;
    submitButton.textContent = 'Adding to scroll...';
    
    // TODO: Connect to actual email service (Mailchimp, ConvertKit, etc.)
    // For now, just show success message
    
    setTimeout(() => {
        // Show success message
        const successMessage = document.createElement('p');
        successMessage.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(122, 155, 118, 0.1);
            border-radius: 8px;
            color: var(--grove-green);
            font-style: italic;
        `;
        successMessage.innerHTML = `
            Welcome. Your name has been added to the scroll.<br>
            You'll hear from us when the season turns, or when there's wisdom worth sharing.<br>
            Until then, tend your lantern.
        `;
        
        // Replace form with success message
        signupForm.style.opacity = '0';
        setTimeout(() => {
            signupForm.style.display = 'none';
            signupForm.parentElement.appendChild(successMessage);
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.style.transition = 'opacity 0.5s ease';
                successMessage.style.opacity = '1';
            }, 50);
        }, 300);
        
    }, 1500);
});

// === RITUAL CARDS STAGGER ANIMATION ===
const ritualCards = document.querySelectorAll('.ritual-card');
ritualCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
});

const ritualObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.ritual-card');
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    });
}, { threshold: 0.1 });

const ritualsSection = document.querySelector('.section-rituals');
if (ritualsSection) {
    ritualObserver.observe(ritualsSection);
}

// === SYMBOL ITEMS STAGGER ===
const symbolItems = document.querySelectorAll('.symbol-item');
symbolItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
});

const symbolObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.symbol-item');
            items.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            });
        }
    });
}, { threshold: 0.1 });

const symbolsSection = document.querySelector('.section-symbols');
if (symbolsSection) {
    symbolObserver.observe(symbolsSection);
}

// === ETHOS CARDS STAGGER ===
const ethosCards = document.querySelectorAll('.ethos-card');
ethosCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
});

const ethosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.ethos-card');
            cards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
        }
    });
}, { threshold: 0.1 });

const ethosSection = document.querySelector('.section-ethos');
if (ethosSection) {
    ethosObserver.observe(ethosSection);
}

// === CONSOLE GREETING ===
console.log('%cWelcome to Mindstream', 'font-size: 20px; font-family: Georgia; color: #7A9B76;');
console.log('%cThe grove is open. The lanterns are lit.', 'font-size: 14px; font-family: Georgia; color: #5A5A5A; font-style: italic;');
