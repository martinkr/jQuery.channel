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
	methods = {

		subscribe : function( sChannel_,fn_ ) {
			// methods._channelCreate(sChannel_)
 			if (!_oSubscriptions[sChannel_].Callbacks)  {
				_oSubscriptions[sChannel_].Callbacks = jQuery.Callbacks('unique');
			}
			_oSubscriptions[sChannel_].Callbacks.add(fn_);
			return this;
		},

		unsubscribe : function( sChannel_,fn_ ) {
		  	if( _oSubscriptions[sChannel_].Callbacks && _oSubscriptions[sChannel_].Callbacks.has(fn_) ) {
				_oSubscriptions[sChannel_].Callbacks.remove(fn_);
			}
			return this;
		},

		publish : function( sChannel_,aData_,oContext_ ) {
			if(_oSubscriptions[sChannel_].Callbacks) {
				_oSubscriptions[sChannel_].Callbacks.fireWith(oContext_||this,aData_);
			}
			return this;
		},

		_channelCreate: function(sChannel_) {
			var _col = sChannel_.split('/');
			// set namespace
			var _oBase = _oSubscriptions;
			for (var _i = 0; _i < _col.length; _i++) {
				// don't have current obj
				if (typeof(_oBase[_col[_i]]) === 'undefined') {
					// add obj
					_oBase[_col[_i]] = {};
				}
				_oBase = _oBase[_col[_i]];
			}
			// _oSubscriptions =  _oBase;
			console.log('-',_oSubscriptions)
		},


		flush : function () {
			_oSubscriptions = {};
		},

		debug : function(  ) {
		  return _oSubscriptions;
		}
	};

  $.channel = $.fn.channel = function( method ) {
// console.log('method: ',method,' methods[ method ]: ',methods[ method ])

		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.channel' );
		}
 	};

})( jQuery );

$.fn.channel.debug = function( ){
	return $.channel('debug');
}
$.fn.channel.flush = function( ){
	return $.channel('flush');
}

/*
(function($) {
  jQuery.channel = function() {



	// registered Mocks
	var _oSubscriptions = {};


	var _subscribe = function (sChannel_,fn_) {
		if (!_oSubscriptions[sChannel_])  {
			_oSubscriptions[sChannel_] = jQuery.Callbacks('unique');
		}
		_oSubscriptions[sChannel_].add(fn_);

	};

	var _unsubscribe = function (sChannel_,fn_) {
		if( _oSubscriptions[sChannel_] && _oSubscriptions[sChannel_].has(fn_) ) {
			_oSubscriptions[sChannel_].remove(fn_);
		}
	};

	var _publish = function (sChannel_,aData_,oContext_) {
		_oSubscriptions[sChannel_].fireWith(oContext_||this,aData_);
	};

	var _debug = function () {
		return _oSubscriptions;
	};

	var _flush = function () {
		_oSubscriptions = {};
	};


	var _initialize = function () {

	};

	return {
	  subscribe : _subscribe ,
	  unsubscribe: _unsubscribe,
	  publish: _publish,
	  debug: _debug,
	  flush: _flush,

	  initialize: _initialize

	};

  }();
})(jQuery);
*/



