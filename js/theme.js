// Gestion des thèmes ProConnect
class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'dark';
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.updateThemeToggleText();
    }

    setupEventListeners() {
        // Toggle theme button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Écouter les changements de préférence système
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Raccourci clavier pour changer de thème (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.storeTheme(newTheme);
        this.animateThemeTransition();
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.body.className = document.body.className.replace(/\b(light|dark)-theme\b/g, '');
        document.body.classList.add(`${theme}-theme`);
        
        // Mettre à jour la meta theme-color pour les navigateurs mobiles
        this.updateMetaThemeColor(theme);
        
        // Déclencher un événement personnalisé
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            dark: '#0a0a0f',
            light: '#ffffff'
        };
        
        metaThemeColor.content = colors[theme];
    }

    updateThemeToggleText() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            const text = this.currentTheme === 'dark' ? 'Mode Clair' : 'Mode Sombre';
            themeToggle.textContent = text;
        }
    }

    animateThemeTransition() {
        // Créer un overlay pour une transition fluide
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: ${this.currentTheme === 'dark' ? '#ffffff' : '#0a0a0f'};
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animer l'overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    if (overlay.parentElement) {
                        document.body.removeChild(overlay);
                    }
                }, 300);
            }, 150);
        });
        
        this.updateThemeToggleText();
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('proconnect-theme', theme);
        } catch (e) {
            console.warn('Impossible de sauvegarder le thème:', e);
        }
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('proconnect-theme');
        } catch (e) {
            console.warn('Impossible de récupérer le thème sauvegardé:', e);
            return null;
        }
    }

    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Méthode pour obtenir le thème actuel
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Méthode pour forcer un thème spécifique
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
            this.storeTheme(theme);
            this.updateThemeToggleText();
        }
    }
}

// Classe pour gérer les préférences utilisateur étendues
class PreferencesManager {
    constructor() {
        this.preferences = this.loadPreferences();
        this.init();
    }

    init() {
        this.applyPreferences();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Écouter les changements de thème
        document.addEventListener('themeChanged', (e) => {
            this.preferences.theme = e.detail.theme;
            this.savePreferences();
        });

        // Gérer les préférences d'animation
        const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reduceMotionQuery.addEventListener('change', (e) => {
            this.preferences.reduceMotion = e.matches;
            this.applyMotionPreference();
            this.savePreferences();
        });
    }

    loadPreferences() {
        try {
            const stored = localStorage.getItem('proconnect-preferences');
            return stored ? JSON.parse(stored) : this.getDefaultPreferences();
        } catch (e) {
            console.warn('Impossible de charger les préférences:', e);
            return this.getDefaultPreferences();
        }
    }

    getDefaultPreferences() {
        return {
            theme: 'dark',
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            notifications: true,
            soundEnabled: true,
            language: 'fr'
        };
    }

    savePreferences() {
        try {
            localStorage.setItem('proconnect-preferences', JSON.stringify(this.preferences));
        } catch (e) {
            console.warn('Impossible de sauvegarder les préférences:', e);
        }
    }

    applyPreferences() {
        this.applyMotionPreference();
        this.applyNotificationPreference();
    }

    applyMotionPreference() {
        if (this.preferences.reduceMotion) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
    }

    applyNotificationPreference() {
        if (!this.preferences.notifications) {
            document.body.classList.add('notifications-disabled');
        } else {
            document.body.classList.remove('notifications-disabled');
        }
    }

    updatePreference(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
        this.applyPreferences();
    }

    getPreference(key) {
        return this.preferences[key];
    }
}

// Classe pour gérer les couleurs personnalisées
class ColorManager {
    constructor() {
        this.customColors = this.loadCustomColors();
        this.init();
    }

    init() {
        this.applyCustomColors();
    }

    loadCustomColors() {
        try {
            const stored = localStorage.getItem('proconnect-custom-colors');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.warn('Impossible de charger les couleurs personnalisées:', e);
            return {};
        }
    }

    saveCustomColors() {
        try {
            localStorage.setItem('proconnect-custom-colors', JSON.stringify(this.customColors));
        } catch (e) {
            console.warn('Impossible de sauvegarder les couleurs personnalisées:', e);
        }
    }

    applyCustomColors() {
        const root = document.documentElement;
        
        Object.entries(this.customColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    setCustomColor(property, value) {
        this.customColors[property] = value;
        this.saveCustomColors();
        this.applyCustomColors();
    }

    resetCustomColors() {
        this.customColors = {};
        this.saveCustomColors();
        
        // Supprimer les propriétés CSS personnalisées
        const root = document.documentElement;
        const customProperties = [
            '--primary-gradient',
            '--secondary-gradient',
            '--accent-gradient'
        ];
        
        customProperties.forEach(property => {
            root.style.removeProperty(property);
        });
    }

    getAvailableColorSchemes() {
        return {
            default: {
                name: 'Par défaut',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '--secondary-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    '--accent-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }
            },
            ocean: {
                name: 'Océan',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                    '--secondary-gradient': 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 100%)',
                    '--accent-gradient': 'linear-gradient(135deg, #81C784 0%, #4CAF50 100%)'
                }
            },
            sunset: {
                name: 'Coucher de soleil',
                colors: {
                    '--primary-gradient': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                    '--secondary-gradient': 'linear-gradient(135deg, #FFD93D 0%, #FF6B6B 100%)',
                    '--accent-gradient': 'linear-gradient(135deg, #A8E6CF 0%, #88D8A3 100%)'
                }
            }
        };
    }

    applyColorScheme(schemeName) {
        const schemes = this.getAvailableColorSchemes();
        const scheme = schemes[schemeName];
        
        if (scheme) {
            Object.entries(scheme.colors).forEach(([property, value]) => {
                this.setCustomColor(property, value);
            });
        }
    }
}

// Initialisation des gestionnaires
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.preferencesManager = new PreferencesManager();
    window.colorManager = new ColorManager();
});

// Export pour utilisation dans d'autres modules
window.ThemeManager = ThemeManager;
window.PreferencesManager = PreferencesManager;
window.ColorManager = ColorManager;
