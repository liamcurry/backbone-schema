var isNode = typeof module !== 'undefined' && module.exports
  , should = isNode ? require('chai').should() : window.chai.should()
  , Backbone = isNode ? require('backbone') : window.Backbone;

if (isNode) require('../backbone-schema');

var TestModel = Backbone.Model.extend()
  , tester;

describe('When a Backbone models has a schema', function () {

  beforeEach(function () {
    tester = new TestModel();
  });

  describe('and it has a field that specify type', function () {

    before(function () {
      TestModel.prototype.schema = {
          type1: 'string'
        , type2: String
        , type3: { type: 'string' }
        , type4: { type: String }
        , type5: 'number'
        , type6: Number
        , type7: { type: 'number' }
        , type8: { type: Number }
      };
    });

    describe('and an invalid value has been set, it:', function () {

      it('should not validate when field is a string', function () {
        tester.set({ type1: 12345678, type5: 'foobar' }, { silent: true });
        should.exist(tester.validate());
      });

      it('should not validate when field is a constructor', function () {
        tester.set({ type2: 12345678, type6: 'foobar' }, { silent: true });
        should.exist(tester.validate());
      });

      it('should not validate when type attribute is a string', function () {
        tester.set({ type3: 12345678, type7: 'foobar' }, { silent: true });
        should.exist(tester.validate());
      });

      it('should not validate when type attribute is a constructor', function () {
        tester.set({ type4: 12345678, type8: 'foobar' }, { silent: true });
        should.exist(tester.validate());
      });

    });

    describe('and a valid value has been set, it:', function () {

      it('should validate when field is a string', function () {
        tester.set({ type1: 'foobar', type5: 12345678 }, { silent: true });
        should.not.exist(tester.validate());
      });

      it('should validate when field is a constructor', function () {
        tester.set({ type2: 'foobar', type6: 12345678 }, { silent: true });
        should.not.exist(tester.validate());
      });

      it('should validate when type attribute is a string', function () {
        tester.set({ type3: 'foobar', type7: 12345678 }, { silent: true });
        should.not.exist(tester.validate());
      });

      it('should validate when type attribute is a constructor', function () {
        tester.set({ type4: 'foobar', type8: 12345678 }, { silent: true });
        should.not.exist(tester.validate());
      });

    });

  });

  describe('and it has fields that could be required, it:', function () {

    before(function () {
      TestModel.prototype.schema = {
          requiredField: { required: true }
        , notRequiredField: { required: false }
        , defaultField: {}
      };
    });

    it('should not validate when required fields are missing', function () {
      tester.set({ notRequiredField: 'testing' }, { silent: true });
      should.exist(tester.validate());
    });

    it('should validate when no required fields are missing', function () {
      tester.set({ requiredField: 'testing' }, { silent: true });
      should.not.exist(tester.validate());
    });

    it('should validate when unspecified fields are missing', function () {
      tester.set({ requiredField: 'testing' }, { silent: true });
      should.not.exist(tester.validate());
    });

  });

  describe('and it has fields that specify choices, it:', function () {

    before(function () {
      TestModel.prototype.schema = {
          status: { choices: [ 'online', 'offline', 'away' ] }
        , mixed: { choices: [ 1, 'test', 5.5 ] }
      };
    });

    it('should not validate when an invalid choice has been set', function () {
      tester.set({ status: 'notonline' }, { silent: true });
      should.exist(tester.validate());
    });

    it('should validate when a valid choice has been set', function () {
      tester.set({ status: 'away' }, { silent: true });
      should.not.exist(tester.validate());
    });

    it('should validate when using mixed choices', function () {
      tester.set({ mixed: 5.5 }, { silent: true });
      should.not.exist(tester.validate());
    });

    it('should invalidate when using mixed choices', function () {
      tester.set({ mixed: 5.1 }, { silent: true });
      should.exist(tester.validate());
    });

  });

});
