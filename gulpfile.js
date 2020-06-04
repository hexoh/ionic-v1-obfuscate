var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');

var paths = {
  sass: ['./scss/**/*.scss'],
  templatecache: ['./www/templates/**/*.html'],
  ng_annotate: ['./www/js/*.js'],
  useref: ['./www/*.html'],
  inject_templates: ['./www/index.html']
};

gulp.task('serve:before', ['default', 'watch']);

gulp.task('default', ['sass', 'inject_templates', 'templatecache', 'ng_annotate', 'useref']);

gulp.task('sass', function (done) {
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
  gulp.src('./www/templates/**/*.html')
    .pipe(templateCache({ root: 'templates', standalone: true }))
    .pipe(gulp.dest('./www/js'))
    .on('end', done);
});

gulp.task('ng_annotate', function (done) {
  gulp.src('./www/js/*.js')
    .pipe(ngAnnotate({ single_quotes: true }))
    .pipe(gulp.dest('./www/dist/js/app'))
    .on('end', done);
});

// js uglify
gulp.task('js-uglify', function () {
  gulp.src('./www/dist/js/*.js') // if you want to uglify a certain javascript file, please use: .src(['./www/dist/js/app.js', './www/dist/js/basic.js', ...])
    .pipe(uglify({
      compress: {
        drop_console: true,  // delete console
        drop_debugger: true  // delete debugger
      }
    }))
    .pipe(gulp.dest('./www/dist/js'));
});

gulp.task('useref', function (done) {
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
  gulp.src('./www/index.html')
    .pipe(inject(gulp.src('./www/js/templates.js', { read: false }), { relative: true }))
    .pipe(gulp.dest('./www'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
  gulp.watch(paths.ng_annotate, ['ng_annotate']);
  gulp.watch(paths.useref, ['useref']);
  gulp.watch(paths.inject_templates, ['inject_templates']);
});
