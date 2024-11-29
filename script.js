// Stats counter animation with easing
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function for smooth counting
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.classList.add('glow-active');
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize stats animation when in view
function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated', 'animate');
                const countElement = entry.target.querySelector('h3');
                const finalValue = parseInt(entry.target.dataset.count);
                animateValue(countElement, 0, finalValue, 2000);
            }
        });
    }, {
        threshold: 0.5
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Navigation scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.padding = '1rem 5%';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.padding = '1.5rem 5%';
    }
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    menuBtn.innerHTML = navLinks.classList.contains('show') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            // Close mobile menu if open
            navLinks.classList.remove('show');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation and submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const loadingAnimation = submitButton.querySelector('.loading-animation');
        const buttonText = submitButton.querySelector('span');
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.opacity = '0';
        loadingAnimation.style.display = 'block';
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        
        // Reset form and button
        contactForm.reset();
        submitButton.disabled = false;
        buttonText.style.opacity = '1';
        loadingAnimation.style.display = 'none';
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Scroll reveal animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Service card image parallax
document.querySelectorAll('.service-card').forEach(card => {
    const image = card.querySelector('.service-image');
    
    if (image) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            image.style.transform = `
                translateX(${x * 20}px)
                translateY(${y * 20}px)
                scale(1.1)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            image.style.transform = '';
        });
    }
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Initialize animations
window.addEventListener('scroll', () => {
    reveal();
    updateActiveNavLink();
});

window.addEventListener('load', () => {
    reveal();
    initStatsAnimation();
});
