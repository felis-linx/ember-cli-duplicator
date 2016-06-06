/*jshint node:true*/
module.exports = {
  description: 'Generates an Ember duplicated model',

  locals: function(options) {
    return {
      imports: 'import DS from \'ember-dat\';' + EOL + 'import Duplicator from \'ember-cli-duplicator/addon/mixins\';',
      baseClass: 'DS.Model',
      body: ''
    };
  }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
