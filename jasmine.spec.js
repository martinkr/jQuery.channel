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
    window.callbackFoo =  window.callbackBar = function () {
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
  // it('should expose a method called "subscribe" ',function () {
  //   expect(typeof $.channel.subscribe).toBe('function');
  // });

  // it('should expose a method called "unsubscribe" ',function () {
  //   expect(typeof $.channel.unsubscribe).toBe('function');
  // });

  // it('should expose a method called "publish" ',function () {
  //   expect(typeof $.channel.publish).toBe('function');
  // });

/**
 * subscribe
 */

  it('should subscribe to a channel "foo" using "subscribe" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    $.channel('subscribe',_sFoo,window.callbackFoo);
    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();

  });


  it('should subscribe multiple callbacks to a single channel "foo" using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sFoo,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo].has(window.callbackBar)).toBeTruthy();

  });


  it('should subscribe callbacks to different channels using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo]).toBe(undefined);
    expect($.channel.debug()[_sBar]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('subscribe',_sBar,window.callbackBar);

    expect($.channel.debug()[_sFoo].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sBar].has(window.callbackBar)).toBeTruthy();

  });

 it('should subscribe callbacks to different nested channels "FOO/BAR", "FOO/BAZ" using "subscribe"  ',function () {

    expect($.channel.debug()[_sFoo+'/'+_sBar]).toBe(undefined);
    expect($.channel.debug()[_sFoo+'/'+_sBaz]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    spyOn(window, 'callbackBar').andCallThrough();

    $.channel('subscribe',_sFoo+'/'+_sBar,window.callbackFoo);
    $.channel('subscribe',_sFoo+'/'+_sBaz,window.callbackBar);

    expect($.channel.debug()[_sFoo+'/'+_sBar].has(window.callbackFoo)).toBeTruthy();
    expect($.channel.debug()[_sFoo+'/'+_sBaz].has(window.callbackBar)).toBeTruthy();

  });

/**
 * publish
 */

  it('should publish to a channel "foo" using "publish" ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo);

    expect(window.callbackFoo).toHaveBeenCalled();
  });

  it('should publish to a channel "foo" using "publish" and pass custom data ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);
    spyOn(window, 'callbackFoo').andCallThrough();

    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo,[_sBar]);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.CheckOne).toBeTruthy();

  });

  it('should publish to a channel "foo" using "publish" and pass a custom context pointing to this in the callback  ',function () {
    expect($.channel.debug()[_sFoo]).toBe(undefined);

    spyOn(window, 'callbackFoo').andCallThrough();
    expect(window.callbackFoo).not.toHaveBeenCalled();

    $.channel('subscribe',_sFoo,window.callbackFoo);
    $.channel('publish',_sFoo,null,_context);

    expect(window.callbackFoo).toHaveBeenCalled();
    expect(window.CheckTwo).toBeTruthy();
  });


  it('should publish to multiple callbacks on a single channel "foo" using "publish"  ',function () {

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


  it('should publish to different callbacks on a different channels  using "publish"  ',function () {

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
  it('should unsubscribe a single callback from a channel "foo" using "unsubscribe" ',function () {
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

  it('should unsubscribe a single callback from a channel "foo" using "unsubscribe" and preserve all other callbacks on this channel ',function () {
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