// npm install --save-dev gulp-sass
// Requires above and gulp-load-plugins

module.exports = function (gulp, plugins) {
    return function () {
        gulp.src('src/sass/**/*.scss')
            .pipe(plugins.sass().on('error', plugins.sass.logError))
            .pipe(gulp.dest('Resources/public/css/'));
    }
}