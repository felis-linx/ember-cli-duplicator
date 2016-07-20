import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import Duplicator from 'ember-cli-duplicator/mixins/duplicator';

var baz = Model.extend(Duplicator, {
  bars: hasMany('bar')
});

baz.reopenClass({
  FIXTURES: [
    {
      'id': '1',
      'bars': ['1', '2']
    }
  ]
});

export default baz;