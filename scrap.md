
$.tabloid.subscribe()
$.tabloid.subscribe()

$('item').tabloid('subscribe returns  this == $('item')
$('item').tabloid('subscribe',context)<< this == $('item')

use :

$.callbacks() !?

http://www.cs.ru.nl/~pieter/oss/manyfaces.pdf
http://addyosmani.com/resources/essentialjsdesignpatterns/book/#observerpatternjavascript

Differences Between The Observer And Publish/Subscribe Pattern

Whilst the Observer pattern is useful to be aware of, quite often in the JavaScript world, we'll find it commonly implemented using a variation known as the Publish/Subscribe pattern. Whilst very similar, there are differences between these patterns worth noting.

The Observer pattern requires that the observer (or object) wishing to receive topic notifications must subscribe this interest to the object firing the event (the subject).

The Publish/Subscribe pattern however uses a topic/event channel which sits between the objects wishing to receive notifications (subscribers) and the object firing the event (the publisher). This event system allows code to define application specific events which can pass custom arguments containing values needed by the subscriber. The idea here is to avoid dependencies between the subscriber and publisher.

This differs from the Observer pattern as it allows any subscriber implementing an appropriate event handler to register for and receive topic notifications broadcast by the publisher.

Here is an example of how one might use the Publish/Subscribe if provided with a functional implementation powering publish(),subscribe() and unsubscribe() behind the scenes:


## structure
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


## samples

---

// Uses AMD or browser globals to create a jQuery plugin.

// It does not try to register in a CommonJS environment since
// jQuery is not likely to run in those environments.
// See jqueryPluginCommonJs.js for that version.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.jqueryPlugin = function () {};
}));


---
/*

	jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

	Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

	Original is (c) Dojo Foundation 2004-2010. Released under either AFL or new BSD, see:
	http://dojofoundation.org/license for more information.

*/

;(function(d){

	// the topic/subscription hash
	var cache = {};

	d.publish = function(/* String */topic, /* Array? */args){
		// summary:
		//		Publish some data on a named topic.
		// topic: String
		//		The channel to publish on
		// args: Array?
		//		The data to publish. Each array item is converted into an ordered
		//		arguments on the subscribed functions.
		//
		// example:
		//		Publish stuff on '/some/topic'. Anything subscribed will be called
		//		with a function signature like: function(a,b,c){ ... }
		//
		//	|		$.publish("/some/topic", ["a","b","c"]);
		cache[topic] && d.each(cache[topic], function(){
			this.apply(d, args || []);
		});
	};

	d.subscribe = function(/* String */topic, /* Function */callback){
		// summary:
		//		Register a callback on a named topic.
		// topic: String
		//		The channel to subscribe to
		// callback: Function
		//		The handler event. Anytime something is $.publish'ed on a
		//		subscribed channel, the callback will be called with the
		//		published array as ordered arguments.
		//
		// returns: Array
		//		A handle which can be used to unsubscribe this particular subscription.
		//
		// example:
		//	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
		//
		if(!cache[topic]){
			cache[topic] = [];
		}
		cache[topic].push(callback);
		return [topic, callback]; // Array
	};

	d.unsubscribe = function(/* Array */handle){
		// summary:
		//		Disconnect a subscribed function for a topic.
		// handle: Array
		//		The return value from a $.subscribe call.
		// example:
		//	|	var handle = $.subscribe("/something", function(){});
		//	|	$.unsubscribe(handle);

		var t = handle[0];
		cache[t] && d.each(cache[t], function(idx){
			if(this == handle[1]){
				cache[t].splice(idx, 1);
			}
		});
	};

})(jQuery);

/**
 Radio.js - Chainable, Dependency Free Publish/Subscribe for Javascript
 http://radio.uxder.com
 Author: Scott Murphy 2011
 twitter: @hellocreation, github: uxder

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */
(function (name, global, definition) {
  if (typeof module !== 'undefined') module.exports = definition(name, global);
  else if (typeof define === 'function' && typeof define.amd  === 'object') define(definition);
  else global[name] = definition(name, global);
})('radio', this, function (name, global) {

  "use strict";

  /**
   * Main Wrapper for radio.$ and create a function radio to accept the channelName
   * @param {String} channelName topic of event
   */
  function radio(channelName) {
    arguments.length ? radio.$.channel(channelName) : radio.$.reset();
    return radio.$;
  }

  radio.$ = {
    version: '0.2',
    channelName: "",
    channels: [],

    /**
     * Reset global state, by removing all channels
     * @example
     *    radio()
     */
    reset: function() {
      radio.$.channelName = "";
      radio.$.channels = [];
    },

    /**
     * Broadcast (publish)
     * Iterate through all listeners (callbacks) in current channel and pass arguments to subscribers
     * @param arguments data to be sent to listeners
     * @example
     *    //basic usage
     *    radio('channel1').broadcast('my message');
     *    //send an unlimited number of parameters
     *    radio('channel2').broadcast(param1, param2, param3 ... );
     */
    broadcast: function() {
      var i, c = this.channels[this.channelName],
        l = c.length,
        subscriber, callback, context;
      //iterate through current channel and run each subscriber
      for (i = 0; i < l; i++) {
        subscriber = c[i];
        //if subscriber was an array, set the callback and context.
        if ((typeof(subscriber) === 'object') && (subscriber.length)) {
          callback = subscriber[0];
          //if user set the context, set it to the context otherwise, it is a globally scoped function
          context = subscriber[1] || global;
        }
        callback.apply(context, arguments);
      }
      return this;
    },

    /**
     * Create the channel if it doesn't exist and set the current channel/event name
     * @param {String} name the name of the channel
     * @example
     *    radio('channel1');
     */
    channel: function(name) {
      var c = this.channels;
      //create a new channel if it doesn't exists
      if (!c[name]) c[name] = [];
      this.channelName = name;
      return this;
    },

    /**
     * Add Subscriber to channel
     * Take the arguments and add it to the this.channels array.
     * @param {Function|Array} arguments list of callbacks or arrays[callback, context] separated by commas
     * @example
     *      //basic usage
     *      var callback = function() {};
     *      radio('channel1').subscribe(callback);
     *
     *      //subscribe an endless amount of callbacks
     *      radio('channel1').subscribe(callback, callback2, callback3 ...);
     *
     *      //adding callbacks with context
     *      radio('channel1').subscribe([callback, context],[callback1, context], callback3);
     *
     *      //subscribe by chaining
     *      radio('channel1').subscribe(callback).radio('channel2').subscribe(callback).subscribe(callback2);
     */
    subscribe: function() {
      var a = arguments,
        c = this.channels[this.channelName],
        i, l = a.length,
        p, ai = [];

      //run through each arguments and subscribe it to the channel
      for (i = 0; i < l; i++) {
        ai = a[i];
        //if the user sent just a function, wrap the fucntion in an array [function]
        p = (typeof(ai) === "function") ? [ai] : ai;
        if ((typeof(p) === 'object') && (p.length)) c.push(p);
      }
      return this;
    },

    /**
     * Remove subscriber from channel
     * Take arguments with functions and unsubscribe it if there is a match against existing subscribers.
     * @param {Function} arguments callbacks separated by commas
     * @example
     *      //basic usage
     *      radio('channel1').unsubscribe(callback);
     *      //you can unsubscribe as many callbacks as you want
     *      radio('channel1').unsubscribe(callback, callback2, callback3 ...);
     *       //removing callbacks with context is the same
     *      radio('channel1').subscribe([callback, context]).unsubscribe(callback);
     */
    unsubscribe: function() {
      var a = arguments,
        i, j, c = this.channels[this.channelName],
        l = a.length,
        cl = c.length,
        offset = 0,
        jo;
      //loop through each argument
      for (i = 0; i < l; i++) {
        //need to reset vars that change as the channel array items are removed
        offset = 0;
        cl = c.length;
        //loop through the channel
        for (j = 0; j < cl; j++) {
          jo = j - offset;
          //if there is a match with the argument and the channel function, unsubscribe it from the channel array
          if (c[jo][0] === a[i]) {
            //unsubscribe matched item from the channel array
            c.splice(jo, 1);
            offset++;
          }
        }
      }
      return this;
    }
  };

  return radio;
});
