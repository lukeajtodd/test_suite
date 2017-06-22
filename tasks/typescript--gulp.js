// npm install --save-dev gulp-typescript typescript
// Requires above and gulp-load-plugins, gulp-sourcemaps, merge2

module.exports = function (gulp, plugins, merge) {
    return function () {
        var result = gulp.src('scripts/**/*.{ts,js}')
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.typescript({
                experimentalDecorators: true,
                target: 'ES3',
                allowJs: true
            }));

        return merge([
            // result.dts.pipe(gulp.dest('scripts/tsDefinitions/')),
            result.js
                .pipe(plugins.sourcemaps.write('sourcemaps/'))
                .pipe(gulp.dest('public/javascript/'))
        ]);
    };
};