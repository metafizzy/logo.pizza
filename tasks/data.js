var gulp = require('gulp');
var getTransform = require('./utils/get-transform');
var path = require('path');

var logosDataSrc = 'data/logos/*.yml';

module.exports = function( site ) {

  gulp.task( 'logos-data', function() {
    return gulp.src( dataSrc )
      .pipe( getTransform( function( file, enc, next ) {
        var basename = path.basename( file.path, path.extname( file.path ) );
        site.data[ basename ] = JSON.parse( file.contents.toString() );
        next( null, file );
      }) );
  });

  gulp.task( 'data', [ 'json-data' ] );

  // site.watch( dataSrc, [ 'content' ] );

};
