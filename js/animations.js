// Gestionnaire d'animations avancées pour ProConnect
class AnimationManager {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupMouseFollower();
        this.setupParallaxEffects();
        this.setupMorphingElements();
        this.initializeCounters();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '-50px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerElementAnimation(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec des classes d'animation
        document.querySelectorAll('[class*="animate-"], .scroll-reveal, .counter, .progress-bar').forEach(el => {
            observer.observe(el);
        });

        this.observers.set('intersection', observer);
    }

    triggerElementAnimation(element, ratio) {
        const animationClass = this.getAnimationClass(element);
        
        if (animationClass && !element.classList.contains('animated')) {
            element.classList.add('animated', animationClass);
            
            // Animations spéciales
            if (element.classList.contains('counter')) {
                this.animateCounter(element);
            }
            
            if (element.classList.contains('progress-bar')) {
                this.animateProgressBar(element);
            }
            
            if (element.classList.contains('typewriter')) {
                this.animateTypewriter(element);
            }
        }
    }

    getAnimationClass(element) {
        const classes = element.className.split(' ');
        return classes.find(cls => cls.startsWith('animate-')) || 'animate-fadeInUp';
    }

    setupMouseFollower() {
        let mouseX = 0;
        let mouseY = 0;
        let followerX = 0;
        let followerY = 0;

        // Créer le suiveur de souris
        const follower = document.createElement('div');
        follower.className = 'mouse-follower';
        follower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(follower);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animation fluide du suiveur
        const updateFollower = () => {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            
            followerX += dx * 0.1;
            followerY += dy * 0.1;
            
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Effets spéciaux au hover
        document.querySelectorAll('button, a, .interactive').forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(2)';
                follower.style.background = 'radial-gradient(circle, rgba(245, 87, 108, 0.4) 0%, transparent 70%)';
            });
            
            el.addEventListener('mouseleave', () => {
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
                follower.style.background = 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)';
            });
        });
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        let ticking = false;

        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrollTop * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    setupMorphingElements() {
        // Morphing des icônes au hover
        document.querySelectorAll('.morph-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                this.morphIcon(icon, 'hover');
            });
            
            icon.addEventListener('mouseleave', () => {
                this.morphIcon(icon, 'normal');
            });
        });
    }

    morphIcon(icon, state) {
        const svg = icon.querySelector('svg');
        if (!svg) return;

        if (state === 'hover') {
            svg.style.transform = 'scale(1.2) rotate(15deg)';
            svg.style.filter = 'drop-shadow(0 5px 15px rgba(102, 126, 234, 0.4))';
        } else {
            svg.style.transform = 'scale(1) rotate(0deg)';
            svg.style.filter = 'none';
        }
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target || element.textContent);
        const duration = parseInt(element.dataset.duration || 2000);
        const suffix = element.dataset.suffix || '';
        
        let current = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + suffix;
            }
        };
        
        updateCounter();
    }

    animateProgressBar(element) {
        const progress = parseInt(element.dataset.progress || 0);
        const duration = parseInt(element.dataset.duration || 1500);
        
        let currentProgress = 0;
        const increment = progress / (duration / 16);
        
        const updateProgress = () => {
            currentProgress += increment;
            if (currentProgress < progress) {
                element.style.width = currentProgress + '%';
                requestAnimationFrame(updateProgress);
            } else {
                element.style.width = progress + '%';
            }
        };
        
        updateProgress();
    }

    animateTypewriter(element) {
        const text = element.dataset.text || element.textContent;
        const speed = parseInt(element.dataset.speed || 50);
        
        element.textContent = '';
        let i = 0;
        
        const typeChar = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, speed);
            }
        };
        
        typeChar();
    }

    initializeCounters() {
        // Ajouter des compteurs automatiques pour les statistiques
        const statsElements = document.querySelectorAll('.stat-number');
        
        statsElements.forEach(el => {
            if (!el.dataset.target) {
                const value = el.textContent.replace(/[^\d]/g, '');
                if (value) {
                    el.dataset.target = value;
                    el.classList.add('counter');
                }
            }
        });
    }

    // Méthodes pour créer des animations personnalisées
    createFloatingElement(options = {}) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
            position: absolute;
            width: ${options.size || 10}px;
            height: ${options.size || 10}px;
            background: ${options.color || 'rgba(102, 126, 234, 0.6)'};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
        `;
        
        const container = options.container || document.body;
        container.appendChild(element);
        
        // Animation de flottement
        const duration = options.duration || 5000;
        const startX = Math.random() * container.offsetWidth;
        const startY = container.offsetHeight;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = -50;
        
        element.style.left = startX + 'px';
        element.style.top = startY + 'px';
        
        element.animate([
            { transform: 'translate(0, 0) scale(0)', opacity: 0 },
            { transform: 'translate(0, -50px) scale(1)', opacity: 1, offset: 0.1 },
            { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        };
        
        return element;
    }

    createRippleEffect(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            if (ripple.parentElement) {
                ripple.parentElement.removeChild(ripple);
            }
        };
    }

    // Méthode pour animer l'apparition d'éléments en séquence
    animateSequence(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animate-fadeInUp', 'animated');
            }, index * delay);
        });
    }

    // Méthode pour créer des particules interactives
    createInteractiveParticles(container, count = 50) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createFloatingElement({
                    container: container,
                    size: Math.random() * 6 + 2,
                    color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.6)`,
                    duration: Math.random() * 3000 + 2000
                });
            }, Math.random() * 5000);
        }
    }

    // Nettoyage des observers
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

// Gestionnaire d'effets visuels spéciaux
class VisualEffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupRippleEffects();
        this.setupGlowEffects();
        this.setupMagneticEffects();
    }

    setupRippleEffects() {
        document.querySelectorAll('.ripple-effect, .btn-primary, .btn-secondary').forEach(element => {
            element.addEventListener('click', (e) => {
                window.animationManager.createRippleEffect(e, element);
            });
        });
    }

    setupGlowEffects() {
        document.querySelectorAll('.glow-on-hover').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 30px rgba(102, 126, 234, 0.6)';
                element.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
                element.style.transform = '';
            });
        });
    }

    setupMagneticEffects() {
        document.querySelectorAll('.magnetic').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.animationManager = new AnimationManager();
    window.visualEffectsManager = new VisualEffectsManager();
});

// Export pour utilisation dans d'autres modules
window.AnimationManager = AnimationManager;
window.VisualEffectsManager = VisualEffectsManager;
