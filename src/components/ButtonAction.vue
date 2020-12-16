<template>
  <button :class="['button', { 'button--square': square }]">
    <slot />
    {{ name }}
  </button>
</template>

<script>
export default {
  name: "button-action",
  props: {
    name: String,
    square: Boolean
  }
};
</script>

<style lang="scss">
.button {
  width: auto;
  height: var(--space-2);
  margin-right: var(--space-0-25);
  display: flex;
  align-items: center;
  background: white;
  color: var(gray-70);
  font-weight: 500;
  font-size: var(--text-sm);
  border: 0.0625rem solid var(--gray-30);
  border-radius: var(--border-radius-4);
  padding-right: var(--space-1);
  box-shadow: var(--shadow-xs);

  svg {
    margin-right: var(--space-0-5);
  }

  &--square {
    margin: 0;
    padding: var(--space-0-5);

    svg {
      margin: 0;
    }
  }
}
</style>
