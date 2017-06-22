var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var merge = require('merge2');

gulp.task('transpile', require('./tasks/typescript--gulp')(gulp, plugins, merge));

gulp.task('default', function() {
    gulp.watch(['scripts/**/*.{ts,js}'], ['transpile']);
});