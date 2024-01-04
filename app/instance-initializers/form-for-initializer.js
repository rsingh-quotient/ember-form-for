import config from '../config/environment';

import { set } from '@ember/object';

const DEFAULT_CONFIG = {
  buttonClasses: ['form-button'],
  fieldClasses: ['form-field'],
  fieldHasErrorClasses: ['form-field--has-errors'],
  errorClasses: ['form-field--errors'],
  hintClasses: ['form-field--hint'],
  inputClasses: ['form-field--control'],
  labelClasses: ['form-field--label'],
  resetClasses: ['form-button--reset'],
  submitClasses: ['form-button--submit']
};

export function initialize(application) {
  let formForConfig = Object.assign({}, DEFAULT_CONFIG, config['ember-form-for']);
  let configService = application.lookup('service:ember-form-for/config');

  Object.keys(formForConfig).forEach((key) => {
    set(configService, key, formForConfig[key]);
  });
}

export default {
  name: 'form-for-initializer',
  initialize
};