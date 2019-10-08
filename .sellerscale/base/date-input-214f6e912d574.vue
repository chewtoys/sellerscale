<template>
  <MiDropdown
    ref="dropdown"
    class="mi-date-input"
    popupWidth="18"
    :plain="plain"
    :drop="drop"
    :border="border"
    :padding="padding"
    :cell="cell">
    <div class="-nu-center">
      {{ value }}
    </div>
    <template v-slot:content>
      <DatePicker :locale="$i18n.locale" :value="value" @input="select"/>
    </template>
  </MiDropdown>
</template>

<script>
import Logdown from 'logdown';
import DatePicker from '@/components/date-picker.vue';

const logger = new Logdown('mi-date-input');

export default {
  name: 'mi-date-input',
  props: {
    value: {},
    cell: Boolean,
    padding: {},
    border: {},
    drop: String,
    plain: Boolean,
  },
  inject: {
    cellContext: {
      name: 'cellContext',
      default: false,
    },
  },
  created() {
    if (this.cellContext && this.cell) {
      this.cellContext.setPadding(0);
    }
  },
  methods: {
    close() {
      this.$refs.dropdown.close();
    },
    select(value) {
      logger.info(`date-picker \`${value}\``);

      this.$emit('input', value);

      this.close();
    },
  },
  computed: {
    selected() {
      if (this.value != null) {
        return this.options.find(option => option[this.primary] === this.value);
      }

      return null;
    },
  },
  components: {
    DatePicker,
  },
};
</script>
