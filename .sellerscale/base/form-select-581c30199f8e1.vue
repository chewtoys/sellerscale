<template>
  <MiSelect
    v-if="fieldSchema"
    :options="fieldSchema.options"
    width="100%"
    height="2.5"
    maxHeight="20"
    :value="value"
    @input="setValue"/>
</template>

<script>
import MiFormInput from './form-input.vue';

export default {
  name: 'mi-form-select',
  extends: MiFormInput,
  methods: {
    setValue(value) {
      this.value = value;
    },
  },
  computed: {
    selectedOption() {
      return this.fieldSchema.options.find(option => option.value === this.value);
    },
  },
};
</script>
