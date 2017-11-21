var gulp = require('gulp');
var hbs = require('handlebars');
var transfob = require('transfob');
var rename = require('gulp-rename');

var licenseSrc = 'templates/license.mustache';

module.exports = function( site ) {

  gulp.task( 'license', [ 'partials' ], function() {

    for ( var partialName in site.partials ) {
      var partialTemplate = site.partials[ partialName ];
      hbs.registerPartial( partialName, partialTemplate );
    }

    return gulp.src( licenseSrc )
      .pipe( transfob( function( file, enc, next ) {
        var template = hbs.compile( file.contents.toString() );
        file.contents = new Buffer( template( site.data ) );
        next( null, file );
      }) )
      .pipe( rename('license.html') )
      .pipe( gulp.dest('build') );
  });

  site.watch( licenseSrc, [ 'license' ] );

};
