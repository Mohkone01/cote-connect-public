# 🚀 COMMANDES USUELLES - CôteConnect

## 📋 Guide de démarrage rapide

### 🔧 Prérequis
- **Navigateur moderne** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Serveur web local** (optionnel mais recommandé)
- **Terminal/Invite de commandes**

---

## 🌐 DÉMARRAGE DU SITE

### 🚀 Option 1 : Serveur Python (Recommandé)
```bash
# Python 3.x
python -m http.server 8080

# Python 2.x (si nécessaire)
python -m SimpleHTTPServer 8080

# Accès : http://localhost:8080
```

### 🚀 Option 2 : Serveur Node.js
```bash
# Installation globale de serve
npm install -g serve

# Démarrage du serveur
serve . -p 8080

# Ou avec npx (sans installation)
npx serve . -p 8080

# Accès : http://localhost:8080
```

### 🚀 Option 3 : Live Server (VS Code)
```bash
# 1. Installer l'extension "Live Server" dans VS Code
# 2. Clic droit sur index.html
# 3. Sélectionner "Open with Live Server"
# 4. Accès automatique : http://127.0.0.1:5500
```

### 🚀 Option 4 : PHP (si disponible)
```bash
# Serveur PHP intégré
php -S localhost:8080

# Accès : http://localhost:8080
```

---

## 📁 NAVIGATION DU SITE

### 🏠 Pages principales
```bash
# Page d'accueil
http://localhost:8080/

# Marketplace B2B
http://localhost:8080/marketplace.html

# Gestion coopératives
http://localhost:8080/cooperatives.html

# Analytics et statistiques
http://localhost:8080/analytics.html

# Formation agricole
http://localhost:8080/formation.html

# Authentification
http://localhost:8080/login.html
http://localhost:8080/register.html
```

---

## 🛠️ DÉVELOPPEMENT

### 📝 Édition des fichiers
```bash
# Ouvrir le projet dans VS Code
code .

# Ouvrir un fichier spécifique
code index.html
code css/african-theme.css
code js/main.js

# Ouvrir dans un autre éditeur
notepad index.html          # Windows
nano index.html             # Linux/Mac
vim index.html              # Vim
```

### 🔍 Inspection et debug
```bash
# Ouvrir DevTools dans le navigateur
# Chrome/Edge : F12 ou Ctrl+Shift+I
# Firefox : F12 ou Ctrl+Shift+I
# Safari : Cmd+Option+I

# Console JavaScript
console.log("Debug message");

# Inspection des éléments
# Clic droit > "Inspecter l'élément"
```

### 🎨 Modification des styles
```bash
# Fichiers CSS principaux à modifier
css/main.css                    # Styles de base
css/african-theme.css           # Thème africain principal
css/animations.css              # Animations et transitions
css/glassmorphism.css          # Effets glassmorphism
css/auth-complete-redesign.css  # Pages d'authentification

# Rechargement automatique avec Live Server
# Les modifications sont visibles instantanément
```

---

## 🧪 TESTS ET VALIDATION

### ✅ Tests fonctionnels
```bash
# Tester toutes les pages
curl -I http://localhost:8080/
curl -I http://localhost:8080/marketplace.html
curl -I http://localhost:8080/cooperatives.html
curl -I http://localhost:8080/analytics.html
curl -I http://localhost:8080/formation.html
curl -I http://localhost:8080/login.html
curl -I http://localhost:8080/register.html

# Vérifier les codes de réponse (200 = OK)
```

### 📱 Tests responsive
```bash
# Dans DevTools :
# 1. F12 pour ouvrir DevTools
# 2. Ctrl+Shift+M pour mode responsive
# 3. Tester différentes tailles :
#    - Mobile : 375x667 (iPhone)
#    - Tablet : 768x1024 (iPad)
#    - Desktop : 1920x1080

# Ou utiliser les presets DevTools
```

### ⚡ Tests performance
```bash
# Lighthouse (intégré Chrome DevTools)
# 1. F12 > Onglet "Lighthouse"
# 2. Sélectionner "Performance"
# 3. Cliquer "Generate report"

# PageSpeed Insights en ligne
# https://pagespeed.web.dev/
```

---

## 🔧 MAINTENANCE

### 🔄 Mise à jour du contenu
```bash
# Modifier les prix en temps réel
# Fichier : index.html (lignes 168-174)
# Changer les valeurs FCFA et pourcentages

# Modifier les statistiques
# Fichier : index.html (lignes 123-135)
# Changer data-target pour les compteurs

# Ajouter de nouvelles formations
# Fichier : formation.html
# Dupliquer une section de cours existante
```

### 🎨 Personnalisation des couleurs
```bash
# Fichier : css/african-theme.css
# Variables CSS à modifier (début du fichier) :

:root {
    --color-coffee: #D2691E;      # Orange café
    --color-cacao: #CD853F;       # Beige cacao
    --color-earth: #8B4513;       # Brun terre
    --color-leaf: #228B22;        # Vert feuille
    --color-stem: #2F4F2F;        # Vert tige
}
```

### 🌙 Gestion des thèmes
```bash
# Basculer entre thème clair/sombre
# Cliquer sur le bouton toggle dans la navbar
# Ou via JavaScript console :
document.body.classList.toggle('dark-theme');

# Forcer un thème
localStorage.setItem('theme', 'dark');   # Thème sombre
localStorage.setItem('theme', 'light');  # Thème clair
```

---

## 📦 OPTIMISATION ET BUILD

### 🗜️ Minification CSS
```bash
# Installation de clean-css-cli
npm install -g clean-css-cli

# Minification d'un fichier
cleancss -o css/main.min.css css/main.css

# Minification de tous les CSS
cleancss -o dist/css/all.min.css css/*.css
```

### 🗜️ Minification JavaScript
```bash
# Installation de terser
npm install -g terser

# Minification d'un fichier
terser js/main.js -o js/main.min.js

# Minification de tous les JS
terser js/*.js -o dist/js/all.min.js
```

### 🖼️ Optimisation images
```bash
# Installation d'imagemin
npm install -g imagemin-cli

# Optimisation des images
imagemin images/* --out-dir=dist/images
```

---

## 🌐 DÉPLOIEMENT

### 🚀 Netlify (Recommandé)
```bash
# 1. Créer un compte sur netlify.com
# 2. Glisser-déposer le dossier du projet
# 3. URL automatique générée
# 4. Configuration domaine personnalisé possible

# Ou via Netlify CLI
npm install -g netlify-cli
netlify deploy
netlify deploy --prod  # Déploiement production
```

### 🚀 Vercel
```bash
# Installation Vercel CLI
npm install -g vercel

# Déploiement
vercel
vercel --prod  # Production
```

### 🚀 GitHub Pages
```bash
# 1. Créer un repository GitHub
# 2. Pousser le code
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/coteconnect.git
git push -u origin main

# 3. Activer GitHub Pages dans les settings
# 4. URL : https://username.github.io/coteconnect
```

---

## 🐛 DÉPANNAGE

### ❌ Problèmes courants
```bash
# Site ne se charge pas
# Vérifier que le serveur est démarré
# Vérifier l'URL : http://localhost:8080

# Styles ne s'appliquent pas
# Vider le cache navigateur : Ctrl+F5
# Vérifier les chemins CSS dans index.html

# JavaScript ne fonctionne pas
# Ouvrir DevTools (F12) > Console
# Vérifier les erreurs JavaScript

# Images ne s'affichent pas
# Vérifier les chemins des images
# Vérifier que les fichiers existent
```

### 🔧 Commandes de diagnostic
```bash
# Vérifier les ports utilisés
netstat -an | grep :8080        # Linux/Mac
netstat -an | findstr :8080     # Windows

# Tester la connectivité
ping localhost
curl -I http://localhost:8080

# Vérifier les permissions fichiers
ls -la                          # Linux/Mac
dir                            # Windows
```

---

## 📞 SUPPORT

### 🆘 Ressources d'aide
```bash
# Documentation complète
cat DOCUMENTATION_COMPLETE.md

# Logs du serveur
# Vérifier la console où le serveur est lancé

# Validation HTML
# https://validator.w3.org/

# Validation CSS
# https://jigsaw.w3.org/css-validator/
```

### 🔍 Debug avancé
```bash
# Mode développeur navigateur
# F12 > Sources > Breakpoints

# Performance profiling
# F12 > Performance > Record

# Network monitoring
# F12 > Network > Reload page

# Memory usage
# F12 > Memory > Take snapshot
```

---

*Guide des commandes généré le 2025-06-15*
*Version 1.0 - CôteConnect Platform*
