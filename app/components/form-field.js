import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { assert } from '@ember/debug';
import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import { isPresent, isEmpty } from '@ember/utils';
import Ember from 'ember';
import layout from '../templates/components/form-field';

import { humanize } from '../utils/strings';

const {
  mixin
} = Ember;
import { or, reads, notEmpty } from '@ember/object/computed';
import {
  get,
  set,
  observer,
  getWithDefault,
  computed
} from '@ember/object';

const FormFieldComponent = Component.extend({
  layout,

  config: service('ember-form-for/config'),

  _defaultErrorsProperty: 'errors',
  errorsProperty: or('config.errorsProperty', '_defaultErrorsProperty'),

  errorsPath(propertyName) {
    let errorsPath = this.get('config.errorsPath');
    let errorsProperty = this.errorsProperty;

    if (!isPresent(errorsPath)) {
      errorsPath = `${errorsProperty}.PROPERTY_NAME`;
    }

    return errorsPath.replace('PROPERTY_NAME', propertyName);
  },

  classNameBindings: [],

  concatenatedProperties: [
    'inputClasses',
    'labelClasses',
    'hintClasses',
    'errorClasses'
  ],

  control: 'one-way-input',

  init() {
    this._super(...arguments);

    let fieldClasses = get(this, 'config.fieldClasses');

    this.classNames = this.classNames.concat(fieldClasses);

    this.classNameBindings = this.classNameBindings.slice();
    this.classNameBindings.push(`hasErrors:${get(this, 'config.fieldHasErrorClasses')}`);

    this.propertyNameDidChange();
  },

  didReceiveAttrs() {
    this._super(...arguments);

    ['inputClasses', 'labelClasses', 'hintClasses', 'errorClasses'].forEach(
      (type) => {
        set(
          this,
          `_${type}`,
          (get(this, type) || []).concat(get(this, `config.${type}`))
        );
      }
    );

    assert('{{form-field}} requires an object property to be passed in',
      this.object != null);

    assert('{{form-field}} requires the propertyName property to be set',
      typeof this.propertyName === 'string');

    set(this, 'modelName', this.getModelName());
  },

  propertyNameDidChange: observer('propertyName', 'errorsProperty', function() {
    let propertyName = this.propertyName;
    let errorsPath = `object.${this.errorsPath(propertyName)}`;

    mixin(this, {
      rawValue: reads(`object.${propertyName}`),
      errors: reads(errorsPath),
      hasErrors: notEmpty(errorsPath)
    });
  }),

  update(object, propertyName, value) {
    set(object, propertyName, value);
  },

  labelText: computed('propertyName', 'label', 'i18n.locale', function() {
    let i18n = this.i18n;
    let label = this.label;

    if (isPresent(label)) {
      return label;
    } else if (isPresent(i18n)) {
      return i18n.t(this.labelI18nKey);
    } else {
      return humanize(this.propertyName);
    }
  }),

  labelI18nKey: computed('config.i18nKeyPrefix', 'modelName', 'propertyName', function() {
    return [
      get(this, 'config.i18nKeyPrefix'),
      dasherize(this.modelName || ''),
      dasherize(this.propertyName || '')
    ].filter((x) => !!x)
      .join('.');
  }),

  fieldId: computed('object', 'form', 'propertyName', function() {
    let baseId = this.form || this.elementId;
    return `${baseId}_${this.propertyName}`;
  }),

  fieldName: computed('object', 'modelName', 'propertyName', function() {
    return `${this._nameForObject()}[${this.propertyName}]`;
  }),

  describedByValue: computed('hint', 'errors.[]', 'fieldId', function() {
    let ids = [];
    let hint = this.hint;
    let errors = this.errors;
    let fieldId = this.fieldId;

    if (isPresent(hint)) {
      ids.push(`${fieldId}_hint`);
    }

    if (isPresent(errors)) {
      errors.forEach((_, index) => {
        ids.push(`${fieldId}_error-${index}`);
      });
    }

    return isEmpty(ids) ? null : ids.join(' ');
  }),

  _nameForObject() {
    return this.modelName || guidFor(this.object);
  },

  getModelName() {
    let formName = this.form;
    let modelName = get(this, 'object.modelName');
    let constructorName = get(this, 'object.constructor.modelName');
    let changesetConstructorName = get(this, 'object._content.constructor.modelName');

    return formName || modelName || constructorName || changesetConstructorName;
  },

  value: computed('rawValue', function() {
    let serializeValue = this.serializeValue || ((value) => (value));
    return serializeValue(this.rawValue);
  }),

  actions: {
    processUpdate(object, propertyName, value) {
      let rawValue = this.rawValue;
      let deserializeValue = this.deserializeValue || ((value) => (value));
      this.update(object, propertyName, deserializeValue(value, rawValue));
    }
  }
});

FormFieldComponent.reopenClass({
  positionalParams: ['propertyName']
});

export default FormFieldComponent;
