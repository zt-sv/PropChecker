/**
 * @module lib/helpers
 */
'use strict';

var
    toString    = Object.prototype.toString,
    types       = ['String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 'Function', 'RegExp', 'Error'],
    isNull      = function isNull(value) {
        return value === null && typeof value === 'object';
    },
    isUndefined = function isUndefined(value) {
        return typeof value === 'undefined';
    },
    helpers     = {
        isNull:          isNull,
        isUndefined:     isUndefined,
        notNullNotUndef: function notNullNotUndef(value) {
            return !isNull(value) && !isUndefined(value);
        }
    };

// Create basic type checkers
types.forEach(function(type) {
    helpers['is' + type] = function(value) {
        return toString.call(value) === '[object ' + type + ']';
    };
});

module.exports = helpers;
