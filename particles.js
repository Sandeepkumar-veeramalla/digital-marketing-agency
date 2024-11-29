class ParticleSystem {
    constructor() {
        this.particles = [];
        this.connections = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        
        // Add mouse light effect
        this.mouseLight = document.createElement('div');
        this.mouseLight.className = 'mouse-light';
        this.container.appendChild(this.mouseLight);
        
        // Add to hero section
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(this.container);
            this.width = hero.offsetWidth;
            this.height = hero.offsetHeight;
        }
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
        
        // Create particle clusters
        for (let i = 0; i < 3; i++) {
            this.createParticleCluster();
        }
    }
    
    createParticle() {
        const particle = {
            element: document.createElement('div'),
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 2
        };
        
        particle.element.className = 'particle';
        particle.element.style.width = particle.size + 'px';
        particle.element.style.height = particle.size + 'px';
        
        this.container.appendChild(particle.element);
        this.particles.push(particle);
    }
    
    createParticleCluster() {
        const cluster = document.createElement('div');
        cluster.className = 'particle-cluster';
        
        // Add particles to cluster
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            cluster.appendChild(particle);
        }
        
        cluster.style.left = Math.random() * (this.width - 100) + 'px';
        cluster.style.top = Math.random() * (this.height - 100) + 'px';
        
        this.container.appendChild(cluster);
    }
    
    createConnection(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const connection = document.createElement('div');
            connection.className = 'connection-line';
            connection.style.width = distance + 'px';
            connection.style.left = p1.x + 'px';
            connection.style.top = p1.y + 'px';
            connection.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
            connection.style.opacity = (1 - distance / 150) * 0.5;
            
            this.container.appendChild(connection);
            this.connections.push(connection);
            
            // Remove connection after animation
            setTimeout(() => {
                this.container.removeChild(connection);
                this.connections = this.connections.filter(c => c !== connection);
            }, 200);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            const hero = document.querySelector('.hero');
            if (hero) {
                this.width = hero.offsetWidth;
                this.height = hero.offsetHeight;
            }
        });
        
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            // Update mouse light position
            this.mouseLight.style.left = this.mouseX + 'px';
            this.mouseLight.style.top = this.mouseY + 'px';
            
            // Create particle trail
            this.createTrailParticle(this.mouseX, this.mouseY);
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.mouseX = null;
            this.mouseY = null;
        });
    }
    
    createTrailParticle(x, y) {
        const trail = document.createElement('div');
        trail.className = 'particle trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        this.container.appendChild(trail);
        
        // Remove trail particle after animation
        setTimeout(() => {
            this.container.removeChild(trail);
        }, 1000);
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off walls
            if (particle.x <= 0 || particle.x >= this.width) particle.speedX *= -1;
            if (particle.y <= 0 || particle.y >= this.height) particle.speedY *= -1;
            
            // Keep particles within bounds
            particle.x = Math.max(0, Math.min(this.width, particle.x));
            particle.y = Math.max(0, Math.min(this.height, particle.y));
            
            // Mouse interaction
            if (this.mouseX !== null && this.mouseY !== null) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.x -= dx * force * 0.05;
                    particle.y -= dy * force * 0.05;
                }
            }
            
            // Update particle position
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        // Create connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.createConnection(this.particles[i], this.particles[j]);
            }
        }
    }
    
    animate() {
        this.updateParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system
window.addEventListener('load', () => {
    new ParticleSystem();
});
