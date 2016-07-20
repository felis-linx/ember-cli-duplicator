# Ember-cli-duplicator
[![Code Climate](https://codeclimate.com/github/felis-linx/ember-cli-duplicator/badges/gpa.svg)](https://codeclimate.com/github/felis-linx/ember-cli-duplicator)

This README outlines the details of collaborating on this Ember addon.

Duplicator mixin — create a replica of record with nested records and circular relations
and deep unload model with all relationships

Inspired by lazybensch's ember-cli-copyable

## Usage

Define your model with duplicator mixin

```javascript
import Model from 'ember-data/model';
import Duplicator from 'ember-cli-duplicator';

export default Model.extend(Duplicator, {
  define the propertyes, hasMany and belongsTo also allowed to use
});
```

```javascript
double = record.duplicate(options);
```
or
```javascript
record.duplicate(options).then(function(double) {
  your code here...
});
```


## Installation

* `npm install https://github.com/felis-linx/ember-cli-duplicator`
* and then import the mixin wherever you need it:
```
import Duplicator from 'ember-cli-duplicator';
```

## Contributing

If you want to contribute to this module.

* `git clone https://github.com/felis-linx/ember-cli-duplicator`
* `cd ember-cli-duplicator`
* `npm install`
* `bower install`
* `ember test`

