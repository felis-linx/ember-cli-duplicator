import DS from 'ember-data';
import Duplicator from 'ember-cli-duplicator/mixins/duplicator';
//import FixtureAdapter from 'ember-data-fixture-adapter';
        
var setupModels = function(app, async) {
  app.Foo = DS.Model.extend(Duplicator, {
    property: DS.attr('string')
  });

  app.Bar = DS.Model.extend(Duplicator, {
    foo: DS.belongsTo('foo', { async: async })
  });

  app.Baz = DS.Model.extend(Duplicator, {
    foos: DS.hasMany('foo', {async: async }),
    bar: DS.belongsTo('bar', {async: async })
  });

  app.NestedList = DS.Model.extend(Duplicator, {
    baz: DS.hasMany('baz', {async: async })
  });

  app.Multi = DS.Model.extend(Duplicator, {
    bars: DS.hasMany('bar', {async: async }),
    baz: DS.belongsTo('baz', {async: async })
  });

  app.FooFix = DS.Model.extend( {
    property: DS.attr('string')
  });

  app.FooBar = DS.Model.extend(Duplicator, {
    fooFix: DS.belongsTo('fooFix', { async: async })
  });

  app.FooEmpty = DS.Model.extend(Duplicator, {
    property: DS.attr('string'),
    foo: DS.belongsTo('foo', { async: async })
  });
};

var setupFixtures = function(app) {
  app.Foo.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': 'prop1'
      },
      {
        'id': '2',
        'property': 'prop2'
      },
      {
        'id': '3',
        'property': 'prop3'
      }
    ]
  });

  app.Bar.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'foo': '1'
      }
    ]
  });

  app.Baz.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'foos': ['1', '2'],
        'bar': '1'
      },
      {
        'id': '2',
        'foos': ['3'],
        'bar': '1'
      }
    ]
  });

  app.Multi.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'bars': ['1'],
        'baz': '1'
      },
      {
        'id': '2',
        'bars': [],
        'baz': '1'
      }
    ]
  });

  app.NestedList.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'baz': ['1']
      },
    ]
  });

  app.FooFix.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': 'fix1'
      }
    ]
  });

  app.FooBar.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'fooFix': '1'
      }
    ]
  });

  app.FooEmpty.reopenClass({
    FIXTURES: [
      {
        'id': '1',
        'property': '2'
      }
    ]
  });
};

//var FAdapter = FixtureAdapter.extend();

export default function fabricate(app, async) {

  setupModels(app, async);
  setupFixtures(app);
//  app.ApplicationAdapter = FAdapter;//.get('adapter'); // DS.FixtureAdapter;
//  store.set('adapter', FAdapter);
//  app.Store = DS.Store.extend({
//    adapter: FixtureAdapter.extend()
//  });
  let store = app.__container__.lookup('service:store');
  return store;
}