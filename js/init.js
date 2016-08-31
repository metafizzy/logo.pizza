( function() {
  // init all modules, based on their data-js attribute
  var jsModuleElems = document.querySelectorAll('[data-js]');

  for ( var i=0, len = jsModuleElems.length; i < len; i++ ) {
    var elem = jsModuleElems[i];
    var moduleName = elem.getAttribute('data-js');
    var module = LogoPizza.modules[ moduleName ];
    if ( module ) {
      module( elem );
    }
  }

})();
