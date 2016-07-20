import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Duplicator from 'ember-cli-duplicator/mixins/duplicator';

var foo = Model.extend(Duplicator, {
  property: attr('string', { defaultValue: 'foo' })
});

foo.reopenClass({
  FIXTURES: [
    {
      'id': '1',
      'property': 'foo 1'
    },
    {
      'id': '2',
      'property': 'foo 2'
    },
    {
      'id': '3',
      'property': 'foo 3'
    }
  ]
});

export default foo;