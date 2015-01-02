# Node-Webkit Bootstrap

Structure de base pour débuter un projet Node-Webkit.

Les commandes Grunt se chargent de télécharger/décompresser automatiquement node-webkit et de configurer votre projet afin de faciliter le processus de développement.

Pour personnaliser le comportement des commandes, voir le fichier `Gruntfile.js`.

## Débuter avec le projet

Dans votre propre projet Node-Webkit
```
git remote add nw-bootstrap https://github.com/bornholm/nw-bootstrap.git
git fetch nw-bootstrap
git merge nw-bootstrap/master
sudo npm install grunt-cli -g
npm install
grunt
```

## Commandes Grunt

- **grunt app:build** Génère un dossier avec l'ensemble des fichiers nécessaires à la diffusion de votre application.
- **grunt app:run** (ou simplement `grunt`) Lance votre application à partir des sources.
