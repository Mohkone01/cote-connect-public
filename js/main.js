// ProConnect - JavaScript Principal
class ProConnect {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initAnimations();
        this.initScrollReveal();
    }

    init() {
        console.log('🚀 CôteConnect initialisé');
        this.addPageEnterAnimation();
        this.initParticles();
        this.initThemeSwitcher();
    }

    setupEventListeners() {
        // Navigation mobile
        this.setupMobileNav();

        // Recherche
        this.setupSearch();

        // Actions rapides
        this.setupQuickActions();

        // Profil dropdown
        this.setupProfileDropdown();

        // Smooth scroll pour les liens d'ancrage
        this.setupSmoothScroll();
    }

    setupMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-container input');
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results glass-card';

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 2) {
                    this.performSearch(query, searchResults);
                } else {
                    this.hideSearchResults(searchResults);
                }
            });

            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchInput.parentElement.classList.remove('focused');
                    this.hideSearchResults(searchResults);
                }, 200);
            });
        }
    }

    performSearch(query, resultsContainer) {
        // Simulation de recherche
        const mockResults = [
            { type: 'person', name: 'Marie Dubois', title: 'Développeuse Full-Stack', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
            { type: 'person', name: 'Jean Martin', title: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
            { type: 'company', name: 'TechCorp', industry: 'Technologie', logo: '🏢' },
            { type: 'job', title: 'Senior Developer', company: 'StartupXYZ', location: 'Paris' }
        ];

        const filteredResults = mockResults.filter(item =>
            item.name?.toLowerCase().includes(query.toLowerCase()) ||
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.company?.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(filteredResults, resultsContainer);
    }

    displaySearchResults(results, container) {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">Aucun résultat trouvé</div>';
        } else {
            results.forEach(result => {
                const resultElement = this.createSearchResultElement(result);
                container.appendChild(resultElement);
            });
        }

        const searchContainer = document.querySelector('.search-container');
        if (!container.parentElement) {
            searchContainer.appendChild(container);
        }

        container.style.display = 'block';
        container.classList.add('animate-fadeInUp');
    }

    createSearchResultElement(result) {
        const element = document.createElement('div');
        element.className = 'search-result-item';

        if (result.type === 'person') {
            element.innerHTML = `
                <img src="${result.avatar}" alt="${result.name}" class="result-avatar">
                <div class="result-content">
                    <div class="result-name">${result.name}</div>
                    <div class="result-title">${result.title}</div>
                </div>
            `;
        } else if (result.type === 'company') {
            element.innerHTML = `
                <div class="result-logo">${result.logo}</div>
                <div class="result-content">
                    <div class="result-name">${result.name}</div>
                    <div class="result-title">${result.industry}</div>
                </div>
            `;
        } else if (result.type === 'job') {
            element.innerHTML = `
                <div class="result-icon">💼</div>
                <div class="result-content">
                    <div class="result-name">${result.title}</div>
                    <div class="result-title">${result.company} • ${result.location}</div>
                </div>
            `;
        }

        element.addEventListener('click', () => {
            this.handleSearchResultClick(result);
        });

        return element;
    }

    handleSearchResultClick(result) {
        console.log('Résultat sélectionné:', result);
        // Ici, vous pourriez naviguer vers la page du profil, de l'entreprise, etc.
    }

    hideSearchResults(container) {
        if (container.parentElement) {
            container.style.display = 'none';
            container.classList.remove('animate-fadeInUp');
        }
    }

    setupQuickActions() {
        const quickActionBtns = document.querySelectorAll('.quick-action-btn');

        quickActionBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.handleQuickAction(index);
                this.animateQuickAction(btn);
            });
        });
    }

    handleQuickAction(actionIndex) {
        const actions = ['createPost', 'openMessages', 'showNotifications'];
        const action = actions[actionIndex];

        switch (action) {
            case 'createPost':
                this.showCreatePostModal();
                break;
            case 'openMessages':
                window.location.href = 'messages.html';
                break;
            case 'showNotifications':
                this.showNotificationsPanel();
                break;
        }
    }

    animateQuickAction(btn) {
        btn.classList.add('animate-bounce');
        setTimeout(() => {
            btn.classList.remove('animate-bounce');
        }, 1000);
    }

    showCreatePostModal() {
        // Créer et afficher un modal pour créer un post
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Créer un post</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <textarea placeholder="Quoi de neuf ?" rows="4"></textarea>
                    <div class="post-options">
                        <button class="btn-secondary">📷 Photo</button>
                        <button class="btn-secondary">📹 Vidéo</button>
                        <button class="btn-secondary">📄 Document</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Annuler</button>
                    <button class="btn-primary">Publier</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('animate-fadeInUp');

        // Événements du modal
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.modal-cancel').addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
    }

    closeModal(modal) {
        modal.classList.add('animate-fadeInUp');
        modal.style.animationDirection = 'reverse';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    }

    showNotificationsPanel() {
        // Afficher un panneau de notifications
        const panel = document.createElement('div');
        panel.className = 'notifications-panel glass-card';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Notifications</h3>
                <button class="panel-close">&times;</button>
            </div>
            <div class="panel-content">
                <div class="notification-item">
                    <div class="notification-avatar">
                        <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" alt="">
                    </div>
                    <div class="notification-content">
                        <p><strong>Marie Dubois</strong> a aimé votre post</p>
                        <span class="notification-time">Il y a 5 min</span>
                    </div>
                </div>
                <div class="notification-item">
                    <div class="notification-avatar">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="">
                    </div>
                    <div class="notification-content">
                        <p><strong>Jean Martin</strong> a commenté votre post</p>
                        <span class="notification-time">Il y a 15 min</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        panel.classList.add('animate-slideIn');

        panel.querySelector('.panel-close').addEventListener('click', () => {
            document.body.removeChild(panel);
        });

        // Fermer en cliquant à l'extérieur
        setTimeout(() => {
            document.addEventListener('click', function closePanel(e) {
                if (!panel.contains(e.target)) {
                    document.body.removeChild(panel);
                    document.removeEventListener('click', closePanel);
                }
            });
        }, 100);
    }

    setupProfileDropdown() {
        const profileDropdown = document.querySelector('.profile-dropdown');

        if (profileDropdown) {
            profileDropdown.addEventListener('mouseenter', () => {
                const dropdown = profileDropdown.querySelector('.dropdown-content');
                dropdown.classList.add('animate-fadeInUp');
            });
        }
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initAnimations() {
        // Animer les éléments au chargement de la page
        const animatedElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta');

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';

            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    addPageEnterAnimation() {
        document.body.classList.add('page-enter');
    }

    initParticles() {
        // Créer des particules flottantes dynamiques
        const particlesContainer = document.querySelector('.floating-particles');
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    this.createParticle(particlesContainer);
                }, i * 500);
            }
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            animation: particle-float ${8 + Math.random() * 4}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
        `;

        container.appendChild(particle);

        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        }, 12000);
    }

    initThemeSwitcher() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('coteconnect-theme') || 'light';
        this.setTheme(savedTheme);

        // Event listener pour le toggle
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Animation de pulsation pour attirer l'attention (seulement sur la page d'accueil)
        if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
            setTimeout(() => {
                themeToggle.classList.add('theme-pulse');
                setTimeout(() => {
                    themeToggle.classList.remove('theme-pulse');
                }, 2000);
            }, 3000);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        const themeToggle = document.querySelector('.theme-toggle');

        // Animation de transition
        themeToggle.classList.add('switching');

        // Effet de transition fluide
        document.documentElement.style.transition = 'all 0.5s ease-in-out';

        setTimeout(() => {
            this.setTheme(newTheme);
            localStorage.setItem('coteconnect-theme', newTheme);

            // Retirer l'animation
            setTimeout(() => {
                themeToggle.classList.remove('switching');
                document.documentElement.style.transition = '';
            }, 600);
        }, 100);

        // Effet de particules lors du changement
        this.createThemeParticles();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.querySelector('.theme-toggle');

        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.classList.add('dark');
            } else {
                themeToggle.classList.remove('dark');
            }
        }

        // Mettre à jour les couleurs CSS personnalisées
        this.updateThemeColors(theme);
    }

    updateThemeColors(theme) {
        // Les couleurs sont maintenant gérées par les variables CSS dans african-theme.css
        // Cette fonction est conservée pour la compatibilité mais n'est plus nécessaire
        console.log(`Thème ${theme} appliqué via CSS variables`);
    }

    createThemeParticles() {
        const particleCount = 20;
        const colors = ['#D2691E', '#A0522D', '#228B22'];

        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    animation: themeParticle 1.5s ease-out forwards;
                `;

                // Direction aléatoire
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 100 + Math.random() * 100;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;

                particle.style.setProperty('--end-x', `${endX}px`);
                particle.style.setProperty('--end-y', `${endY}px`);

                document.body.appendChild(particle);

                setTimeout(() => {
                    if (particle.parentElement) {
                        document.body.removeChild(particle);
                    }
                }, 1500);
            }, i * 50);
        }
    }
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new ProConnect();
});

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur ProConnect:', e.error);
});

// Export pour utilisation dans d'autres modules
window.ProConnect = ProConnect;
