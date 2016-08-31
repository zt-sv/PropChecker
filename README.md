# PropChecker

  Minimalist JavaScript object validation library.
  
  [![NPM Version](https://img.shields.io/npm/v/battlecruiser.svg)](https://www.npmjs.com/package/propchecker)
  [![NPM Downloads](https://img.shields.io/npm/dm/battlecruiser.svg)](https://www.npmjs.com/package/propchecker)
  [![Build Status](https://travis-ci.org/13rentgen/PropChecker.svg?branch=1.0.0)](https://travis-ci.org/13rentgen/PropChecker)
  [![Codacy Badge](https://api.codacy.com/project/badge/Grade/e42d97578303492facda399da2811ed1)](https://www.codacy.com/app/13rentgen/PropChecker?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=13rentgen/PropChecker&amp;utm_campaign=Badge_Grade)

## Installation

PropChecker is packaged on npm:
```sh
$ npm install propchecker 
```

## Usage Example

```javascript
var config = {
    foo: [PropChecker.isRequired, PropChecker.isString],
    nested: {
        bar: PropChecker.isNumber,
        arr: PropChecker.isArray,
        anotherArray: PropChecker.isArrayOf(PropChecker.isNumber)
    }
};

var obj = {
    foo: 'some string',
    nested: {
        bar: 123, 
        arr: ['element1', 'element2'],
        anotherArray: [1, 2, 3, 4]
    }
};

var errorHandler = function(errors) {
    console.log(errors);
};

PropChecker.validate(obj, config, errorHandler);
```

## Available checkers

####isRequired####
Check the property value is not a null and not an undefined

####isString####
Check the property value is a string

####isNumber####
Check the property value is a number

####isBoolean####
Check the property value is a boolean

####isArray####
Check the property value is a number

####isObject####
Check the property value is an object

####isDate####
Check the property value is a date

####isFunction####
Check the property value is a function

####isRegExp####
Check the property value is a regexp

####isError####
Check the property value is a error

####isArrayOf####
Check the property value is an array with specific elements type. Type specified through any PropChecker validator. Basic example:
```javascript
var config = {
    arrayWithString: PropChecker.isArrayOf(PropChecker.isString),
    arrayWithArrayWithNumbers: PropChecker.isArrayOf(PropChecker.isArrayOf(PropChecker.isNumber))
};

var obj = {
    arrayWithString: ['some string', 'another string'],
    arrayWithArrayWithNumbers: [[1], [2, 3], [4, 5]]
};
```

####isEqual####
Check the property value is equal to primitive, using strict equality operator inside. Basic example:
```javascript
var config = {
    age: PropChecker.isEqual(18)
};

var obj = {
    age: 18
};
```
####Not enough?####
You can define your own PropCheck validator. Type checker function should return null, when the value is valid, or an error instance, when the value is invalid. Basic example:
```javascript
var myValidator = new PropChecker(function(propName, propValue) {
    if (propValue > 10) {
        return new TypeError(propName + ' is invalid'); 
    }
    
    return null;
});

var config = {
    age: myValidator
};

var obj = {
    age: 9
};
```

## License

  [MIT](LICENSE)
