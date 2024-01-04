import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { set, get, computed } from '@ember/object';
import layout from '../../templates/components/form-fields/radio-field';

import { humanize } from '../../utils/strings';

import { or } from '@ember/object/computed';

const RadioFieldComponent = Component.extend({
  tagName: '',
  layout,

  control: 'one-way-radio',

  config: service('ember-form-for/config'),

  modelName: or('object.modelName', 'object.constructor.modelName'),

  update(object, propertyName, value) {
    set(object, propertyName, value);
  },

  labelText: computed('value', 'label', 'i18n.locale', function() {
    let i18n = this.i18n;
    let label = this.label;

    if (isPresent(label)) {
      return label;
    } else if (isPresent(i18n)) {
      return i18n.t(this.labelI18nKey);
    } else {
      return this.label || humanize(this.value);
    }
  }),

  labelI18nKey: computed('config.i18nKeyPrefix', 'modelName', 'propertyName', 'value', function() {
    let value = this.value;

    if (isPresent(value)) {
      value = dasherize(value.toString());
    }

    return [
      get(this, 'config.i18nKeyPrefix'),
      dasherize(this.modelName || ''),
      dasherize(this.propertyName || ''),
      value
    ].filter((x) => !!x)
      .join('.');
  })
});

RadioFieldComponent.reopenClass({
  positionalParams: ['propertyName', 'value']
});

export default RadioFieldComponent;
