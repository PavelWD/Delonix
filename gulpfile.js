'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass');

gulp.task("scss", function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/style'))
});
