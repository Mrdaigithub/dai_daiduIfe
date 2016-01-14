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
});

gulp.task('mincss', function () {
    gulp.src('item-pc/result/*.css')
        .pipe(uglifycss({
            "max-line-len": 80
        }))
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('item-pc/result/min/'));
});
//压缩合并js代码
gulp.task('minjs', function() {
    return gulp.src('item-pc/result/*.js')
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('item-pc/result/min/'));
});
//sass转css
gulp.task('sass', function () {
    return sass('item-pc/src/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('item-pc/result'))
        .pipe(reload({stream: true}));
});
//es6转es5.1
gulp.task('babel', function () {
    return gulp.src('item-pc/src/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('item-pc/result'));
});
//监控es6
gulp.task('watchjs', function () {
    gulp.watch('item-pc/src/*.js', ['babel']);
});
// 静态服务器
gulp.task('watchSass',  ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "./item-pc"
        }
    });
    gulp.watch("item-pc/src/*.scss", ['sass']);
    gulp.watch("item-pc/index.html").on('change', reload);
    gulp.watch("item-pc/result/*.*").on('change', reload);
});