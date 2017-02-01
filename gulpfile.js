var gulp = require('gulp');

// ----- site ----- //

// stuff used across tasks
var site = {
  // templating data
  data: {
    currentPrice: 780,
    isDev: process.argv[2] == 'dev',
  },
  templates: {},
  // src to watch, tasks to trigger
  watches: [],
  watch: function( src, tasks ) {
    site.watches.push( [ src, tasks ] );
  }
};

// ----- tasks ----- //

require('./tasks/assets')( site );
require('./tasks/hint')( site );
require('./tasks/js')( site );
require('./tasks/css')( site );
require('./tasks/partials')( site );
require('./tasks/logo-pages')( site );
require('./tasks/homepage')( site );

// ----- default ----- //

gulp.task( 'default', [
  'hint',
  'homepage',
  'logo-pages',
  'js',
  'css',
  'prod-assets'
] );


// ----- watch ----- //

gulp.task( 'dev', [ 'default' ] );

// gulp.task( 'dev', [
//   'hint',
//   'prod-assets',
//   'content'
// ], function() {
//   site.watches.forEach( function( watchable ) {
//     gulp.watch.apply( gulp, watchable );
//   });
// });
