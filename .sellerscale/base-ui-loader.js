import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const requireComponent = require.context(
  // The relative path of the components folder
  './base',
  // Whether or not to look in subfolders
  false,
  // The regular expression used to match base component filenames
  /\w+\.vue$/,
);

requireComponent.keys().forEach((fileName) => {
  // Get component config
  const componentConfig = requireComponent(fileName);

  // Get PascalCase name of component
  const componentName = upperFirst(camelCase(componentConfig.default.name));

  // Register component globally
  Vue.component(
    componentName,
    componentConfig.default || componentConfig,
  );
});
