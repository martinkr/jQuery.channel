/**
 * @projectDescription
 *
 * Spec for:
 *  jQuery.paperboy - https://github.com/martinkr/jQuery.paperboy
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


describe('jQuery.paperboy ', function() {

  var _sKey = "FOO";
  var _sValue = "BAR";
  var counter = 0;

  beforeEach(function() {
    _sKey = "FOO";
    _sValue = "BAR";
    window.callbackFoo = function () {};
  });

  afterEach(function() {
      window.callbackFoo = null;
  });

  /**
   * INTERFACE
   */
  it('should expose a method called "subscribe" ',function () {
    expect(typeof $.paperboy.subscribe).toBe('function');
  });

  it('should expose a method called "unsubscribe" ',function () {
    expect(typeof $.paperboy.unsubscribe).toBe('function');
  });

  it('should expose a method called "publish" ',function () {
    expect(typeof $.paperboy.publish).toBe('function');
  });

/**
 * subscribe
 */

  it('should subscribe to channel "foo" using "subscribe" ',function () {

    $.paperboy.subscribe('foo',window.callbackFoo);
    expect($.paperboy.debug().foo.has(window.callbackFoo)).toBeTruthy();

  });

/**
 * publish
 */

  it('should subscribe to channel "foo" using "subscribe" ',function () {
    spyOn(window, 'callbackFoo');
    expect(window.callbackFoo).not.toHaveBeenCalled();
    $.paperboy.subscribe('foo',window.callbackFoo);
    $.paperboy.publish('foo');
    expect(window.callbackFoo).toHaveBeenCalled();
  });


});