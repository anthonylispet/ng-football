# Fabulous Edgar Markov Tournament

Application Angular permettant de gérer des decks, des ligues et les rencontres du tournoi Commander.

## Développement local

Installer les dépendances puis démarrer le serveur de développement :

```powershell
npm.cmd install
npm.cmd start
```

L'application est ensuite accessible sur `http://localhost:4200/`.

## Build de production local

```powershell
npm.cmd run build
```

Le résultat est généré dans `dist/ng-football/browser/`.

## Mise à jour de GitHub Pages

GitHub Pages publie le contenu du dossier `docs` de la branche `main`. La configuration `github-pages` d'Angular renseigne automatiquement le bon chemin de base `/ng-football/` et place `index.html` directement dans `docs`.

Depuis la racine du projet, générer la version à publier :

```powershell
npm.cmd run build -- --configuration production,github-pages
New-Item -ItemType File -Path .\docs\.nojekyll -Force | Out-Null
```

Vérifier que le point d'entrée a bien été créé :

```powershell
Test-Path .\docs\index.html
```

La commande doit retourner `True`. Il reste ensuite à publier le nouveau build :

```powershell
git add angular.json src docs README.md
git commit -m "Update GitHub Pages application"
git push origin main
```

Le déploiement est alors déclenché automatiquement et l'application devient disponible sur :

<https://anthonylispet.github.io/ng-football/>

En cas d'ancienne version conservée par le navigateur, effectuer un rechargement forcé avec `Ctrl + F5`.

## Tests

```powershell
npm.cmd test
```
