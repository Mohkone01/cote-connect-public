// Gestionnaire du Marketplace B2B pour CôteConnect
class MarketplaceManager {
    constructor() {
        this.products = [];
        this.auctions = [];
        this.currentFilter = 'all';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.priceChart = null;
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.generateSampleProducts();
        this.generateSampleAuctions();
        this.renderProducts();
        this.initializePriceChart();
        this.startRealTimeUpdates();
        this.animateMarketplaceElements();
    }

    setupEventListeners() {
        // Filtres
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchFilter(e.target.dataset.filter);
            });
        });

        // Actions rapides
        document.getElementById('sellProductBtn')?.addEventListener('click', () => {
            this.showSellProductModal();
        });

        document.getElementById('createAuctionBtn')?.addEventListener('click', () => {
            this.showCreateAuctionModal();
        });

        document.getElementById('requestQuoteBtn')?.addEventListener('click', () => {
            this.showRequestQuoteModal();
        });

        // Modal de vente
        this.setupSellProductModal();

        // Enchères
        this.setupAuctionHandlers();
    }

    generateSampleProducts() {
        const cooperatives = [
            'Coopérative Yamoussoukro',
            'Union Daloa',
            'Coopérative San-Pédro',
            'Groupement Bouaké',
            'Coopérative Abengourou'
        ];

        const productTypes = [
            { name: 'Café Arabica Premium', type: 'coffee', basePrice: 2450, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop' },
            { name: 'Café Robusta Grade 1', type: 'coffee', basePrice: 2200, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop' },
            { name: 'Cacao Bio Premium', type: 'cacao', basePrice: 1950, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
            { name: 'Cacao Grade 1', type: 'cacao', basePrice: 1850, image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop' },
            { name: 'Cacao Grade 2', type: 'cacao', basePrice: 1650, image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop' }
        ];

        this.products = [];
        for (let i = 0; i < 24; i++) {
            const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
            const cooperative = cooperatives[Math.floor(Math.random() * cooperatives.length)];
            const priceVariation = (Math.random() - 0.5) * 200;
            
            this.products.push({
                id: i + 1,
                name: productType.name,
                type: productType.type,
                cooperative: cooperative,
                price: Math.round(productType.basePrice + priceVariation),
                quantity: Math.round((Math.random() * 50 + 5) * 10) / 10,
                quality: ['Premium', 'Grade 1', 'Grade 2', 'Bio'][Math.floor(Math.random() * 4)],
                region: cooperative.split(' ')[1] || 'Abidjan',
                rating: (Math.random() * 2 + 3).toFixed(1),
                image: productType.image,
                deliveryDate: this.getRandomFutureDate(),
                isAuction: Math.random() > 0.7,
                blockchain: this.generateBlockchainId(),
                certifications: this.getRandomCertifications()
            });
        }
    }

    generateSampleAuctions() {
        this.auctions = this.products
            .filter(p => p.isAuction)
            .slice(0, 5)
            .map(product => ({
                ...product,
                currentBid: product.price + Math.round(Math.random() * 300),
                timeLeft: Math.round(Math.random() * 180 + 30), // 30-210 minutes
                bidders: Math.round(Math.random() * 8 + 2),
                minIncrement: 25
            }));
    }

    renderProducts() {
        const container = document.getElementById('productsList');
        if (!container) return;

        const filteredProducts = this.filterProducts();
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        container.innerHTML = '';

        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            container.appendChild(productCard);
            
            // Animation d'apparition
            setTimeout(() => {
                productCard.classList.add('animate-fadeInUp');
            }, index * 100);
        });

        this.updatePagination(filteredProducts.length);
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card glass-card';
        card.dataset.productId = product.id;

        const badgeText = product.isAuction ? '🔨 Enchère' : '💰 Vente directe';
        const actionButton = product.isAuction ? 
            `<button class="btn-primary btn-small bid-btn" data-product-id="${product.id}">Enchérir</button>` :
            `<button class="btn-primary btn-small buy-btn" data-product-id="${product.id}">Acheter</button>`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">${badgeText}</div>
            </div>
            <div class="product-content">
                <div class="product-header">
                    <div>
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-cooperative">${product.cooperative}</p>
                    </div>
                    <div class="product-rating">
                        <span>⭐ ${product.rating}</span>
                    </div>
                </div>
                
                <div class="product-details">
                    <div class="detail-item">
                        <span class="detail-label">Quantité</span>
                        <span class="detail-value">${product.quantity}T</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Qualité</span>
                        <span class="detail-value">${product.quality}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Région</span>
                        <span class="detail-value">${product.region}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Livraison</span>
                        <span class="detail-value">${product.deliveryDate}</span>
                    </div>
                </div>
                
                <div class="product-price">${product.price.toLocaleString()} FCFA/kg</div>
                
                <div class="product-actions">
                    ${actionButton}
                    <button class="btn-secondary btn-small contact-btn" data-product-id="${product.id}">
                        <svg viewBox="0 0 24 24" style="width: 16px; height: 16px;">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                        Contacter
                    </button>
                </div>
                
                <div class="blockchain-trace">
                    <span class="blockchain-id">🔗 ${product.blockchain}</span>
                    <span class="trace-verified">✅ Tracé</span>
                </div>
            </div>
        `;

        // Ajouter les event listeners
        card.querySelector('.bid-btn, .buy-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (product.isAuction) {
                this.showBidModal(product);
            } else {
                this.showPurchaseModal(product);
            }
        });

        card.querySelector('.contact-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.contactSeller(product);
        });

        card.addEventListener('click', () => {
            this.showProductDetails(product);
        });

        return card;
    }

    filterProducts() {
        if (this.currentFilter === 'all') {
            return this.products;
        }
        return this.products.filter(product => {
            switch (this.currentFilter) {
                case 'coffee':
                    return product.type === 'coffee';
                case 'cacao':
                    return product.type === 'cacao';
                case 'auctions':
                    return product.isAuction;
                case 'direct':
                    return !product.isAuction;
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
        
        this.renderProducts();
    }

    initializePriceChart() {
        const canvas = document.getElementById('priceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Générer des données de prix historiques
        const coffeeData = this.generatePriceHistory(2450, 30);
        const cacaoData = this.generatePriceHistory(1850, 30);

        this.drawPriceChart(ctx, width, height, coffeeData, cacaoData);
        
        // Mettre à jour le graphique toutes les 30 secondes
        setInterval(() => {
            coffeeData.push(coffeeData[coffeeData.length - 1] + (Math.random() - 0.5) * 50);
            cacaoData.push(cacaoData[cacaoData.length - 1] + (Math.random() - 0.5) * 40);
            
            if (coffeeData.length > 30) coffeeData.shift();
            if (cacaoData.length > 30) cacaoData.shift();
            
            this.drawPriceChart(ctx, width, height, coffeeData, cacaoData);
        }, 30000);
    }

    generatePriceHistory(basePrice, days) {
        const data = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < days; i++) {
            currentPrice += (Math.random() - 0.5) * 100;
            currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice));
            data.push(currentPrice);
        }
        
        return data;
    }

    drawPriceChart(ctx, width, height, coffeeData, cacaoData) {
        // Effacer le canvas
        ctx.clearRect(0, 0, width, height);
        
        // Couleurs du thème africain
        const coffeeColor = '#D2691E';
        const cacaoColor = '#A0522D';
        
        // Calculer les échelles
        const allData = [...coffeeData, ...cacaoData];
        const minPrice = Math.min(...allData);
        const maxPrice = Math.max(...allData);
        const priceRange = maxPrice - minPrice;
        
        const xStep = width / (coffeeData.length - 1);
        
        // Dessiner la grille
        ctx.strokeStyle = 'rgba(210, 105, 30, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Dessiner les courbes
        this.drawPriceLine(ctx, coffeeData, minPrice, priceRange, height, xStep, coffeeColor);
        this.drawPriceLine(ctx, cacaoData, minPrice, priceRange, height, xStep, cacaoColor);
        
        // Légende
        ctx.font = '12px Ubuntu';
        ctx.fillStyle = coffeeColor;
        ctx.fillText('Café', 10, 20);
        ctx.fillStyle = cacaoColor;
        ctx.fillText('Cacao', 10, 35);
    }

    drawPriceLine(ctx, data, minPrice, priceRange, height, xStep, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((price, index) => {
            const x = index * xStep;
            const y = height - ((price - minPrice) / priceRange) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    startRealTimeUpdates() {
        // Mettre à jour les enchères toutes les 10 secondes
        setInterval(() => {
            this.updateAuctions();
        }, 10000);

        // Mettre à jour les prix toutes les 30 secondes
        setInterval(() => {
            this.updateMarketPrices();
        }, 30000);
    }

    updateAuctions() {
        this.auctions.forEach(auction => {
            auction.timeLeft = Math.max(0, auction.timeLeft - 1);
            
            // Simuler de nouvelles enchères
            if (Math.random() > 0.7 && auction.timeLeft > 0) {
                auction.currentBid += auction.minIncrement;
                auction.bidders += 1;
            }
        });

        // Mettre à jour l'affichage des enchères
        this.updateAuctionDisplay();
    }

    updateAuctionDisplay() {
        const auctionItems = document.querySelectorAll('.auction-item');
        auctionItems.forEach((item, index) => {
            if (this.auctions[index]) {
                const auction = this.auctions[index];
                const bidElement = item.querySelector('.current-bid');
                const timeElement = item.querySelector('.time-left');
                
                if (bidElement) {
                    bidElement.textContent = `${auction.currentBid.toLocaleString()} FCFA/kg`;
                }
                
                if (timeElement) {
                    const hours = Math.floor(auction.timeLeft / 60);
                    const minutes = auction.timeLeft % 60;
                    timeElement.textContent = `⏰ ${hours}h ${minutes}m`;
                }
            }
        });
    }

    updateMarketPrices() {
        const priceElements = document.querySelectorAll('.market-stats .stat-number');
        priceElements.forEach((element, index) => {
            if (index < 2) { // Prix du café et cacao
                const currentValue = parseInt(element.textContent.replace(/\D/g, ''));
                const variation = (Math.random() - 0.5) * 50;
                const newValue = Math.max(1000, currentValue + variation);
                
                this.animateNumberChange(element, newValue);
            }
        });
    }

    animateNumberChange(element, newValue) {
        const currentValue = parseInt(element.textContent.replace(/\D/g, ''));
        const difference = newValue - currentValue;
        const steps = 20;
        const stepValue = difference / steps;
        let currentStep = 0;

        const animate = () => {
            if (currentStep < steps) {
                const value = Math.round(currentValue + (stepValue * currentStep));
                element.textContent = value.toLocaleString();
                currentStep++;
                requestAnimationFrame(animate);
            } else {
                element.textContent = Math.round(newValue).toLocaleString();
            }
        };

        animate();
    }

    showSellProductModal() {
        const modal = document.getElementById('sellProductModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('animate-fadeInUp');
        }
    }

    setupSellProductModal() {
        const modal = document.getElementById('sellProductModal');
        if (!modal) return;

        // Fermer le modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.querySelector('.modal-cancel').addEventListener('click', () => {
            this.closeModal(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Soumettre le formulaire
        const form = modal.querySelector('.sell-product-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmission(new FormData(form));
        });
    }

    handleProductSubmission(formData) {
        // Simuler l'ajout du produit
        const newProduct = {
            id: this.products.length + 1,
            name: formData.get('productType'),
            type: formData.get('productType').includes('coffee') ? 'coffee' : 'cacao',
            cooperative: 'Votre Coopérative',
            price: parseInt(formData.get('price')),
            quantity: parseFloat(formData.get('quantity')),
            quality: 'Premium',
            region: 'Votre Région',
            rating: '5.0',
            image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
            deliveryDate: formData.get('deliveryDate'),
            isAuction: false,
            blockchain: this.generateBlockchainId(),
            certifications: ['Bio', 'Commerce Équitable']
        };

        this.products.unshift(newProduct);
        this.renderProducts();
        
        this.closeModal(document.getElementById('sellProductModal'));
        this.showSuccessMessage('Votre produit a été publié avec succès !');
    }

    generateBlockchainId() {
        return '#' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    getRandomFutureDate() {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 30 + 7));
        return date.toLocaleDateString('fr-FR');
    }

    getRandomCertifications() {
        const certs = ['Bio', 'Commerce Équitable', 'Rainforest Alliance', 'UTZ'];
        const numCerts = Math.floor(Math.random() * 3) + 1;
        return certs.sort(() => 0.5 - Math.random()).slice(0, numCerts);
    }

    animateMarketplaceElements() {
        const elements = [
            '.marketplace-header',
            '.marketplace-filters',
            '.quick-actions',
            '.marketplace-sidebar'
        ];

        elements.forEach((selector, index) => {
            const el = document.querySelector(selector);
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.6s ease-out';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }

    closeModal(modal) {
        modal.style.animationDirection = 'reverse';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
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

    updatePagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        // Logique de pagination à implémenter
    }

    setupAuctionHandlers() {
        // Gérer les clics sur les boutons d'enchère
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bid-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                const product = this.products.find(p => p.id === productId);
                if (product) {
                    this.showBidModal(product);
                }
            }
        });
    }

    showBidModal(product) {
        // Créer et afficher le modal d'enchère
        this.showSuccessMessage(`Enchère sur ${product.name} - Fonctionnalité en développement`);
    }

    showPurchaseModal(product) {
        // Créer et afficher le modal d'achat
        this.showSuccessMessage(`Achat de ${product.name} - Fonctionnalité en développement`);
    }

    contactSeller(product) {
        // Rediriger vers la messagerie
        this.showSuccessMessage(`Contact avec ${product.cooperative} - Redirection vers la messagerie`);
    }

    showProductDetails(product) {
        // Afficher les détails du produit
        this.showSuccessMessage(`Détails de ${product.name} - Modal en développement`);
    }
}

// Initialiser le gestionnaire du marketplace
document.addEventListener('DOMContentLoaded', () => {
    window.marketplaceManager = new MarketplaceManager();
});

// Export pour utilisation dans d'autres modules
window.MarketplaceManager = MarketplaceManager;
