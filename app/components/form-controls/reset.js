import ButtonComponent from './button';

export default ButtonComponent.extend({
  type: 'reset',

  click(e, ...args) {
    e.preventDefault();
    if (this.reset !== undefined) {
      this.reset(...args);
    }
  }
});
