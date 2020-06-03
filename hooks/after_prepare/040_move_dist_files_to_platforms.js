#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var fs = require('fs');
var path = require('path');
var mv = require('mv');

var run = function () {
  var iosPlatformsPath = path.resolve(__dirname, '../../platforms/ios');
  var iosPlatformsDir_dist_css = path.resolve(__dirname, iosPlatformsPath + '/www/dist/css');
  var iosPlatformsDir_dist_js = path.resolve(__dirname, iosPlatformsPath + '/www/dist/js');
  var iosPlatformsDir_dist_index = path.resolve(__dirname, iosPlatformsPath + '/www/dist/index.html');
  var iosPlatformsDir_www_css = path.resolve(__dirname, iosPlatformsPath + '/www/css');
  var iosPlatformsDir_www_js = path.resolve(__dirname, iosPlatformsPath + '/www/js');
  var iosPlatformsDir_www_index = path.resolve(__dirname, iosPlatformsPath + '/www/index.html');

  console.log("Moving dist files to iOS platform start");
  // ios platform exist
  if (fs.existsSync(iosPlatformsPath)) {
    mv(iosPlatformsDir_dist_css, iosPlatformsDir_www_css, { mkdirp: true }, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving CSS folder to iOS platform");
      } else {
        console.log("CSS folder moved OK to iOS platform");
      }
    });

    mv(iosPlatformsDir_dist_js, iosPlatformsDir_www_js, { mkdirp: true }, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving JS folder to iOS platform");
      } else {
        console.log("JS folder moved OK to iOS platform");
      }
    });

    mv(iosPlatformsDir_dist_index, iosPlatformsDir_www_index, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving index.html file to iOS platform");
      } else {
        console.log("index.html file moved OK to iOS platform");
      }
    });
    console.log("Moving dist files to iOS platform end");
  } else {
    console.log('iOS platform not exist');
  }

  var androidPlatformsPath = path.resolve(__dirname, '../../platforms/android');
  if (!fs.existsSync(androidPlatformsPath + '/assets')) {
    // new android path
    androidPlatformsPath = path.resolve(__dirname, '../../platforms/android/app/src/main');
  }
  var androidPlatformsDir_dist_css = path.resolve(__dirname, androidPlatformsPath + '/assets/www/dist/css');
  var androidPlatformsDir_dist_js = path.resolve(__dirname, androidPlatformsPath + '/assets/www/dist/js');
  var androidPlatformsDir_dist_index = path.resolve(__dirname, androidPlatformsPath + '/assets/www/dist/index.html');
  var androidPlatformsDir_www_css = path.resolve(__dirname, androidPlatformsPath + '/assets/www/css');
  var androidPlatformsDir_www_js = path.resolve(__dirname, androidPlatformsPath + '/assets/www/js');
  var androidPlatformsDir_www_index = path.resolve(__dirname, androidPlatformsPath + '/assets/www/index.html');

  console.log("Moving dist files to Android platform start");
  if (fs.existsSync(androidPlatformsPath)) {
    mv(androidPlatformsDir_dist_css, androidPlatformsDir_www_css, { mkdirp: true }, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving CSS folder to Android platform");
      } else {
        console.log("CSS folder moved OK to Android platform");
      }
    });

    mv(androidPlatformsDir_dist_js, androidPlatformsDir_www_js, { mkdirp: true }, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving JS folder to Android platform");
      } else {
        console.log("JS folder moved OK to Android platform");
      }
    });

    mv(androidPlatformsDir_dist_index, androidPlatformsDir_www_index, function (err) {
      if (typeof err != 'undefined') {
        console.log("err");
        console.log(err);
        console.log("ERROR when moving index.html file to Android platform");
      } else {
        console.log("index.html file moved OK to Android platform");
      }
    });
    console.log("Moving dist files to Android platform end");
  } else {
    console.log('Android platform not exist');
  }
};

run();
