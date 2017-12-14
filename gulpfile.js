'use strict'

// Developement framework
var gulp = require('gulp')
var util = require('gulp-util')

// For JS building
var browserify = require('browserify')
var babelify = require('babelify')
var sourcemaps = require('gulp-sourcemaps')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var standard = require('gulp-standard')


gulp.task('build', ['copy:html', 'compile:css', 'compile:js'])
// TODO
// gulp.task('dist', ['build']);

gulp.task('check', ['check:standard'])

// TODO: split app js code and gulp tasks
gulp.task('check:standard', function () {
  return gulp.src(['**/*.js', '!build/**', '!node_modules/**'])
    .pipe(standard())
    .pipe(standard.reporter('default', { breakOnError: true }))
})

gulp.task('watch', function (next) {
  gulp.watch('src/**/*.html', ['copy:html'])
  gulp.watch('src/**/*.js', ['compile:js'])
  gulp.watch('src/**/*.styl', ['compile:css'])
  return next()
})

gulp.task('copy:html', function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build'))
})

var stylus = require('gulp-stylus')
var axis = require('axis')
var concat = require('gulp-concat')

gulp.task('compile:css', function () {
  return gulp.src('src/**/*.styl')
    .pipe(stylus({
      use: [axis()],
      sourcemap: {inline: true, sourceRoot: '.', basePath: 'css'},
      compress: true
    }))
    .pipe(concat('index.css'))
    .pipe(gulp.dest('build/assets/css'))
})

var plumber = require('gulp-plumber')

gulp.task('compile:js', function () {
  var config = {
    entries: ['src/application.js'],
    debug: 'true'
  }

  return browserify(config)
    .transform(babelify.configure({
      presets: ['es2015']
    }))
    .bundle()
    .pipe(source('application.js'))
    .pipe(plumber(function (error) {
      util.log(util.colors.yellow('-------------Error-------------'))
      util.log(error.message)
      util.log(util.colors.yellow('-------------------------------'))

      this.emit('end')
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/assets/js/'))
})
