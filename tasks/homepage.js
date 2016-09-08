var gulp = require('gulp');
var hbs = require('handlebars');
var getTransform = require('./utils/get-transform');
var gulpYaml = require('gulp-yaml');
var rename = require('gulp-rename');
var extend = require('./utils/extend');
var thumbOrder = require('./thumbnail-order');

var data = {};

gulp.task( 'homepage-logos-data', function() {
  data.thumbnails = [];
  return gulp.src( 'data/logos/*.yml' )
    .pipe( gulpYaml() )
    .pipe( getTransform( function( file, enc, next ) {
      var logoData = JSON.parse( file.contents.toString() );
      data.thumbnails.push( logoData );
      next( null, file );
    }) );
});

module.exports = function( site ) {

  gulp.task( 'homepage', [ 'partials', 'homepage-logos-data' ], function() {

    data.thumbnails.sort( function( thumbA, thumbB ) {
      var indexA = getThumbIndex( thumbA );
      var indexB = getThumbIndex( thumbB );
      return indexA - indexB;
    });

    for ( var partialName in site.partials ) {
      var partialTemplate = site.partials[ partialName ];
      hbs.registerPartial( partialName, partialTemplate );
    }

    return gulp.src( 'templates/homepage.mustache' )
      .pipe( getTransform( function( file, enc, next ) {
        var template = hbs.compile( file.contents.toString() );
        extend( data, site.data );
        file.contents = new Buffer( template( data ) );
        next( null, file );
      }) )
      .pipe( rename('index.html') )
      .pipe( gulp.dest('build') );
  });

};


function getThumbIndex( thumbnail ) {
  var index = thumbOrder.indexOf( thumbnail.slug );
  index = index == -1 ? Infinity : index;
  return index;
}
