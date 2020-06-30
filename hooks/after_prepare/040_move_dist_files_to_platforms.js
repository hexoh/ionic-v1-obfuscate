#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var fs = require('fs');
var path = require('path');
var mv = require('mv');

var rootDir = process.argv[2];

var getPlatforms = function () {
  // go through each of the platform directories that have been prepared
  return (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
};

var getPlatformPath = function (platform) {
  var wwwPath = '';
  if (platform === 'android') {
    wwwPath = path.join('platforms', platform, 'assets', 'www');
    if (!fs.existsSync(wwwPath)) {
      wwwPath = path.join(platformPath, platform, 'app', 'src', 'main', 'assets', 'www');
    }
  } else {
    wwwPath = path.join('platforms', platform, 'www');
  }
  return wwwPath;
};

var run = function () {
  if (rootDir) {

    // list of files and folders to move from www/dist to www/
    var toMove = ['css', 'js', 'index.html'];

    var platforms = getPlatforms();
    platforms.forEach(function (value) {
      try {
        var platform = value.trim().toLowerCase();
        var wwwPath = getPlatformPath(platform);
        var distPath = path.join(wwwPath, 'dist');

        console.log('Moving dist files to ' + platform + ' platform...\n');

        toMove.forEach(function (what) {
          var from = path.join(distPath, what);
          var to = path.join(wwwPath, what);

          mv(from, to, {mkdirp: true}, (function (what, from, to) {
            return function (err) {
              if (typeof err !== 'undefined') {
                console.log('ERROR when moving "' + what + '" to ' + platform + ' platform');
                console.log('\tMoving from: "' + from + '" to "' + to + '"');
                console.log(err);
              } else {
                console.log('\tMoved "' + what + '".');
              }
            };
          })(what, from, to));

        });
      } catch (e) {
        console.error('move dist files to platforms error: ' + e);
      }
    });
  }
};

// move dist files run
run();
