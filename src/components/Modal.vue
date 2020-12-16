<template>
  <div class="modal" v-if="isOpen">
    <div class="modal__content">
      <div class="modal__body">
        <slot />
      </div>
      <div class="modal__footer">
        <button @click="closeModal">
          {{ closeButtonLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { watch } from "vue";

export default {
  name: "modal",
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    closeButtonLabel: {
      type: String
    }
  },
  setup(props, { emit }) {
    const closeModal = () => emit("close-modal");

    const toggleBodyOverflowHidden = () => {
      if (props.isOpen) document.body.style.overflow = "hidden";
      if (!props.isOpen) document.body.style.overflow = "";
    };

    watch(
      () => props.isOpen,
      () => toggleBodyOverflowHidden()
    );

    return {
      closeModal
    };
  }
};
</script>
<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 3;

  &__content {
    display: block;
    width: 35rem;
    max-height: 100%;
    padding-bottom: var(--space-2);
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: 0 0 3.75rem 0.625rem rgba(0, 0, 0, 0.9);
    border-radius: var(--border-radius-8);
    border: 0.0625rem solid var(--color-gray);
    overflow-x: scroll;
    z-index: 2;
  }

  &__body {
    padding: var(--space-3);
  }

  &__footer {
    position: relative;
    width: 100%;
    margin-left: auto;
    bottom: var(--space-1);
    display: flex;

    button {
      font-size: var(--text-sm);
      font-weight: 500;
      background: var(--brand-50);
      min-width: 2rem;
      color: white;
      border: none;
      border-radius: var(--border-radius-4);
      padding: var(--space-1);
      margin-left: auto;
      margin-right: var(--space-1-5);
      z-index: 1;
    }
  }
}
</style>
