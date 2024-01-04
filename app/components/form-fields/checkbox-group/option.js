import Component from '@ember/component';
import { dasherize } from '@ember/string';
import { or } from '@ember/object/computed';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import layout from '../../../templates/components/form-fields/checkbox-group/option';

import { humanize } from '../../../utils/strings';

export default Component.extend({
  tagName: '',
  layout,

  config: service('ember-form-for/config'),

  modelName: or('object.modelName', 'object.constructor.modelName'),

  labelText: computed('value', 'label', 'labelI18nKey', 'i18n.locale', function() {
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
