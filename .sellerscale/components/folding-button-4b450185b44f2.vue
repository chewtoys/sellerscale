<template>
  <div
    class="folding-button"
    role="button"
    @click="toggle()"
    tabindex="0">
    <nu-icon
      :name="value ? 'chevrons-right' : 'chevrons-left'"
      size="1.5">
    </nu-icon>
  </div>
</template>

<script>
export default {
  name: 'folding-button',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle');
    },
  },
};
</script>

<style scoped>
.folding-button {
  --folder-background-color: rgba(255, 255, 255, .1);

  display: grid;
  position: absolute;
  width: 2rem;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 0;
  margin: 0;
  color: inherit;
  border: 0;
  background-color: var(--folder-background-color);
  font-size: 1rem;
  place-content: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: color var(--nu-theme-animation-time) linear,
    background-color var(--nu-theme-animation-time) linear,
    box-shadow var(--nu-theme-animation-time) linear,
    border-color var(--nu-theme-animation-time) linear;
  box-shadow: 0 0 0 calc(1rem / 8) transparent inset;
}

.folding-button:not(:hover):not(:focus) {
  --color: var(--nu-theme-background-color);
}

.folding-button:hover, .folding-button:focus {
  --folder-background-color: var(--nu-minor-background-color);
  color: var(--nu-theme-color);
}

.folding-button:focus {
  outline: none;
  box-shadow: 0 0 0 calc(1rem / 8) var(--nu-theme-border-color) inset;
}
</style>
