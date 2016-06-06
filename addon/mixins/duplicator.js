import Ember from 'ember';
import DS from 'ember-data';
//import generateUUID from 'lptrendv2/mixins/generate-uuid'; 

/**
 * Duplicator mixin — create a replica of record with nested records and circular relations
 * and deep unload model with all relationships
 * inspired by lazybensch`s ember-cli-copyable
 *
 * @mixin duplicator
 */

export default Ember.Mixin.create(generateUUID, {
  
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
      
      var double = self.get('store').createRecord(type, {
        id : type+'-'+self.generateUUID(8) // TODO: different UUID size for models
      });
      
      Ember.Logger.info('Create new',type,'#',double.get('id'));
      
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
        
        var relation = self.get(relationName);        
        
        if (!relation) { return; }
        
        var overwrite = false, passedOptions = {};
        
        switch (Ember.typeOf(options[relationName])) {
            
          case 'null':
            return;
            
          case 'instance':
            overwrite = options[relationName];
            break;
            
          case 'object':
            passedOptions = options[relationName];
            break;
            
          case 'array':
            overwrite = options[relationName];
            break;
            
          default:
            break;
        }
        
        switch (relation.constructor) {
            
          case DS.PromiseObject:
            queue.push(relation.then(function(_object) {             
              if (overwrite) {                
                double.set(relationName, overwrite);                
              } else {                
                return _object.duplicate(passedOptions).then(function(_double) {
                   double.set(relationName, _double);
                });
              }
            }));
            break;
            
          case DS.PromiseManyArray:           
            if (overwrite) {              
              double.get(relationName).then(function(_double) {
                _double.setObjects(overwrite);
              });                            
            } else {              
              queue.push(relation.then(function(_objects) {                
                var _queue = _objects.map(function(_object) {
                  var _passedOptions = {};
                  _object.eachRelationship(function(_relationName, _meta) {
                    if (_meta.kind === 'belongsTo') {
                      if (_object.get(_relationName).content === self) {
                        _passedOptions[_relationName] = double;
                      }
                    }
                  });
                  return _object.duplicate(_passedOptions);                  
                });                
                return Ember.RSVP.all(_queue).then(function(_doubles) {
                  double.get(relationName).then(function(_object) {
                    _object.setObjects(_doubles);
                  });
                });                
              }));              
            }
            break;
            
          default:           
            if (meta.kind === 'belongsTo') {              
              if (overwrite) {            
                double.set(relationName, overwrite);                
              } else {                
                queue.push(relation.duplicate(passedOptions).then(function(_double) {
                  double.set(relationName, _double);
                }));                
              }                            
            } else {               
              if (overwrite) {                
                double.get(relationName).then(function(_double) {
                  _double.setObjects(overwrite);
                });                
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
            }
            break;
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
    Ember.Logger.info('deepunload in '+modelName, self.id);
    self.eachRelationship(function(relationName, relationship) {
      if (upwards.indexOf(relationName) === -1) {
        if (relationship.kind === "belongsTo") {
          self.get(relationName).deepUnload(upwards); //[modelName] TODO: compute what attribute is belongsTo self
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
