import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Duplicator from 'ember-cli-duplicator/mixins/duplicator';

var bar = Model.extend(Duplicator, {
  foos: hasMany('foo'),
  baz: belongsTo('baz'),
});

bar.reopenClass({
  FIXTURES: [
    {
      'id': '1',
      'foos': ['1', '2'],
      'baz': '1'
    },
    {
      'id': '2',
      'foos': ['3'],
      'baz': '1'
    }
  ]
});

export default bar;