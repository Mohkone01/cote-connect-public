// Gestionnaire d'authentification pour ProConnect
class AuthManager {
    constructor() {
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.animateAuthElements();
        this.setupPasswordStrength();
        this.setupPasswordToggle();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Formulaire d'inscription
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Formulaire de connexion
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Mot de passe oublié
        const forgotPasswordLink = document.querySelector('.forgot-password');
        if (forgotPasswordLink) {
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }

        // Boutons sociaux
        this.setupSocialLogin();

        // Modal mot de passe oublié
        this.setupForgotPasswordModal();
    }

    animateAuthElements() {
        // Animer l'apparition des éléments
        const elements = [
            '.auth-form',
            '.auth-info',
            '.floating-stats .stat-card'
        ];

        elements.forEach((selector, index) => {
            const els = document.querySelectorAll(selector);
            els.forEach((el, elIndex) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.6s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, (index * 200) + (elIndex * 100));
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        if (!passwordInput) return;

        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        passwordInput.addEventListener('input', (e) => {
            const password = e.target.value;
            const strength = this.calculatePasswordStrength(password);
            
            this.updatePasswordStrength(strength, strengthBar, strengthText);
        });
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length === 0) {
            return { score: 0, feedback: ['Saisissez un mot de passe'], color: '#6b7280' };
        }

        // Longueur
        if (password.length >= 8) score += 25;
        else feedback.push('Au moins 8 caractères');

        // Minuscules et majuscules
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 25;
        else feedback.push('Majuscules et minuscules');

        // Chiffres
        if (/\d/.test(password)) score += 25;
        else feedback.push('Au moins un chiffre');

        // Caractères spéciaux
        if (/[^A-Za-z0-9]/.test(password)) score += 25;
        else feedback.push('Caractères spéciaux');

        let level, color;
        if (score < 50) {
            level = 'Faible';
            color = '#ef4444';
        } else if (score < 75) {
            level = 'Moyen';
            color = '#f59e0b';
        } else if (score < 100) {
            level = 'Fort';
            color = '#10b981';
        } else {
            level = 'Très fort';
            color = '#059669';
        }

        return {
            score,
            feedback: feedback.length > 0 ? feedback : [level],
            color
        };
    }

    updatePasswordStrength(strength, strengthBar, strengthText) {
        if (!strengthBar || !strengthText) return;

        strengthBar.style.width = strength.score + '%';
        strengthBar.style.background = strength.color;
        strengthText.textContent = strength.feedback.join(', ');
        strengthText.style.color = strength.color;
    }

    setupPasswordToggle() {
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const input = toggle.parentElement.querySelector('input');
                const isPassword = input.type === 'password';
                
                input.type = isPassword ? 'text' : 'password';
                
                // Changer l'icône
                const svg = toggle.querySelector('svg');
                if (isPassword) {
                    svg.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
                } else {
                    svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
                }
            });
        });
    }

    setupFormValidation() {
        // Validation en temps réel
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Validation de confirmation de mot de passe
        const confirmPassword = document.getElementById('confirmPassword');
        const password = document.getElementById('password');
        
        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordConfirmation(password, confirmPassword);
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Validation email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Adresse email invalide';
            }
        }

        // Validation mot de passe
        if (field.type === 'password' && field.id === 'password' && value) {
            if (value.length < 8) {
                isValid = false;
                message = 'Le mot de passe doit contenir au moins 8 caractères';
            }
        }

        // Validation champs requis
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Ce champ est requis';
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    validatePasswordConfirmation(password, confirmPassword) {
        const isValid = password.value === confirmPassword.value;
        const message = isValid ? '' : 'Les mots de passe ne correspondent pas';
        
        this.showFieldValidation(confirmPassword, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Supprimer les messages d'erreur existants
        this.clearFieldError(field);

        if (!isValid && message) {
            field.style.borderColor = '#ef4444';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 4px;
                animation: fadeInUp 0.3s ease;
            `;
            
            field.parentElement.appendChild(errorDiv);
        } else {
            field.style.borderColor = isValid ? '#10b981' : '';
        }
    }

    clearFieldError(field) {
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }

    handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validation du formulaire
        if (!this.validateRegistrationForm(data)) {
            return;
        }

        // Animation du bouton
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.animateSubmitButton(submitBtn, 'Création en cours...');

        // Simulation de l'inscription
        setTimeout(() => {
            this.completeRegistration(data);
        }, 2000);
    }

    validateRegistrationForm(data) {
        let isValid = true;

        // Vérifier tous les champs requis
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        requiredFields.forEach(field => {
            if (!data[field] || !data[field].trim()) {
                isValid = false;
            }
        });

        // Vérifier les conditions d'utilisation
        if (!data.terms) {
            isValid = false;
            this.showErrorMessage('Vous devez accepter les conditions d\'utilisation');
        }

        // Vérifier la correspondance des mots de passe
        if (data.password !== data.confirmPassword) {
            isValid = false;
            this.showErrorMessage('Les mots de passe ne correspondent pas');
        }

        return isValid;
    }

    handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Validation basique
        if (!data.email || !data.password) {
            this.showErrorMessage('Veuillez remplir tous les champs');
            return;
        }

        // Animation du bouton
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.animateSubmitButton(submitBtn, 'Connexion...');

        // Simulation de la connexion
        setTimeout(() => {
            this.completeLogin(data);
        }, 1500);
    }

    animateSubmitButton(button, loadingText) {
        const originalText = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `
            <div class="loading-spinner"></div>
            <span>${loadingText}</span>
        `;
        
        // Ajouter le style du spinner
        if (!document.querySelector('#spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Restaurer le bouton après un délai
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
        }, 3000);
    }

    completeRegistration(data) {
        // Sauvegarder les données utilisateur (simulation)
        localStorage.setItem('proconnect-user', JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            jobTitle: data.jobTitle,
            company: data.company,
            registeredAt: new Date().toISOString()
        }));

        this.showSuccessMessage('Compte créé avec succès ! Redirection...');
        
        setTimeout(() => {
            window.location.href = 'feed.html';
        }, 2000);
    }

    completeLogin(data) {
        // Simulation de vérification des identifiants
        const users = JSON.parse(localStorage.getItem('proconnect-users') || '[]');
        const user = users.find(u => u.email === data.email);

        if (user) {
            localStorage.setItem('proconnect-current-user', JSON.stringify(user));
            this.showSuccessMessage('Connexion réussie ! Redirection...');
            
            setTimeout(() => {
                window.location.href = 'feed.html';
            }, 1500);
        } else {
            // Pour la démo, on accepte n'importe quel email/mot de passe
            localStorage.setItem('proconnect-current-user', JSON.stringify({
                firstName: 'Alexandre',
                lastName: 'Dubois',
                email: data.email,
                jobTitle: 'Senior Developer',
                company: 'TechCorp'
            }));
            
            this.showSuccessMessage('Connexion réussie ! Redirection...');
            
            setTimeout(() => {
                window.location.href = 'feed.html';
            }, 1500);
        }
    }

    setupSocialLogin() {
        document.querySelectorAll('.btn-social').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = btn.classList.contains('google') ? 'Google' : 'LinkedIn';
                this.handleSocialLogin(provider);
            });
        });
    }

    handleSocialLogin(provider) {
        this.showInfoMessage(`Redirection vers ${provider}...`);
        
        // Simulation de connexion sociale
        setTimeout(() => {
            localStorage.setItem('proconnect-current-user', JSON.stringify({
                firstName: 'Utilisateur',
                lastName: provider,
                email: `user@${provider.toLowerCase()}.com`,
                jobTitle: 'Professional',
                company: provider,
                provider: provider
            }));
            
            window.location.href = 'feed.html';
        }, 2000);
    }

    setupForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        const form = document.getElementById('forgotPasswordForm');
        
        if (!modal || !form) return;

        // Fermer le modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeForgotPasswordModal();
        });
        
        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            this.closeForgotPasswordModal();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeForgotPasswordModal();
            }
        });

        // Soumettre le formulaire
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.resetEmail.value;
            
            if (email) {
                this.showSuccessMessage('Email de réinitialisation envoyé !');
                this.closeForgotPasswordModal();
            }
        });
    }

    showForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('animate-fadeInUp');
        }
    }

    closeForgotPasswordModal() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('animate-fadeInUp');
        }
    }

    showSuccessMessage(message) {
        this.showToast(message, 'success', '✅');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error', '❌');
    }

    showInfoMessage(message) {
        this.showToast(message, 'info', 'ℹ️');
    }

    showToast(message, type, icon) {
        const toast = document.createElement('div');
        toast.className = `toast-notification glass-card toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);
        toast.classList.add('animate-slideIn');

        // Auto-fermeture
        setTimeout(() => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        }, 4000);

        // Fermeture manuelle
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        });
    }
}

// Initialiser le gestionnaire d'authentification
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export pour utilisation dans d'autres modules
window.AuthManager = AuthManager;
