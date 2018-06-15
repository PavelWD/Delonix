'use strict';

var gulp = require('gulp'),
  size = require('gulp-size'), // выводит в лог размер файла
  browserSync = require('browser-sync');

//  html
var htmlhint = require("gulp-htmlhint"); // HTML валидатор


//  css
var sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'), // Автопрефиксер
  uncss = require('gulp-uncss'); // анализирует HTML код и находит все неиспользуемые и продублированные стили.


//  js
var jshint = require('gulp-jshint'), // проверяе js
  fixmyjs = require("gulp-fixmyjs"), // исправляет js код после jshint
  uglify = require('gulp-uglify'); // сжимает js


gulp.task("endHTML", function () {
  return gulp.src('app/**/*.html')
    .pipe(htmlhint('.htmlhintrc'))
});

gulp.task("scss", function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('app/style'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task("endJS", function () {
  return gulp.src('app/js/**/*.js')
    .pipe(jshint())
    .pipe(fixmyjs())
    .pipe(uglify())
});

gulp.task("checkScss", function () {
  return gulp.src('app/style/**/*.css')
    .pipe(uncss({
      html: ['app/**/*.html']
    }))
    .pipe(size())
    .pipe(gulp.dest('dest/'))
});

gulp.task("browserSync", function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task("start", ['browserSync'], function () {
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});
