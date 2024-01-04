import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import RSVP from 'rsvp';
import EmberObject, { observer, computed } from '@ember/object';
import Button from './button';
import layout from '../../templates/components/form-controls/submit';

import { alias } from '@ember/object/computed';

const SubmitButton = Button.extend({
  layout,
  tagName: 'button',
  type: 'submit',

  activePromise: undefined,

  classNames: ['async-button'],
  attributeBindings: ['disabled', 'type'],

  submit: alias('action'),
  default: 'Submit',
  pending: 'Submitting...',

  NON_ATTRIBUTE_BOUND_PROPS: [
    'click'
  ],

  init() {
    this._super(...arguments);
  },

  click() {
    // PromiseProxyMixin allows us to use .isPending in the templates
    // RSVP.Promise is required to handle situation when submit function
    // returns non-promise.
    this.set('activePromise', EmberObject.extend(PromiseProxyMixin).create({
      promise: new RSVP.Promise((resolve) => {
        resolve(this.submit());
      })
    }));
    return false;
  },

  disabled: computed('activePromise.isPending', function() {
    if (this.get('activePromise.isPending') === true) {
      return true;
    } else {
      return false;
    }
  }),

  resetAction: observer('reset', 'activePromise.isFulfilled', 'activePromise.isRejected', function() {
    if (this.reset && (this.get('activePromise.isFulfilled') || this.get('activePromise.isRejected'))) {
      this.set('activePromise', undefined);
    }
  })
});

SubmitButton.reopenClass({
  positionalParams: ['default']
});

export default SubmitButton;
