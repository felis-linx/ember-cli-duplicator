import Ember from 'ember';
//import DS from 'ember-data';
//import DuplicatorMixin from 'ember-cli-duplicator/mixins/duplicator';
//import { module, test } from 'qunit';
import { moduleForModel, test } from 'ember-qunit';
//import startApp from '../../helpers/start-app';
//import fixture from '../../helpers/fixture';
//import FixtureAdapter from 'ember-data-fixture-adapter';

/*
moduleFor('mixin:duplicator', {
  needs: ['model:foo']
});
*/
moduleForModel('foo', 'Unit | Mixin | duplicator', {
  unit: true,
  needs: ['adapter:application']
});

/*
module('Unit | Mixin | duplicator', {
  needs: ['model:profile'],
  before: function () {
    console.log('setup');
    let application = startApp();
    store = fixture(application, true);
  },
  beforeEach: function() {
    console.log('Before each');
  },
  afterEach: function() {
    console.log('After each');
  }
});

// Replace this with your real tests.
test('it exist', function(assert) {
  let DuplicatorObject = Ember.Object.extend(DuplicatorMixin);
  let subject = DuplicatorObject.create();
  assert.ok(subject);
});
*/
test('Simple duplicate', function(assert) {
  assert.expect(2);
  var store = this.store();

  return Ember.run(function() {
    return store.findRecord('foo', '1').then(function(foo) {
      return foo.duplicate().then(function(copy) {
        assert.notEqual(copy.get('id'), '1', 'Id is changed to '+copy.get('id'));
        assert.equal(copy.get('property'), 'foo 1', 'Property is '+copy.get('property'));
      });
    });
  });
});

test('Duplicate with override attribute', function(assert) {
  assert.expect(1);
  var store = this.store();

//  let application = startApp(),
//      store = application.__container__.lookup('service:store');
  return Ember.run(function() {
    return store.findRecord('foo', '2').then(function(foo) {
      return foo.duplicate({property: 'overriden'}).then(function(copy) {
        assert.equal(copy.get('property'), 'overriden', 'Property is '+copy.get('property'));
      });
    });
  });
});
