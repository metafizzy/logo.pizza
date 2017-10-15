var gulp = require('gulp');

gulp.task( 'fonts', function() {
  return gulp.src( 'fonts/*.*', { base: '.' } )
    .pipe( gulp.dest('build') );
});

var assetsSrc = 'assets/**/*.*';
gulp.task( 'assets', function() {
  return gulp.src( assetsSrc )
    .pipe( gulp.dest('build') );
});

var imgSrc = 'img/**/*.*';
gulp.task( 'img', function() {
  return gulp.src( imgSrc )
    .pipe( gulp.dest('build/img') );
});

// copy prod assets
gulp.task( 'prod-assets', [ 'fonts', 'assets', 'img' ] );

module.exports = function( site ) {
  site.watch( assetsSrc, [ 'assets' ] );
  site.watch( imgSrc, [ 'img' ] );
};
