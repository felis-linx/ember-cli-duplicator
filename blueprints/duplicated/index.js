/*jshint node:true*/
var EOL = require('os').EOL;

module.exports = {
  description: 'Generates an Ember duplicated model',

  locals: function(options) {
    return {
      imports: 'import DS from \'ember-data\';' + EOL + 'import Duplicator from \'ember-cli-duplicator/mixins/duplicator\';',
      baseClass: 'DS.Model',
      body: ''
    };
  }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
