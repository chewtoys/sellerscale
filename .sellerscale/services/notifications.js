import lockr from 'lockr';

export const NOTIFICATIONS_THEMES = {
  info: 'primary',
  error: 'danger',
};

export const NOTIFICATIONS_ICONS = {
  info: 'info',
  error: 'alert-triangle',
};

let idCounter = 0;

/**
 * @typedef {Notification}
 * @property {String|Number} [id]
 * @property {String} message
 * @property {String} type
 * @property {Boolean} [sticky]
 * @property {Boolean} [read]
 * @property {String} [action]
 * @property {Function} [callback]
 */

const NOTIFICATION_TIMEOUT = 10000;

const Notifications = {
  items: [],
  readList: lockr.get('notifications.read') || [],
  closeList: lockr.get('notifications.close') || [],

  show(notification) {
    if (!notification.type) {
      notification.type = 'info';
    }

    const isClose = this.closeList.includes(notification.id);

    // do nothing if this notification has already been closed
    if (isClose) {
      return;
    }

    if (notification.action && !notification.callback) {
      notification.callback = () => {
        Notifications.close(notification);
      };
    }

    if (!notification.id) {
      // generate new id if it is not presented
      idCounter += 1;
      notification.id = idCounter;
    } else if (this.items.find(item => item.id === notification.id)) {
      // do nothing if it's duplicate
      return;
    }

    // check if this notification has already been read
    notification.read = this.readList.includes(notification.id);

    this.items.unshift(notification);
    this.apply();

    notification.sticky = !!notification.id && !notification.read;

    if (notification.sticky) {
      setTimeout(() => Notifications.unstick(notification, true), NOTIFICATION_TIMEOUT);
    }
  },
  info(options = {}) {
    this.show({ ...options, type: 'info' });
  },
  error(options = {}) {
    this.show({ ...options, type: 'error' });
  },
  apply() {
    this.items = [...this.items];

    lockr.set('notifications.read', this.readList);
    lockr.set('notifications.close', this.closeList);
  },
  unstick(notification, auto = false) {
    notification.sticky = false;

    if (!auto) {
      this.read(notification);
    }

    this.apply();
  },
  read(notification) {
    notification.read = true;

    if (!this.readList.includes(notification.id)) {
      this.readList.push(notification.id);
    }

    this.apply();
  },
  close(notification) {
    if (typeof notification === 'string') {
      notification = this.items.find(n => n.id === notification);
    }

    if (!notification) return;

    if (!this.items.includes(notification)) return;

    this.items.splice(this.items.indexOf(notification), 1);
    this.closeList.push(notification.id);

    this.apply();
  },
  readAll() {
    Notifications.items.forEach((notification) => {
      Notifications.unstick(notification);
      Notifications.read(notification);
    });
  },
};

export default Notifications;

window.Sellerscale = {
  ...(window.Sellerscale || {}),
  Notifications,
};
