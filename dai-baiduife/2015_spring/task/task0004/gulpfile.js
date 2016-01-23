//sass,js默认在source文件夹下
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require("gulp-sourcemaps"),
    buffer = require('vinyl-buffer'),
    babelify = require('babelify');

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
//js代码模块化,babel转化
gulp.task('babel', function () {
    browserify({
        entries: ['item-pc/src/script.js'],
        debug: true
    })
        .transform("babelify", {presets: ["es2015"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./item-pc/result'))
});
//监控代码模块化，es6
gulp.task('watchjs', function () {
    gulp.watch('item-pc/src/*.js',['babel']);
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