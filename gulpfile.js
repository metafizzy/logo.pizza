/*jshint node: true, unused: true, undef: true */

var gulp = require('gulp');

// ----- site ----- //

// stuff used across tasks
var site = {
  // templating data
  data: {
    isDev: process.argv[2] == 'dev',
    isExport: process.argv[2] == 'export',
    logos: {},
  },
  // src to watch, tasks to trigger
  watches: [],
  watch: function( src, tasks ) {
    site.watches.push( [ src, tasks ] );
  }
};

// ----- tasks ----- //

// require('./tasks/assets')( site );
// require('./tasks/dist')( site );
// require('./tasks/hint')( site );
// require('./tasks/js')( site );
// require('./tasks/css')( site );
// require('./tasks/data')( site );
// require('./tasks/partials')( site );
// require('./tasks/content')( site );

// var yaml = require('js-yaml');
var getTransform = require('./tasks/utils/get-transform');
var hbs = require('handlebars');

// gulp.task( 'logos-data', function() {
//   return gulp.src( 'data/logos/*.yml' )
//     .pipe( getTransform( function( file, enc, next ) {
//       var logoData = yaml.safeLoad( file.contents.toString() );
//       site.data.logos[ logoData.slug ] = logoData;
//       next( null, file );
//     }) );
// });

var gulpYaml = require('gulp-yaml');
var rename = require('gulp-rename');
var path = require('path');

var templates = {};

gulp.task( 'templates', function() {
  return gulp.src('templates/*.mustache')
    .pipe( getTransform( function( file, enc, next ) {
      var contents = file.contents.toString();
      var template = hbs.compile( contents );
      var basename = path.basename( file.path, path.extname( file.path ) );
      templates[ basename ] = template;
      next( null, file );
    }));
});

gulp.task( 'logo-pages', [ 'templates' ], function() {
  return gulp.src( 'data/logos/*.yml' )
    .pipe( gulpYaml() )
    .pipe( getTransform( function( file, enc, next ) {
      var data = JSON.parse( file.contents.toString() );
      file.contents = new Buffer( templates['logo-page']( data ) );
      next( null, file );
    }) )
    .pipe( rename({ extname: '.html' }) )
    .pipe( gulp.dest('build') );
});


// ----- default ----- //

// gulp.task( 'default', [
//   'hint',
//   'content',
//   'js',
//   'css',
//   'dist',
//   'prod-assets'
// ] );

// ----- export ----- //

// version of site used in packery-docs.zip

// gulp.task( 'export', [ 'default' ] );

// ----- watch ----- //

// gulp.task( 'dev', [
//   'hint',
//   'dist',
//   'prod-assets',
//   'content'
// ], function() {
//   site.watches.forEach( function( watchable ) {
//     gulp.watch.apply( gulp, watchable );
//   });
// });
