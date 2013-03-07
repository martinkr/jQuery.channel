(function( $ ){

  var methods = {
    init : function( options ) {
      // THIS
    },
    show : function( ) {
      // IS
    },
    hide : function( ) {
      // GOOD
    },
    update : function( content ) {
      // !!!
    }
  };

  $.fn.tooltip = function( method ) {

    // Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }

  };

})( jQuery );
/*
// calls the init method
$('div').tooltip();

// calls the init method
$('div').tooltip({
  foo : 'bar'
});
// calls the hide method
$('div').tooltip('hide');
// calls the update method
$('div').tooltip('update', 'This is the new tooltip content!');
*/