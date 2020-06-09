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

If you  run `ionic serve`, your gulp doesn't work. Please add the following code to your **_gulpfile.js_** file:

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

2. Copy the following cordova hooks.

   * In **_before_prepare_** folder copy [these](https://gist.github.com/hexoh/ef8f28d17124290bdba62b29ff6b9951) files.
   * If you are using Linux or Mac, give execution permissions to all of them, run

      ```shell
      chmod +x file_name
      ```

3. We are ready to test javascript linting, run this command and you will see that jshint is working.

   ```shell
   ionic build ios [android]
   ```

### HTML templates transformation

Part of the obfuscation is transforming all the html templates in angular js templates (compressed inside a javascript file).

1. For this we are going to use **_gulp-angular-templatecache_**. Run this command to install the npm package.

   ```shell
   npm install gulp-angular-templatecache --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_gulp-angular-templatecache_**.

      ```js
      var templateCache = require('gulp-angular-templatecache');
      ```

   * add `templatecache` in **_paths_**.

      ```js
      var paths = {
        sass: ['./scss/**/*.scss'],
        templatecache: ['./www/templates/**/*.html'] // add templatecache
      };
      ```

   * add `templatecache` task.The **_root_** parameter refers to the root directory node of your html file. Adding this parameter will automatically add the root node before the generated file path.

      ```js
      gulp.task('templatecache', function (done) {
        console.log('gulp templatecache start: convert html to js');
        gulp.src('./www/templates/**/*.html')
          .pipe(templateCache({ root: 'templates', standalone: true })) // add root parameter
          .pipe(gulp.dest('./www/js'))
          .on('end', done);
      });
      ```

   * add `templatecache` task in **_default task_** and **_watch task_**.

      ```js
      gulp.task('default', ['sass', 'templatecache']);
      ```

      ```js
      gulp.task('watch', function() {
        gulp.watch(paths.sass, ['sass']);
        gulp.watch(paths.templatecache, ['templatecache']);
      });
      ```

3. If your project have `ionic.project` file, also you need to add this to **_ionic.project_**.

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "watch"
      ]
      ```

4. Add **_templates_** module in your **_app.js_**.

   ```js
   angular.module('starter', ['ionic', 'starter.controllers', 'templates'])
   ```

5. Add reference to **_templates.js_** file in your **_index.html_**.

   ```html
   <script src="js/templates.js"></script>
   ```

6. Run

   This will add a **_templates.js_** file inside **_www/js_** with all the html templates as angular js templates.

   ```shell
   ionic serve

   or

   gulp templatecache
   ```

### Enable ng-strict-di

Before minifying we need to enable angular strict dependency injection (for more information about why you need this, read [here](https://github.com/olov/ng-annotate#highly-recommended-enable-ng-strict-di-in-your-minified-builds). This will save us from breaking angular dependency injection when minifying.

1. For that we are going to use **_gulp-ng-annotate_**. Run this command to install the npm package.

   ```shell
   npm install gulp-ng-annotate --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_gulp-ng-annotate_**.

      ```js
      var ngAnnotate = require('gulp-ng-annotate');
      ```

   * add `ng_annotate` in **_paths_**.

      ```js
      var paths = {
        sass: ['./scss/**/*.scss'],
        templatecache: ['./www/templates/**/*.html'], // add templatecache
        ng_annotate: ['./www/js/*.js']
      };
      ```

   * add `ng_annotate` task.

      ```js
      gulp.task('ng_annotate', function (done) {
        console.log('gulp ng_annotate start: add dependency injection annotations');
        gulp.src('./www/js/*.js')
          .pipe(ngAnnotate({ single_quotes: true }))
          .pipe(gulp.dest('./www/dist/js/app'))
          .on('end', done);
      });
      ```

   * add `ng_annotate` task in **_default task_** and **_watch task_**.

      ```js
      gulp.task('default', ['sass', 'templatecache', 'ng_annotate']);
      ```

      ```js
      gulp.task('watch', function() {
        gulp.watch(paths.sass, ['sass']);
        gulp.watch(paths.templatecache, ['templatecache']);
        gulp.watch(paths.ng_annotate, ['ng_annotate']);
      });
      ```

3. If your project have `ionic.project` file, also you need to add this to **_ionic.project_**.

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "ng_annotate",
        "watch"
      ]
      ```

4. Change the path of our angular js files in the **_index.html_** as follows.

   ```html
   <script src="dist/js/app/app.js"></script>
   <script src="dist/js/app/controllers.js"></script>
   <script src="dist/js/app/services.js"></script>
   <script src="dist/js/app/templates.js"></script>
   ```

5. Add `ng-strict-di` directive in `ng-app` tag (inside **_index.html_**).

   ```html
   <body ng-app="your-app" ng-strict-di>
   ```

6. Run

   This will create a **_dist_** folder inside **_www_** folder with all our js files with strict dependency injection fixed.

   ```shell
   ionic serve

   or

   gulp ng_annotate
   ```

### Concatenate js and css files

1. For the concatenation of files we are going to use gulp-useref. Run this command to install the npm package. Install version 2.1.0 here, because the function method of the higher version has changed.

   ```shell
   npm install gulp-useref@2.1.0 --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_gulp-useref_**.

      ```js
      var useref = require('gulp-useref');
      ```

   * add `useref` in **_paths_**.

      ```js
      var paths = {
        sass: ['./scss/**/*.scss'],
        templatecache: ['./www/templates/**/*.html'], // add templatecache
        ng_annotate: ['./www/js/*.js'],
        useref: ['./www/*.html'],
      };
      ```

   * add `useref` task.

      ```js
      gulp.task('useref', function (done) {
        console.log('gulp useref start: handle file concatenation');
        var assets = useref.assets();
        gulp.src('./www/*.html')
          .pipe(assets)
          .pipe(assets.restore())
          .pipe(useref())
          .pipe(gulp.dest('./www/dist'))
          .on('end', done);
      });
      ```

   * add `useref` task in **_default task_** and **_watch task_**.

      ```js
      gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'useref']);
      ```

      ```js
      gulp.task('watch', function() {
        gulp.watch(paths.sass, ['sass']);
        gulp.watch(paths.templatecache, ['templatecache']);
        gulp.watch(paths.ng_annotate, ['ng_annotate']);
        gulp.watch(paths.useref, ['useref']);
      });
      ```

3. If your project have `ionic.project` file, also you need to add this to **_ionic.project_**.

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "ng_annotate",
        "useref",
        "watch"
      ]
      ```

4. Add the following to **_index.html_** to bundle css and js as you want.

   ```html
   <!-- build:css css/styles.css -->
   <link href="css/ionic.app.css" rel="stylesheet">
   <!-- endbuild -->
   ```

   ```html
   <!-- build:js js/app.js -->
   <script src="dist/js/app/app.js"></script>
   <script src="dist/js/app/controllers.js"></script>
   <script src="dist/js/app/services.js"></script>
   <script src="dist/js/app/templates.js"></script>
   <!-- endbuild -->
   ```

   Note: if you require an external script/file don’t include it inside a bundle. For example:

   ```html
   <script src="http://maps.google.com/maps/api/js"></script>
   ```

5. Run

   This will create the bundled files inside you **_www/dist_** folder also a new **_index.html_** with the new path to the bundled files.

   ```shell
   ionic serve

   or

   gulp useref
   ```

### Automatically add files to html

In order to better automate packaging and deployment, we can use the gulp plugin to automatically add the `js` file to **_index.html_** without requiring us to manually add it.

1. For that we are going to use **_gulp-inject_** . Run this command to install the npm package.

   ```shell
   npm install gulp-inject --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_gulp-inject_**.

      ```js
      var inject = require('gulp-inject');
      ```

   * add `inject_templates` in **_paths_**.

      ```js
      var paths = {
        sass: ['./scss/**/*.scss'],
        templatecache: ['./www/templates/**/*.html'], // add templatecache
        ng_annotate: ['./www/js/*.js'],
        inject_templates: ['./www/index.html']
      };
      ```

   * add `inject_templates` task.

      ```js
      gulp.task('inject_templates', function (done) {
        console.log('gulp inject_templates start: auto add file in index.html');
        gulp.src('./www/index.html')
         .pipe(inject(gulp.src('./www/dist/js/app/app.js', { read: false }), { relative: true, starttag: '<!-- inject:app:{{ext}} -->' }))
         .pipe(inject(gulp.src(['./www/dist/js/app/controllers.js', './www/dist/js/app/services.js', './www/dist/js/app/templates.js'], { read: false }), { relative: true }))
         .pipe(gulp.dest('./www'))
         .on('end', done);
      });
      ```

   * add `inject_templates` task in **_default task_**.

      ```js
      gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'inject_templates', 'useref']);
      ```

3. If your project have `ionic.project` file, also you need to add this to **_ionic.project_**.

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "ng_annotate",
        "inject_templates",
        "useref",
        "watch"
      ]
      ```

4. Modify the reference to `js` in **_index.html_**.

   ```html
   <!-- build:js js/app.js -->  
   <!-- inject:app:js -->
   <!-- endinject -->
   <!-- endbuild -->

   <!-- build:js js/basic.js -->  
   <!-- inject:js -->
   <!-- endinject -->
   <!-- endbuild -->
   ```

5. Run

   ```shell
   ionic serve

   or

   gulp inject_templates
   ```

   The `js` file will be automatically added to the tag `<!-- inject:js -->` And within `<!-- endinject -->`.

### Run gulp tasks synchronously

Because the gulp task is executed asynchronously, but the gulp task we created needs to be executed synchronously in order, otherwise an error will occur.

1. For that we are going to use **_run-sequence_** . Run this command to install the npm package.

   ```shell
   npm install run-sequence --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_sequence_**.

      ```js
      var sequence = require('run-sequence');
      ```

   * Modify the **_default_** task.

      ```js
      gulp.task('default', function (done) {
        sequence('sass', 'templatecache', 'ng_annotate', 'inject_templates', 'useref', done);
      });
      ```

3. Run

   ```shell
   ionic serve

   or

   gulp default
   ```

### Uglify, minify and obfuscate

1. For this procedure we are going to use these npm packages. Run these commands to install them.

   ```shell
   npm install cordova-uglify --save-dev
   npm install mv --save-dev
   ```

2. Copy the following cordova hooks.

   * In **_after_prepare_** folder copy [these](https://gist.github.com/hexoh/aec9c0e18031360ffd7ad517ad119659) files.
   * If you are using Linux or Mac, give execution permissions to all of them, run

      ```shell
      chmod +x file_name
      ```

3. We are ready to get the obfuscated/minified/compressed apk, run this command and you will see your production ready app.

   ```shell
   ionic build ios [android]
   ```

### Another minify and obfuscate plugin

If your project is a web project and you do not use Cordova to package your project, you can use the `gulp-uglify` plugin to minify and obfuscate.

You can choose one of `gulp-uglify` and `cordova-uglify`.

1. For that we are going to use **_gulp-uglify_** . Run this command to install the npm package.

   ```shell
   npm install gulp-uglify --save-dev
   ```

2. Add the following lines to **_gulpfile.js_**.

   * require **_gulp-uglify_**.

      ```js
      var uglify = require('gulp-uglify');
      ```

   * add `js_uglify` task.

      ```js
      gulp.task('js_uglify', function () {
        console.log('gulp js_uglify start: uglify js file');
        gulp.src('./www/dist/js/*.js') // if you want to uglify a certain javascript file, please use: .src(['./www/dist/js/app.js', './www/dist/js/basic.js', ...])
        .pipe(uglify({
          compress: {
            drop_console: true,  // delete console
            drop_debugger: true  // delete debugger
          }
        }))
        .pipe(gulp.dest('./www/dist/js'));
      });
      ```

   * add `js_uglify` task in **_default task_**.

      ```js
      gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'inject_templates', 'useref', 'js_uglify']);
      ```

3. If your project have `ionic.project` file, also you need to add this to **_ionic.project_**.

      ```js
      "gulpStartupTasks": [
        "sass",
        "templatecache",
        "ng_annotate",
        "inject_templates",
        "useref",
        "js_uglify",
        "watch"
      ]
      ```

4. Run

   ```shell
   ionic serve

   or

   gulp js_uglify
   ```
