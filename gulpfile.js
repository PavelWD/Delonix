'use strict';

var gulp = require('gulp'),
  size = require('gulp-size'), // выводит в лог размер файла
  browserSync = require('browser-sync');

//  html
var htmlhint = require("gulp-htmlhint"); // HTML валидатор


//  css
var sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'), // Автопрефиксер
  uncss = require('gulp-uncss'), // анализирует HTML код и находит все неиспользуемые и продублированные стили.
  csso = require('gulp-csso'); // отличный CSS минификатор


//  js
var jshint = require('gulp-jshint'), // проверяе js
  fixmyjs = require("gulp-fixmyjs"), // исправляет js код после jshint
  uglify = require('gulp-uglify'); // сжимает js

var src = {
    html: "app/**/*.html",
    scss: "app/scss/**/*.scss",
    js: "app/js/**/*.js",
    fonts: "app/fonts",
    images: "app/images"
  },
  workingSrc = {
    html: "app/",
    css: "app/style",
    js: "app/js"
  },
  endSrc = {
    html: "dist/",
    css: "dist/style",
    js: "dist/js",
    fonts: "dist/fonts",
    images: "dist/images"
  };

//   проверка html
gulp.task("checkHTML", function () {
  return gulp.src(src.html)
    .pipe(htmlhint())
});
//  загрузка html в готовый проект
gulp.task("endHTML", ["checkHTML"], function () {
  return gulp.src(src.html)
    .pipe(size())
    .pipe(gulp.dest(endSrc.html))
});

//  компиляция scss в css
gulp.task("scss", function () {
  return gulp.src(src.scss)
    .pipe(sass())
    .pipe(gulp.dest(endSrc.css))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(workingSrc.css))
});
//  слежение за изменениями и вывод в браузер
gulp.task("workingOutSCSS", ["scss"], function () {
  return gulp.src(workingSrc.css + "/**/*.css")
    .pipe(browserSync.reload({
      stream: true
    }))
});
//  загрузка css в готовый проект
gulp.task("endCSS", ["scss"], function () {
  return gulp.src(workingSrc.css + "/**/*.css")
    .pipe(csso({
      restructure: true,
      sourceMap: true,
      debug: true
    }))
    .pipe(gulp.dest(endSrc.css))
});

//  проверка js
gulp.task("jshint", function () {
  return gulp.src(src.js)
    .pipe(jshint())
});
//  слежение за изменениями
gulp.task("workingOutJS", function () {
  gulp.watch(src.js, ["jshint"])
});
//  загрузка js в готовый проект
gulp.task("endJS", ["jshint"], function () {
  return gulp.src(src.js)
    .pipe(fixmyjs())
    .pipe(uglify())
    .pipe(gulp.dest(endSrc.js))
})

// работа browserSync
gulp.task("browserSync", function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

//  запуск работы
gulp.task("start", ['browserSync'], function () {
  gulp.watch(src.scss, ['workingOutSCSS']);
  gulp.watch(src.html, browserSync.reload);
  gulp.watch(src.js, browserSync.reload);
});

// конечный вариант проекта
gulp.task("endProject", ['endHTML', 'endCSS', 'endJS']);
