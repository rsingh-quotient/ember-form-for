import { inject as service } from '@ember/service';
import Config from 'ember-config/config';

const DEFAULT_CONFIG = {
  buttonClasses: ['form-button'],
  fieldClasses: ['form-field'],
  fieldHasErrorClasses: ['form-field--has-errors'],
  errorClasses: ['form-field--errors'],
  hintClasses: ['form-field--hint'],
  inputClasses: ['form-field--control'],
  labelClasses: ['form-field--label'],
  resetClasses: ['form-button--reset'],
  submitClasses: ['form-button--submit'],
};

export function initialize(application) {
  const configService = service('ember-form-for/config');
  const mergedConfig = Config.get('ember-form-for') || {};

  Object.assign(configService, {
    ...DEFAULT_CONFIG,
    ...mergedConfig,
  });
}

export default {
  name: 'form-for-initializer',
  initialize,
};
