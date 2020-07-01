#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var fs = require('fs');
var path = require('path');

var rootDir = process.argv[2];

var deleteFolderRecursive = function (removePath) {
  if (fs.existsSync(removePath)) {
    fs.readdirSync(removePath).forEach(function (file, index) {
      var curPath = path.join(removePath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(removePath);
  }
};

var getPlatforms = function () {
  // go through each of the platform directories that have been prepared
  return (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);
};

var getPlatformPath = function (platform) {
  var wwwPath = '';
  if (platform === 'android') {
    wwwPath = path.join('platforms', platform, 'assets', 'www');
    if (!fs.existsSync(wwwPath)) {
      wwwPath = path.join('platforms', platform, 'app', 'src', 'main', 'assets', 'www');
    }
  } else {
    wwwPath = path.join('platforms', platform, 'www');
  }
  return wwwPath;
};

var run = function () {
  if (rootDir) {
    var platforms = getPlatforms();
    platforms.forEach(function (value) {
      try {
        var platform = value.trim().toLowerCase();
        var wwwPath = getPlatformPath(platform);
        var distPath = path.join(wwwPath, 'dist');

        if (fs.existsSync(distPath)) {
          console.log('removing dist folder: ' + distPath);
          deleteFolderRecursive(distPath);
        }

      } catch (e) {
        console.error('clean obfuscation error: ' + e);
      }
    });
  }
};

// clean obfuscation run
run();
