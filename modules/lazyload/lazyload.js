( function( window ) {
'use strict';

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var lazyLoaders = [];

var winHeight;

// -------------------------- LazyLoader -------------------------- //

function LazyLoader( element ) {
  this.element = element;
  this.isLazy = true;
  this.isImg = this.element.nodeName == 'IMG';
  // default sizes
  this.width = 100;
  this.height = 100;
  if ( this.isImg ) {
    this.setPlaceholder();
  }
}

LazyLoader.prototype.setPlaceholder = function() {
  this.updateSize();
  canvas.width = this.width;
  canvas.height = this.height;
  ctx.fillStyle = '#EEE';
  ctx.fillRect( 0, 0, this.width, this.height );
  this.element.src = canvas.toDataURL();
};

LazyLoader.prototype.updateSize = function() {
  var attr = this.element.getAttribute('data-lazy');
  if ( !attr ) {
    return;
  }
  var attrParts = attr.split('x');
  this.width = parseInt( attrParts[0], 10 );
  this.height = parseInt( attrParts[1], 10 );
};

LazyLoader.prototype.updatePosition = function() {
  var rect = this.element.getBoundingClientRect();
  this.top = rect.top + window.scrollY;
  this.bottom = this.top + this.element.offsetHeight;
};

LazyLoader.prototype.check = function() {
  var scrollY = window.scrollY;
  var activeTop = scrollY - winHeight * 1.5;
  var activeBottom = scrollY + winHeight * 3;
  var isInOverlap = this.top < activeBottom && this.bottom > activeTop;
  if ( isInOverlap ) {
    this.load();
  }
};

LazyLoader.prototype.load = function() {
  if ( !this.isLazy ) {
    return;
  }
  var src = this.element.getAttribute('data-src');
  // console.log( 'loading', src );
  this.element.src = src;
  this.isLazy = false;
};

// --------------------------  -------------------------- //

function checkLazies() {
  // stop listening if no more to load
  if ( !lazyLoaders.length ) {
    window.removeEventListener( 'scroll', onThrottledScroll );
    window.removeEventListener( 'resize', onDebounceResize );
    return;
  }

  // check lazy loaders
  lazyLoaders.forEach( function( lazyLoader ) {
    lazyLoader.check();
  });
  // filter out loaded
  lazyLoaders = lazyLoaders.filter( function( lazyLoader ) {
    return lazyLoader.isLazy;
  });
}

function updatePositions() {
  lazyLoaders.forEach( function( lazyLoader ) {
    lazyLoader.updatePosition();
  });
}

function onResize() {
  winHeight = window.innerHeight;
  updatePositions();
  checkLazies();
}

var onThrottledScroll = throttle( checkLazies, 200 );
var onDebounceResize = debounce( onResize );

// -------------------------- init -------------------------- //

winHeight = window.innerHeight;

var lazyLoadImgs = document.querySelectorAll('img[data-lazy], iframe[data-lazy]');
var lazyLoader;
for ( var i=0; i < lazyLoadImgs.length; i++ ) {
  var img = lazyLoadImgs[i];
  lazyLoader = new LazyLoader( img );
  lazyLoaders.push( lazyLoader );
}

// init
// do async for other stuff to be setup
setTimeout( function() {
  onResize();
  window.addEventListener( 'scroll', onThrottledScroll );
  window.addEventListener( 'resize', onDebounceResize );
});

// -------------------------- debounce & throttle -------------------------- //

function debounce( fn, threshold ) {
  var timeout;
  return function debounced() {
    clearTimeout( timeout );

    var _this = this;
    var args = arguments;
    function delayed() {
      fn.apply( _this, args );
    }

    timeout = setTimeout( delayed, 100 || threshold );
  };
}

function throttle( fn, delay ) {
  var wait = false;
  return function () {
    if ( wait ) {
      return;
    }
    fn();
    wait = true;
    setTimeout( function (){
      wait = false;
      fn();
    }, delay || 100 );
  };
}

})( window );

