<template>
  <label v-if="fieldSchema" :for="id" class="mi-form-label">
    <span class="-nu-w6">
      {{ $t(label) }}
      <nu-icon
        v-if="mark"
        theme="primary"
        size=".75" name="info" inline
        v-tooltip.main="$t('label.required_field')"/>
    </span>
  </label>
</template>

<script>
export default {
  name: 'mi-form-label',
  inject: ['getFormSchema'],
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
      fieldSchema: undefined,
    };
  },
  computed: {
    label() {
      const key = `form_field.${
        this.fieldSchema.label
        || ((this.formSchema.translationPrefix || '') + this.name)}`;

      if (this.$te(key)) {
        return this.$t(key);
      }

      return this.fieldSchema.label || this.name;
    },
    mark() {
      if (this.fieldSchema
        && this.fieldSchema.validation
        && this.fieldSchema.validation.required) {
        return true;
      }

      return false;
    },
    id() {
      return this.formSchema.id ? `${this.formSchema.id}-${this.name}` : this.name;
    },
  },
  mounted() {
    this.formSchema = this.getFormSchema();
    this.fieldSchema = this.formSchema.fields[this.name];
  },
};
</script>

<style scoped>
label {
  position: relative;
  display: block;
  padding: .5rem 0;
  margin: 0;
  line-height: 1.5;
  white-space: nowrap;
}
</style>
