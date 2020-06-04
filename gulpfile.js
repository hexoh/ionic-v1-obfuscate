var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var sequence = require('run-sequence');

var paths = {
  sass: ['./scss/**/*.scss'],
  templatecache: ['./www/templates/**/*.html'],
  ng_annotate: ['./www/js/*.js'],
  useref: ['./www/*.html'],
  inject_templates: ['./www/index.html']
};

gulp.task('sass', function (done) {
  console.log('gulp sass start');
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('templatecache', function (done) {
  console.log('gulp templatecache start: convert html to js');
  gulp.src('./www/templates/**/*.html')
    .pipe(templateCache({ root: 'templates', standalone: true }))
    .pipe(gulp.dest('./www/js'))
    .on('end', done);
});

gulp.task('ng_annotate', function (done) {
  console.log('gulp ng_annotate start: add dependency injection annotations');
  gulp.src('./www/js/*.js')
    .pipe(ngAnnotate({ single_quotes: true }))
    .pipe(gulp.dest('./www/dist/js/app'))
    .on('end', done);
});

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

// add templates.js to index.html
gulp.task('inject_templates', function (done) {
  console.log('gulp inject_templates start: auto add file in index.html');
  gulp.src('./www/index.html')
    .pipe(inject(gulp.src('./www/dist/js/app/app.js', { read: false }), { relative: true, starttag: '<!-- inject:app:{{ext}} -->' }))
    .pipe(inject(gulp.src(['./www/dist/js/app/controllers.js', './www/dist/js/app/services.js', './www/dist/js/app/templates.js'], { read: false }), { relative: true }))
    .pipe(gulp.dest('./www'))
    .on('end', done);
});

// js uglify
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

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.ng_annotate, ['ng_annotate']);
  gulp.watch(paths.useref, ['useref']);
});

gulp.task('default', function (done) {
  sequence('sass', 'templatecache', 'ng_annotate', 'inject_templates', 'useref', done);
});

gulp.task('ionic:serve:before', ['default']);
