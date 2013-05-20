backbone-schema
===============

[![Build Status](https://secure.travis-ci.org/liamcurry/backbone-schema.png)](http://travis-ci.org/liamcurry/backbone-schema)

A minimalistic and lightweight schema validator for Backbone models. Loosely
inspired by [Mongoose's schema validation](http://mongoosejs.com/docs/guide.html).
Feel free to fork, modify, and contribute to your needs. Pull requests and
issues are welcome.

```bash
npm install backbone-schema
```

or use [bower](http://bower.io) to install backbone-schema

```
bower install backbone-schema
```

Usage
-----

Can be used in the browser or the server. Just include backbone-schema in your
project and define a `schema` property in your models.

See [Backbone's documentation](http://backbonejs.org/#Model-validate) for more
information.

Example
-------

See [tests.js](https://github.com/liamcurry/backbone-schema/blob/master/tests.js)
for more examples.

### Basic example
```javascript
var Backbone = require('backbone');
require('backbone-schema');

var User = Backbone.Model.extend({

  schema: {
      nickname: String
    , username: { type: String, required: true }
    , joined: Date
  }

  // All your other normal Backbone.Model code...

});

var liam = new User();        // Emits an error because "username" is not defined.
liam.set('username', 'liam'); // Good to go
liam.set('nickname', 1);      // Emits an error because "nickname" must be a string
liam.set('nickname', 'Liam'); // Good to go
liam.set('joined', 'Tues');   // Emits an error because "joined" must be a date.
```

### Extended example

```javascript
var Backbone = require('backbone');
require('backbone-schema');

var Message = Backbone.Model.extend({

    schema: {
        nickname: String      // Types can be specified as functions...
      , text: {
          type: 'string'      // ...or they can be specified as strings.
        , required: true      // Makes the attribute required for the model to validate.
      }
      , timestamp: {
          type: Date
        , validators: [       // Custom validator functions can be set in an array
            function (val) {  // Each validator will be given the value of the field
              if (val > new Date()) {
                return 'Timestamp can not be set to a future date.';
              }
            }
          ]
      }
      , kind: {
          required: true
        , type: String
        , choices: [          // Enum-esque functionality. Forces the attribute to be
            'message'         // one of these choices in order to be valid.
          , 'left'
          , 'joined'
          ]
      }
      , _isStrict: true       // Enables strict mode, which disallows arbitrary attributes
    }

});
```

Options
-------

Below is a list of options available for each attribute in the schema.

### required

If `true`, the field must be defined.

_Type: `Boolean`, Default: `false`_

### validators

An array of validator functions that will be passed the value of this field
and ran. You can access the current model within these functions using  `this`.

_Type: `Array`, Default: `[]`_

### type

If defined, the field must be of the specified type. May be a string or a function.

_Type: `Function` or `String`, Default: `null`_

### choices

An array of objects. If defined, then the value of this field must be in this array.

_Type: `Array`, Default: `[]`_

Strict mode
-----------

Strict mode will invalidate the model if there are attributes in it that don't
exist in the schema. It is off by default, but you can enable it by defining
`_isStrict` in the top-level of your schema.
