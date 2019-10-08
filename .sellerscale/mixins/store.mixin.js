import lockr from 'lockr';

function setProp(namespace, prop, value) {
  lockr.set(`${namespace}:${prop}`, value);
}

function getProp(namespace, prop) {
  return lockr.get(`${namespace}:${prop}`);
}

export default function StoreMixin(props) {
  return {
    data() {
      return Object.keys(props)
        .reduce((obj, prop) => {
          const stored = getProp(this.$options.name, prop);

          if (stored != null) {
            /* eslint-disable no-param-reassign */
            obj[prop] = stored;
          }

          return obj;
        }, { ...props });
    },
    created() {
      Object.keys(props)
        .forEach((prop) => {
          this.$watch(prop, (value) => {
            setProp(this.$options.name, prop, value);
          });
        });
    },
  };
}

export function getStoredProp(name, prop) {
  return getProp(name, prop);
}
