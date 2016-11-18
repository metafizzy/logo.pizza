/*jshint devel: true */

( function() {

// data for layers
var layers = {};
// elements
var assetDisplay, colorElems, bigAssetImg, smallAssetImg;

// init
LogoPizza.modules['custom-colors'] = function( elem ) {
  assetDisplay = document.querySelector('.asset-display--main');
  bigAssetImg = assetDisplay.querySelector('.asset-display__img--big');
  smallAssetImg = assetDisplay.querySelector('.asset-display__img--small');

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
  var defaultColors = [];
  for ( var i=0; i < colorElems.length; i++ ) {
    var colorElem = colorElems[i];
    var defaultColor = colorElem.getAttribute('data-default-color');
    defaultColors.push( defaultColor );
  }

  for ( i=0; i < colorElems.length; i++ ) {
    initColorElem( colorElems[i], defaultColors );
  }

}

var layerCount = 0;

function initColorElem( colorElem, defaultColors ) {
  layerCount++;
  var title = colorElem.getAttribute('data-title');
  // build data
  var defaultColor = colorElem.getAttribute('data-default-color');
  layers[ title ] = {
    imgSrc: colorElem.getAttribute('data-layer-src'),
    defaultColor: defaultColor,
    color: defaultColor,
    preview: colorElem.querySelector('.custom-color__preview'),
    codeElem: colorElem.querySelector('.custom-color__title__code'),
  };
  var hueb = new Huebee( colorElem, {
    setText: false,
    setBGColor: false,
    offset: [ 25, -5 ],
    customColors: defaultColors,
  });
  // hueb.setColor( defaultColor );
  hueb.on( 'change', function( color ) {
    var layer = layers[ title ];
    layer.color = color;
    layer.preview.style.backgroundColor = color;
    layer.codeElem.textContent = color;
    renderLayer( layer );
    renderComposite();
  });
  // load layer images on first click
  colorElem.addEventListener( 'click', loadLayerImages );
}

// ----- load layers ----- //

var areLayerImagesLoaded = false;
var didLoad = false;
var canvasBig, ctxBig, canvasSmall, ctxSmall;

function loadLayerImages() {
  if ( didLoad ) {
    return;
  }
  // only load once
  didLoad = true;
  // create canvases to replace images
  canvasBig = document.createElement('canvas');
  canvasSmall = document.createElement('canvas');
  canvasBig.className = bigAssetImg.className;
  canvasSmall.className = smallAssetImg.className;
  ctxBig = canvasBig.getContext('2d');
  ctxSmall = canvasSmall.getContext('2d');

  for ( var layerTitle in layers ) {
    loadLayer( layers[ layerTitle ] );
  }
}

var loadedImgCount = 0;

function loadLayer( layer ) {
  var img = layer.img = new Image();
  img.onload = function() {
    onImgLoad( layer );
  };
  img.onerror = function() {
    onImgError( layer );
  };
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
  // images loaded
  if ( loadedImgCount == layerCount ) {
    imagesLoaded( layer );
  }
}

function imagesLoaded( layer ) {
  areLayerImagesLoaded = true;
  canvasBig.width = layer.width;
  canvasBig.height = layer.height;
  canvasSmall.width = layer.width/4;
  canvasSmall.height = layer.height/4;
  assetDisplay.appendChild( canvasBig );
  assetDisplay.appendChild( canvasSmall );
  bigAssetImg.style.display = 'none';
  smallAssetImg.style.display = 'none';
  renderComposite();
}

function onImgError( layer ) {
  console.error( 'Could not load layer: ', layer.imgSrc, layer.img.src );
  // debugger
}


// ----- render ----- //

function renderComposite() {
  if ( !areLayerImagesLoaded ) {
    return;
  }
  ctxBig.clearRect( 0, 0, canvasBig.width, canvasBig.height );
  for ( var layerName in layers ) {
    var layer = layers[ layerName ];
    ctxBig.drawImage( layer.canvas, 0, 0 );
    // copy to small canvas
    ctxSmall.save();
    ctxSmall.scale( 0.25, 0.25 );
    ctxSmall.drawImage( canvasBig, 0, 0 );
    ctxSmall.restore();
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
  // render on big canvas
  ctxBig.drawImage( layer.canvas, 0, 0 );
}

})();
