---
title: Ionic1 minification and obfuscation
description: The Ionic1 framework project minification and obfuscation.
---

English | [简体中文](./README.zh-CN.md)

## The Ionic1 framework project minification and obfuscation

We will minified and obfuscated our project in the following steps:

* (**cordova hook**) **`Lint your javascript`** (this step is needed because before minifying and obfuscating we need to ensure that there are no javascript errors)
* (**gulp task**) **`Load html templates as javascript angular templates`** (this adds more obfuscation as your html won’t be visible for others)
* (**gulp task**) **`Enable angular strict dependency injection`** (this step is needed because before obfuscating we need to ensure angular dependency injection won’t brake)
* (**gulp task**) **`Concat js and css files`** (this hides more details about your code)
* (**cordova hook**) And finally **`uglify, minify and obfuscate your code`**

For all the previous task we are going to use a mixture between **_gulp tasks_** and **_cordova hooks_**. Gulp tasks will be “running” all the time after you run `ionic serve`. Cordova hooks will run each time you build or run your project with `ionic build ios [android]` or `ionic run android [ios]`.

If you  run `ionic serve`, your gulp doesn't work. Please add the following code to your **`gulpfile.js`** file:

   ```js
   gulp.task('serve:before', ['default']);  // ionic cli v2 use this code

   or

   gulp.task('ionic:watch:before', ['default']);  // ionic cli v3 use this code

   or

   gulp.task('ionic:serve:before', ['default']);  // ionic cli v4 and newer ionic cli use this code
   ```

### Lint your javascript

1. For this procedure we are going to use these npm packages. Run these commands to install them.

   ```shell
   npm install jshint --save-dev
   npm install async --save-dev
   ```

2. Copy the following cordova hooks

   * In **_before_prepare_** folder copy these [files](https://gist.github.com/hexoh/ef8f28d17124290bdba62b29ff6b9951)
   * If you are using Linux or Mac, give execution permissions to all of them, run `chmod +x file_name`

3. We are ready to test javascript linting, run this command and you will see that jshint is working

   ```shell
   ionic build ios [android]
   ```

### HTML templates transformation

Part of the obfuscation is transforming all the html templates in angular js templates (compressed inside a javascript file)

1. For this we are going to use **_gulp-angular-templatecache_**. Run this command to install the npm package

   ```shell
   npm install gulp-angular-templatecache --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**

   * require **_gulp-angular-templatecache_**

      ```js
      var templateCache = require('gulp-angular-templatecache');
      ```

   * add `templatecache` in **_paths_**

      ```js
      var paths = {
        sass: ['./scss/**/*.scss'],
        templatecache: ['./www/templates/**/*.html'] // add templatecache
      };
      ```

   * add `templatecache task`.The **_root_** parameter refers to the root directory node of your html file. Adding this parameter will automatically add the root node before the generated file path.

      ```js
      gulp.task('templatecache', function (done) {
        console.log('gulp templatecache start: convert html to js');
        gulp.src('./www/templates/**/*.html')
          .pipe(templateCache({ root: 'templates', standalone: true })) // add root parameter
          .pipe(gulp.dest('./www/js'))
          .on('end', done);
      });
      ```

   * If your project have `ionic.project` file, also you need to add this to **_ionic.project_**

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "watch"
      ]
      ```
