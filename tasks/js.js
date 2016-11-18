var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var getGlobPaths = require('./utils/get-glob-paths');

var jsSrc = [
  // dependencies
  'bower_components/ev-emitter/ev-emitter.js',
  'bower_components/unipointer/unipointer.js',
  // isotope dependencies
  'bower_components/get-size/get-size.js',
  'bower_components/desandro-matches-selector/matches-selector.js',
  'bower_components/fizzy-ui-utils/utils.js',
  'bower_components/outlayer/item.js',
  'bower_components/outlayer/outlayer.js',
  // isotope
  'bower_components/isotope/js/layout-mode.js',
  'bower_components/isotope/js/item.js',
  'bower_components/isotope/js/isotope.js',
  'bower_components/isotope/js/layout-modes/fit-rows.js',
  // huebee
  'bower_components/huebee/huebee.js',
  // docs
  'js/boilerplate.js',
  // modules
  'modules/**/*.js',
  // init
  'js/init.js',
];

// concat & minify js
gulp.task( 'site-js', function() {
  gulp.src( jsSrc )
    .pipe( uglify() )
    .pipe( concat('logo-pizza.min.js') )
    .pipe( gulp.dest('build/js') );
});

gulp.task( 'js', [ 'site-js' ] );

module.exports = function( site ) {
  site.data.jsPaths = getGlobPaths( jsSrc );
};
