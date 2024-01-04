import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../templates/components/form-errors';

export default Component.extend({
  layout,
  tagName: '',

  limitedErrors: computed('errors.[]', 'maxErrors', function() {
    let errors = this.errors;
    let maxErrors = this.maxErrors;

    if (maxErrors) {
      return errors.slice(0, maxErrors);
    }

    if (typeof errors === 'string') {
      errors = [errors];
    }

    return errors;
  }),

  joinedErrorClasses: computed('errorClasses', function() {
    return (this.errorClasses || []).join(' ');
  })
});
