const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const csscomb = require('gulp-csscomb');
const cleanCSS = require('gulp-clean-css');

gulp.task('js', function () {
  return gulp.src('include/js/main.js')
      .pipe(concat('main.min.js'))
      .pipe(babel({ presets: ['babili'] }))
      .pipe(gulp.dest('include/js'));
});

gulp.task('css', function () {
  return gulp.src('include/css/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false,
      }))

      .pipe(csscomb())
      .pipe(concat('main.min.css'))
      .pipe(cleanCSS())
      .pipe(gulp.dest('include/css'));

});

gulp.task('default', gulp.series('js', 'css', function (done) {
  gulp.watch('include/js/main.js', gulp.task('js'));
  gulp.watch('include/css/main.scss', gulp.task('css'));
  done();
}));
