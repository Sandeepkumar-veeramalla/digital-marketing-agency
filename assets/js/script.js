// Performance optimization for animations
const animationOptions = {
    threshold: 0.15,
    rootMargin: '50px',
    root: null
};

// Intersection Observer for reveal animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('active');
            });
            revealObserver.unobserve(entry.target);
        }
    });
}, animationOptions);

// Initialize reveal animations
function initRevealAnimations() {
    document.querySelectorAll('.reveal, .service-card, .portfolio-item, .stat-item').forEach(element => {
        revealObserver.observe(element);
    });
}

// Stats counter with Intersection Observer
function initStatsCounter() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                let count = 0;
                const duration = 2000;
                const increment = target / (duration / 16);

                const updateCount = () => {
                    if (count < target) {
                        count += increment;
                        counter.querySelector('h3').textContent = Math.ceil(count) + '+';
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.querySelector('h3').textContent = target + '+';
                    }
                };

                counter.classList.add('active');
                requestAnimationFrame(updateCount);
                statsObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px'
    });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Logo click scroll to top with smooth behavior
document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Initialize Vanilla Tilt with performance optimization
function initTilt() {
    if (window.VanillaTilt && !isMobile()) {
        // For service cards
        VanillaTilt.init(document.querySelectorAll('.service-card'), {
            max: 8,
            speed: 400,
            scale: 1.03,
            glare: true,
            'max-glare': 0.3,
            gyroscope: true
        });

        // For portfolio items
        VanillaTilt.init(document.querySelectorAll('.portfolio-item'), {
            max: 5,
            speed: 400,
            scale: 1.02,
            glare: true,
            'max-glare': 0.2
        });
    }
}

// Smooth scroll with performance optimization
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation link update with throttling
function initActiveNavUpdate() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (pageYOffset >= sectionTop - sectionHeight / 3) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === current) {
                        link.classList.add('active');
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Section background parallax effect
function initParallax() {
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            sections.forEach(section => {
                const distance = window.pageYOffset - section.offsetTop;
                const translateY = distance * 0.2;
                if (section.querySelector('.section-content')) {
                    section.querySelector('.section-content').style.transform = `translateY(${translateY}px)`;
                }
            });
        });
    });
}

// Check if device is mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initSmoothScroll();
    initStatsCounter();
    initActiveNavUpdate();
    initTilt();
    initParallax();
});

// Handle window resize with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const handleResize = debounce(() => {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js');
    }
}, 250);

window.addEventListener('resize', handleResize);

// Check for reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('paused');
    } else {
        document.body.classList.remove('paused');
    }
});
