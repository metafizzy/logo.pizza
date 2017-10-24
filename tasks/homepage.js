var gulp = require('gulp');
var hbs = require('handlebars');
var transfob = require('transfob');
var gulpYaml = require('gulp-yaml');
var rename = require('gulp-rename');
var extend = require('./utils/extend');
var thumbOrder = require('./thumbnail-order');

var data = {};

var logoDataSrc = 'data/*/*.yml';

gulp.task( 'homepage-logos-data', function() {
  data.thumbnails = {};
  return gulp.src( logoDataSrc )
    .pipe( gulpYaml() )
    .pipe( transfob( function( file, enc, next ) {
      // get volume from preceding directory
      var pathParts = file.path.split('/');
      var volume = pathParts[ pathParts.length - 2 ];
      // create volume array
      if ( !data.thumbnails[ volume ] ) {
        data.thumbnails[ volume ] = [];
      }
      // add logo data to volume
      var logoData = JSON.parse( file.contents.toString() );
      data.thumbnails[ volume ].push( logoData );
      next( null, file );
    }) );
});

module.exports = function( site ) {

  gulp.task( 'homepage', [ 'partials', 'homepage-logos-data' ], function() {

    data.thumbnails.vol2.sort( function( thumbA, thumbB ) {
      var indexA = getThumbIndex( thumbA );
      var indexB = getThumbIndex( thumbB );
      return indexA - indexB;
    });

    for ( var partialName in site.partials ) {
      var partialTemplate = site.partials[ partialName ];
      hbs.registerPartial( partialName, partialTemplate );
    }

    return gulp.src( 'templates/homepage.mustache' )
      .pipe( transfob( function( file, enc, next ) {
        var template = hbs.compile( file.contents.toString() );
        extend( data, site.data );
        file.contents = new Buffer( template( data ) );
        next( null, file );
      }) )
      .pipe( rename('index.html') )
      .pipe( gulp.dest('build') );
  });

  site.watch( logoDataSrc, [ 'homepage' ] );

};


function getThumbIndex( thumbnail ) {
  var index = thumbOrder.indexOf( thumbnail.slug );
  index = index == -1 ? Infinity : index;
  return index;
}
