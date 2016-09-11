var gulp = require('gulp');

gulp.task( 'fonts', function() {
  return gulp.src( 'fonts/*.*', { base: '.' } )
    .pipe( gulp.dest('build') );
});

gulp.task( 'assets', function() {
  return gulp.src('assets/**/*.*')
    .pipe( gulp.dest('build') );
});

gulp.task( 'img', function() {
  return gulp.src('img/**/*.*')
    .pipe( gulp.dest('build/img') );
});

// copy prod assets
gulp.task( 'prod-assets', [ 'fonts', 'assets', 'img' ] );

module.exports = function() {};
