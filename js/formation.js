// Gestionnaire révolutionnaire de Formation
class FormationManager {
    constructor() {
        this.trainings = [];
        this.webinars = [];
        this.userProgress = {};
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.generateTrainings();
        this.generateWebinars();
        this.renderTrainings();
        this.animateElements();
        this.startProgressTracking();
    }

    setupEventListeners() {
        // Boutons d'inscription aux formations
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('inscrire')) {
                this.enrollInTraining(e.target);
            }
        });

        // Cartes de catégories
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                this.exploreCategory(card);
            });
        });

        // Statistiques interactives
        document.querySelectorAll('.training-stats .stat-item').forEach(stat => {
            stat.addEventListener('click', () => {
                this.showStatDetails(stat);
            });
        });
    }

    generateTrainings() {
        this.trainings = [
            {
                id: 1,
                title: 'Techniques Avancées de Fermentation du Café',
                description: 'Maîtrisez les processus de fermentation pour améliorer la qualité de votre café',
                category: 'coffee',
                level: 'Intermédiaire',
                duration: '4 semaines',
                rating: 4.8,
                reviews: 245,
                price: 0,
                certification: true,
                image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop',
                instructor: 'Dr. Kouame Yao',
                modules: 8,
                students: 1250,
                badge: 'Nouveau',
                skills: ['Fermentation', 'Qualité', 'Processus'],
                prerequisites: ['Bases de la caféiculture'],
                language: 'Français',
                format: 'En ligne'
            },
            {
                id: 2,
                title: 'Certification Bio pour le Cacao',
                description: 'Guide complet pour obtenir et maintenir la certification biologique',
                category: 'cacao',
                level: 'Avancé',
                duration: '6 semaines',
                rating: 4.9,
                reviews: 189,
                price: 25000,
                certification: true,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
                instructor: 'Ing. Marie Diabaté',
                modules: 12,
                students: 890,
                badge: 'Premium',
                skills: ['Certification Bio', 'Normes', 'Documentation'],
                prerequisites: ['Expérience en cacaoculture'],
                language: 'Français/Anglais',
                format: 'Hybride'
            },
            {
                id: 3,
                title: 'Gestion Financière des Coopératives',
                description: 'Comptabilité, budgets et planification financière pour dirigeants',
                category: 'management',
                level: 'Débutant',
                duration: '3 semaines',
                rating: 4.7,
                reviews: 312,
                price: 0,
                certification: true,
                image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
                instructor: 'Prof. Adjoua Bamba',
                modules: 6,
                students: 2100,
                badge: 'Populaire',
                skills: ['Comptabilité', 'Budget', 'Planification'],
                prerequisites: ['Aucun'],
                language: 'Français',
                format: 'En ligne'
            }
        ];
    }

    generateWebinars() {
        this.webinars = [
            {
                id: 1,
                title: 'Tendances du Marché Mondial du Café 2024',
                description: 'Analyse des prix, demande et opportunités d\'export',
                date: '2024-06-15',
                time: '14:00 - 15:30',
                instructor: 'Dr. Kouame Yao',
                expertise: 'Expert Commerce',
                format: 'En ligne',
                attendees: 450,
                language: 'Français',
                topics: ['Prix mondiaux', 'Tendances export', 'Opportunités marché']
            },
            {
                id: 2,
                title: 'Innovations Technologiques en Cacaoculture',
                description: 'IoT, drones et applications mobiles pour optimiser les rendements',
                date: '2024-06-22',
                time: '10:00 - 11:30',
                instructor: 'Ing. Marie Diabaté',
                expertise: 'AgriTech',
                format: 'En ligne',
                attendees: 320,
                language: 'Français/Anglais',
                topics: ['IoT agricole', 'Drones', 'Applications mobiles']
            }
        ];
    }

    renderTrainings() {
        // Les formations sont déjà dans le HTML, on ajoute juste l'interactivité
        this.addTrainingInteractivity();
        this.updateTrainingStats();
    }

    addTrainingInteractivity() {
        document.querySelectorAll('.training-card').forEach((card, index) => {
            const training = this.trainings[index];
            if (training) {
                // Ajouter des données dynamiques
                this.enhanceTrainingCard(card, training);
                
                // Ajouter les event listeners
                card.addEventListener('mouseenter', () => {
                    this.showTrainingPreview(card, training);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.hideTrainingPreview(card);
                });
                
                card.addEventListener('click', () => {
                    this.showTrainingDetails(training);
                });
            }
        });
    }

    enhanceTrainingCard(card, training) {
        // Ajouter une barre de progression
        const progressBar = document.createElement('div');
        progressBar.className = 'learning-progress';
        progressBar.innerHTML = `
            <div class="progress-fill" style="width: ${Math.random() * 100}%"></div>
        `;
        
        const content = card.querySelector('.training-content');
        if (content) {
            content.appendChild(progressBar);
        }
        
        // Ajouter des badges dynamiques
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'training-badges';
        badgeContainer.innerHTML = `
            <span class="skill-badge">👥 ${training.students} étudiants</span>
            <span class="skill-badge">📚 ${training.modules} modules</span>
            <span class="skill-badge">🌐 ${training.language}</span>
        `;
        
        content.appendChild(badgeContainer);
    }

    showTrainingPreview(card, training) {
        // Créer une preview flottante
        const preview = document.createElement('div');
        preview.className = 'training-preview glass-card';
        preview.innerHTML = `
            <h4>${training.title}</h4>
            <div class="preview-stats">
                <span>👨‍🏫 ${training.instructor}</span>
                <span>⏱️ ${training.duration}</span>
                <span>🎯 ${training.level}</span>
            </div>
            <div class="preview-skills">
                ${training.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <div class="preview-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.random() * 100}%"></div>
                </div>
                <span>Progression moyenne: ${Math.floor(Math.random() * 100)}%</span>
            </div>
        `;
        
        document.body.appendChild(preview);
        
        // Positionner la preview
        const rect = card.getBoundingClientRect();
        preview.style.position = 'fixed';
        preview.style.top = `${rect.top}px`;
        preview.style.left = `${rect.right + 20}px`;
        preview.style.zIndex = '1000';
        
        // Animation d'apparition
        preview.style.opacity = '0';
        preview.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            preview.style.transition = 'all 0.3s ease-out';
            preview.style.opacity = '1';
            preview.style.transform = 'translateX(0)';
        }, 10);
    }

    hideTrainingPreview(card) {
        const preview = document.querySelector('.training-preview');
        if (preview) {
            preview.style.opacity = '0';
            preview.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                if (preview.parentElement) {
                    document.body.removeChild(preview);
                }
            }, 300);
        }
    }

    showTrainingDetails(training) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card large-modal">
                <div class="modal-header">
                    <h2>${training.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="training-detail-grid">
                        <div class="training-info">
                            <img src="${training.image}" alt="${training.title}" class="training-detail-image">
                            <div class="training-meta-detail">
                                <div class="meta-item">
                                    <strong>Instructeur:</strong> ${training.instructor}
                                </div>
                                <div class="meta-item">
                                    <strong>Durée:</strong> ${training.duration}
                                </div>
                                <div class="meta-item">
                                    <strong>Niveau:</strong> ${training.level}
                                </div>
                                <div class="meta-item">
                                    <strong>Modules:</strong> ${training.modules}
                                </div>
                                <div class="meta-item">
                                    <strong>Étudiants:</strong> ${training.students.toLocaleString()}
                                </div>
                                <div class="meta-item">
                                    <strong>Note:</strong> ${training.rating}⭐ (${training.reviews} avis)
                                </div>
                            </div>
                        </div>
                        <div class="training-content-detail">
                            <h3>Description</h3>
                            <p>${training.description}</p>
                            
                            <h3>Compétences acquises</h3>
                            <div class="skills-list">
                                ${training.skills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                            </div>
                            
                            <h3>Prérequis</h3>
                            <ul>
                                ${training.prerequisites.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                            
                            <div class="training-price-detail">
                                <span class="price-label">Prix:</span>
                                <span class="price-value">${training.price === 0 ? 'Gratuit' : training.price.toLocaleString() + ' FCFA'}</span>
                                ${training.certification ? '<span class="cert-included">+ Certificat inclus</span>' : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Fermer</button>
                    <button class="btn-primary" onclick="formationManager.enrollInTraining(this, ${training.id})">
                        S'inscrire maintenant
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        // Event listeners pour fermer le modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    enrollInTraining(button, trainingId = null) {
        let training;
        
        if (trainingId) {
            training = this.trainings.find(t => t.id === trainingId);
        } else {
            // Trouver la formation depuis le contexte du bouton
            const card = button.closest('.training-card');
            const index = Array.from(document.querySelectorAll('.training-card')).indexOf(card);
            training = this.trainings[index];
        }
        
        if (training) {
            this.showEnrollmentSuccess(training);
            this.updateUserProgress(training.id);
        }
    }

    showEnrollmentSuccess(training) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification glass-card toast-success';
        toast.innerHTML = `
            <div class="toast-icon">🎓</div>
            <div class="toast-content">
                <h4>Inscription réussie !</h4>
                <p>Vous êtes maintenant inscrit à "${training.title}"</p>
                <div class="toast-actions">
                    <button class="btn-small btn-primary" onclick="formationManager.startLearning(${training.id})">
                        Commencer
                    </button>
                </div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);
        toast.classList.add('animate-slideIn');

        setTimeout(() => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        }, 6000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        });
    }

    startLearning(trainingId) {
        const training = this.trainings.find(t => t.id === trainingId);
        if (training) {
            // Simuler le début de l'apprentissage
            this.showSuccessMessage(`Démarrage de "${training.title}" - Redirection vers la plateforme d'apprentissage...`);
        }
    }

    updateUserProgress(trainingId) {
        if (!this.userProgress[trainingId]) {
            this.userProgress[trainingId] = {
                enrolled: true,
                progress: 0,
                startDate: new Date(),
                lastAccess: new Date()
            };
        }
    }

    exploreCategory(card) {
        const categoryTitle = card.querySelector('h3').textContent;
        this.showSuccessMessage(`Exploration de la catégorie "${categoryTitle}" - Fonctionnalité en développement`);
    }

    showStatDetails(stat) {
        const statLabel = stat.querySelector('.stat-label').textContent;
        this.showSuccessMessage(`Détails pour "${statLabel}" - Modal statistiques en développement`);
    }

    updateTrainingStats() {
        // Animer les compteurs de statistiques
        const counters = document.querySelectorAll('.training-stats .counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            this.animateCounter(counter, 0, target, 2000);
        });
    }

    animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOutCubic;
            
            element.textContent = Math.round(current).toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    startProgressTracking() {
        // Simuler le suivi de progression en temps réel
        setInterval(() => {
            this.updateLearningProgress();
        }, 30000);
    }

    updateLearningProgress() {
        document.querySelectorAll('.progress-fill').forEach(fill => {
            const currentWidth = parseInt(fill.style.width) || 0;
            const newWidth = Math.min(currentWidth + Math.random() * 5, 100);
            fill.style.width = `${newWidth}%`;
        });
    }

    animateElements() {
        const elements = [
            '.page-header',
            '.training-stats',
            '.training-categories',
            '.popular-trainings',
            '.upcoming-webinars'
        ];

        elements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 1s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 300);
            }
        });
    }

    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification glass-card toast-success';
        toast.innerHTML = `
            <div class="toast-icon">✅</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);
        toast.classList.add('animate-slideIn');

        setTimeout(() => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        }, 4000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        });
    }
}

// Initialiser le gestionnaire de formation
document.addEventListener('DOMContentLoaded', () => {
    window.formationManager = new FormationManager();
});

// Export pour utilisation dans d'autres modules
window.FormationManager = FormationManager;
