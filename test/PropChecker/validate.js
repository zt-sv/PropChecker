'use strict';

var
    PropChecker = require('../../lib/PropChecker'),
    methods     = ['validate'];

describe('Testing method "validate" in "lib/PropChecker"...', function() {
    describe('public methods', function() {
        it('should to have public methods: ' + methods.map(function(method) {
            return '\n        - ' + method;
        }) + '\n', function() {
            methods.forEach(function(method) {
                expect(PropChecker).itself.to.respondTo(method);
            });
        });
    });

    describe('custom error handler', function() {
        it('should throw an Error if error handler is not a function', function() {
            var
                invalid = [].concat(strings, numbers, bool, objects, arrays, dates, errors, regexps);

            invalid.forEach(function(value) {
                expect(function() {
                    return PropChecker.validate({}, {}, value);
                }).to.throw(TypeError, '"errorHandler" must be a function');
            });
        });
    });

    describe('missing validation type', function() {
        it('should throw an Error if validation type is missing', function() {
            var
                testCases = [
                    {
                        obj:  {},
                        conf: {
                            foo: ''
                        }
                    },
                    {
                        obj:  {},
                        conf: {
                            foo: ['']
                        }
                    },
                    {
                        obj:  {},
                        conf: {
                            foo: function() {}
                        }
                    }
                ];

            testCases.forEach(function(testCase) {
                expect(function() {
                    return PropChecker.validate(testCase.obj, testCase.conf);
                }).to.throw(Error, 'Property foo should have a type');
            });
        });
    });

    describe('validate plain object', function() {
        it('should validate without error', function() {
            var
                testCases = [
                    {
                        obj:    {},
                        config: {}
                    },
                    {
                        obj:  {
                            foo:    'bar',
                            nested: {},
                            arr:    [],
                            someFn: function someFn() {}
                        },
                        conf: {
                            foo:    [PropChecker.isRequired, PropChecker.isString],
                            age:    [PropChecker.isNumber],
                            nested: PropChecker.isObject,
                            arr:    PropChecker.isArray,
                            someFn: PropChecker.isFunction
                        }
                    }
                ];

            testCases.forEach(function(testCase) {
                expect(function() {
                    return PropChecker.validate(testCase.obj, testCase.conf);
                }).to.not.throw();
            });
        });

        it('should validate with TypeError', function() {
            var
                testCases = [
                    {
                        obj:  {},
                        conf: {
                            foo: [PropChecker.isRequired]
                        }
                    },
                    {
                        obj:  {
                            foo: {}
                        },
                        conf: {
                            foo: [PropChecker.isString],
                            age: PropChecker.isRequired
                        }
                    }
                ];

            testCases.forEach(function(testCase) {
                expect(function() {
                    return PropChecker.validate(testCase.obj, testCase.conf);
                }).to.throw(TypeError);
            });
        });
    });

    describe('validate nested object', function() {
        it('should validate without error', function() {
            var
                testCases = [
                    {
                        obj: {
                            nested: {}
                        },
                        config: {}
                    },
                    {
                        obj: {
                            arr: [1, 2, 3]
                        },
                        conf: {
                            arr: PropChecker.isArrayOf(PropChecker.isNumber)
                        }
                    },
                    {
                        obj: {
                            arr: [[1], [2, 3]]
                        },
                        conf: {
                            arr: PropChecker.isArrayOf(PropChecker.isArrayOf(PropChecker.isNumber))
                        }
                    },
                    {
                        obj: {
                            foo: 'bar',
                            nested: {
                                num: 1
                            }
                        },
                        conf: {
                            foo: [PropChecker.isRequired, PropChecker.isString],
                            nested: {
                                num: PropChecker.isNumber,
                                arr: PropChecker.isArray
                            }
                        }
                    }
                ];

            testCases.forEach(function(testCase) {
                expect(function() {
                    return PropChecker.validate(testCase.obj, testCase.conf);
                }).to.not.throw();
            });
        });

        it('should validate with error', function() {
            var
                testCases = [
                    {
                        obj: {},
                        conf: {
                            nested: {
                                foo: [PropChecker.isRequired]
                            }
                        }
                    },
                    {
                        obj: {
                            arr: [1, 2, 'g']
                        },
                        conf: {
                            arr: PropChecker.isArrayOf(PropChecker.isNumber)
                        }
                    },
                    {
                        obj: {
                            foo: {},
                            nested: {
                                foo: 123
                            }
                        },
                        conf: {
                            foo: [PropChecker.isString],
                            nested: {
                                foo: [PropChecker.isString],
                                age: PropChecker.isRequired
                            }

                        }
                    }
                ];

            testCases.forEach(function(testCase) {
                expect(function() {
                    return PropChecker.validate(testCase.obj, testCase.conf);
                }).to.throw(TypeError);
            });
        });
    });
});
