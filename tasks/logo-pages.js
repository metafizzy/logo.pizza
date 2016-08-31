var gulp = require('gulp');
var hbs = require('handlebars');
var getTransform = require('./utils/get-transform');
var gulpYaml = require('gulp-yaml');
var rename = require('gulp-rename');

var template;

gulp.task( 'logo-page-template', function() {
  return gulp.src('templates/logo-page.mustache')
    .pipe( getTransform( function( file, enc, next ) {
      template = hbs.compile( file.contents.toString() );
      next( null, file );
    }));
});

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

module.exports = function( site ) {

  gulp.task( 'logo-pages', [ 'partials', 'logo-page-template' ], function() {

    for ( var partialName in site.partials ) {
      var partialTemplate = site.partials[ partialName ];
      hbs.registerPartial( partialName, partialTemplate );
    }

    return gulp.src( 'data/logos/*.yml' )
      .pipe( gulpYaml() )
      .pipe( getTransform( function( file, enc, next ) {
        var data = JSON.parse( file.contents.toString() );
        extend( data, site.data );
        file.contents = new Buffer( template( data ) );
        next( null, file );
      }) )
      .pipe( rename({ extname: '.html' }) )
      .pipe( gulp.dest('build') );
  });

};
