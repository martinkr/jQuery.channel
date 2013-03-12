/**
 * @projectDescription
 *
 * Spec for:
 *  jQuery.channel - https://github.com/martinkr/jQuery.channel
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
 *  jQuery JavaScript Library - http://jquery.com/
 *    Copyright 2010, John Resig
 *    Dual licensed under the MIT or GPL Version 2 licenses - http://jquery.org/license
 *
 *  Jasmine A JavaScript Testing Framework - https://github.com/pivotal/jasmine
 *    Copyright (c) 2008-2011 Pivotal Labs
 *    Licensed under the MIT license - https://github.com/pivotal/jasmine/MIT.LICENSE
 */


describe('jQuery.channel ', function() {

  var _sFoo = "FOO";
  var _sBar = "BAR";
  var _sBaz = "BAZ";

  var counter = 0;

  beforeEach(function() {
    _sFoo = "FOO";
    _sBar = "BAR";
    _context = {'context':'context'};
    window.CheckOne = null;
    window.CheckTwo = null;
    window.callbackFoo =  window.callbackBar = window.callbackBaz = window.callbackFooBar =  function () {
      // console.log('this: ',this)
      window.CheckOne = arguments[0]==_sBar;
      window.CheckTwo = this == _context;
    };
  });

  afterEach(function() {
      window.callbackFoo = null;
      window.CheckOne = null;
      window.CheckTwo = null;
     $.channel.flush();
  });

  /**
   * INTERFACE
   */
  // xit('should expose a method called "subscribe" ',function () {
  //   expect(typeof $.channel.subscribe).toBe('function');
  // });

  // xit('should expose a method called "unsubscribe" ',function () {
  //   expect(typeof $.channel.unsubscribe).toBe('function');
  // });

  // xit('should expose a method called "publish" ',function () {
  //   expect(typeof $.channel.publish).toBe('function');
  // });

/**
 * subscribe
 */

  xit('should subscribe to a channel "foo" using "subscribe" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    $.channel('subscribe',_sFoo,window.callbackFoo);
    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();

  });


  xit('should subscribe multiple callbacks to a single channel "foo" using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo].has(window.callbackBar)).toBeTruthy();

  });


  xit('should subscribe callbacks to different channels using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);
    expect($.channel.debug()[_sBar]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sBar,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sBar].has(window.callbackBar)).toBeTruthy();

  });

   xit('should subscribe a callbacks to a channel ONCE even if subscribe has been called multiplet imes  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackFoo);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();

    expect(window.callbackFoo.callCount).toBe(0);
    $.channel('publish',_sFoo);
    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.callbackFoo.callCount).toBe(1);

  });


  xit('should normalize subscriptions: FOO/BAR and FOO/BAR represent the same channel ',function () {

    expect($.channel.debug()[_sFoo+'/'+_sBar]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/']).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo+'/'+_sBar,window.callbackFoo);
    $.channel('subscribe',_sFoo+'/'+_sBar+'/',window.callbackBar);

    expect($.channel.debug()[_sFoo+'/'+_sBar+'/']).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackBar)).toBeTruthy();

    expect(window.callbackFoo.callCount).toBe(0);
    expect(window.callbackBar.callCount).toBe(0);

    $.channel('publish',_sFoo+'/'+_sBar);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(1);

    $.channel('publish',_sFoo+'/'+_sBar+'/');

    expect(window.callbackFoo.callCount).toBe(2);
    expect(window.callbackBar.callCount).toBe(2);

    $.channel('unsubscribe',_sFoo+'/'+_sBar+'/',window.callbackFoo);
    $.channel('unsubscribe',_sFoo+'/'+_sBar,window.callbackBar);

    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackFoo)).not.toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackBar)).not.toBeTruthy();

  });


  /** nested */

 xit('should subscribe callbacks to different nested channels "FOO/BAR", "FOO/BAZ", "FOO/BAR/BAZ" using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo+'/'+_sBar]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBaz]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();
    spyOn(window, 'callbackBaz').andCallThrough();

    $.channel('subscribe',_sFoo+'/'+_sBar,window.callbackFoo);
    $.channel('subscribe',_sFoo+'/'+_sBaz,window.callbackBar);
    $.channel('subscribe',_sFoo+'/'+_sBar+'/'+_sBaz,window.callbackBaz);

    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBaz].has(window.callbackBar)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz].has(window.callbackBaz)).toBeTruthy();

  });

xit('should unsubscribe from channel  "FOO/BAR/BAZ" while preserving subscription to "FOO/BAR/BAR"  ',function () {

    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBar]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz]).toBe(undefined);

    spyOn(window, 'callbackBar').andCallThrough();
    spyOn(window, 'callbackBaz').andCallThrough();

    $.channel('subscribe',_sFoo+'/'+_sBar+'/'+_sBar,window.callbackBar);
    $.channel('subscribe',_sFoo+'/'+_sBar+'/'+_sBaz,window.callbackBaz);

    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBar].has(window.callbackBar)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz].has(window.callbackBzr)).toBeTruthy();

    $.channel('unsubscribe',_sFoo+'/'+_sBar+'/'+_sBaz,window.callbackBaz);

    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBar].has(window.callbackBar)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz].has(window.callbackBzr)).not.toBeTruthy();

  });


  /** nested */

it('should subscribe, unsubscribe and publish to multiple channels using the STRING* wildcard ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'*']).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();
    spyOn(window, 'callbackBaz').andCallThrough();
    spyOn(window, 'callbackFooBar').andCallThrough();

    $.channel('subscribe',_sFoo+'*',window.callbackFoo);
    $.channel('subscribe',_sFoo+'/'+_sBar,window.callbackBar);
    $.channel('subscribe',_sFoo+'/'+_sBar+'/'+_sBaz,window.callbackBaz);

    expect($.channel.debugWildcards()).toEqual([_sFoo+'*']);
    expect($.channel.debug()[_sFoo+'*'].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackBar)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz].has(window.callbackBaz)).toBeTruthy();

    $.channel('publish',_sBar);

    expect(window.callbackFoo.callCount).toBe(0);
    expect(window.callbackBar.callCount).toBe(0);
    expect(window.callbackBaz.callCount).toBe(0);
    expect(window.callbackFooBar.callCount).toBe(0);

    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(0);
    expect(window.callbackBaz.callCount).toBe(0);
    expect(window.callbackFooBar.callCount).toBe(0);

    $.channel('publish',_sFoo+'/'+_sBaz);

    expect(window.callbackFoo.callCount).toBe(2);
    expect(window.callbackBar.callCount).toBe(0);
    expect(window.callbackBaz.callCount).toBe(0);
    expect(window.callbackFooBar.callCount).toBe(0);

    $.channel('publish',_sFoo+'/'+_sBar);

    expect(window.callbackFoo.callCount).toBe(3);
    expect(window.callbackBar.callCount).toBe(1);
    expect(window.callbackBaz.callCount).toBe(0);
    expect(window.callbackFooBar.callCount).toBe(0);


    $.channel('publish',_sFoo+'/'+_sBar+'/'+_sBaz);

    expect(window.callbackFoo.callCount).toBe(4);
    expect(window.callbackBar.callCount).toBe(1);
    expect(window.callbackBaz.callCount).toBe(1);
    expect(window.callbackFooBar.callCount).toBe(0);


    $.channel('subscribe',_sFoo+'/'+_sBar+'*',window.callbackFooBar);
    expect($.channel.debugWildcards()).toEqual([_sFoo+'*',_sFoo+'/'+_sBar+'*']);
    expect($.channel.debug()[_sFoo+'/'+_sBar+'*'].has(window.callbackFooBar)).toBeTruthy();

    $.channel('publish',_sFoo+'/'+_sBar+'/'+_sBaz);

    expect(window.callbackFoo.callCount).toBe(5);
    expect(window.callbackBar.callCount).toBe(1);
    expect(window.callbackBaz.callCount).toBe(2);
    expect(window.callbackFooBar.callCount).toBe(1);

    $.channel('unsubscribe',_sFoo+'/'+_sBar+'*',window.callbackFooBar);

    expect($.channel.debugWildcards()).toEqual([_sFoo+'*']);

    expect($.channel.debug()[_sFoo+'*'].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackBar)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'/'+_sBaz].has(window.callbackBaz)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBar+'*'].has(window.callbackFooBar)).not.toBeTruthy();

    $.channel('publish',_sFoo+'/'+_sBar+'/'+_sBaz);

    expect(window.callbackFoo.callCount).toBe(6);
    expect(window.callbackBar.callCount).toBe(1);
    expect(window.callbackBaz.callCount).toBe(3);
    expect(window.callbackFooBar.callCount).toBe(1);


  });


  xit('should subscribe, unsubscribe and publish to multiple channels using the *String/ wildcard ',function () {



  });

  xit('should subscribe, unsubscribe and publish to multiple channels using the *String* wildcard ',function () {



  });

/*
 * publish
 */

  xit('should publish to a channel "foo" using "publish" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo);

    expect(window.callbackFoo).toHaveBeenCalled();
  });

  xit('should ignore publish if no callbacks are registered" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    $.channel('publish',_sFoo);
  });

  xit('should publish to a channel "foo" using "publish" and pass custom data ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    spyOn(window, 'callbackFoo').andCallThrough();

    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo,[_sBar]);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.CheckOne).toBeTruthy();

  });

  xit('should publish to a channel "foo" using "publish" and pass a custom context pointing to this in the callback  ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo,null,_context);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.CheckTwo).toBeTruthy();
  });


  xit('should publish to multiple callbacks on a single channel "foo" using "publish"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    expect(window.callbackFoo).not.toHaveBeenCalled();
    expect(window.callbackBar).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo].has(window.callbackBar)).toBeTruthy();

    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(1);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.callbackBar).toHaveBeenCalled();

    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(2);
    expect(window.callbackBar.callCount).toBe(2);

  });


  xit('should publish to different callbacks on a different channels  using "publish"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    expect(window.callbackFoo).not.toHaveBeenCalled();
    expect(window.callbackBar).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sBar,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sBar].has(window.callbackBar)).toBeTruthy();

    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(0);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.callbackBar).not.toHaveBeenCalled();

    $.channel('publish',_sBar);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(1);

  });



/**
 * unsubscribe
 */
  xit('should unsubscribe a single callback from a channel "foo" using "unsubscribe" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.callbackFoo.callCount).toBe(1);

    $.channel('unsubscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(1);


  });

  xit('should ignore unsubscribe if no callbacks are registered" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    $.channel('unsubscribe',_sFoo);
  });


  xit('should unsubscribe a single callback from a channel "foo" using "unsubscribe" and preserve all other callbacks on this channel ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();
    expect(window.callbackBar).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackBar);

    $.channel('publish',_sFoo);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.callbackBar).toHaveBeenCalled();

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(1);

    $.channel('unsubscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo);

    expect(window.callbackFoo.callCount).toBe(1);
    expect(window.callbackBar.callCount).toBe(2);

  });


});