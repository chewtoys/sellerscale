<template>
  <nu-block class="mi-form-error" v-if="validation">
    <MiContent
      class="mi-form-error-inner">
      <slot></slot>
      {{ showError ? errors[0] : '' }}
    </MiContent>
  </nu-block>
</template>

<script>
import { fieldErrorsComputed } from '@/helpers/form.helper';

export default {
  name: 'mi-form-error',
  inject: ['getFormValidation', 'getFormSchema'],
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      validation: undefined,
      formSchema: undefined,
    };
  },
  computed: {
    errors: fieldErrorsComputed,
    showError() {
      return this.validation.$dirty && this.validation.$invalid;
    },
  },
  mounted() {
    this.validation = this.getFormValidation()[this.name];
    this.formSchema = this.getFormSchema();
  },
};
</script>

<style scoped>
.mi-form-error {
  height: 1.5rem;
}

.mi-form-error-inner {
  color: var(--danger-color);
  height: 1.2rem;
  font-size: var(--size-very-small);
}
</style>
