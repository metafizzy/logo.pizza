var gulp = require('gulp');
var hbs = require('handlebars');
var transfob = require('transfob');
var gulpYaml = require('gulp-yaml');
var rename = require('gulp-rename');
var extend = require('./utils/extend');

var template;

// Handlebars helpers
hbs.registerHelper( 'commaListVariants', function( variants ) {
  if ( variants ) {
    var list = variants.map( function( variant ) {
      return variant.title;
    });
    return list.join(', ');
  } else {
    return variants;
  }
});

hbs.registerHelper( 'ifOr', function( a, b, options ) {
  if ( a || b ) {
    return options.fn( this );
  } else {
    return options.inverse( this );  
  }
});

var logoPageTemplateSrc = 'templates/logo-page.mustache';

gulp.task( 'logo-page-template', function() {
  return gulp.src( logoPageTemplateSrc )
    .pipe( transfob( function( file, enc, next ) {
      template = hbs.compile( file.contents.toString() );
      next( null, file );
    }));
});



// hash of logos
var logos;
// collection of tags,
// tags = {
//   circles: ['adventure', 'dog-profile', 'mr-grin' ],
//   animals: [ ']
// }
var tags;

var logoDataSrc = 'data/*/*.yml';

gulp.task( 'logo-pages-logos-data', function() {
  logos = {};
  tags = {};
  return gulp.src( 'data/vol2/*.yml' )
    .pipe( gulpYaml() )
    .pipe( transfob( function( file, enc, next ) {
      var logoData = JSON.parse( file.contents.toString() );
      // add logo data to logos hash
      logos[ logoData.slug ] = logoData;
      logoData.tags.forEach( function( tag ) {
        // create tag hash
        if ( !tags[ tag ] ) {
          tags[ tag ] = [];
        }
        tags[ tag ].push( logoData.slug );
      });
      next( null, file );
    }) );
});

module.exports = function( site ) {


  gulp.task( 'logo-pages', [ 'partials', 'logo-page-template', 'logo-pages-logos-data' ], function() {

    for ( var partialName in site.partials ) {
      var partialTemplate = site.partials[ partialName ];
      hbs.registerPartial( partialName, partialTemplate );
    }

    return gulp.src( logoDataSrc )
      .pipe( gulpYaml() )
      .pipe( transfob( function( file, enc, next ) {
        var data = JSON.parse( file.contents.toString() );
        data.otherLogos = getOtherLogos( data );
        extend( data, site.data );
        file.contents = new Buffer( template( data ) );
        next( null, file );
      }) )
      .pipe( rename({ extname: '.html', dirname: '' }) )
      .pipe( gulp.dest('build') );
  });

  site.watch( logoDataSrc, [ 'logo-pages' ] );
  site.watch( logoPageTemplateSrc, [ 'logo-pages' ] );

};

function getOtherLogos( pageLogo ) {
  var slugs = tags[ pageLogo.otherTag ];
  if ( !slugs ) {
    return;
  }
  // filter out page logo from others
  slugs = slugs.filter( function( slug ) {
    return slug != pageLogo.slug;
  });
  var otherLogos = slugs.map( function( slug ) {
    return logos[ slug ];
  });
  return otherLogos;
}
