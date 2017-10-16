LogoPizza.modules['for-sale'] = function( elem ) {

  // init Isotope
  var iso = new Isotope( '.thumbnails', {
    layoutMode: 'fitRows',
    stagger: 15,
    transitionDuration: '0.3s',
  });

  var groups = elem.querySelectorAll('.for-sale__filter__group');
  var groupFilters = {};

  for ( var i=0; i < groups.length; i++ ) {
    initGroup( groups[i] );
  }

  function initGroup( group ) {
    var groupKey = group.getAttribute('data-filter-group');
    group.addEventListener( 'click', function( event ) {
      // only button clicks
      if ( !matchesSelector( event.target, '.for-sale__filter__button' ) ) {
        return;
      }
      group.querySelector('.is-selected').classList.remove('is-selected');
      event.target.classList.add('is-selected');
      var buttonFilter = event.target.getAttribute('data-filter');
      groupFilters[ groupKey ] = buttonFilter;
      iso.arrange({
        filter: getComboFilter()
      });
    });
  }

  function getComboFilter() {
    var combo = '';
    for ( var key in groupFilters ) {
      combo += groupFilters[ key ];
    }
    return combo;
  }

};
