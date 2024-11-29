// Interactive hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    const content = card.innerHTML;
    const icon = card.querySelector('i');
    
    // Add magnetic effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${deltaY * 10}deg)
            rotateY(${deltaX * 10}deg)
            translateZ(20px)
        `;
        
        // Move icon with enhanced depth
        if (icon) {
            icon.style.transform = `
                translate(${deltaX * 20}px, ${deltaY * 20}px)
                scale(1.1)
            `;
        }
        
        // Adjust glow effect
        card.style.setProperty('--glow-x', `${x}px`);
        card.style.setProperty('--glow-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        if (icon) {
            icon.style.transform = '';
        }
    });
});

// Portfolio items interaction
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Update custom properties for gradient effect
        item.style.setProperty('--mouse-x', x);
        item.style.setProperty('--mouse-y', y);
        
        // Tilt effect
        const rotateX = (y - 0.5) * 20;
        const rotateY = (x - 0.5) * 20;
        
        item.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Title glow effect on hover
document.querySelectorAll('.title-glow').forEach(title => {
    title.addEventListener('mouseenter', () => {
        title.classList.add('glow-active');
    });
    
    title.addEventListener('mouseleave', () => {
        title.classList.remove('glow-active');
    });
});

// Button hover effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Form input animations
document.querySelectorAll('.form-group').forEach(group => {
    const input = group.querySelector('input, textarea, select');
    const label = group.querySelector('label');
    
    if (input && label) {
        input.addEventListener('focus', () => {
            label.classList.add('active');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                label.classList.remove('active');
            }
        });
        
        // Check initial state
        if (input.value) {
            label.classList.add('active');
        }
    }
});
