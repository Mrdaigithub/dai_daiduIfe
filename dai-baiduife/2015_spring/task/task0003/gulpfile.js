//sass,js默认在source文件夹下
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var babel = require('gulp-babel');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
//最后执行
gulp.task('default', ['mincss','minjs'], function () {
})
gulp.task('mincss', function () {
    gulp.src('result/*.css')
        .pipe(uglifycss({
            "max-line-len": 80
        }))
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('result/min/'));
});
//压缩合并js代码
gulp.task('minjs', function() {
    return gulp.src('result/*.js')
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('result/min/'));
});
//sass转css
gulp.task('sass', function () {
    return sass('source/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('result'))
        .pipe(reload({stream: true}));
});
//ecma6转ecma5.1
gulp.task('babel', function () {
    return gulp.src('source/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('result'));
});
//监控es6
gulp.task('watchjs', function () {
    gulp.watch('source/*.js', ['babel']);
});
// 静态服务器
gulp.task('watchSass',  ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("source/*.scss", ['sass']);
    gulp.watch("*.html").on('change', reload);
});