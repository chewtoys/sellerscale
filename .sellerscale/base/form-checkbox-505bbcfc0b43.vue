<template>
  <MiCheckbox
    :id="id"
    v-if="fieldSchema"
    :label="false"
    :value="value"
    @input="setValue"/>
</template>

<script>
import MiFormInput from './form-input.vue';

export default {
  name: 'mi-form-checkbox',
  extends: MiFormInput,
  methods: {
    setValue(value) {
      this.value = value;
    },
  },
};
</script>
