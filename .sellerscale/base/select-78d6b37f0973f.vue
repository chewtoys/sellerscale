<template>
  <MiDropdown
    ref="dropdown"
    class="mi-select"
    :cell="cell"
    :maxHeight="maxHeight"
    :drop="drop"
    :disabled="disabled">
    <slot v-if="hasSlot('selected')" name="selected" :option="selected"></slot>
    <span v-if="selected && !hasSlot('selected')">
      {{ $t(selected.label) }}
    </span>
    <span v-if="!selected && !hasSlot('selected')">
      &nbsp;
    </span>
    <template v-slot:content>
      <nu-menu
        ref="options">
        <nu-menuitem
          v-for="option in options"
          :key="option[primary]"
          padding=".5"
          @tap="select(option[primary])">
          <nu-block v-if="hasSlot('option')" mod="ellipsis">
            <slot name="option" :option="option"></slot>
          </nu-block>
          <div v-if="!hasSlot('option')">
            {{ $t(option.label) }}
          </div>
        </nu-menuitem>
      </nu-menu>
    </template>
  </MiDropdown>
</template>

<script>
import Logdown from 'logdown';
import { hasSlot } from '@/util';
import { unitMapper } from '@/helpers/props';

const logger = new Logdown('mi-select');

export default {
  name: 'mi-select',
  props: {
    primary: {
      type: String,
      default: 'value',
    },
    options: {
      type: Array,
    },
    height: {
      default: 2.5,
    },
    maxHeight: {
      default: 15,
    },
    value: {},
    drop: {
      type: String,
      default: 'down',
    },
    cell: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    close() {
      this.$refs.dropdown.close();
    },
    select(value) {
      logger.info(`select \`${value}\``);

      this.$emit('input', value);

      setTimeout(() => this.close(), 0);
    },
    onOptionKeyDown(evt, value) {
      if (evt.which === 13) {
        this.select(value);

        setTimeout(() => {
          this.$refs.dropdown.$refs.selected.$refs.root.focus();
        });
      }
    },
    hasSlot,
  },
  computed: {
    selected() {
      if (this.value != null) {
        return this.options.find(option => option[this.primary] === this.value);
      }

      return null;
    },
  },
};
</script>

<style scoped>
.mi-select-options {
  display: flex;
  flex-flow: column nowrap;
  box-sizing: border-box;
}
</style>
