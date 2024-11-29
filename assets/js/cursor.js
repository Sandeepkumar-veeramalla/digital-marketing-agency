document.addEventListener('DOMContentLoaded', function() {
    // Only initialize custom cursor on non-mobile devices
    if (!isMobile()) {
        initCustomCursor();
    }
});

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function initCustomCursor() {
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // Cursor state
    let cursorVisible = true;
    let cursorEnlarged = false;

    // Mouse position with smooth interpolation
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Animation settings
    const ease = 0.15;
    let rafId = null;

    // Update cursor position with debouncing
    const updateCursor = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    // Smooth animation loop
    function animate() {
        // Calculate smooth movement
        const dx = mouseX - currentX;
        const dy = mouseY - currentY;
        
        currentX += dx * ease;
        currentY += dy * ease;

        if (cursorVisible) {
            cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${cursorEnlarged ? 1.5 : 1})`;
            cursorDot.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }

        rafId = requestAnimationFrame(animate);
    }

    // Start animation
    animate();

    // Event listeners with performance optimization
    document.addEventListener('mousemove', updateCursor, { passive: true });

    document.addEventListener('mouseenter', () => {
        cursorVisible = true;
        cursor.style.opacity = 1;
        cursorDot.style.opacity = 1;
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = 0;
        cursorDot.style.opacity = 0;
    });

    // Optimize hover effects for interactive elements
    const clickables = document.querySelectorAll(
        'a, button, .service-card, .portfolio-item, .social-links a, input, textarea, select, .btn, .logo'
    );

    clickables.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorEnlarged = true;
            requestAnimationFrame(() => {
                cursor.classList.add('hover');
                cursorDot.classList.add('hover');
            });
        });

        element.addEventListener('mouseleave', () => {
            cursorEnlarged = false;
            requestAnimationFrame(() => {
                cursor.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });
    });

    // Handle cursor visibility on click
    document.addEventListener('mousedown', () => {
        requestAnimationFrame(() => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.8)`;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(0.8)`;
        });
    });

    document.addEventListener('mouseup', () => {
        requestAnimationFrame(() => {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
            cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) scale(1)`;
        });
    });

    // Handle page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(animate);
        }
    });

    // Add cursor styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor {
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            transition: opacity 0.15s ease-out;
            z-index: 9999;
            will-change: transform;
        }

        .cursor-dot {
            width: 4px;
            height: 4px;
            background-color: var(--primary-color);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            transition: opacity 0.15s ease-out;
            z-index: 9999;
            will-change: transform;
        }

        .custom-cursor.hover {
            transform: scale(1.5);
            background-color: rgba(0, 200, 83, 0.1);
            mix-blend-mode: difference;
        }

        .cursor-dot.hover {
            transform: scale(0.5);
        }

        @media (max-width: 768px) {
            .custom-cursor,
            .cursor-dot {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}
