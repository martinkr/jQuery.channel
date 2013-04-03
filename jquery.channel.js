/**
 *
 * jQuery.channel - https://github.com/martinkr/jQuery.channel
 *
 * jQuery.channel
 *
 * @Version: 1.2.4
 *
 * @example:

 *
 * Copyright (c) 2011-2012 Martin Krause (jQuery.public.mkrause.info)
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Martin Krause public@mkrause.info
 * @copyright Martin Krause (jQuery.public.mkrause.info)
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @license GNU http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @requires
 *  jQuery JavaScript Library - http://jQuery.com/, v1.7+
 *    Copyright 2010, John Resig
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jQuery.org/license
 *
 */

/* jshint browser:true, jquery:true, strict: false, smarttabs:true, onevar:true */
/* global jQuery:true, -$:true */

(function( $ ){

	// "use strict";

	var _oSubscriptions = {},
		_aWildcards = [],

		_methods = {

		/**
		 * Normalizes channel names by removing trailing slashes if neccessary
		 * @param  {String} sChannel_ Channel name
		 * @return {String}           Normalized channel
		 * @private
		 */
		_normalize:function (sChannel_) {
			return (sChannel_.lastIndexOf('/') === sChannel_.length-1) ? sChannel_.slice(0,-1) : sChannel_;
		},

		/**
		 * Push channels with wildcards to the control instance
		 * @param  {String} sChannel_
		 * @return {Void}
		 * @private
		 */
		_setWildcard : function (sChannel_) {
			if ( sChannel_.indexOf('*') !== -1 && $.inArray( sChannel_, _aWildcards) === -1 ) {
				_aWildcards.push(sChannel_);
			}
		},

		/**
		 * Remove channels withwildcards from the control instance
		 * @param  {String} sChannel_ current channel
		 * @return {Void}
		 * @private
		 */
		_unsetWildcard : function (sChannel_) {
			var _iPos = $.inArray( sChannel_, _aWildcards);
			if ( sChannel_.indexOf('*') !== -1 && _iPos !== -1 ) {
				 _aWildcards.splice(_iPos, 1 );
			}
		},

		/**
		 * Filter all registered callbacks to get all channels we need to notify.
		 * Basicall we're checking the current channel against the registered wildcard-channels.
		 * @param  {String} sChannel_ current channel
		 * @return {Array}           All channels that need to be notified
		 * @private
		 */
		_filterCallbacks: function  (sChannel_){

			var _i,
				_aChannels = [],
				_regExp
				;
// console.log('---')
// console.log('filter callbacks for :' ,sChannel_, ' with wildcards ', _aWildcards)
			// push the current channel
			if (_oSubscriptions[sChannel_])  {
				_aChannels.push(sChannel_);
			}

			// @TODO: implement publishing with wildcards!
			// skip if there's just the wildcard and a wildcard gets published
			// if (_aWildcards.length == 1 && _aWildcards[0] === sChannel_) { return _aChannels;}

			// get all
			for (_i = 0; _i < _aWildcards.length; _i++) {

				_regExp = new RegExp('^'+_aWildcards[_i],"g");
				if ( _regExp.test(sChannel_)  ) {
					_aChannels.push(_aWildcards[_i]);
				}

			}

// console.log('sChannel_: ', sChannel_, ' resulted in callbacks: ', _aChannels)

			return _aChannels;
		},

		/**
		 * Creates the curstom arguments object.
		 * Adds additional properties:
		 * .data: contains the supplied custom data
		 * .originalChannel: contains the original channel this data was published to - e.g. "foo/bar"
		 * .channel: contains the matched channel this data was published to - e.g. "foo/*"
		 *
		 * @param   {String} sOriginalChannel_  original channel
		 * @param   {String} sChannel_  current channel
		 * @param   {Array}  aData_    [description]
		 * @return  {[type]}           [description]
		 * @private
		 */
		_normalizeCustomData :function (sOriginalChannel_,sChannel_,aData_) {
			return {
				"data": aData_,
				"channel":sChannel_,
				"originalChannel":sOriginalChannel_
			};
		},


		/**
		 * Subscribes to channel
		 * @param  {String} sChannel_   Channel, e.g. news/world
		 * @param  {Function} fn_       Callback
		 * @return {jQuery-Collection}  this
		 */
		subscribe : function( sChannel_,fn_ ) {
			sChannel_ = _methods._normalize(sChannel_);
			_methods._setWildcard(sChannel_);

			if (!_oSubscriptions[sChannel_])  {
				_oSubscriptions[sChannel_] = $.Callbacks('unique');
			}

			_oSubscriptions[sChannel_].add(fn_);
			return this;
		},

		/**
		 * Unsubscribes from channel
		 * @param  {String} sChannel_   Channel, e.g. news/world
		 * @param  {Function} fn_       Callback
		 * @return {jQuery-Collection}  this
		 */
		unsubscribe : function( sChannel_,fn_ ) {
			sChannel_ = _methods._normalize(sChannel_);
			_methods._unsetWildcard(sChannel_);

			if( _oSubscriptions[sChannel_] && _oSubscriptions[sChannel_].has(fn_) ) {
				_oSubscriptions[sChannel_].remove(fn_);
			}
			return this;
		},

		/**
		 * Publishes to channel
		 * @param  {String} sChannel_   Channel, e.g. news/world
		 * @param  {Array} aData_       Custom data passed as argument to the registered callback
		 * @param  {Object} oContext_   Changes the context (this) inside the callback function
		 * @return {jQuery-Collection}  this
		 */
		publish : function( sChannel_,aData_,oContext_ ) {
			var  _i ,
				_aChannels = _methods._filterCallbacks(sChannel_);

			sChannel_ = _methods._normalize(sChannel_);

			// trigger callbacks on all channels
			for (_i = 0 ; _i < _aChannels.length; _i++) {
				// console.log(sChannel_, " -> publish: ",_aChannels[_i],_oSubscriptions[_aChannels[_i]] )
				_oSubscriptions[_aChannels[_i]].fireWith(oContext_||this,[_methods._normalizeCustomData(sChannel_,_aChannels[_i],aData_)]);
			}

			return this;
		},

		/** test function */
		flush : function () {
			_oSubscriptions = {};
			_aWildcards = [];
		},

		/** test function */
		debug : function(  ) {
		  return _oSubscriptions;
		},
		/** test function */
		debugWildcards : function(  ) {
		  return _aWildcards;
		}
	};

	/**
	 * Main function
	 * @see http://docs.jquery.com/Plugins/Authoring
	 * @param  {String} method_ Method to execute
	 * @param  {Array} [aData_] additional data being passed to the publish method
	 * @param  {Object} [oContext_] additional contetxt being passed to the publish method
	 * @param  {Function} [fn_] additional function being passed to the subscribe/unsubscribe method
	 * @return {jQuery-Collection}  this
	 */
	$.channel = $.fn.channel = function( method_ ) {
		// "use strict";
		if ( _methods[method_] ) {
			return _methods[ method_ ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method_ === 'object' || ! method_ ) {
			return _methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method_ + ' does not exist on jQuery.channel' );
		}
	};

})( jQuery );

/* test functions */
jQuery.fn.channel.debug = function( ){
	return jQuery.channel('debug');
};
jQuery.fn.channel.debugWildcards = function( ){
	return jQuery.channel('debugWildcards');
};
jQuery.fn.channel.flush = function( ){
	return jQuery.channel('flush');
};

