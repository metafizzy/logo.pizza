var gulp = require('gulp');

// ----- site ----- //

// src to watch, tasks to trigger
var watches = [];

// stuff used across tasks
var site = {
  // templating data
  data: {
    currentPrice: 230,
    isDev: process.argv[2] == 'dev',
  },
  templates: {},
  watch: function( src, tasks ) {
    watches.push( [ src, tasks ] );
  },
};

// ----- tasks ----- //

require('./tasks/assets')( site );
require('./tasks/hint')( site );
require('./tasks/js')( site );
require('./tasks/css')( site );
require('./tasks/partials')( site );
require('./tasks/logo-pages')( site );
require('./tasks/homepage')( site );
require('./tasks/license')( site );

// ----- content ----- //

gulp.task( 'content', [
  'homepage',
  'logo-pages',
  'license',
]);

// ----- default ----- //

gulp.task( 'default', [
  'hint',
  'prod-assets',
  'js',
  'css',
  'content',
] );


// ----- watch ----- //

gulp.task( 'dev', [
  'hint',
  'prod-assets',
  'content',
], function() {
  watches.forEach( function( watchable ) {
    gulp.watch.apply( gulp, watchable );
  });
});
