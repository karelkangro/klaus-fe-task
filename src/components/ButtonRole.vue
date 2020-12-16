<template>
  <button
    :class="[
      'button-role',
      { 'button-role--admin': role === 'ADMIN' },
      { 'button-role--agent': role === 'AGENT' },
      { 'button-role--account': role === 'ACCOUNT_MANAGER' },
      { 'button-role--external': role === 'EXTERNAL_REVIEWER' }
    ]"
  >
    {{ parsedRole }}
  </button>
</template>

<script>
import { parsedString } from "@/utils";

export default {
  name: "button-role",
  props: {
    role: String
  },
  computed: {
    parsedRole() {
      return parsedString(this.role);
    }
  }
};
</script>

<style lang="scss">
.button-role {
  border: none;
  border-radius: var(--border-radius-4);
  height: 1.5rem;
  padding-left: var(--space-0-5);
  padding-right: var(--space-0-5);
  font-size: var(--text-xs);

  &--admin {
    background: var(--purple-20);
  }
  &--agent {
    background: var(--blue-20);
  }
  &--account {
    background: var(--pink-20);
  }
  &--external {
    background: var(--orange-20);
  }
}
</style>
