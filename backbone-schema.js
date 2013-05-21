define(['Backbone'], function(backbone, require) {

  var isNode = typeof module !== 'undefined' && module.exports
    , _ = isNode ? require('underscore') : this._
    , Backbone = isNode ? require('backbone') : this.Backbone;


	var Schema = Backbone.Model.extend({

    validateSchema: function () {
      var schema = this.schema || {}
        , attrs = JSON.parse(JSON.stringify(this.attributes)); // clone
		for (var key in schema) {
		
		console.log("key: "+ key);
		
        var attr = attrs[key]
          , field = schema[key]
          , type = typeof field === 'object' ? field.type : field
          , choices = field.choices
          , validators = field.validators || [];

        if (field.required && !attr)
          return '"' + key + '" is required.';
			if (!field) continue;
			if(attr == undefined){
				console.log("attr is undef for key: "+ key);
				delete attrs[key]
				continue;
			}

        if (choices && !_.contains(choices, attr))
          return '"' + key + '" must be one of ' + choices.join(', ');

        if (_.isString(type) && typeof attr !== type)
          return '"' + key + '" must be a ' + type;

        if (_.isFunction(type) && attr.constructor !== type)
          return '"' + key + '" must be a ' + type.prototype.constructor.name;

        for (var i=validators.length; i--;) {
          var error = validators[i].call(this, attr);
          if (error) return error;
        }

        delete attrs[key];
      }

      if (schema._isStrict && _.size(attrs)) {
        return _.keys(attrs).join(', ') + ' are not in the schema';
      }
      console.log("return true");
      return true;
    },

    validateS: function (attrs) {
      return this.validateSchema();
    }

  });
	return Schema;
});
