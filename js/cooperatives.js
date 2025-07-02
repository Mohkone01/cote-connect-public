// Gestionnaire révolutionnaire des Coopératives
class CooperativesManager {
    constructor() {
        this.cooperatives = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.cooperativesPerPage = 9;
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.generateCooperatives();
        this.renderCooperatives();
        this.animateElements();
        this.startLiveUpdates();
    }

    setupEventListeners() {
        // Filtres
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchFilter(e.target.dataset.filter);
            });
        });

        // Recherche en temps réel
        const searchInput = document.querySelector('.nav-search input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchCooperatives(e.target.value);
            });
        }
    }

    generateCooperatives() {
        const regions = [
            { name: 'Yamoussoukro', coords: [6.8276, -5.2893] },
            { name: 'Daloa', coords: [6.8775, -6.4503] },
            { name: 'San-Pédro', coords: [4.7467, -6.6364] },
            { name: 'Bouaké', coords: [7.6944, -5.0300] },
            { name: 'Abengourou', coords: [6.7297, -3.4967] },
            { name: 'Gagnoa', coords: [6.1319, -5.9506] },
            { name: 'Korhogo', coords: [9.4581, -5.6297] },
            { name: 'Man', coords: [7.4125, -7.5539] }
        ];

        const coopNames = [
            'Union des Producteurs de Café',
            'Coopérative Agricole Moderne',
            'Groupement des Cacaoculteurs',
            'Union Solidaire des Planteurs',
            'Coopérative Bio Excellence',
            'Alliance des Producteurs Durables',
            'Union Équitable du Terroir',
            'Coopérative Innovation Verte',
            'Groupement Prospérité Agricole',
            'Union des Femmes Productrices',
            'Coopérative Jeunes Agriculteurs',
            'Alliance Café-Cacao Premium'
        ];

        const certifications = [
            { name: 'Bio', icon: '🌱', color: '#228B22' },
            { name: 'Équitable', icon: '🤝', color: '#FF6B35' },
            { name: 'Rainforest', icon: '🌳', color: '#2E8B57' },
            { name: 'UTZ', icon: '✓', color: '#4169E1' },
            { name: 'ISO', icon: '📋', color: '#8B4513' }
        ];

        this.cooperatives = [];
        
        for (let i = 0; i < 36; i++) {
            const region = regions[Math.floor(Math.random() * regions.length)];
            const coopName = coopNames[Math.floor(Math.random() * coopNames.length)];
            const memberCount = Math.floor(Math.random() * 800) + 50;
            const productionVolume = Math.floor(Math.random() * 500) + 100;
            const rating = (Math.random() * 2 + 3).toFixed(1);
            
            // Spécialités
            const specialties = [];
            if (Math.random() > 0.3) specialties.push('coffee');
            if (Math.random() > 0.4) specialties.push('cacao');
            if (specialties.length === 0) specialties.push(Math.random() > 0.5 ? 'coffee' : 'cacao');
            
            // Certifications aléatoires
            const coopCertifications = [];
            certifications.forEach(cert => {
                if (Math.random() > 0.6) {
                    coopCertifications.push(cert);
                }
            });

            this.cooperatives.push({
                id: i + 1,
                name: `${coopName} ${region.name}`,
                region: region.name,
                coordinates: region.coords,
                memberCount: memberCount,
                productionVolume: productionVolume,
                rating: parseFloat(rating),
                specialties: specialties,
                certifications: coopCertifications,
                foundedYear: 2000 + Math.floor(Math.random() * 24),
                president: this.generatePresidentName(),
                revenue: Math.floor(Math.random() * 500000000) + 50000000,
                exportCountries: Math.floor(Math.random() * 15) + 3,
                sustainabilityScore: Math.floor(Math.random() * 40) + 60,
                isVerified: Math.random() > 0.2,
                lastActivity: this.getRandomRecentDate()
            });
        }
    }

    generatePresidentName() {
        const firstNames = ['Kouassi', 'Adjoua', 'Yao', 'Akissi', 'Kofi', 'Ama', 'Kwame', 'Affoué'];
        const lastNames = ['Diabaté', 'Ouattara', 'Koné', 'Traoré', 'Bamba', 'Doumbia', 'Sangaré', 'Coulibaly'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    getRandomRecentDate() {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        return date.toLocaleDateString('fr-FR');
    }

    renderCooperatives() {
        const container = document.getElementById('cooperativesGrid');
        if (!container) return;

        const filteredCoops = this.filterCooperatives();
        const startIndex = (this.currentPage - 1) * this.cooperativesPerPage;
        const endIndex = startIndex + this.cooperativesPerPage;
        const coopsToShow = filteredCoops.slice(startIndex, endIndex);

        container.innerHTML = '';

        coopsToShow.forEach((coop, index) => {
            const coopCard = this.createCooperativeCard(coop);
            container.appendChild(coopCard);
            
            // Animation d'apparition
            setTimeout(() => {
                coopCard.classList.add('animate-fadeInUp');
            }, index * 150);
        });

        this.updatePagination(filteredCoops.length);
    }

    createCooperativeCard(coop) {
        const card = document.createElement('div');
        card.className = 'coop-card glass-card';
        card.dataset.coopId = coop.id;

        const specialtyTags = coop.specialties.map(specialty => {
            const specialtyClass = specialty === 'coffee' ? 'coffee' : specialty === 'cacao' ? 'cacao' : 'bio';
            const specialtyName = specialty === 'coffee' ? '☕ Café' : specialty === 'cacao' ? '🍫 Cacao' : '🌱 Bio';
            return `<span class="specialty-tag ${specialtyClass}">${specialtyName}</span>`;
        }).join('');

        const certificationBadges = coop.certifications.map(cert => 
            `<div class="certification-badge" title="${cert.name}" style="border-color: ${cert.color};">${cert.icon}</div>`
        ).join('');

        const verifiedBadge = coop.isVerified ? '<span class="verified-badge">✅ Vérifiée</span>' : '';

        card.innerHTML = `
            <div class="coop-header">
                <h3 class="coop-title">${coop.name}</h3>
                <div class="coop-location">${coop.region}</div>
                ${verifiedBadge}
            </div>
            
            <div class="coop-content">
                <div class="coop-stats-mini">
                    <div class="mini-stat">
                        <span class="mini-stat-number">${coop.memberCount}</span>
                        <span class="mini-stat-label">Membres</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-number">${coop.productionVolume}T</span>
                        <span class="mini-stat-label">Production</span>
                    </div>
                    <div class="mini-stat">
                        <span class="mini-stat-number">${coop.rating}⭐</span>
                        <span class="mini-stat-label">Note</span>
                    </div>
                </div>
                
                <div class="coop-specialties">
                    ${specialtyTags}
                </div>
                
                <div class="coop-certifications">
                    ${certificationBadges}
                </div>
                
                <div class="coop-details">
                    <p><strong>Président:</strong> ${coop.president}</p>
                    <p><strong>Fondée:</strong> ${coop.foundedYear}</p>
                    <p><strong>Export:</strong> ${coop.exportCountries} pays</p>
                    <p><strong>Durabilité:</strong> ${coop.sustainabilityScore}%</p>
                </div>
                
                <div class="coop-actions">
                    <button class="btn-coop primary" onclick="cooperativesManager.viewCooperative(${coop.id})">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                        Voir Détails
                    </button>
                    <button class="btn-coop secondary" onclick="cooperativesManager.contactCooperative(${coop.id})">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Contacter
                    </button>
                </div>
            </div>
        `;

        // Ajouter les event listeners
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-coop')) {
                this.viewCooperative(coop.id);
            }
        });

        return card;
    }

    filterCooperatives() {
        if (this.currentFilter === 'all') {
            return this.cooperatives;
        }
        return this.cooperatives.filter(coop => {
            switch (this.currentFilter) {
                case 'coffee':
                    return coop.specialties.includes('coffee');
                case 'cacao':
                    return coop.specialties.includes('cacao');
                case 'certified':
                    return coop.certifications.length > 0;
                default:
                    return true;
            }
        });
    }

    switchFilter(filter) {
        this.currentFilter = filter;
        this.currentPage = 1;
        
        // Mettre à jour l'UI des filtres
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });
        
        this.renderCooperatives();
    }

    searchCooperatives(query) {
        if (!query) {
            this.renderCooperatives();
            return;
        }

        const filteredCoops = this.cooperatives.filter(coop => 
            coop.name.toLowerCase().includes(query.toLowerCase()) ||
            coop.region.toLowerCase().includes(query.toLowerCase()) ||
            coop.president.toLowerCase().includes(query.toLowerCase())
        );

        this.renderFilteredCooperatives(filteredCoops);
    }

    renderFilteredCooperatives(coops) {
        const container = document.getElementById('cooperativesGrid');
        if (!container) return;

        container.innerHTML = '';

        coops.forEach((coop, index) => {
            const coopCard = this.createCooperativeCard(coop);
            container.appendChild(coopCard);
            
            setTimeout(() => {
                coopCard.classList.add('animate-fadeInUp');
            }, index * 100);
        });
    }

    viewCooperative(id) {
        const coop = this.cooperatives.find(c => c.id === id);
        if (coop) {
            this.showCooperativeModal(coop);
        }
    }

    showCooperativeModal(coop) {
        // Créer un modal détaillé pour la coopérative
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content glass-card large-modal">
                <div class="modal-header">
                    <h2>${coop.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="coop-detail-grid">
                        <div class="detail-section">
                            <h3>Informations Générales</h3>
                            <p><strong>Région:</strong> ${coop.region}</p>
                            <p><strong>Président:</strong> ${coop.president}</p>
                            <p><strong>Fondée:</strong> ${coop.foundedYear}</p>
                            <p><strong>Membres:</strong> ${coop.memberCount.toLocaleString()}</p>
                            <p><strong>Note:</strong> ${coop.rating}⭐</p>
                        </div>
                        <div class="detail-section">
                            <h3>Production</h3>
                            <p><strong>Volume annuel:</strong> ${coop.productionVolume}T</p>
                            <p><strong>Revenus:</strong> ${(coop.revenue / 1000000).toFixed(1)}M FCFA</p>
                            <p><strong>Export:</strong> ${coop.exportCountries} pays</p>
                            <p><strong>Durabilité:</strong> ${coop.sustainabilityScore}%</p>
                        </div>
                    </div>
                    <div class="coop-certifications-detail">
                        <h3>Certifications</h3>
                        <div class="certifications-list">
                            ${coop.certifications.map(cert => `<span class="cert-badge">${cert.icon} ${cert.name}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Fermer</button>
                    <button class="btn-primary" onclick="cooperativesManager.contactCooperative(${coop.id})">Contacter</button>
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

    contactCooperative(id) {
        const coop = this.cooperatives.find(c => c.id === id);
        if (coop) {
            this.showSuccessMessage(`Demande de contact envoyée à ${coop.name}`);
        }
    }

    animateElements() {
        const elements = [
            '.page-header',
            '.coop-stats',
            '.coop-filters'
        ];

        elements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.8s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 300);
            }
        });
    }

    startLiveUpdates() {
        // Simuler des mises à jour en temps réel
        setInterval(() => {
            this.updateCooperativeStats();
        }, 30000);
    }

    updateCooperativeStats() {
        // Mettre à jour quelques statistiques aléatoirement
        this.cooperatives.forEach(coop => {
            if (Math.random() > 0.9) {
                coop.lastActivity = new Date().toLocaleDateString('fr-FR');
                // Petite variation dans la production
                const variation = (Math.random() - 0.5) * 10;
                coop.productionVolume = Math.max(50, coop.productionVolume + variation);
            }
        });
    }

    updatePagination(totalCoops) {
        const totalPages = Math.ceil(totalCoops / this.cooperativesPerPage);
        // Logique de pagination à implémenter
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

// Initialiser le gestionnaire des coopératives
document.addEventListener('DOMContentLoaded', () => {
    window.cooperativesManager = new CooperativesManager();
});

// Export pour utilisation dans d'autres modules
window.CooperativesManager = CooperativesManager;
