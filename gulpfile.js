/*
 * GENERATED BY http://quenchjs.com/
*/

var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');

var paths = {
  sass: {
    src: [
      './src/web/css/*.scss'
    ],
    dist: './src/web/css/'
  }
}

gulp.task('styles', function(done){
  gulp.src(paths.sass.src)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.sass.dist))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass.src, ['styles']);
});

gulp.task('default', ['styles']);
gulp.run('watch');
