/*jshint devel: true */

( function() {

var defaultColors = [];
// hash of colors
var colorGroups = {};
// colorGroups = {
//   '#19F': [
//     {
//       element: <path>,
//       attr: 'fill'
//     }, ...
//   ]
// }

// init
LogoPizza.modules['custom-colors-svg'] = function( elem ) {
  var assetDisplay = document.querySelector('.asset-display--main');
  var bigImg = assetDisplay.querySelector('.asset-display__img--big');
  var smallImg = assetDisplay.querySelector('.asset-display__img--small');

  updateColorGroups( bigImg );
  updateColorGroups( smallImg );
  // init default colors
  for ( var color in colorGroups ) {
    defaultColors.push( color );
  }
  createCustomColors( elem );

  // ----- light & dark buttons ----- //

  var lightBGButton = elem.querySelector('.custom-bg-button--light');
  var darkBGButton = elem.querySelector('.custom-bg-button--dark');

  lightBGButton.onclick = function() {
    assetDisplay.classList.remove('is-dark');
    elem.classList.remove('is-dark');
  };
  darkBGButton.onclick = function() {
    assetDisplay.classList.add('is-dark');
    elem.classList.add('is-dark');
  };

  // initColors( elem );
};

function updateColorGroups( img ) {
  var colorElements = img.querySelectorAll('[fill],[stroke]');
  for ( var i=0; i < colorElements.length; i++ ) {
    var colorElem = colorElements[i];
    addColorElement( colorElem, 'fill' );
    addColorElement( colorElem, 'stroke' );
  }
}

function addColorElement( colorElem, attr ) {
  var color = colorElem.getAttribute( attr );
  if ( !color || color == 'none' ) {
    return;
  }
  color = color.toUpperCase();
  var group = colorGroups[ color ];
  // create array if not already there
  if ( !group ) {
    group = colorGroups[ color ] = [];
  }
  var target = {
    element: colorElem,
    attr: attr,
  };
  group.push( target );
}

function createCustomColors( elem ) {
  var proxyCustomColor = elem.querySelector('.custom-color');
  // don't need these attrs, used for canvas
  proxyCustomColor.removeAttribute('data-layer-src');
  proxyCustomColor.removeAttribute('data-title');
  var i = 1;
  for ( var color in colorGroups ) {
    createCustomColor( color, i, proxyCustomColor );
    i++;
  }

  proxyCustomColor.parentNode.removeChild( proxyCustomColor );
}

function createCustomColor( color, i, proxy ) {
  // create custom color element
  var customColor = proxy.cloneNode( true );
  customColor.setAttribute( 'data-default-color', color );
  customColor.setAttribute( 'data-title', 'Color ' + i );
  var preview = customColor.querySelector('.custom-color__preview');
  var title = customColor.querySelector('.custom-color__title');
  // set initial settings
  updateCustomColor( color );
  proxy.parentNode.appendChild( customColor );

  function updateCustomColor( selectedColor ) {
    preview.style.backgroundColor = selectedColor;
    title.textContent = 'Color ' + i + ': ' + selectedColor;
  }

  // Huebee
  var hueb = new Huebee( customColor, {
    setText: false,
    setBGColor: false,
    offset: [ 25, -5 ],
    customColors: defaultColors,
  });

  var colorGroup = colorGroups[ color ];

  hueb.on( 'change', function( selectedColor ) {
    colorGroup.forEach( function( target ) {
      target.element.setAttribute( target.attr, selectedColor );
    });
    updateCustomColor( selectedColor );
  });
}

})();
