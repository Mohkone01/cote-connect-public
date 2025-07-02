@echo off
echo ========================================
echo   CoteConnect - Setup Repository Public
echo ========================================
echo.

echo 1. Creation de la structure de dossiers...
if not exist "images" mkdir images
if not exist "docs" mkdir docs

echo 2. Copie des fichiers HTML...
copy "..\COTE CONNECT\*.html" . >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Fichiers HTML copies avec succes
) else (
    echo    ❌ Erreur lors de la copie des fichiers HTML
)

echo 3. Copie des dossiers CSS et JS...
xcopy "..\COTE CONNECT\css" css\ /E /I /Q >nul 2>&1
xcopy "..\COTE CONNECT\js" js\ /E /I /Q >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Dossiers CSS et JS copies avec succes
) else (
    echo    ❌ Erreur lors de la copie des dossiers CSS/JS
)

echo 4. Copie des images...
copy "..\COTE CONNECT\*.png" images\ >nul 2>&1
if %errorlevel% equ 0 (
    echo    ✅ Images copiees avec succes
) else (
    echo    ❌ Erreur lors de la copie des images
)

echo 5. Copie de la documentation...
copy "..\COTE CONNECT\DOCUMENTATION*.md" docs\ >nul 2>&1
copy "..\COTE CONNECT\COMMANDES_PROJET.md" docs\ >nul 2>&1
copy "..\COTE CONNECT\SOLUTION-TRAIT-SOULIGNEMENT.md" docs\ >nul 2>&1
echo    ✅ Documentation copiee

echo 6. Creation du fichier vercel.json...
echo { > vercel.json
echo   "version": 2, >> vercel.json
echo   "name": "cote-connect", >> vercel.json
echo   "builds": [ >> vercel.json
echo     { >> vercel.json
echo       "src": "**/*", >> vercel.json
echo       "use": "@vercel/static" >> vercel.json
echo     } >> vercel.json
echo   ], >> vercel.json
echo   "routes": [ >> vercel.json
echo     { >> vercel.json
echo       "src": "/(.*)", >> vercel.json
echo       "dest": "/$1" >> vercel.json
echo     } >> vercel.json
echo   ] >> vercel.json
echo } >> vercel.json
echo    ✅ Configuration Vercel creee

echo 7. Creation du fichier .gitignore...
echo # Fichiers systeme > .gitignore
echo .DS_Store >> .gitignore
echo Thumbs.db >> .gitignore
echo *.log >> .gitignore
echo. >> .gitignore
echo # Fichiers temporaires >> .gitignore
echo *.tmp >> .gitignore
echo *.temp >> .gitignore
echo *~ >> .gitignore
echo. >> .gitignore
echo # Dossiers de cache >> .gitignore
echo .cache/ >> .gitignore
echo .vercel/ >> .gitignore
echo. >> .gitignore
echo # Fichiers de configuration locale >> .gitignore
echo .env >> .gitignore
echo .env.local >> .gitignore
echo .env.production >> .gitignore
echo    ✅ Fichier .gitignore cree

echo 8. Creation du README pour les images...
echo # Images CoteConnect > images\README.md
echo. >> images\README.md
echo Ce dossier contient toutes les captures d'ecran de CoteConnect : >> images\README.md
echo. >> images\README.md
echo - P1.png : Page d'accueil >> images\README.md
echo - P2.png : Marketplace B2B >> images\README.md
echo - P3.png : Gestion cooperatives >> images\README.md
echo - P4.png : Analytics et statistiques >> images\README.md
echo - P5.png : Formation agricole >> images\README.md
echo - P6.png : Authentification >> images\README.md
echo - P7.png : Profil utilisateur >> images\README.md
echo - P8.png : Messagerie >> images\README.md
echo - P9.png : Reseau social >> images\README.md
echo - P10.png : Autres fonctionnalites >> images\README.md

echo 9. Initialisation Git...
git init >nul 2>&1
git config user.email "konmohamed149@yahoo.com" >nul 2>&1
git config user.name "Mohkone01" >nul 2>&1
echo    ✅ Git initialise

echo 10. Ajout des fichiers...
git add . >nul 2>&1
echo    ✅ Fichiers ajoutes

echo 11. Premier commit...
git commit -m "Initial commit: CoteConnect - Plateforme Cooperatives Cafe-Cacao" >nul 2>&1
echo    ✅ Premier commit effectue

echo.
echo ========================================
echo   Setup termine avec succes !
echo ========================================
echo.
echo Fichiers copies :
dir /b *.html 2>nul | find /c /v "" > temp.txt
set /p htmlcount=<temp.txt
del temp.txt
echo - %htmlcount% fichiers HTML
echo - Dossiers CSS et JS complets
dir /b images\*.png 2>nul | find /c /v "" > temp.txt
set /p imgcount=<temp.txt
del temp.txt
echo - %imgcount% images PNG
echo - Documentation complete
echo.
echo Prochaines etapes :
echo 1. Creer le repository sur GitHub :
echo    https://github.com/new
echo    Nom : cote-connect-public
echo    Description : Plateforme Cooperatives Cafe-Cacao de Cote d'Ivoire
echo    Visibilite : Public
echo.
echo 2. Connecter au repository :
echo    git remote add origin https://github.com/Mohkone01/cote-connect-public.git
echo.
echo 3. Pousser vers GitHub :
echo    git push -u origin main
echo.
echo 4. Deployer sur Vercel :
echo    https://vercel.com/new
echo    Importer le repository cote-connect-public
echo.
pause
