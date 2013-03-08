/**
 *
 * jQuery.channel - https://github.com/martinkr/jQuery.channel
 *
 * jQuery.channel
 *
 * @Version: 1.1.0
 *
 * @example:

 *
 * Copyright (c) 2012 Martin Krause (jquery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jquery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 *  jQuery JavaScript Library - http://jquery.com/, v1.5+
 *    Copyright 2010, John Resig
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 */

// JSLint setting, @see http://www.jslint.com/lint.html#options
/*jslint devel: false, browser: true, continue: true, eqeq: true, vars: true, evil: true, white: true, forin: true, css: true, cap: true, nomen: true, plusplus: true, maxerr: 500, indent: 4 */


(function( $ ){

  var _oSubscriptions = {},

	_methods = {

		/**
		 * Subscribes to channel
		 * @param  {String} sChannel_ 	Channel, e.g. news/world
		 * @param  {Function} fn_       Callback
		 * @return {jQuery-Collection}  this
		 */
		subscribe : function( sChannel_,fn_ ) {
 			if (!_oSubscriptions[sChannel_])  {
				_oSubscriptions[sChannel_] = jQuery.Callbacks('unique');
			}
			_oSubscriptions[sChannel_].add(fn_);
			return this;
		},

		/**
		 * Unsubscribes from channel
		 * @param  {String} sChannel_ 	Channel, e.g. news/world
		 * @param  {Function} fn_       Callback
		 * @return {jQuery-Collection}  this
		 */
		unsubscribe : function( sChannel_,fn_ ) {
		  	if( _oSubscriptions[sChannel_] && _oSubscriptions[sChannel_].has(fn_) ) {
				_oSubscriptions[sChannel_].remove(fn_);
			}
			return this;
		},

		/**
		 * Publishes to channel
		 * @param  {String} sChannel_ 	Channel, e.g. news/world
		 * @param  {Array} aData_		Custom data passed as argument to the registered callback
		 * @param  {Object} oContext_	Changes the context (this) inside the callback function
		 * @return {jQuery-Collection}  this
		 */
		publish : function( sChannel_,aData_,oContext_ ) {
			if(_oSubscriptions[sChannel_]) {
				_oSubscriptions[sChannel_].fireWith(oContext_||this,aData_);
			}
			return this;
		},

		/** test function */
		flush : function () {
			_oSubscriptions = {};
		},
		/** test function */
		debug : function(  ) {
		  return _oSubscriptions;
		}
	};

	$.channel = $.fn.channel = function( method_ ) {
		// Method calling logic  see http://docs.jquery.com/Plugins/Authoring
		if ( _methods[method_] ) {
			return _methods[ method_ ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method_ === 'object' || ! method ) {
			return _methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method_ + ' does not exist on jQuery.channel' );
		}
 	};

})( jQuery );

/* test functions */
$.fn.channel.debug = function( ){
	return $.channel('debug');
};
$.fn.channel.flush = function( ){
	return $.channel('flush');
};

