//export { default } from 'ember-data-fixture-adapter';
import Ember from 'ember';
import FixtureAdapter from 'ember-data-fixture-adapter';
        
export default FixtureAdapter.extend({
  
  findRecord: function(store, typeClass, id) {
    var fixtures = this.fixturesForType(typeClass);
    var fixture;

    Ember.assert(`Unable to find fixtures for model type ${typeClass.toString()}. If you're defining your fixtures using 'Model.FIXTURES = ...'', please change it to 'Model.reopenClass({ FIXTURES: ... })'.`, fixtures);

    if (fixtures) {
      fixture = Ember.A(fixtures).findBy('id', id);
    }

    if (fixture) {
      return this.simulateRemoteCall(() => fixture);
    }
  }
  
});