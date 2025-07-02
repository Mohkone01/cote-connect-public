// Gestionnaire de thème universel pour toutes les pages
class UniversalThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        // Charger le thème sauvegardé immédiatement
        this.loadSavedTheme();
        
        // Initialiser le thème switcher quand le DOM est prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initThemeSwitcher();
            });
        } else {
            this.initThemeSwitcher();
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('coteconnect-theme') || 'light';
        this.setTheme(savedTheme);
    }

    initThemeSwitcher() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        // Event listener pour le toggle
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });

        // Mettre à jour l'apparence du bouton
        this.updateToggleButton();

        console.log('✅ Theme switcher initialized');
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            // Animation de transition
            themeToggle.classList.add('switching');
            
            // Effet de transition fluide sur le body
            document.body.style.transition = 'all 0.3s ease-in-out';
        }
        
        setTimeout(() => {
            this.setTheme(newTheme);
            localStorage.setItem('coteconnect-theme', newTheme);
            
            // Retirer l'animation
            if (themeToggle) {
                setTimeout(() => {
                    themeToggle.classList.remove('switching');
                    document.body.style.transition = '';
                }, 300);
            }
        }, 50);

        // Effet de particules lors du changement
        this.createThemeParticles();
        
        console.log(`🎨 Theme switched to: ${newTheme}`);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Appliquer l'attribut data-theme au document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Mettre à jour le bouton toggle
        this.updateToggleButton();
        
        // Déclencher un événement personnalisé pour les autres scripts
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
    }

    updateToggleButton() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        if (this.currentTheme === 'dark') {
            themeToggle.classList.add('dark');
            themeToggle.setAttribute('title', 'Passer en mode clair');
        } else {
            themeToggle.classList.remove('dark');
            themeToggle.setAttribute('title', 'Passer en mode sombre');
        }
    }

    createThemeParticles() {
        const particleCount = 15;
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
                    animation: themeParticle 1.2s ease-out forwards;
                `;
                
                // Direction aléatoire
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 80 + Math.random() * 80;
                const endX = Math.cos(angle) * distance;
                const endY = Math.sin(angle) * distance;
                
                particle.style.setProperty('--end-x', `${endX}px`);
                particle.style.setProperty('--end-y', `${endY}px`);
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentElement) {
                        document.body.removeChild(particle);
                    }
                }, 1200);
            }, i * 30);
        }
    }

    // Méthode publique pour obtenir le thème actuel
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Méthode publique pour forcer un thème
    forceTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.setTheme(theme);
            localStorage.setItem('coteconnect-theme', theme);
        }
    }
}

// Initialiser le gestionnaire de thème immédiatement
window.universalThemeManager = new UniversalThemeManager();

// Export pour utilisation dans d'autres modules
window.UniversalThemeManager = UniversalThemeManager;

// Fonction utilitaire pour les autres scripts
window.getTheme = () => window.universalThemeManager.getCurrentTheme();
window.setTheme = (theme) => window.universalThemeManager.forceTheme(theme);

console.log('🎨 Universal Theme Manager loaded');
