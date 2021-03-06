import Ember from 'ember';
import DS from 'ember-data';

/**
 * Duplicator mixin — create a replica of record with nested records and circular relations
 * and deep unload model with all relationships
 * inspired by lazybensch`s ember-cli-copyable
 *
 * @mixin duplicator
 */

export default Ember.Mixin.create({
  
/**
 * Create dublicate of record with nested records and circular relations
 * @function
 * @param {Object} options — attributes that should be overwriten or prevented from dublication
 * @returns {Promise}
 * @memberof duplicator
 *
 * @example <caption>extend default DS.Model with applying this mixin</caption>
 * import Duplicator from 'path/to/mixin';
 * export default DS.Model.extend(Duplicator, {
 *   define the propertyes, hasMany and belongsTo also allowed to use
 * });
 *
 * @example <caption>Using double of model when promise resolved</caption>
 * model.duplicate().then(function(double) {
 *   your code here...
 * });
 *
 * @example <caption>Options examples</caption>
 * model.duplicate({created: new Date()}); // overwrite property 'created'
 * model.duplicate({parent: null}), // overwrite property 'parent' and prevent duplicate parent branch
 * model.duplicate({css: { overflow: 'scroll'}}); // overwrite nested option
 *
 */
  duplicate: function(options) {
    
    var self = this;
    options = options || {};
    
    return new Ember.RSVP.Promise(function(resolve) {
      
      var source = self.constructor,
          type = source.modelName || source.typeKey,
          queue = [];
      
      var double = self.get('store').createRecord(type, {});
      
      Ember.Logger.log(`[Duplicator] create new '${type}'`,double.get('id'));
      
      source.eachAttribute(function(attribute) {
        switch(Ember.typeOf(options[attribute])) {

         case 'undefined':
           double.set(attribute, self.get(attribute));
           break;

         case 'null':
           double.set(attribute, null); // NOTE: or stay it undefined ?
           break;

         default:
           double.set(attribute, options[attribute]);
           break;
        }
      });

      source.eachRelationship(function(relationName, meta) {
        
        let relation = self.get(relationName),
            relationType = Ember.typeOf(options[relationName]);
        
        if (relation && relationType !== 'null') {

          let passedOptions = {};

          if (relationType === 'instance' || relationType === 'array') {
            double.set(relationName, options[relationName]);
            return;
          } else if (relationType === 'object') {
            passedOptions = options[relationName];
          }
          
          switch (relation.constructor) {

            case DS.PromiseObject:
              queue.push(relation.then(function(_object) {
                return _object.duplicate(passedOptions).then(function(_double) {
                   double.set(relationName, _double);
                });
              }));              
              break;

            case DS.PromiseManyArray:           
              queue.push(relation.then(function(objects) {
                let _queue = objects.map(function(object) {
                      var _passedOptions = {};
                      object.eachRelationship(function(_relationName, _meta) {
                        if (_meta.kind === 'belongsTo') {
                          if (object.get(_relationName).content === self) {
                            _passedOptions[_relationName] = double;
                          }
                        }
                      });
                      return object.duplicate(_passedOptions);
                    });

                return Ember.RSVP.all(_queue).then(function(doubles) {
                  double.get(relationName).then(function(object) {
                    object.setObjects(doubles);
                  });
                });
              }));
              break;

            default:
              if (meta.kind === 'belongsTo') {              
                queue.push(relation.duplicate(passedOptions).then(function(_double) {
                  double.set(relationName, _double);
                }));                                                            
              } else {               
                var objects = relation.map(function(object) {
                  return object.duplicate(passedOptions);
                });                
                queue.push(Ember.RSVP.all(objects).then(function(_objects) {
                  double.get(relationName).then(function(_double) {
                    _double.setObjects(_objects);
                  });
                }));                
              }
              break;
          }
        }
      });
      
      Ember.RSVP.all(queue).then(function() {
        resolve(double);
      });
      
    });
  },
  
/**
 * Deep unload model with all relationships
 * @param {Array} upwards — attributes which should not be attempted to unload
 * @memberof duplicator
 */
  deepUnload: function(upwards) {
    
    var self = this,
        store = self.get('store'),
        modelName = self.constructor.modelName;
    
    upwards = upwards || [];
    Ember.Logger.log(`[Duplicator] deepUnload '${modelName}'`, self.id);
    self.eachRelationship(function(relationName, relationship) {
      if (upwards.indexOf(relationName) === -1) {
        if (relationship.kind === "belongsTo") {
          self.get(relationName).deepUnload(upwards);
        }
        if (relationship.kind === "hasMany") {
          var relations = self.get(relationName).map(function(relation) {
            return relation;
          });
          for(let i=relations.length-1; i>=0; i--) {
            relations[i].deepUnload(upwards); //[modelName]
          }
        }
      }
    });
    store.unloadRecord(self);
  }
});
