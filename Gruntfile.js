/* jshint node: true */
var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {

  // Version de Node-Webkit
  var NW_VERSION = '0.11.3';

  // Dossier de destination de l'empaquetage
  var BUILD_DIR = 'build';

  // Systèmes cible de l'empaquetage, false pour désactiver la cible
  var BUILD_TARGETS = {
    linux_ia32: true, // Linux 32bits
    linux_x64: true, // Linux 64bits
    win: true, // Windows
    osx: false // MacOS
  };

  // Récupération du package.json de l'application
  var PKG = grunt.file.readJSON('package.json');

  // Surcharge du fichier package.json lors d'un build
  var PKG_OVERWRITE = {
    window: {
      toolbar: false
    }
  };

  var buildOptions = _.merge({
    runtimeVersion: NW_VERSION
  }, BUILD_TARGETS);

  var APP_FILES = [];
  _(BUILD_TARGETS).forEach(function(isEnabled, target) {

    // Si la cible n'est pas activée, passer à la cible suivante.
    if(!isEnabled) return;

    // Architecture par défaut
    var arch = 'ia32';
    // Récupération du système cible
    var platform = target;

    // Si la plateforme cible est basée sur linux
    if(platform.indexOf('linux') !== -1) {
      arch = platform.split('_')[1];
      platform = 'linux';
    }

    // Définition du nom du dossier de destination pour la build
    // Exemple: myapp-0.0.1-linux-x64
    var dirName = PKG.name + '-' + PKG.version + '-' + platform + '-' + arch;
    var destPath = path.join(BUILD_DIR, dirName + '/');

    // Définition des fichiers nécessaires au fonctionnement de l'application

    // Récupération des dépendances nodejs de l'application
    var modules = _.keys(PKG.dependencies).map(function(moduleName) {
      return path.join('node_modules', moduleName, '**');
    });
    APP_FILES.push({src: modules, dest: destPath});

    // Ajout du fichier package.json
    APP_FILES.push({src: 'package.json', dest: destPath});

    // AJout du point d'entrée de l'application
    APP_FILES.push({src: PKG.main, dest: destPath});

    // --------------------------------------------------------
    // Ajouter ici les dépendances propres à votre application

    // --------------------------------------------------------
  });

  // Configuration des tâches Grunt
  grunt.initConfig({

    pkg: PKG,

    download: {
      options: {
        runtimeVersion: NW_VERSION
      }
    },

    run: {
      options: {
        nwArgs: ['.'],
        runtimeVersion: NW_VERSION
      }
    },

    build: {
      options: buildOptions
    },

    clean: {
      build: [BUILD_DIR]
    },

    copy: {
      build: {
        files: APP_FILES,
        options: {
          noProcess: ['**','!package.json'],
          process: function() {
            var pkg = _.merge(PKG, PKG_OVERWRITE);
            return JSON.stringify(pkg, null, 2);
          }
        }
      }
    }

  });

  grunt.registerTask('app:run',  ['download', 'run']);
  grunt.registerTask(
    'app:build',
    ['download', 'clean:build', 'build', 'copy:build']
  );
  grunt.registerTask('default', ['app:run']);

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-nw');

};
