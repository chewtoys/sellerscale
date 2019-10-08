// import Logdown from 'logdown';
import Supports from '@/services/supports';

// const logger = new Logdown('app.scroll-fix');

export default {
  init(cssSelector) {
    if (!Supports.chrome) return;

    this.timerId = 0;

    function handler() {
      const $els = document.querySelectorAll(cssSelector);

      // logger.info('tick');

      [...$els].forEach(($el) => {
        if (Number($el.dataset.tableScroll) === Number($el.scrollLeft)) {
          $el.style.overflowX = 'hidden';
          /* eslint-disable-next-line no-unused-expressions */
          $el.dataset.height = $el.offsetHeight; // force recalc
          $el.style.overflowX = 'auto';
          // $el.dataset.hidden = true;
          // logger.info('fix', $el);
        } else if (Number($el.dataset.tableScroll) !== Number($el.scrollLeft)) {
          $el.dataset.tableScroll = Number($el.scrollLeft);
          // $el.dataset.hidden = '';

          this.timerId = setTimeout(handler, 0);
          // logger.info('recalc', $el);
        }
      });
    }

    function onEvent() {
      if (this.timerId) {
        clearTimeout(this.timerId);
      }

      this.timerId = setTimeout(handler, 1000);
    }

    window.addEventListener('wheel', onEvent, true);
    window.addEventListener('scroll', onEvent, true);
    window.addEventListener('mousemove', onEvent, true);

    this.timerId = setTimeout(handler, 0);
  },
};
