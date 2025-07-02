// Gestionnaire pour la page du feed
class FeedManager {
    constructor() {
        this.posts = [];
        this.currentPage = 1;
        this.postsPerPage = 5;
        this.isLoading = false;
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.generateInitialPosts();
        this.renderPosts();
        this.animateFeedElements();
    }

    setupEventListeners() {
        // Bouton créer un post
        const createPostBtn = document.getElementById('createPostBtn');
        if (createPostBtn) {
            createPostBtn.addEventListener('click', () => this.showCreatePostModal());
        }

        // Bouton charger plus
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }

        // Boutons de suggestion
        this.setupSuggestionButtons();

        // Actions des posts
        this.setupPostActions();
    }

    generateInitialPosts() {
        const samplePosts = [
            {
                id: 1,
                author: {
                    name: 'Marie Dubois',
                    title: 'Product Manager chez Google',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Excellente conférence sur l\'IA aujourd\'hui ! Les nouvelles possibilités d\'automatisation vont révolutionner notre façon de travailler. Qui d\'autre était présent ? 🚀',
                image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=300&fit=crop',
                time: 'Il y a 2h',
                likes: 127,
                comments: 23,
                shares: 8,
                liked: false
            },
            {
                id: 2,
                author: {
                    name: 'Thomas Martin',
                    title: 'CTO chez StartupXYZ',
                    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Notre équipe vient de lancer une nouvelle fonctionnalité révolutionnaire ! Après 6 mois de développement intensif, nous sommes fiers de présenter notre solution d\'analyse prédictive. Merci à toute l\'équipe pour ce travail exceptionnel ! 💪',
                time: 'Il y a 4h',
                likes: 89,
                comments: 15,
                shares: 12,
                liked: true
            },
            {
                id: 3,
                author: {
                    name: 'Sophie Laurent',
                    title: 'UX Designer chez Adobe',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Réflexion du jour : L\'importance de l\'empathie dans le design. Comprendre vraiment les besoins des utilisateurs fait toute la différence entre un bon produit et un produit exceptionnel. Qu\'en pensez-vous ?',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=300&fit=crop',
                time: 'Il y a 6h',
                likes: 156,
                comments: 34,
                shares: 19,
                liked: false
            },
            {
                id: 4,
                author: {
                    name: 'Alexandre Dubois',
                    title: 'Senior Full-Stack Developer',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Partage d\'expérience : Comment nous avons optimisé les performances de notre application React de 40% en utilisant des techniques de lazy loading et de code splitting. Thread détaillé en commentaires 👇',
                time: 'Il y a 8h',
                likes: 203,
                comments: 45,
                shares: 28,
                liked: true
            },
            {
                id: 5,
                author: {
                    name: 'Emma Wilson',
                    title: 'Data Scientist chez Microsoft',
                    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Fascinant de voir comment l\'analyse de données peut révéler des patterns inattendus. Notre dernière étude sur les comportements utilisateurs a complètement changé notre approche produit. La data ne ment jamais ! 📊',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
                time: 'Il y a 12h',
                likes: 178,
                comments: 29,
                shares: 15,
                liked: false
            }
        ];

        this.posts = samplePosts;
    }

    renderPosts() {
        const feedContainer = document.getElementById('feedPosts');
        if (!feedContainer) return;

        const postsToShow = this.posts.slice(0, this.currentPage * this.postsPerPage);
        
        feedContainer.innerHTML = '';
        
        postsToShow.forEach((post, index) => {
            const postElement = this.createPostElement(post);
            feedContainer.appendChild(postElement);
            
            // Animation d'apparition
            setTimeout(() => {
                postElement.classList.add('animate-fadeInUp');
            }, index * 100);
        });

        // Masquer le bouton "Charger plus" si tous les posts sont affichés
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            if (postsToShow.length >= this.posts.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'flex';
            }
        }
    }

    createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'post-card glass-card';
        postDiv.dataset.postId = post.id;

        postDiv.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">
                    <img src="${post.author.avatar}" alt="${post.author.name}">
                </div>
                <div class="post-author-info">
                    <div class="post-author-name">${post.author.name}</div>
                    <div class="post-author-title">${post.author.title}</div>
                    <div class="post-time">${post.time}</div>
                </div>
                <button class="post-menu">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                    </svg>
                </button>
            </div>
            
            <div class="post-content">
                <div class="post-text">${post.content}</div>
                ${post.image ? `
                    <div class="post-image">
                        <img src="${post.image}" alt="Post image">
                    </div>
                ` : ''}
            </div>
            
            <div class="post-actions">
                <button class="post-action like-btn ${post.liked ? 'liked' : ''}" data-action="like">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7z"/>
                    </svg>
                    <span>${post.likes}</span>
                </button>
                
                <button class="post-action comment-btn" data-action="comment">
                    <svg viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <span>${post.comments}</span>
                </button>
                
                <button class="post-action share-btn" data-action="share">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    <span>${post.shares}</span>
                </button>
                
                <button class="post-action save-btn" data-action="save">
                    <svg viewBox="0 0 24 24">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                    </svg>
                    <span>Sauvegarder</span>
                </button>
            </div>
        `;

        return postDiv;
    }

    setupPostActions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.post-action')) {
                const actionBtn = e.target.closest('.post-action');
                const action = actionBtn.dataset.action;
                const postCard = actionBtn.closest('.post-card');
                const postId = parseInt(postCard.dataset.postId);
                
                this.handlePostAction(action, postId, actionBtn);
            }
        });
    }

    handlePostAction(action, postId, button) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        switch (action) {
            case 'like':
                this.toggleLike(post, button);
                break;
            case 'comment':
                this.showCommentModal(post);
                break;
            case 'share':
                this.sharePost(post);
                break;
            case 'save':
                this.savePost(post, button);
                break;
        }
    }

    toggleLike(post, button) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        
        button.classList.toggle('liked', post.liked);
        button.querySelector('span').textContent = post.likes;
        
        // Animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Effet de particules pour le like
        if (post.liked) {
            this.createLikeParticles(button);
        }
    }

    createLikeParticles(button) {
        const rect = button.getBoundingClientRect();
        const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                width: 6px;
                height: 6px;
                background: ${colors[i]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 6) * Math.PI * 2;
            const distance = 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${x}px, ${y}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(particle);
            };
        }
    }

    showCommentModal(post) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Commentaires</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="post-preview">
                        <div class="post-author">
                            <img src="${post.author.avatar}" alt="${post.author.name}">
                            <div>
                                <strong>${post.author.name}</strong>
                                <p>${post.content.substring(0, 100)}...</p>
                            </div>
                        </div>
                    </div>
                    <div class="comments-section">
                        <div class="comment-input">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" alt="Vous">
                            <input type="text" placeholder="Ajouter un commentaire...">
                            <button class="btn-primary">Publier</button>
                        </div>
                        <div class="comments-list">
                            <!-- Les commentaires seraient chargés ici -->
                            <p class="no-comments">Soyez le premier à commenter !</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.classList.add('animate-fadeInUp');

        // Fermer le modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    sharePost(post) {
        if (navigator.share) {
            navigator.share({
                title: `Post de ${post.author.name}`,
                text: post.content,
                url: window.location.href
            });
        } else {
            // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Lien copié dans le presse-papiers !', 'success');
            });
        }
    }

    savePost(post, button) {
        const isSaved = button.classList.contains('saved');
        button.classList.toggle('saved', !isSaved);
        
        const text = button.querySelector('span');
        text.textContent = isSaved ? 'Sauvegarder' : 'Sauvegardé';
        
        this.showToast(
            isSaved ? 'Post retiré des sauvegardés' : 'Post sauvegardé !',
            'success'
        );
    }

    loadMorePosts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        // Animation de chargement
        loadMoreBtn.innerHTML = `
            <div class="loading-spinner"></div>
            <span>Chargement...</span>
        `;
        
        // Simuler le chargement
        setTimeout(() => {
            this.currentPage++;
            this.generateMorePosts();
            this.renderPosts();
            this.isLoading = false;
            
            loadMoreBtn.innerHTML = `
                <svg viewBox="0 0 24 24">
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Charger plus de posts
            `;
        }, 1500);
    }

    generateMorePosts() {
        const additionalPosts = [
            {
                id: this.posts.length + 1,
                author: {
                    name: 'Lucas Bernard',
                    title: 'DevOps Engineer chez AWS',
                    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face'
                },
                content: 'Infrastructure as Code : notre migration vers Terraform nous a fait gagner 60% de temps sur les déploiements. Retour d\'expérience complet sur notre blog ! 🚀',
                time: 'Il y a 1 jour',
                likes: 92,
                comments: 18,
                shares: 7,
                liked: false
            },
            {
                id: this.posts.length + 2,
                author: {
                    name: 'Camille Rousseau',
                    title: 'Frontend Developer chez Spotify',
                    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face'
                },
                content: 'CSS Grid vs Flexbox : quand utiliser quoi ? Petit guide pratique avec des exemples concrets. Vos retours sont les bienvenus ! 💻',
                image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=300&fit=crop',
                time: 'Il y a 1 jour',
                likes: 134,
                comments: 26,
                shares: 11,
                liked: true
            }
        ];

        this.posts.push(...additionalPosts);
    }

    setupSuggestionButtons() {
        document.querySelectorAll('.suggestion-item .btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const suggestionItem = btn.closest('.suggestion-item');
                const name = suggestionItem.querySelector('h5').textContent;
                
                btn.textContent = 'Suivi';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
                btn.disabled = true;
                
                this.showToast(`Vous suivez maintenant ${name}`, 'success');
            });
        });
    }

    showCreatePostModal() {
        // Utiliser le modal existant de main.js
        if (window.ProConnect && window.ProConnect.prototype.showCreatePostModal) {
            const proConnect = new window.ProConnect();
            proConnect.showCreatePostModal();
        } else {
            this.showToast('Fonctionnalité de création de post en cours de développement', 'info');
        }
    }

    animateFeedElements() {
        // Animer l'apparition des éléments
        const elements = [
            '.create-post',
            '.sidebar-card',
            '.post-card'
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

    closeModal(modal) {
        modal.style.animationDirection = 'reverse';
        setTimeout(() => {
            if (modal.parentElement) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    showToast(message, type = 'info') {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast-notification glass-card toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);
        toast.classList.add('animate-slideIn');

        setTimeout(() => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        }, 3000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentElement) {
                document.body.removeChild(toast);
            }
        });
    }
}

// Initialiser le gestionnaire de feed
document.addEventListener('DOMContentLoaded', () => {
    window.feedManager = new FeedManager();
});

// Export pour utilisation dans d'autres modules
window.FeedManager = FeedManager;
