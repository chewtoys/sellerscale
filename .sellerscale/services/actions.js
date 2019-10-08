import Logdown from 'logdown';
import Analytics from '@/services/analytics';

const logger = new Logdown('app.actions');
const queue = [];
const UNITE_TIME = 3000;

let index = -1;
let promise;

const LIMIT = 1000;

function normalize() {
  if (queue.length > LIMIT) {
    queue.shift();
    index -= 1;
  }
}

function blur() {
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

const Actions = {
  async do(id, redo, undo, element) {
    const timestamp = Date.now();

    // if (promise) {
    //   promise = promise.then(() => this.do(id, redo, undo, element));
    //
    //   return promise;
    // }

    // promise = redo();

    // await promise;

    // promise = null;

    redo();

    const previousAction = queue[index];

    if (previousAction && previousAction.id === id
      && timestamp - previousAction.timestamp <= UNITE_TIME) {
      queue.splice(index);
      queue.push({
        id,
        redo: async () => redo(),
        undo: previousAction.undo,
        element,
        timestamp,
      });
    } else {
      index += 1;
      queue.splice(index);
      queue.push({
        id,
        redo: async () => redo(),
        undo: async () => undo(),
        element,
        timestamp,
      });
    }

    normalize();

    return true;
  },
  async undo() {
    // temporarily disable async actions
    // if (promise) {
    //   return promise.then(() => this.undo());
    // }

    logger.info('undo');

    if (queue[index]) {
      const id = queue[index].id;
      logger.info('undo done', id);

      Analytics.event('actions:undo', { id });

      blur();
      promise = queue[index].undo();

      await promise;

      promise = null;

      index -= 1;
      return true;
    }

    logger.info('undo empty');
    return false;
  },
  async redo() {
    // temporarily disable async actions
    // if (promise) {
    //   return promise.then(() => this.undo());
    // }

    if (queue[index + 1]) {
      const id = queue[index + 1].id;
      logger.info('redo done', id);

      Analytics.event('actions:redo', { id });

      blur();
      promise = queue[index + 1].redo();

      await promise;

      promise = null;
      index += 1;
      return true;
    }

    logger.info('redo empty');
    return false;
  },
  reset() {
    logger.info('reset');
    queue.splice(0); // empty queue
    index = -1;
  },
  delete(pattern) {
    const newQueue = queue.filter(action => !action.id.startsWith(pattern));

    queue.splice(0);
    queue.push(...newQueue);

    index = queue.length - 1;
  },
};

const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

document.body.addEventListener('keydown', (evt) => {
  const mainKey = isMacLike ? evt.metaKey : evt.ctrlKey;
  const activeElement = document.activeElement;

  if (evt.altKey || !mainKey) return;

  if ((activeElement.tagName === 'INPUT'
    && activeElement.type !== 'tel' && activeElement.type !== 'checkbox')
    || activeElement.tagName === 'TEXTAREA') return;

  if (evt.key === 'z' && !evt.shiftKey) {
    Actions.undo();
    evt.preventDefault();
  } else if ((evt.key === 'z' && evt.shiftKey)
    || (evt.key === 'y' && !evt.shiftKey)) {
    Actions.redo();
    evt.preventDefault();
  }
});

export default Actions;
