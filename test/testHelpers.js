'use strict';

global.chai   = require('chai');
global.expect = chai.expect;

global.nullAndUndef  = [null, undefined];
global.numbers       = [-1, 1, 1.23, 0, NaN, Infinity, new Number(), new Number(0), new Number(10)];
global.strings       = ['', '1', new String(), new String(''), new String('asd')];
global.bool          = [true, false, new Boolean(), new Boolean(true)];
global.objects       = [{}, {
    foo: 'foo'
}, new Object(), new Object({})];
global.arrays        = [[], [0], ['asd'], new Array(), new Array(10)];
global.dates         = [new Date()];
global.errors        = [new Error()];
global.regexps       = [new RegExp(), /^someRe*/gi];
global.fns           = [function() {}, function WithName() {}];
