export default function ReactSwitchMixin(callback) {
  return {
    watch: {
      'User.profile.marketplace': function reactMarketplaceSwitch() {
        if (callback) {
          callback.call(this);
        } else if (this.preload) {
          this.preload();
        }
      },
    },
  };
}
