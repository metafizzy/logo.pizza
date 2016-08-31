LogoPizza.modules['custom-colors'] = function( elem ) {
  var assetDisplay = document.querySelector('.asset-display--main');

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
};
