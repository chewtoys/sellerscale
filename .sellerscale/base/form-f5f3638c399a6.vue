<template>
  <nu-grid
    @keydown="onKeyDown">
    <slot
      :$invalid="$v.$invalid"
      :$valid="!$v.$invalid"
      :$pending="$v.$pending"
      :$dirty="$v.$anyDirty"
      :$changed="isFormDataChanged"
      :$formData="getFormData()"
      :$v="$v.formData">
    </slot>
  </nu-grid>
</template>

<script>
import { validationMixin } from 'vuelidate';
import cloneDeep from 'lodash/cloneDeep';
import MiPanel from '@/base/panel.vue';

export default {
  name: 'mi-form',
  mixins: [validationMixin],
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: {
      default: () => {
      },
    },
  },
  data() {
    const data = {
      initialFormData: {},
      isFormDataChanged: false,
      formValidationTimer: null,
      formData: {},
    };

    if (this.schema) {
      Object.keys(this.schema.fields)
        .forEach((key) => {
          data.formData[key] = this.value && this.value[key] != null
            ? this.value[key]
            : this.schema.fields[key].default;
        });
    }

    return data;
  },
  validations() {
    const formDataValidation = Object.keys(cloneDeep(this.schema.fields))
      .reduce((validation, key) => {
        /* eslint-disable no-param-reassign */
        validation[key] = this.schema.fields[key].validation || {};

        return validation;
      }, {});

    return { formData: formDataValidation };
  },
  watch: {
    '$v.$pending': function onPendingChange() {
      this.emitValidation();
    },
  },
  methods: {
    onSubmit(evt) {
      if (evt) {
        evt.preventDefault();
      }

      if (this.$v.formData.$invalid) {
        this.$v.formData.$touch();
      } else {
        this.$emit('submit', this.getFormData());
      }
    },
    onKeyDown(evt) {
      if (evt.which === 13) {
        this.onSubmit(evt);
      }
    },
    emitValidation() {
      this.$emit('validation', {
        invalid: this.$v.formData.$invalid,
        pending: this.$v.formData.$pending,
        valid: !this.$v.formData.$invalid,
        dirty: this.$v.formData.$anyDirty,
        changed: this.isFormDataChanged,
        data: this.getFormData(),
      });
    },
    isValid() {
      return !this.$v.formData.$invalid;
    },
    getFormData() {
      const formData = {};

      Object.keys(this.schema.fields)
        .forEach((key) => {
          formData[key] = this.formData[key];
        });

      return formData;
    },
    getFormSchema() {
      const schema = cloneDeep(this.schema);

      Object.keys(schema.fields)
        .forEach((prop) => {
          schema.fields[prop].default = this.formData[prop];
          this.initialFormData[prop] = schema.fields[prop].default;
        });

      return schema;
    },
    setChanged() {
      this.isFormDataChanged = false;

      Object.keys(this.schema.fields)
        .find((prop) => {
          if (this.formData[prop] !== this.initialFormData[prop]) {
            this.isFormDataChanged = true;

            return true;
          }

          return false;
        });
    },
    change(name, value) {
      if (this.formData[name] === value) return;

      this.formData[name] = value;

      this.setChanged();

      this.$emit('input', cloneDeep(this.formData));

      clearTimeout(this.formValidationTimer);

      this.formValidationTimer = setTimeout(() => {
        this.emitValidation();
      }, 50);
    },
  },
  provide() {
    return {
      getFormValidation: () => this.$v.formData,
      getFormSchema: () => this.getFormSchema(),
      formFieldChange: (name, value) => {
        this.change(name, value);
      },
      formFieldTouch: (name) => {
        this.$v.formData[name].$touch();
      },
      formSubmit: () => {
        this.onSubmit();
      },
    };
  },
};
</script>
