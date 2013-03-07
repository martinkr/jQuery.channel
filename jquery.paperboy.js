/**
 *
 * jQuery.paperboy - https://github.com/martinkr/jQuery.paperboy
 *
 * jQuery.paperboy
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


  jQuery.channel = function(sChannel_) {


	// registered Mocks
	var _oSubscriptions = {};


	var _subscribe = function (fn_) {
console.log(sChannel_)
		if (_oSubscriptions[sChannel_])  {
			_oSubscriptions[sChannel_].add(fn_);
		} else {
			_oSubscriptions[sChannel_] = jQuery.Callbacks();
		}

	};

	var _unsubscribe = function (sChannel_,fn_) {
	};

	var _publish = function (sChannel_) {
	};

	var _debug = function () {
		return _oSubscriptions;
	};

   /**
   * Constructor: sets $.ajaxTransport intercepting the original $.ajax
   * @return {Void}
   */
	var _initialize = function () {

	};
	/**
	 * Public API
	 */
	return {
	  subscribe : _subscribe ,
	  unsubscribe: _unsubscribe,
	  publish: _publish,
	  debug: _debug,

	  initialize: _initialize

	};

  };
  /**
   * var topics = {};
jQuery.Topic = function( id ) {
    var callbacks,
        method,
        topic = id && topics[ id ];
    if ( !topic ) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if ( id ) {
            topics[ id ] = topic;
        }
    }
    return topic;
};
This can then be used by parts of your application to publish and subscribe to events of interest very easily:

view plaincopy to clipboardprint?
// Subscribers
$.Topic( 'mailArrived' ).subscribe( fn1 );
   */



