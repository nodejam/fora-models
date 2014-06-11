// Generated by CoffeeScript 1.6.3
(function() {
  var Validator;

  Validator = (function() {
    function Validator(typeUtils) {
      this.typeUtils = typeUtils;
    }

    Validator.prototype.validate = function*(obj, typeDefinition) {
      var customValidationResults, def, errors, field, fieldName, _i, _len, _ref, _ref1, _ref2;
      errors = [];
      _ref = typeDefinition.schema.properties;
      for (fieldName in _ref) {
        def = _ref[fieldName];
        this.addError(errors, fieldName, yield this.validateField(obj, obj[fieldName], fieldName, def));
      }
      if ((_ref1 = typeDefinition.schema.required) != null ? _ref1.length : void 0) {
        _ref2 = typeDefinition.schema.required;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          field = _ref2[_i];
          if (typeof obj[field] === 'undefined') {
            errors.push("" + field + " is required");
          }
        }
      }
      if (typeDefinition.validate) {
        customValidationResults = yield typeDefinition.validate.call(obj);
        if (customValidationResults != null ? customValidationResults.length : void 0) {
          return errors.concat(customValidationResults);
        } else {
          return errors;
        }
      } else {
        return errors;
      }
    };

    Validator.prototype.validateField = function*(obj, value, fieldName, fieldDef) {
      var errors, item, typeCheck, _i, _len;
      errors = [];
      if (value != null) {
        if (fieldDef.type === 'array') {
          if (fieldDef.minItems && value.length < fieldDef.minItems) {
            errors.push("" + fieldName + ": must have at least " + fieldDef.minItems + " elements");
          }
          if (fieldDef.maxItems && value.length > fieldDef.maxItems) {
            errors.push("" + fieldName + ": can have at most " + fieldDef.minItems + " elements");
          }
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            if (this.typeUtils.isCustomType(fieldDef.items.type)) {
              if (item.validate) {
                errors = errors.concat(yield item.validate());
              } else if (fieldDef.items.typeDefinition) {
                errors = errors.concat(yield this.validate(item, fieldDef.items.typeDefinition));
              }
            } else {
              errors = errors.concat(yield this.validateField(obj, item, "[" + fieldName + "]", fieldDef.items));
            }
          }
        } else {
          typeCheck = function(fn) {
            if (!fn()) {
              return errors.push("" + fieldName + ": expected " + fieldDef.type + " but got " + (JSON.stringify(value)));
            }
          };
          switch (fieldDef.type) {
            case 'integer':
              typeCheck(function() {
                return value % 1 === 0;
              });
              break;
            case 'number':
              typeCheck(function() {
                return typeof value === 'number';
              });
              break;
            case 'string':
              typeCheck(function() {
                return typeof value === 'string';
              });
              break;
            case 'boolean':
              typeCheck(function() {
                return typeof value === 'boolean';
              });
              break;
            default:
              if (this.typeUtils.isCustomType(fieldDef.type)) {
                if (value.validate) {
                  errors = errors.concat(yield value.validate());
                } else if (fieldDef.typeDefinition) {
                  errors = errors.concat(yield this.validate(value, fieldDef.typeDefinition));
                }
              }
          }
        }
      }
      return errors;
    };

    Validator.prototype.addError = function(list, fieldName, error) {
      var item, _i, _len;
      if (error === true) {
        return list;
      }
      if (error === false) {
        list.push("" + fieldName + " is invalid.");
        return list;
      }
      if (error instanceof Array) {
        if (error.length > 0) {
          for (_i = 0, _len = error.length; _i < _len; _i++) {
            item = error[_i];
            this.addError(list, fieldName, item);
          }
        }
        return list;
      }
      if (error) {
        list.push(error);
        return list;
      }
    };

    return Validator;

  })();

  module.exports = Validator;

}).call(this);