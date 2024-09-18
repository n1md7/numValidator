/*
	Purpose: To validate user Input
	Works only with unique selectors or just picking up the first one.
	Allowed keys: [0-9.,], backspace, arrow keys, delete, tab
	Example of usage:
		createValidator({
			maxLen: 8,       // optional, default 8
			decMaxLen: 2,    // optional, default 2
			selector: '#txt' // required, query selector
		})
		.activeOn('keydown') // required
		.disableOn(['paste', 'drop']) // optional
    @version 1.1.0 26/06/18
*/

window.createValidator = (function(document, Validator) {
  'use strict';
  return function(config) {
    return new Validator(document, config);
  };
})(document, function(ctx, config) {

  const maxLen = config.maxLen || 8;
  const decMaxLen = config.decMaxLen || 2;
  const inputElement = ctx.querySelector(config.selector || 'input[type=text]');

  if (!inputElement) {
    console.error('Selector not found:', config.selector);
    return;
  }

  // Allowed keycodes for number validation
  const allowedKeyCodes = new Set([
    8, 9, 37, 38, 39, 40, 46, // Backspace, Tab, Arrows, Delete
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // Numbers 0-9
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // Numpad 0-9
    110, 190, 188 // Decimal, period, comma
  ]);

  const decimalKeyCodes = new Set([110, 190, 188]); // Keys for '.', ','

  // Check if the key is allowed
  const isAllowedKey = (key) => allowedKeyCodes.has(key);

  // Handle input validation logic
  const validateInputNumber = function(event) {
    const value = this.value;
    const length = value.length;
    const decimalIndex = value.indexOf('.');

    // Prevent input if max length is reached, except for control keys
    if (length >= maxLen && ![8, 9, 37, 38, 39, 40, 46].includes(event.which)) {
      event.preventDefault();
      return;
    }

    // Handle allowed keys
    if (isAllowedKey(event.which)) {
      // Handle decimal input ('.', ',')
      if (decimalKeyCodes.has(event.which)) {
        if (decimalIndex === -1) {
          this.value += length === 0 ? '0.' : '.';
        }
        event.preventDefault();
      }

      // Prevent further input after reaching decimal precision limit
      if (decimalIndex !== -1 && length - decimalIndex > decMaxLen) {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
    }
  };

  // Enable input validation on the specified event
  this.activeOn = function(eventName) {
    inputElement.addEventListener(eventName, validateInputNumber);
    return this;
  };

  // Disable specific events (e.g., paste, drop)
  this.disableOn = function(events) {
    events.forEach((event) => {
      inputElement.addEventListener(event, (e) => e.preventDefault());
    });
    return this;
  };

});
