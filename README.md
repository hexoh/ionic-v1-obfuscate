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
* (**cordova hook**) And finally **`uglify, minify and obfuscate your code`**.

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
