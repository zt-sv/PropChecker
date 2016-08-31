'use strict';

var
    helpers       = require('../../lib/helpers'),

    staticMethods = {
        'isNull':          {
            validValues:   [null],
            invalidValues: [undefined].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isUndefined':     {
            validValues:   [undefined],
            invalidValues: [null].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'notNullNotUndef': {
            validValues:   [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns),
            invalidValues: [].concat(nullAndUndef)
        },
        'isString':        {
            validValues:   [].concat(strings),
            invalidValues: [].concat(nullAndUndef, numbers, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isNumber':        {
            validValues:   [].concat(numbers),
            invalidValues: [].concat(nullAndUndef, strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isBoolean':       {
            validValues:   [].concat(bool),
            invalidValues: [].concat(nullAndUndef, numbers, strings, objects, arrays, dates, errors, regexps, fns)
        },
        'isArray':         {
            validValues:   [].concat(arrays),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, dates, errors, regexps, fns)
        },
        'isObject':        {
            validValues:   [].concat(objects),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, arrays, dates, errors, regexps, fns)
        },
        'isDate':          {
            validValues:   [].concat(dates),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, errors, regexps, fns)
        },
        'isFunction':      {
            validValues:   [].concat(fns),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, regexps)
        },
        'isRegExp':        {
            validValues:   [].concat(regexps),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, fns)
        },
        'isError':         {
            validValues:   [].concat(errors),
            invalidValues: [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, regexps, fns)
        }
    };

describe('Testing "lib/helpers"...', function() {
    describe('public methods', function() {
        it('should to have public methods: ' + Object.getOwnPropertyNames(staticMethods).map(function(method) {
            return '\n        - ' + method;
        }) + '\n', function() {
            for (var method in staticMethods) {
                expect(helpers).to.have.ownProperty(method);
            }
        });
    });

    Object.getOwnPropertyNames(staticMethods).forEach(function(method) {
        var
            validValues = staticMethods[method].validValues,
            invalidValues = staticMethods[method].invalidValues;

        describe('static method "' + method + '"', function() {
            it(method + ' should return true with values', function() {
                validValues.forEach(function(value) {
                    expect(helpers[method](value)).to.be.true;
                });
            });

            it(method + ' should return false with values', function() {
                invalidValues.forEach(function(value) {
                    expect(helpers[method](value)).to.be.false;
                });
            });
        });
    });
});
