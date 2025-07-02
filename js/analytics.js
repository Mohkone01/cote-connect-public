// Gestionnaire révolutionnaire d'Analytics
class AnalyticsManager {
    constructor() {
        this.kpiData = {};
        this.chartData = {};
        this.realTimeInterval = null;
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.generateKPIData();
        this.renderKPIs();
        this.initializeCharts();
        this.generateTableData();
        this.startRealTimeUpdates();
        this.animateElements();
    }

    setupEventListeners() {
        // Contrôles des graphiques
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchChartPeriod(e.target.textContent);
                this.updateChartButtons(e.target);
            });
        });

        // Interactions KPI
        document.querySelectorAll('.kpi-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showKPIDetails(card.dataset.kpi);
            });
        });
    }

    generateKPIData() {
        this.kpiData = {
            coffee: {
                value: 2400000,
                change: 12.5,
                trend: 'positive',
                details: {
                    volume: 450,
                    avgPrice: 5333,
                    topBuyer: 'Hamburg Coffee Co.',
                    growth: '+15% vs mois dernier'
                }
            },
            cacao: {
                value: 1800000,
                change: 8.3,
                trend: 'positive',
                details: {
                    volume: 380,
                    avgPrice: 4737,
                    topBuyer: 'Premium Cacao Inc.',
                    growth: '+8% vs mois dernier'
                }
            },
            orders: {
                value: 156,
                change: 23,
                trend: 'positive',
                details: {
                    completed: 142,
                    pending: 14,
                    avgValue: 26923,
                    satisfaction: '4.8/5'
                }
            },
            quality: {
                value: 4.8,
                change: 0.2,
                trend: 'positive',
                details: {
                    certifications: 12,
                    complaints: 3,
                    returns: '0.5%',
                    premiumRate: '85%'
                }
            }
        };
    }

    renderKPIs() {
        Object.keys(this.kpiData).forEach(kpi => {
            const data = this.kpiData[kpi];
            const valueElement = document.querySelector(`.kpi-card[data-kpi="${kpi}"] .kpi-value`);
            const changeElement = document.querySelector(`.kpi-card[data-kpi="${kpi}"] .kpi-change`);
            
            if (valueElement) {
                if (kpi === 'coffee' || kpi === 'cacao') {
                    this.animateValue(valueElement, 0, data.value, 2000, (val) => {
                        return (val / 1000000).toFixed(1) + 'M FCFA';
                    });
                } else if (kpi === 'quality') {
                    this.animateValue(valueElement, 0, data.value, 2000, (val) => {
                        return val.toFixed(1) + '/5';
                    });
                } else {
                    this.animateValue(valueElement, 0, data.value, 2000);
                }
            }
            
            if (changeElement) {
                changeElement.textContent = `${data.change > 0 ? '+' : ''}${data.change}%`;
                changeElement.className = `kpi-change ${data.trend}`;
            }
        });
    }

    animateValue(element, start, end, duration, formatter = null) {
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * easeOutCubic;
            
            if (formatter) {
                element.textContent = formatter(current);
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    initializeCharts() {
        this.initializePriceChart();
        this.initializeSalesChart();
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

        this.drawAdvancedChart(ctx, width, height, coffeeData, cacaoData);
        
        // Animation de mise à jour
        setInterval(() => {
            coffeeData.push(coffeeData[coffeeData.length - 1] + (Math.random() - 0.5) * 100);
            cacaoData.push(cacaoData[cacaoData.length - 1] + (Math.random() - 0.5) * 80);
            
            if (coffeeData.length > 30) coffeeData.shift();
            if (cacaoData.length > 30) cacaoData.shift();
            
            this.drawAdvancedChart(ctx, width, height, coffeeData, cacaoData);
        }, 5000);
    }

    drawAdvancedChart(ctx, width, height, coffeeData, cacaoData) {
        // Effacer le canvas
        ctx.clearRect(0, 0, width, height);
        
        // Gradient de fond
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, 'rgba(210, 105, 30, 0.1)');
        bgGradient.addColorStop(1, 'rgba(210, 105, 30, 0.02)');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        
        // Grille
        ctx.strokeStyle = 'rgba(210, 105, 30, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Calculer les échelles
        const allData = [...coffeeData, ...cacaoData];
        const minPrice = Math.min(...allData);
        const maxPrice = Math.max(...allData);
        const priceRange = maxPrice - minPrice;
        const xStep = width / (coffeeData.length - 1);
        
        // Dessiner les courbes avec gradients
        this.drawGradientLine(ctx, coffeeData, minPrice, priceRange, height, xStep, '#D2691E', 'rgba(210, 105, 30, 0.3)');
        this.drawGradientLine(ctx, cacaoData, minPrice, priceRange, height, xStep, '#A0522D', 'rgba(160, 82, 45, 0.3)');
        
        // Points de données
        this.drawDataPoints(ctx, coffeeData, minPrice, priceRange, height, xStep, '#D2691E');
        this.drawDataPoints(ctx, cacaoData, minPrice, priceRange, height, xStep, '#A0522D');
        
        // Légende animée
        this.drawAnimatedLegend(ctx, width, height);
    }

    drawGradientLine(ctx, data, minPrice, priceRange, height, xStep, color, fillColor) {
        // Ligne
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
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
        
        // Zone remplie
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        data.forEach((price, index) => {
            const x = index * xStep;
            const y = height - ((price - minPrice) / priceRange) * height;
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo((data.length - 1) * xStep, height);
        ctx.closePath();
        ctx.fill();
    }

    drawDataPoints(ctx, data, minPrice, priceRange, height, xStep, color) {
        ctx.fillStyle = color;
        
        data.forEach((price, index) => {
            if (index % 5 === 0) { // Afficher un point sur 5
                const x = index * xStep;
                const y = height - ((price - minPrice) / priceRange) * height;
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
                
                // Effet de pulsation
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.stroke();
            }
        });
    }

    drawAnimatedLegend(ctx, width, height) {
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2) * 0.1 + 0.9;
        
        ctx.font = 'bold 14px Ubuntu';
        ctx.fillStyle = `rgba(210, 105, 30, ${pulse})`;
        ctx.fillText('☕ Café', 20, 30);
        
        ctx.fillStyle = `rgba(160, 82, 45, ${pulse})`;
        ctx.fillText('🍫 Cacao', 20, 50);
        
        // Indicateur temps réel
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(width - 30, 20, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.font = '12px Ubuntu';
        ctx.fillText('LIVE', width - 50, 25);
    }

    initializeSalesChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.drawPieChart(ctx, canvas.width, canvas.height);
    }

    drawPieChart(ctx, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 3;
        
        const data = [
            { label: 'Café Premium', value: 45, color: '#D2691E' },
            { label: 'Cacao Bio', value: 30, color: '#A0522D' },
            { label: 'Café Standard', value: 15, color: '#CD853F' },
            { label: 'Autres', value: 10, color: '#228B22' }
        ];
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((segment, index) => {
            const sliceAngle = (segment.value / 100) * 2 * Math.PI;
            
            // Segment principal
            ctx.fillStyle = segment.color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            // Bordure
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Labels
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
            const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
            
            ctx.fillStyle = '#333';
            ctx.font = 'bold 12px Ubuntu';
            ctx.textAlign = 'center';
            ctx.fillText(`${segment.value}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Centre décoratif
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius / 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Ubuntu';
        ctx.textAlign = 'center';
        ctx.fillText('Ventes', centerX, centerY);
    }

    generateTableData() {
        this.generateTransactionsTable();
        this.generateBuyersTable();
    }

    generateTransactionsTable() {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;

        const transactions = [
            { date: '15/06/2024', product: 'Café Arabica Premium', quantity: '25T', price: '2,450 FCFA/kg', buyer: 'Hamburg Coffee Co.', status: 'completed' },
            { date: '14/06/2024', product: 'Cacao Bio Grade 1', quantity: '18T', price: '1,950 FCFA/kg', buyer: 'Premium Cacao Inc.', status: 'processing' },
            { date: '13/06/2024', product: 'Café Robusta', quantity: '32T', price: '2,200 FCFA/kg', buyer: 'European Traders', status: 'pending' },
            { date: '12/06/2024', product: 'Cacao Standard', quantity: '45T', price: '1,750 FCFA/kg', buyer: 'Swiss Chocolate SA', status: 'completed' },
            { date: '11/06/2024', product: 'Café Bio', quantity: '15T', price: '2,680 FCFA/kg', buyer: 'Organic Coffee Ltd', status: 'completed' }
        ];

        tbody.innerHTML = transactions.map(t => `
            <tr>
                <td>${t.date}</td>
                <td>${t.product}</td>
                <td>${t.quantity}</td>
                <td>${t.price}</td>
                <td>${t.buyer}</td>
                <td><span class="status-badge ${t.status}">${this.getStatusText(t.status)}</span></td>
            </tr>
        `).join('');
    }

    generateBuyersTable() {
        const tbody = document.getElementById('buyersTable');
        if (!tbody) return;

        const buyers = [
            { name: 'Hamburg Coffee Co.', country: '🇩🇪 Allemagne', volume: '245T', value: '580M FCFA', rating: '4.9⭐' },
            { name: 'Premium Cacao Inc.', country: '🇺🇸 États-Unis', volume: '189T', value: '425M FCFA', rating: '4.8⭐' },
            { name: 'European Traders', country: '🇳🇱 Pays-Bas', volume: '156T', value: '380M FCFA', rating: '4.7⭐' },
            { name: 'Swiss Chocolate SA', country: '🇨🇭 Suisse', volume: '134T', value: '320M FCFA', rating: '4.9⭐' },
            { name: 'Organic Coffee Ltd', country: '🇬🇧 Royaume-Uni', volume: '98T', value: '285M FCFA', rating: '4.6⭐' }
        ];

        tbody.innerHTML = buyers.map(b => `
            <tr>
                <td><strong>${b.name}</strong></td>
                <td>${b.country}</td>
                <td>${b.volume}</td>
                <td>${b.value}</td>
                <td>${b.rating}</td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            completed: 'Terminé',
            pending: 'En attente',
            processing: 'En cours'
        };
        return statusMap[status] || status;
    }

    generatePriceHistory(basePrice, days) {
        const data = [];
        let currentPrice = basePrice;
        
        for (let i = 0; i < days; i++) {
            currentPrice += (Math.random() - 0.5) * 150;
            currentPrice = Math.max(basePrice * 0.8, Math.min(basePrice * 1.2, currentPrice));
            data.push(currentPrice);
        }
        
        return data;
    }

    startRealTimeUpdates() {
        this.realTimeInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 10000);
    }

    updateRealTimeData() {
        // Simuler des mises à jour en temps réel
        Object.keys(this.kpiData).forEach(kpi => {
            const data = this.kpiData[kpi];
            const variation = (Math.random() - 0.5) * 0.1;
            
            if (kpi === 'coffee' || kpi === 'cacao') {
                data.value += variation * 100000;
            } else if (kpi === 'orders') {
                data.value += Math.floor(variation * 10);
            } else if (kpi === 'quality') {
                data.value += variation * 0.1;
                data.value = Math.max(3, Math.min(5, data.value));
            }
        });
        
        this.renderKPIs();
        this.addRealTimeIndicators();
    }

    addRealTimeIndicators() {
        document.querySelectorAll('.kpi-card').forEach(card => {
            if (!card.querySelector('.real-time-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'real-time-indicator';
                indicator.textContent = 'LIVE';
                card.appendChild(indicator);
            }
        });
    }

    switchChartPeriod(period) {
        // Logique pour changer la période du graphique
        console.log(`Switching to ${period} period`);
    }

    updateChartButtons(activeBtn) {
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    showKPIDetails(kpi) {
        const data = this.kpiData[kpi];
        if (data && data.details) {
            // Afficher un modal avec les détails du KPI
            console.log(`Showing details for ${kpi}:`, data.details);
        }
    }

    animateElements() {
        const elements = [
            '.page-header',
            '.kpi-grid',
            '.charts-grid',
            '.data-tables',
            '.insights-section'
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
                }, index * 200);
            }
        });
    }

    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }
    }
}

// Initialiser le gestionnaire d'analytics
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});

// Export pour utilisation dans d'autres modules
window.AnalyticsManager = AnalyticsManager;
