// Gestionnaire pour la page de profil
class ProfileManager {
    constructor() {
        this.isEditing = false;
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.animateProfileElements();
        this.initializeSkillBars();
        this.setupImageUpload();
    }

    setupEventListeners() {
        // Boutons d'édition
        this.setupEditButtons();
        
        // Upload d'images
        this.setupImageHandlers();
        
        // Actions du profil
        this.setupProfileActions();
        
        // Gestion des sections
        this.setupSectionManagement();
    }

    animateProfileElements() {
        // Animer l'apparition des éléments du profil
        const elements = [
            '.profile-avatar-large',
            '.profile-details',
            '.profile-actions',
            '.profile-section'
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
                }, (index * 100) + (elIndex * 50));
            });
        });
    }

    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.dataset.progress;
                    setTimeout(() => {
                        entry.target.style.width = progress + '%';
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    setupEditButtons() {
        // Édition du nom
        const editNameBtn = document.querySelector('.edit-name-btn');
        if (editNameBtn) {
            editNameBtn.addEventListener('click', () => {
                this.editProfileName();
            });
        }

        // Édition des sections
        document.querySelectorAll('.edit-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                this.editSection(section);
            });
        });

        // Ajout de sections
        document.querySelectorAll('.add-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.profile-section');
                this.addSectionItem(section);
            });
        });
    }

    editProfileName() {
        const nameElement = document.querySelector('.profile-name');
        const currentName = nameElement.textContent;
        
        // Créer un input temporaire
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'profile-name-input';
        input.style.cssText = `
            background: var(--glass-bg);
            border: 2px solid var(--primary-gradient);
            border-radius: var(--border-radius);
            padding: var(--spacing-sm);
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--text-primary);
            font-family: 'Poppins', sans-serif;
            width: 100%;
            max-width: 400px;
        `;

        nameElement.style.display = 'none';
        nameElement.parentElement.insertBefore(input, nameElement);
        input.focus();
        input.select();

        const saveEdit = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                nameElement.textContent = newName;
                this.showSuccessMessage('Nom mis à jour avec succès !');
            }
            
            input.remove();
            nameElement.style.display = 'block';
        };

        const cancelEdit = () => {
            input.remove();
            nameElement.style.display = 'block';
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            } else if (e.key === 'Escape') {
                cancelEdit();
            }
        });
    }

    editSection(section) {
        const sectionType = this.getSectionType(section);
        
        switch (sectionType) {
            case 'about':
                this.editAboutSection(section);
                break;
            case 'experience':
                this.editExperienceSection(section);
                break;
            case 'education':
                this.editEducationSection(section);
                break;
            default:
                console.log('Type de section non reconnu');
        }
    }

    getSectionType(section) {
        if (section.querySelector('.about-text')) return 'about';
        if (section.querySelector('.experience-list')) return 'experience';
        if (section.querySelector('.education-list')) return 'education';
        return 'unknown';
    }

    editAboutSection(section) {
        const aboutText = section.querySelector('.about-text');
        const currentText = aboutText.textContent.trim();
        
        // Créer un textarea pour l'édition
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.className = 'about-edit-textarea';
        textarea.style.cssText = `
            width: 100%;
            min-height: 120px;
            background: var(--glass-bg);
            border: 2px solid var(--primary-gradient);
            border-radius: var(--border-radius);
            padding: var(--spacing-md);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 1rem;
            line-height: 1.7;
            resize: vertical;
        `;

        aboutText.style.display = 'none';
        aboutText.parentElement.insertBefore(textarea, aboutText);
        textarea.focus();

        // Boutons de contrôle
        const controls = document.createElement('div');
        controls.className = 'edit-controls';
        controls.style.cssText = `
            display: flex;
            gap: var(--spacing-md);
            margin-top: var(--spacing-md);
        `;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Sauvegarder';
        saveBtn.className = 'btn-primary';
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Annuler';
        cancelBtn.className = 'btn-secondary';

        controls.appendChild(saveBtn);
        controls.appendChild(cancelBtn);
        textarea.parentElement.insertBefore(controls, textarea.nextSibling);

        const saveEdit = () => {
            const newText = textarea.value.trim();
            if (newText && newText !== currentText) {
                aboutText.textContent = newText;
                this.showSuccessMessage('Description mise à jour !');
            }
            
            textarea.remove();
            controls.remove();
            aboutText.style.display = 'block';
        };

        const cancelEdit = () => {
            textarea.remove();
            controls.remove();
            aboutText.style.display = 'block';
        };

        saveBtn.addEventListener('click', saveEdit);
        cancelBtn.addEventListener('click', cancelEdit);
    }

    addSectionItem(section) {
        const sectionType = this.getSectionType(section);
        
        switch (sectionType) {
            case 'experience':
                this.addExperienceItem(section);
                break;
            case 'education':
                this.addEducationItem(section);
                break;
        }
    }

    addExperienceItem(section) {
        const modal = this.createExperienceModal();
        document.body.appendChild(modal);
        
        modal.classList.add('animate-fadeInUp');
        
        // Gérer la soumission du formulaire
        const form = modal.querySelector('.experience-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            this.saveExperienceItem(formData, section);
            this.closeModal(modal);
        });
    }

    createExperienceModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Ajouter une expérience</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="experience-form">
                        <div class="form-group">
                            <label>Poste</label>
                            <input type="text" name="title" required>
                        </div>
                        <div class="form-group">
                            <label>Entreprise</label>
                            <input type="text" name="company" required>
                        </div>
                        <div class="form-group">
                            <label>Type d'emploi</label>
                            <select name="type">
                                <option value="Temps plein">Temps plein</option>
                                <option value="Temps partiel">Temps partiel</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Stage">Stage</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date de début</label>
                                <input type="month" name="startDate" required>
                            </div>
                            <div class="form-group">
                                <label>Date de fin</label>
                                <input type="month" name="endDate">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="current"> Poste actuel
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Lieu</label>
                            <input type="text" name="location">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" rows="4"></textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn-secondary modal-cancel">Annuler</button>
                            <button type="submit" class="btn-primary">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Événements du modal
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.modal-cancel').addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });

        return modal;
    }

    saveExperienceItem(formData, section) {
        const experienceList = section.querySelector('.experience-list');
        
        const newItem = document.createElement('div');
        newItem.className = 'experience-item';
        newItem.innerHTML = `
            <div class="experience-logo">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=60&h=60&fit=crop" alt="${formData.get('company')}">
            </div>
            <div class="experience-details">
                <h3>${formData.get('title')}</h3>
                <p class="company">${formData.get('company')} • ${formData.get('type')}</p>
                <p class="duration">${this.formatDateRange(formData.get('startDate'), formData.get('endDate'), formData.get('current'))}</p>
                <p class="location">${formData.get('location')}</p>
                <p class="description">${formData.get('description')}</p>
            </div>
        `;

        experienceList.insertBefore(newItem, experienceList.firstChild);
        newItem.classList.add('animate-fadeInUp');
        
        this.showSuccessMessage('Expérience ajoutée avec succès !');
    }

    formatDateRange(startDate, endDate, isCurrent) {
        const start = new Date(startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        const end = isCurrent ? 'Présent' : new Date(endDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
        
        return `${start} - ${end}`;
    }

    setupImageHandlers() {
        // Upload de photo de profil
        const editAvatarBtn = document.querySelector('.edit-avatar-btn');
        if (editAvatarBtn) {
            editAvatarBtn.addEventListener('click', () => {
                this.uploadProfileImage();
            });
        }

        // Upload de photo de couverture
        const editCoverBtn = document.querySelector('.edit-cover-btn');
        if (editCoverBtn) {
            editCoverBtn.addEventListener('click', () => {
                this.uploadCoverImage();
            });
        }
    }

    uploadProfileImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const avatarImg = document.querySelector('.profile-avatar-large img');
                    avatarImg.src = e.target.result;
                    this.showSuccessMessage('Photo de profil mise à jour !');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }

    uploadCoverImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const coverImg = document.querySelector('.cover-image');
                    coverImg.src = e.target.result;
                    this.showSuccessMessage('Photo de couverture mise à jour !');
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }

    setupProfileActions() {
        // Bouton de message
        const messageBtn = document.querySelector('.profile-actions .btn-primary');
        if (messageBtn) {
            messageBtn.addEventListener('click', () => {
                this.openMessageDialog();
            });
        }

        // Bouton de connexion
        const connectBtn = document.querySelector('.profile-actions .btn-secondary');
        if (connectBtn && connectBtn.textContent.includes('connecter')) {
            connectBtn.addEventListener('click', () => {
                this.sendConnectionRequest();
            });
        }
    }

    openMessageDialog() {
        // Rediriger vers la page de messages ou ouvrir un modal
        window.location.href = 'messages.html';
    }

    sendConnectionRequest() {
        const connectBtn = document.querySelector('.profile-actions .btn-secondary');
        
        // Animation du bouton
        connectBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            connectBtn.style.transform = 'scale(1)';
            connectBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7"/>
                </svg>
                Demande envoyée
            `;
            connectBtn.disabled = true;
            connectBtn.style.opacity = '0.7';
        }, 150);

        this.showSuccessMessage('Demande de connexion envoyée !');
    }

    closeModal(modal) {
        modal.style.animationDirection = 'reverse';
        setTimeout(() => {
            if (modal.parentElement) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification glass-card';
        toast.innerHTML = `
            <div class="toast-icon">✅</div>
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
        }, 3000);

        // Fermeture manuelle
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        });
    }

    setupImageUpload() {
        // Ajouter des styles pour les formulaires
        const style = document.createElement('style');
        style.textContent = `
            .form-group {
                margin-bottom: var(--spacing-md);
            }
            
            .form-group label {
                display: block;
                margin-bottom: var(--spacing-xs);
                font-weight: 500;
                color: var(--text-primary);
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                background: var(--glass-bg);
                border: 1px solid var(--glass-border);
                border-radius: var(--border-radius);
                padding: var(--spacing-sm);
                color: var(--text-primary);
                font-family: inherit;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--spacing-md);
            }
            
            .checkbox-label {
                display: flex !important;
                align-items: center;
                gap: var(--spacing-xs);
                margin-top: var(--spacing-xs);
            }
            
            .checkbox-label input {
                width: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialiser le gestionnaire de profil
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
});

// Export pour utilisation dans d'autres modules
window.ProfileManager = ProfileManager;
