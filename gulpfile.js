var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var includer = require('gulp-htmlincluder');
var minifyHTML = require('gulp-minify-html');

var paths = {
    html: ['./src/**/*.html'],
    css: ['./src/**/*.css'],
    img: [
        './src/**/*.jpeg',
        './src/**/*.jpg',
        './src/**/*.png',
        './src/**/*.gif',
    ],
    js: ['./src/**/*.js'],
    dest: './'
};

gulp.task('html', function() {
    gulp.src(paths.html)
        .pipe(includer())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('css', function() {
    gulp.src(paths.css)
        .pipe(cleanCss())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

gulp.task('img', function() {
    gulp.src(paths.img)
        .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
    gulp.watch(paths.img, ['img']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html, ['html']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['img', 'css', 'js', 'html']);

// The dev task
gulp.task('dev', ['watch']);