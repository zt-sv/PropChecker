'use strict';

var PropChecker = require('../../lib/PropChecker'),
    propName = 'testingProp',
    staticMethods = {
        'isRequired': {
            validValues: [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps, fns),
            invalidValues: [].concat(nullAndUndef),
            errMessage: 'Property "' + propName + '" is required'
        },
        'isString': {
            validValues: [].concat(nullAndUndef, strings),
            invalidValues: [].concat(numbers, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isNumber': {
            validValues: [].concat(nullAndUndef, numbers),
            invalidValues: [].concat(strings, bool, objects, arrays, dates, errors, regexps, fns)
        },
        'isBoolean': {
            validValues: [].concat(nullAndUndef, bool),
            invalidValues: [].concat(numbers, strings, objects, arrays, dates, errors, regexps, fns)
        },
        'isArray': {
            validValues: [].concat(nullAndUndef, arrays),
            invalidValues: [].concat(numbers, strings, bool, objects, dates, errors, regexps, fns)
        },
        'isObject': {
            validValues: [].concat(nullAndUndef, objects),
            invalidValues: [].concat(numbers, strings, bool, arrays, dates, errors, regexps, fns)
        },
        'isDate': {
            validValues: [].concat(nullAndUndef, dates),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, errors, regexps, fns)
        },
        'isFunction': {
            validValues: [].concat(nullAndUndef, fns),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, errors, regexps)
        },
        'isRegExp': {
            validValues: [].concat(nullAndUndef, regexps),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, errors, fns)
        },
        'isError': {
            validValues: [].concat(nullAndUndef, errors),
            invalidValues: [].concat(numbers, strings, bool, objects, arrays, dates, regexps, fns)
        },
        'isArrayOf': {
            validValues: [],
            invalidValues: []
        },
        'isEqual': {
            validValues: [],
            invalidValues: []
        },
        'isInherits': {
            validValues: [],
            invalidValues: []
        }
    };

describe('Testing checkers in "lib/PropChecker"...', function() {
    describe('checkers', function() {
        it('should to have public checkers: ' + Object.getOwnPropertyNames(staticMethods).map(function(method) {
            return '\n        - ' + method;
        }) + '\n        ', function() {

            Object.getOwnPropertyNames(staticMethods).forEach(function(method) {
                expect(PropChecker).to.have.ownProperty(method);
            });
        });
    });

    Object.getOwnPropertyNames(staticMethods).forEach(function(method) {
        var
            validValues   = staticMethods[method].validValues,
            invalidValues = staticMethods[method].invalidValues,
            errMessage    = staticMethods[method].errMessage || 'Property "' + propName + '" must be';

        if (!validValues.length && !invalidValues.length) {
            return;
        }

        describe('checker "' + method + '"', function() {
            it(method + ' should return null with valid values', function() {
                validValues.forEach(function(value) {
                    expect(function() {
                        return PropChecker[method].check(propName, value);
                    }).to.not.throw();

                    expect(PropChecker[method].check(propName, value)).to.be.null;
                });
            });

            it(method + ' should return TypeError with invalid values', function() {
                invalidValues.forEach(function(value) {
                    var
                        result = PropChecker[method].check(propName, value);

                    expect(result).to.be.an.instanceof(TypeError);
                    expect(result.message).to.have.string(errMessage);
                });
            });
        });
    });

    describe('checker "isArrayOf"', function() {
        it('isArrayOf should work with instance of PropChecker only', function() {
            var
                except = ['isArrayOf', 'isEqual', 'isDeepEqual', 'isInherits'],
                validValues = [];

            Object.getOwnPropertyNames(staticMethods).forEach(function(method) {
                if (~except.indexOf(method)) {
                    return;
                }

                validValues.push(PropChecker[method]);
            });

            validValues.forEach(function(value) {
                expect(function() {
                    return PropChecker.isArrayOf(value);
                }).to.not.throw();
            });
        });

        it('isArrayOf should throw error with any non PropChecker values', function() {
            var
                invalid = [].concat(nullAndUndef, strings, numbers, bool, objects, arrays, dates, errors, regexps, fns);

            invalid.forEach(function(value) {
                expect(function() {
                    return PropChecker.isArrayOf(value);
                }).to.throw(TypeError, 'Type checker function must be an instance of PropChecker');
            });
        });

        it('isArrayOf should return TypeError if validate not array except null and undefined', function() {
            var
                invalid = [].concat(numbers, strings, bool, objects, dates, fns),
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber);

            invalid.forEach(function(value) {
                var
                    result = isArrayOfNumber.check(propName, value);

                expect(result).to.be.an.instanceof(TypeError);
                expect(result.message).to.have.string('Property "' + propName + '" must be an array');
            });
        });

        it('isArrayOf should return null if array elements have compatible type', function() {
            var
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber),
                isArrayOfArray = PropChecker.isArrayOf(PropChecker.isArray),
                isArrayOfObject = PropChecker.isArrayOf(PropChecker.isObject),
                isArrayOfString = PropChecker.isArrayOf(PropChecker.isString);

            numbers.forEach(function(value) {
                expect(function() {
                    return isArrayOfNumber.check(propName, [value]);
                }).to.not.throw();

                expect(isArrayOfNumber.check(propName, [value])).to.be.null;
            });

            strings.forEach(function(value) {
                expect(function() {
                    return isArrayOfString.check(propName, [value]);
                }).to.not.throw();

                expect(isArrayOfString.check(propName, [value])).to.be.null;
            });

            objects.forEach(function(value) {
                expect(function() {
                    return isArrayOfObject.check(propName, [value]);
                }).to.not.throw();

                expect(isArrayOfObject.check(propName, [value])).to.be.null;
            });

            arrays.forEach(function(value) {
                expect(function() {
                    return isArrayOfArray.check(propName, [value]);
                }).to.not.throw();

                expect(isArrayOfArray.check(propName, [value])).to.be.null;
            });
        });

        it('isArrayOf should return TypeError if array elements have not compatible type', function() {
            var
                invalidValues = [].concat(nullAndUndef, strings, bool, objects, arrays, dates, fns),
                isArrayOfNumber = PropChecker.isArrayOf(PropChecker.isNumber);

            invalidValues.forEach(function(value) {
                var
                    result = isArrayOfNumber.check(propName, [value]);

                expect(result).to.be.an.instanceof(TypeError);
                expect(result.message).to.have.string('Property "' + propName + '" have wrong element in array');
            });
        });
    });

    describe('checker "isEqual"', function() {
        it('isEqual should accept any values except null and undefined and return new PropChecker', function() {
            var
                validValues = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            validValues.forEach(function(value) {
                expect(function() {
                    return PropChecker.isEqual(value);
                }).to.not.throw();

                expect(PropChecker.isEqual(value)).to.be.an.instanceof(PropChecker);
            });
        });

        it('isEqual should throw error with null and undefined', function() {
            var
                invalidValues = [].concat(nullAndUndef);

            invalidValues.forEach(function(value) {
                expect(function() {
                    return PropChecker.isEqual(value);
                }).to.throw(TypeError, 'You should pass an any value');
            });
        });

        it('isEqual should no throw error and return null when values is equal', function() {
            var
                valid = [].concat(strings, bool, objects, arrays, dates, fns);

            valid.forEach(function(value) {
                expect(function() {
                    return PropChecker.isEqual(value).check('testValue', value);
                }).to.not.throw();

                expect(PropChecker.isEqual(value).check('testValue', value)).to.be.null;
            });
        });

        it('isEqual should return TypeError when values is not equal', function() {
            var
                invalid = [].concat(numbers, strings, bool, objects, arrays, dates, fns);

            invalid.forEach(function(value) {
                var
                    notEqualValue = 100500,
                    result        = PropChecker.isEqual(value).check(propName, notEqualValue);

                expect(result).to.be.an.instanceof(TypeError);
                expect(result.message).to.have.string('Property "' + propName + '" must be equal to "' + value + '"');
            });
        });
    });

    describe('checker "isInherits"', function() {
        it('isInherits should accept only functions', function() {
            var
                validValues = [].concat(fns);

            validValues.forEach(function(value) {
                expect(function() {
                    return PropChecker.isInherits(value);
                }).to.not.throw();
            });
        });

        it('isInherits should throw error with any non function value', function() {
            var
                invalidValues = [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates);

            invalidValues.forEach(function(value) {
                expect(function() {
                    return PropChecker.isInherits(value);
                }).to.throw(TypeError, 'You should pass a Class function');
            });
        });

        it('isInherits should no throw error and return null when values is inherits passed class', function() {
            function BaseClass() {} // eslint-disable-line
            function SomeClass() {} // eslint-disable-line

            SomeClass.prototype = new BaseClass();

            expect(function() {
                return PropChecker.isInherits(BaseClass).check('testValue', SomeClass);
            }).to.not.throw();

            expect(PropChecker.isInherits(BaseClass).check('testValue', SomeClass)).to.be.null;
        });

        it('isInherits should throw error when values is not inherits passed class', function() {
            var
                result;

            function BaseClass() {} // eslint-disable-line
            function SomeClass() {} // eslint-disable-line
            function ThirdClass() {} // eslint-disable-line

            SomeClass.prototype = new BaseClass();

            result = PropChecker.isInherits(BaseClass).check('testValue', ThirdClass);

            expect(result).to.be.an.instanceof(TypeError);
            expect(result.message).to.have.string('Property "testValue" must be inherits');
        });

        it('isInherits should throw error when values is not a class', function() {
            var
                invalidValues = [].concat(numbers, strings, bool, objects, arrays, dates);

            function BaseClass() {} // eslint-disable-line
            function SomeClass() {} // eslint-disable-line

            SomeClass.prototype = new BaseClass();

            invalidValues.forEach(function(value) {
                var
                    result = PropChecker.isInherits(BaseClass).check('testValue', value);

                expect(result).to.be.an.instanceof(TypeError);
                expect(result.message).to.have.string('Property "testValue" must be a class"');
            });
        });
    });
});
