/* eslint-disable import/prefer-default-export */
import Logdown from 'logdown';

const logger = new Logdown('app.window');

const APP_NAME = 'Sellerscale';

export function setTitle(title) {
  document.title = `${title} – ${APP_NAME}`;
}

export function focus(selector) {
  if (typeof selector === 'string') {
    const element = document.querySelector(selector);

    if (element) {
      element.focus();
      logger.info('element focused', element);
    } else {
      logger.info('no element to focus', selector);
    }
  } else {
    selector.focus();
  }
}

export function scrollBlock(bool) {
  if (bool) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

export function scrollTop() {
  window.scrollTo(0, 0);
}

export function clearSelection() {
  if (window.getSelection().empty) {
    window.getSelection().empty();
  } else if (window.getSelection().removeAllRanges) {
    window.getSelection().removeAllRanges();
  }
}
