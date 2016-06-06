import Ember from 'ember';
import DuplicatorMixin from 'ember-cli-duplicator/mixins/duplicator';
import { module, test } from 'qunit';

module('Unit | Mixin | duplicator');

// Replace this with your real tests.
test('it works', function(assert) {
  let DuplicatorObject = Ember.Object.extend(DuplicatorMixin);
  let subject = DuplicatorObject.create();
  assert.ok(subject);
});
