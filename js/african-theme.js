// Gestionnaire du thème africain pour CôteConnect
class AfricanThemeManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'fr';
        this.translations = {};
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.loadTranslations();
        this.applyLanguage(this.currentLanguage);
        this.animateAfricanElements();
        this.createAfricanParticles();
        this.initializeCounters();
        this.animateProgressBars();
    }

    setupEventListeners() {
        // Sélecteur de langue
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Animation au scroll
        this.setupScrollAnimations();
        
        // Effets hover sur les cartes
        this.setupCardEffects();
    }

    loadTranslations() {
        this.translations = {
            fr: {
                'hero.title.line1': 'Révolutionnons ensemble',
                'hero.title.line2': 'l\'agriculture ivoirienne',
                'hero.title.line3': 'du café et du cacao',
                'hero.subtitle': 'La première plateforme numérique dédiée aux coopératives de Côte d\'Ivoire. Connectez-vous directement aux acheteurs internationaux, tracez vos récoltes avec la blockchain, et accédez aux meilleures pratiques agricoles.',
                'nav.home': 'Accueil',
                'nav.marketplace': 'Marketplace',
                'nav.cooperatives': 'Coopératives',
                'nav.analytics': 'Analytics',
                'nav.formation': 'Formation',
                'btn.join': 'Rejoindre CôteConnect',
                'btn.explore': 'Explorer le Marketplace',
                'btn.login': 'Se connecter',
                'stats.cooperatives': 'Coopératives',
                'stats.producers': 'Producteurs',
                'stats.buyers': 'Pays acheteurs'
            },
            en: {
                'hero.title.line1': 'Let\'s revolutionize together',
                'hero.title.line2': 'Ivorian agriculture',
                'hero.title.line3': 'of coffee and cocoa',
                'hero.subtitle': 'The first digital platform dedicated to Côte d\'Ivoire cooperatives. Connect directly with international buyers, trace your harvests with blockchain, and access best agricultural practices.',
                'nav.home': 'Home',
                'nav.marketplace': 'Marketplace',
                'nav.cooperatives': 'Cooperatives',
                'nav.analytics': 'Analytics',
                'nav.formation': 'Training',
                'btn.join': 'Join CôteConnect',
                'btn.explore': 'Explore Marketplace',
                'btn.login': 'Sign in',
                'stats.cooperatives': 'Cooperatives',
                'stats.producers': 'Producers',
                'stats.buyers': 'Buyer countries'
            }
        };
    }

    switchLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            this.applyLanguage(lang);
            this.storeLanguage(lang);
            this.updateLanguageButtons(lang);
        }
    }

    applyLanguage(lang) {
        const translations = this.translations[lang];
        if (!translations) return;

        // Mettre à jour tous les éléments avec data-translate
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Mettre à jour les placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.dataset.translatePlaceholder;
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });
    }

    updateLanguageButtons(activeLang) {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === activeLang);
        });
    }

    storeLanguage(lang) {
        try {
            localStorage.setItem('coteconnect-language', lang);
        } catch (e) {
            console.warn('Impossible de sauvegarder la langue:', e);
        }
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('coteconnect-language');
        } catch (e) {
            console.warn('Impossible de récupérer la langue sauvegardée:', e);
            return null;
        }
    }

    animateAfricanElements() {
        // Animer l'apparition des éléments
        const elements = [
            '.hero-title',
            '.hero-subtitle',
            '.hero-stats',
            '.hero-cta',
            '.floating-card'
        ];

        elements.forEach((selector, index) => {
            const els = document.querySelectorAll(selector);
            els.forEach((el, elIndex) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, (index * 200) + (elIndex * 100));
            });
        });
    }

    createAfricanParticles() {
        const particlesContainer = document.querySelector('.african-particles');
        if (!particlesContainer) return;

        // Créer des particules inspirées de grains de café et cacao
        const particleTypes = [
            { char: '☕', color: '#D2691E', size: '12px' },
            { char: '🍫', color: '#A0522D', size: '10px' },
            { char: '🌿', color: '#228B22', size: '14px' },
            { char: '●', color: '#8B4513', size: '8px' },
            { char: '◆', color: '#CD853F', size: '6px' }
        ];

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
            
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                color: ${type.color};
                font-size: ${type.size};
                pointer-events: none;
                opacity: 0.6;
                animation: floatParticle ${5 + Math.random() * 5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            particle.textContent = type.char;
            particlesContainer.appendChild(particle);
        }

        // Ajouter l'animation CSS
        if (!document.querySelector('#african-particles-style')) {
            const style = document.createElement('style');
            style.id = 'african-particles-style';
            style.textContent = `
                @keyframes floatParticle {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                        opacity: 0.6;
                    }
                    25% {
                        transform: translateY(-20px) rotate(90deg);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translateY(-10px) rotate(180deg);
                        opacity: 0.4;
                    }
                    75% {
                        transform: translateY(-30px) rotate(270deg);
                        opacity: 0.7;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initializeCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    setTimeout(() => {
                        entry.target.style.width = progress + '%';
                    }, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observer les éléments à animer
        document.querySelectorAll('.feature-card, .floating-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCardEffects() {
        // Effets 3D sur les cartes flottantes
        document.querySelectorAll('.floating-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.applyCardTilt(e.target, 5);
            });

            card.addEventListener('mousemove', (e) => {
                this.updateCardTilt(e);
            });

            card.addEventListener('mouseleave', (e) => {
                this.resetCardTilt(e.target);
            });
        });
    }

    applyCardTilt(card, intensity) {
        card.style.transition = 'transform 0.1s ease';
        card.style.transformStyle = 'preserve-3d';
    }

    updateCardTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        const rotateX = (mouseY / rect.height) * -10;
        const rotateY = (mouseX / rect.width) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    resetCardTilt(card) {
        card.style.transition = 'transform 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    // Méthode pour créer des effets de croissance (agriculture)
    createGrowthEffect(element) {
        const leaves = ['🌱', '🌿', '🍃'];
        
        for (let i = 0; i < 5; i++) {
            const leaf = document.createElement('div');
            leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
            leaf.style.cssText = `
                position: absolute;
                left: 50%;
                top: 50%;
                font-size: 16px;
                pointer-events: none;
                z-index: 1000;
                color: #228B22;
            `;
            
            document.body.appendChild(leaf);
            
            const angle = (i / 5) * Math.PI * 2;
            const distance = 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            leaf.animate([
                { 
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(360deg)`,
                    opacity: 0 
                }
            ], {
                duration: 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(leaf);
            };
        }
    }

    // Méthode pour simuler la mise à jour des prix en temps réel
    startPriceUpdates() {
        const priceElements = document.querySelectorAll('.price');
        const changeElements = document.querySelectorAll('.change');
        
        setInterval(() => {
            priceElements.forEach((priceEl, index) => {
                const currentPrice = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ''));
                const variation = (Math.random() - 0.5) * 100; // Variation de ±50 FCFA
                const newPrice = Math.max(1000, currentPrice + variation);
                const changePercent = ((newPrice - currentPrice) / currentPrice * 100).toFixed(1);
                
                priceEl.textContent = `${Math.round(newPrice).toLocaleString()} FCFA/kg`;
                
                const changeEl = changeElements[index];
                if (changeEl) {
                    changeEl.textContent = `${changePercent > 0 ? '+' : ''}${changePercent}%`;
                    changeEl.className = `change ${changePercent > 0 ? 'positive' : 'negative'}`;
                }
            });
        }, 10000); // Mise à jour toutes les 10 secondes
    }

    // Méthode pour gérer le mode hors ligne
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.showConnectionStatus('Connexion rétablie', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showConnectionStatus('Mode hors ligne activé', 'warning');
        });
    }

    showConnectionStatus(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast-notification glass-card toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${type === 'success' ? '🌐' : '📡'}</div>
            <div class="toast-message">${message}</div>
        `;

        document.body.appendChild(toast);
        toast.classList.add('animate-slideIn');

        setTimeout(() => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        }, 3000);
    }

    syncOfflineData() {
        // Simuler la synchronisation des données hors ligne
        console.log('Synchronisation des données hors ligne...');
        // Ici, on synchroniserait les données stockées localement
    }
}

// Initialiser le gestionnaire de thème africain
document.addEventListener('DOMContentLoaded', () => {
    window.africanThemeManager = new AfricanThemeManager();
    
    // Démarrer les mises à jour de prix
    setTimeout(() => {
        window.africanThemeManager.startPriceUpdates();
    }, 3000);
    
    // Configurer le support hors ligne
    window.africanThemeManager.setupOfflineSupport();
});

// Export pour utilisation dans d'autres modules
window.AfricanThemeManager = AfricanThemeManager;
