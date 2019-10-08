<template>
  <div
    class="mi-content mi-panel"
    :style="`
      place-content: start stretch;
      place-self: stretch;
    `">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'mi-content',
  props: {
    textAlign: String,
    contents: String,
  },
};
</script>

<style scoped>
.mi-content >>> h1:not(:first-child),
.mi-content >>> h2:not(:first-child),
.mi-content >>> h3:not(:first-child),
.mi-content >>> h4:not(:first-child),
.mi-content >>> h5:not(:first-child),
.mi-content >>> h6:not(:first-child) {
  margin-top: 1rem;
}

.mi-content >>> h1 {
  font-size: 2rem;
  line-height: 2.5rem;
}

.mi-content >>> h2 {
  font-size: 1.8rem;
  line-height: 2.5rem;
}

.mi-content >>> h3 {
  font-size: 1.6rem;
  line-height: 2.5rem;
}

.mi-content >>> h4 {
  font-size: 1.4rem;
  line-height: 2rem;
}

.mi-content >>> h5 {
  font-size: 1.2rem;
  line-height: 1.5rem;
}

.mi-content >>> h6 {
  font-size: 1rem;
  line-height: 1.5rem;
}

.mi-content >>> a {
  color: var(--main-color);
  white-space: nowrap;
  transition: color var(--nu-theme-animation-time) linear;
  text-decoration: none;
}

.mi-content >>> a:hover {
  color: var(--nu-minor-color);
  text-decoration: none;
}

.mi-content >>> a:focus {
  outline: none;
  text-decoration: underline;
}

.mi-content >>> a:focus:not(:hover) {
  color: var(--main-color);
}

.mi-content >>> .mi-icon {
  vertical-align: text-top;
}
</style>
