(function () {

  var isNode = typeof module !== 'undefined' && module.exports
    , _ = isNode ? require('underscore') : this._
    , Backbone = isNode ? require('backbone') : this.Backbone;

  _.extend(Backbone.Model.prototype, {

    validateSchema: function () {
      var schema = this.schema || {}
        , attrs = _.clone(this.attributes)
        , _allErrors = this.schema._allErrors || false
        , errors = [];

      for (var key in schema) {
        if (key === "_isStrict") continue;

        var attr = attrs[key]
          , field = schema[key]
          , type = typeof field === 'object' ? field.type : field
          , choices = field.choices
          , validators = field.validators || []
          , requiredMessage = ""
          , choiceMessage = ""
          , stringTypeMessage = ""
          , functionTypeMessage = ""
          , strictMessage = "";

        if (field.required && (attr === null || attr === undefined)){
          requiredMessage = '"' + key + '" is required.';

          if (!_allErrors) {
            return requiredMessage;
          }
          else {
            errors.push({
              key: key,
              errType: "required",
              message: requiredMessage
            });
          }
        }

        if (attr === null || attr === undefined) continue;

        if (choices && !_.contains(choices, attr)){
          choiceMessage = '"' + key + '" must be one of ' + choices.join(', ');

          if (!_allErrors) {
            return choiceMessage;
          }
          else {
            errors.push({
              key: key,
              errType: "choices",
              message: choiceMessage
            });
          }
        }

        if (_.isString(type) && typeof attr !== type){
          stringTypeMessage = '"' + key + '" must be a ' + type;

          if (!_allErrors) {
            return stringTypeMessage;
          }
          else {
            errors.push({
              key: key,
              errType: "type",
              message: stringTypeMessage
            });
          }
        }

        if (_.isFunction(type) && attr.constructor !== type) {
          functionTypeMessage = '"' + key + '" must be a ' + type.prototype.constructor.name;

          if (!_allErrors) {
            return functionTypeMessage;
          }
          else {
            errors.push({
              key: key,
              errType: "type",
              message: functionTypeMessage
            });
          }
        }

        for (var i=validators.length; i--;) {
          var error = validators[i].call(this, attr);
          if (error) {
            if (!_allErrors) {
              return error;
            }
            else {
              errors.push({
                key: key,
                errType: "validator",
                message: error
              });
            }
          }
        }

        delete attrs[key];
      }

      if (schema._isStrict && _.size(attrs)){
        strictMessage = _.keys(attrs).join(', ') + ' are not in the schema';
        if (!_allErrors) {
          return strictMessage;
        }
        else {
          errors.push({
            key: _.keys(attrs),
            errType: "strict",
            message: strictMessage
          });
        }
      }

      if (errors.length > 0) {
        return errors;
      }
    },

    validate: function (attrs) {
      return this.validateSchema();
    }

  });

}.call(this));
