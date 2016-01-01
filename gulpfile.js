var gulp = require('gulp');
var browserify = require('browserify');
var babel = require('gulp-babel');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('script', function() {
  browserify('src/index.js')
    .transform(babelify.configure({
      optional: ['es7.decorators', 'es7.classProperties']
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/'))
});

gulp.task('watch', function() {
  gulp.watch('.env.js', ['script']);
  gulp.watch('src/scripts/**/*.*', ['script']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('build', ['sass', 'script']);
gulp.task('default', ['build']);
