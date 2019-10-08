<template>
  <div
    class="mi-form-field"
    v-if="fieldSchema"
    :style="{
      width: widthRem,
    }">
    <MiInput
      :id="id"
      v-if="fieldSchema && fieldSchema.type !== 'numeric' && fieldSchema.type !== 'currency'"
      v-model="value"
      :name="name"
      :type="fieldSchema.type"
      :status="status"
      :disabled="disabled"
      @blur="onBlur"
      :placeholder="placeholderComputed"
      :autofocus="autofocus"/>
    <MiInputNumeric
      :id="id"
      v-else-if="fieldSchema && fieldSchema.type === 'numeric'"
      v-model="value"
      :name="name"
      :status="status"
      :schema="fieldSchema"
      :autofocus="autofocus"
      @blur="onBlur"/>
    <MiInputCurrency
      :id="id"
      v-else-if="fieldSchema && fieldSchema.type === 'currency'"
      v-model="value"
      :name="name"
      :status="status"
      :schema="fieldSchema"
      :autofocus="autofocus"
      @blur="onBlur"/>
  </div>
</template>

<script>
/**
 * @TODO
 * - Add support for `sameAs` validator.
 */

// import Logdown from 'logdown';

// const logger = new Logdown('mi-form-field');
import { unitMapper } from '@/helpers/props';

export default {
  name: 'mi-form-input',
  inject: ['getFormValidation', 'formFieldChange', 'formFieldTouch', 'getFormSchema'],
  props: {
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    width: {},
  },
  data() {
    return {
      $v: undefined,
      fieldSchema: undefined,
      formSchema: {
        fields: {},
      },
      value: '',
      dirty: false,
    };
  },
  created() {
    this.$watch('value', (newValue) => {
      this.formFieldChange(this.name, newValue);
      this.dirty = true;
    });
  },
  mounted() {
    this.$v = this.getFormValidation()[this.name];
    this.formSchema = this.getFormSchema();
    this.fieldSchema = this.formSchema.fields[this.name];

    this.value = this.fieldSchema.default;
  },
  computed: {
    status() {
      if (!this.fieldSchema.validation) return 'normal';

      if (this.success) {
        return 'success';
      } if (this.error) {
        return 'error';
      }

      return 'normal';
    },
    success() {
      return this.$v.$dirty && !this.$v.$invalid;
    },
    error() {
      return this.$v.$dirty && this.$v.$invalid;
    },
    placeholderComputed() {
      if (!this.placeholder) return undefined;

      const plKey = `placeholder.${
        this.fieldSchema.placeholder
        || ((this.formSchema.translationPrefix || '') + this.name)}`;


      if (this.$te(plKey)) {
        return this.$t(plKey);
      }

      const key = `form_field.${
        this.fieldSchema.placeholder
        || ((this.formSchema.translationPrefix || '') + this.name)}`;

      if (this.$te(key)) {
        return this.$t(key);
      }

      return this.fieldSchema.placeholder || this.name;
    },
    symbol() {
      if (this.fieldSchema.unit === 'currency') {
        return '$';
      } if (this.fieldSchema.unit === 'percent') {
        return '%';
      }

      return '';
    },
    position() {
      if (this.fieldSchema.unit === 'percent') {
        return 'suffix';
      }

      return 'prefix';
    },
    ...unitMapper(['width']),
    id() {
      return this.formSchema.id ? `${this.formSchema.id}-${this.name}` : this.name;
    },
  },
  methods: {
    onBlur() {
      if (this.dirty) {
        this.formFieldTouch(this.name);
      }
    },
  },
};
</script>

<style scoped>
.mi-form-field {
  position: relative;
  width: 100%;
}

</style>
