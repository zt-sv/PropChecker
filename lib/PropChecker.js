/**
 * @module      lib/PropChecker
 *
 * @requires    lib/helpers
 */
'use strict';

var
    h      = require('./helpers'),
    except = ['isNull', 'isUndefined', 'notNullNotUndef'],

    PropChecker =

        /**
         * @class       PropChecker
         * @constructor
         *
         * @param       {Function}  checkFunction   Validation function
         *
         * @throws      {TypeError}                 Will throw an error if class was called as a function
         * @throws      {TypeError}                 Will throw an error if check function is not a function
         */
         function PropChecker(checkFunction) {
             if (!(this instanceof PropChecker)) {
                 throw new TypeError('Cannot call a class as a function');
             }

             if (h.isNull(checkFunction) || h.isUndefined(checkFunction) || !h.isFunction(checkFunction)) {
                 throw new TypeError('Class PropChecker accept only function as argument');
             }

            /**
             * Check property
             *
             * @param   {string}    prop    Property key
             * @param   {*}         value   Property value
             *
             * @returns {void}
             */
             this.check = checkFunction;
         };

/**
 * "isRequired" validation
 *
 * @memberOf    PropChecker
 * @static
 * @type        {PropChecker}
 *
 * @param       {string}        prop    Property name
 * @param       {*}             value   Property value
 *
 * @returns     {void}
 */
PropChecker.isRequired = new PropChecker(function(prop, value) {
    if (h.isNull(value) || h.isUndefined(value)) {
        return new TypeError('Property "' + prop + '" is required');
    }

    return null;
});

// Generate simple type checkers
Object.getOwnPropertyNames(h).forEach(function(method) {
    var
        type = method.replace('is', '').toLocaleLowerCase();

    if (~except.indexOf(method)) {
        return;
    }

    PropChecker[method] = new PropChecker(function(prop, value) {
        if (!(h.isNull(value) || h.isUndefined(value)) && !h[method](value)) {
            return new TypeError('Property "' + prop + '" must be "' + type + '"');
        }

        return null;
    });
});


/**
 * "isArrayOf" validation
 *
 * @memberOf    PropChecker
 * @static
 *
 * @param       {PropChecker}   typeChecker     Type check function
 *
 * @throws      {TypeError}                     Will throw an error if typeChecker is not a PropChecker instance
 *
 * @returns     {PropChecker}
 */
PropChecker.isArrayOf = function(typeChecker) {
    if (h.isNull(typeChecker) || h.isUndefined(typeChecker) || !(typeChecker instanceof PropChecker)) {
        throw new TypeError('Type checker function must be an instance of PropChecker');
    }

    return new PropChecker(function(prop, value) {
        if (!(h.isNull(typeChecker) || h.isUndefined(typeChecker)) && !h.isArray(value)) {
            return new TypeError('Property "' + prop + '" must be an array, but got "' + value + '"');
        }

        var
            hasWrongValues = value.some(function(el) {
                if (h.isNull(el) || h.isUndefined(el)) {
                    return true;
                }

                return typeChecker.check(prop, el);
            });

        if (hasWrongValues) {
            return new TypeError('Property "' + prop + '" have wrong element in array');
        }

        return null;
    });
};

/**
 * "isEqual" validation
 *
 * @memberOf    PropChecker
 * @static
 *
 * @param       {*}         equalValue      Value
 *
 * @throws      {TypeError}                 Will throw an error if equalValue was not passed
 *
 * @returns     {PropChecker}
 */
PropChecker.isEqual = function(equalValue) {
    if (h.isNull(equalValue) || h.isUndefined(equalValue)) {
        throw new TypeError('You should pass an any value');
    }

    return new PropChecker(function(prop, value) {
        if (value !== equalValue) {
            return new TypeError('Property "' + prop + '" must be equal to "' + equalValue + '"');
        }

        return null;
    });
};

/**
 * "isInherits" validation
 *
 * @memberOf    PropChecker
 * @static
 *
 * @param       {*}         SomeClass    Class which property value should be inherits
 *
 * @throws      {TypeError}              Will throw an error if SomeClass was not passed
 *
 * @returns     {PropChecker}
 */
PropChecker.isInherits = function(SomeClass) {
    if (h.isNull(SomeClass) || h.isUndefined(SomeClass) || !h.isFunction(SomeClass)) {
        throw new TypeError('You should pass a Class function');
    }

    return new PropChecker(function(prop, Value) {
        if (!(h.isNull(Value) || h.isUndefined(Value)) && !h.isFunction(Value)) {
            return new TypeError('Property "' + prop + '" must be a class"');
        }

        if (h.isNull(Value) || h.isUndefined(Value) || Value.prototype instanceof SomeClass) {
            return null;
        }

        return new TypeError('Property "' + prop + '" must be inherits "' + SomeClass.name + '"');
    });
};

/**
 * Object validator
 *
 * @param   {Object}    obj             The object for validation
 * @param   {Object}    config          Validation config
 * @param   {?Function} errorHandler    Error handler. Optional parameter
 *
 * @throw   {Error}                     Will throw an error if property doesn't have a validation type
 * @throw   {TypeError}                 Will throw an error if property errorHandler is not a function
 */
PropChecker.validate = function(obj, config, errorHandler) {
    var
        errors = [];

    if (!h.isUndefined(errorHandler) && !h.isFunction(errorHandler)) {
        throw new TypeError('"errorHandler" must be a function');
    }

    errorHandler = errorHandler || function(e) {
        throw e[0];
    };

    Object.getOwnPropertyNames(config || {}).forEach(function(key) {
        var
            error;

        if (config[key] instanceof PropChecker) {
            error = config[key].check(key, obj[key]);
            error && errors.push(error);

            return;
        }

        if (h.isArray(config[key])) {
            return config[key].forEach(function(checker) {
                var
                    error;

                if (checker instanceof PropChecker) {
                    error = checker.check(key, obj[key]);
                    error && errors.push(error);
                } else {
                    throw Error('Property ' + key + ' should have a type');
                }
            });
        }

        if (h.isObject(config[key])) {
            return PropChecker.validate(obj[key], config[key], errorHandler);
        }

        throw Error('Property ' + key + ' should have a type');
    });

    if (errors.length) {
        errorHandler(errors);
    }
};

module.exports = PropChecker;
