'use strict';

var
    PropChecker = require('../../lib/PropChecker'),
    methods     = ['check'];

describe('Testing "lib/PropChecker"...', function() {
    describe('create new PropChecker', function() {
        it('should throw error, if construct without function', function() {
            var
                invalid = [].concat(nullAndUndef, numbers, strings, bool, objects, arrays, dates, errors, regexps);

            invalid.forEach(function(value) {
                expect(function() {
                    return new PropChecker(value);
                }).to.throw(Error, 'Class PropChecker accept only function as argument');
            });
        });

        it('should not throw error, if construct with function', function() {
            var
                valid = [].concat(fns);

            valid.forEach(function(value) {
                expect(function() {
                    return new PropChecker(value);
                }).to.not.throw();
            });
        });
    });

    describe('public methods', function() {
        var
            checker = new PropChecker(fns[0]);

        methods.forEach(function(method) {
            it('should have public method "' + method + '"', function() {
                expect(checker).itself.to.respondTo(method);
            });
        });
    });
});
