import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('baz', 'Unit | Mixin | duplicator', {
  unit: true,
  needs: ['adapter:application', 'model:bar', 'model:foo']
});

test('Simple duplicate', function(assert) {
  assert.expect(2);
  var store = this.store();
  Ember.Logger.log('--- Simple duplicate ---');

  return Ember.run(function() {
    return store.findRecord('foo', '1').then(function(foo) {
      return foo.duplicate().then(function(copy) {
        assert.notEqual(copy.get('id'), foo.get('id'), 'New '+copy._internalModel.modelName+' record Id is '+copy.get('id'));
        assert.equal(copy.get('property'), 'foo 1', 'Property is '+copy.get('property'));
      });
    });
  });
});

test('Simple duplicate with override property', function(assert) {
  assert.expect(2);
  var store = this.store();
  Ember.Logger.log('--- Simple duplicate with override property ---');

  return Ember.run(function() {
    return store.findRecord('foo', '2').then(function(foo) {
      return foo.duplicate({property: 'overriden'}).then(function(copy) {
        assert.notEqual(copy.get('id'), foo.get('id'), 'New '+copy._internalModel.modelName+' record Id is '+copy.get('id'));
        assert.equal(copy.get('property'), 'overriden', 'Property is '+copy.get('property'));
      });
    });
  });
});

test('Deep duplicate', function(assert) {
  assert.expect(12);
  var store = this.store();
  Ember.Logger.log('--- Deep duplicate ---');

  return Ember.run(function() {
    return store.findRecord('baz', '1').then(function(baz) {
      return baz.duplicate().then(function(copy) {
        assert.notEqual(copy.get('id'), baz.get('id'), 'New '+copy._internalModel.modelName+' record Id is '+copy.get('id'));
        
        assert.equal(copy.get('bars.length'), baz.get('bars.length'), 'Copy all '+copy.get('bars.length')+' bar`s');
        assert.notEqual(copy.get('bars.firstObject.id'), baz.get('bars.firstObject.id'), 'New bars.firstObject record Id is '+copy.get('bars.firstObject.id'));
        assert.notEqual(copy.get('bars.lastObject.id'), baz.get('bars.lastObject.id'), 'New bars.lastObject record Id is '+copy.get('bars.firstObject.id'));
        
        assert.equal(copy.get('bars.firstObject.foos.length'), baz.get('bars.firstObject.foos.length'), 'Copy all '+copy.get('bars.firstObject.foos.length')+' foos`s in first bar');

        assert.notEqual(copy.get('bars.firstObject.foos.firstObject.id'), baz.get('bars.firstObject.foos.firstObject.id'), 'New bars.firstObject.foos.firstObject record Id is '+copy.get('bars.firstObject.foos.firstObject.id'));
        assert.equal(copy.get('bars.firstObject.foos.firstObject.property'), baz.get('bars.firstObject.foos.firstObject.property'), 'New bars.firstObject.foos.firstObject property is '+copy.get('bars.firstObject.foos.firstObject.property'));
        
        assert.notEqual(copy.get('bars.firstObject.foos.lastObject.id'), baz.get('bars.firstObject.foos.lastObject.id'), 'New bars.firstObject.foos.lastObject record Id is '+copy.get('bars.firstObject.foos.lastObject.id'));
        assert.equal(copy.get('bars.firstObject.foos.lastObject.property'), baz.get('bars.firstObject.foos.lastObject.property'), 'New bars.firstObject.foos.lastObject property is '+copy.get('bars.firstObject.foos.lastObject.property'));

        assert.equal(copy.get('bars.lastObject.foos.length'), baz.get('bars.lastObject.foos.length'), 'Copy all '+copy.get('bars.lastObject.foos.length')+' foos`s in last bar');

        assert.notEqual(copy.get('bars.lastObject.foos.firstObject.id'), baz.get('bars.lastObject.foos.firstObject.id'), 'New bars.lastObject.foos.firstObject record Id is '+copy.get('bars.lastObject.foos.firstObject.id'));
        assert.equal(copy.get('bars.lastObject.foos.firstObject.property'), baz.get('bars.lastObject.foos.firstObject.property'), 'New bars.lastObject.foos.firstObject property is '+copy.get('bars.lastObject.foos.firstObject.property'));        
      });
    });
  });
});

test('Deep duplicate with overriden belongsTo', function(assert) {
  assert.expect(6);
  var store = this.store();
  Ember.Logger.log('--- Deep duplicate with overriden belongsTo ---');

  return Ember.run(function() {
    return store.findRecord('bar', '1').then(function(bar) {
      return bar.duplicate({baz: null}).then(function(copy) {
        assert.ok(copy.get('baz') === null || copy.get('baz.content') === null, 'In new '+copy._internalModel.modelName+' property baz is '+copy.get('baz.content'));
        assert.notEqual(copy.get('id'), bar.get('id'), 'It record Id is '+copy.get('id'));
        assert.equal(copy.get('foos.length'), bar.get('foos.length'), 'Copy all '+copy.get('foos.length')+' foo`s');
        assert.notEqual(copy.get('foos.firstObject.id'), bar.get('foos.firstObject.id'), 'New first bar.foos record Id is '+copy.get('foos.firstObject.id'));
        assert.notEqual(copy.get('foos.lastObject.id'), bar.get('foos.lastObject.id'), 'New last bar.foos record Id is '+copy.get('foos.lastObject.id'));
        assert.equal(copy.get('foos.firstObject.property'), bar.get('foos.firstObject.property'), 'foos.firstObject.property is '+copy.get('foos.firstObject.property'));
      });
    });
  });
});

test('Deep duplicate with overriden belongsTo & hasMany (shallow copy)', function(assert) {
  assert.expect(7);
  var store = this.store();
  Ember.Logger.log('--- Deep duplicate with overriden hasMany---');

  return Ember.run(function() {
    return store.findRecord('bar', '2').then(function(bar) {
      return store.findRecord('bar', '1').then(function(bar1) {
        return bar1.get('foos').then(function(foos) {
          return bar.duplicate({baz: null, foos: foos}).then(function(copy) {
            assert.ok(copy.get('baz') === null || copy.get('baz.content') === null, 'In new '+copy._internalModel.modelName+' property baz is '+copy.get('baz.content'));
            assert.notEqual(copy.get('id'), bar.get('id'), 'It record Id is '+copy.get('id'));
            assert.equal(copy.get('foos.length'), bar1.get('foos.length'), 'Overwriting all '+copy.get('foos.length')+' foo`s');
            assert.equal(copy.get('foos.firstObject.id'), bar1.get('foos.firstObject.id'), 'New first bar.foos record Id is '+copy.get('foos.firstObject.id'));
            assert.equal(copy.get('foos.lastObject.id'), bar1.get('foos.lastObject.id'), 'New last bar.foos record Id is '+copy.get('foos.lastObject.id'));
            assert.equal(copy.get('foos.firstObject.property'), bar1.get('foos.firstObject.property'), 'foos.firstObject.property is '+copy.get('foos.firstObject.property'));
            assert.equal(copy.get('foos.lastObject.property'), bar1.get('foos.lastObject.property'), 'foos.lastObject.property is '+copy.get('foos.firstObject.property'));
          });
        });
      });
    });
  });
});
