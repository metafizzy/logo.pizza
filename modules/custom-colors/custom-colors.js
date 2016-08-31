/*jshint devel: true */

( function() {

// data for layers
var layers = {};
// elements
var assetDisplay, colorElems;

// init
LogoPizza.modules['custom-colors'] = function( elem ) {
  assetDisplay = document.querySelector('.asset-display--main');

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

  initColors( elem );
};

function initColors( elem ) {
  colorElems = elem.querySelectorAll('.custom-color');
  for ( var i=0; i < colorElems.length; i++ ) {
    initColorElem( colorElems[i] );
  }
}

var layerCount = 0;

function initColorElem( colorElem ) {
  layerCount++;
  var title = colorElem.getAttribute('data-title');
  // build data
  var defaultColor = colorElem.getAttribute('data-default-color');
  layers[ title ] = {
    imgSrc: colorElem.getAttribute('data-layer-src'),
    defaultColor: defaultColor,
    color: defaultColor,
    preview: colorElem.querySelector('.custom-color__preview'),
  };
  var hueb = new Huebee( colorElem, {
    setText: false,
    offset: [ 20, -10 ],
  });
  hueb.on( 'change', function( color ) {
    var layer = layers[ title ];
    layer.color = color;
    layer.preview.style.backgroundColor = color;
    renderLayer( layer );
    renderComposite();
  });
  // load layer images on first click
  colorElem.addEventListener( 'click', loadLayerImages );
}

// ----- load layers ----- //

var areLayerImagesLoaded = false;
var compositeCanvas, compositeCtx;

function loadLayerImages() {
  if ( areLayerImagesLoaded ) {
    return;
  }
  compositeCanvas = document.querySelector('canvas');
  compositeCtx = compositeCanvas.getContext('2d');

  for ( var layerTitle in layers ) {
    loadLayer( layers[ layerTitle ] );
  }
}

var loadedImgCount = 0;

function loadLayer( layer ) {
  var img = layer.img = new Image();
  img.onload = function() {
    onImgLoad( layer );
  }
  img.onerror = function() {
    onImgError( layer );
  }
  img.src = layer.imgSrc;
}

function onImgLoad( layer ) {
  var canvas = layer.canvas = document.createElement('canvas');
  var ctx = layer.ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'source-in';
  layer.width = canvas.width = layer.img.width;
  layer.height = canvas.height = layer.img.height;
  renderLayer( layer );

  loadedImgCount++;
  if ( loadedImgCount == layerCount ) {
    compositeCanvas.width = layer.width;
    compositeCanvas.height = layer.height;
    renderComposite();
  }
}

function onImgError( layer ) {
  console.error( 'Could not load layer: ', layer.imgSrc, layer.img.src );
  debugger
}


// ----- render ----- //

function renderComposite() {
  compositeCtx.clearRect( 0, 0, compositeCanvas.width, compositeCanvas.height );
  for ( var layerName in layers ) {
    var layer = layers[ layerName ];
    compositeCtx.drawImage( layer.canvas, 0, 0 );
  }
}

function renderLayer( layer ) {
  var ctx = layer.ctx;
  ctx.clearRect( 0, 0, layer.width, layer.height );
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage( layer.img, 0, 0 );
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = layer.color;
  ctx.fillRect( 0, 0, layer.width, layer.height );
  compositeCtx.drawImage( layer.canvas, 0, 0 );
}

})();
