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

## API spec

####Run validation####

```javascript
PropChecker.validate(
    Object objectForValidation,
    Object validationConfig,
    Function([TypeError[] errors])
) -> {void}
```

####Define new PropChecker####
Type checker function should return null, when the value is valid, or an error instance, when the value is invalid

```javascript
new PropChecker(
    Function(
        String propertyName,
        * propertyValue
    ) typeCheckerFunction
) -> {PropChecker}
```


## License

  [MIT](LICENSE)
