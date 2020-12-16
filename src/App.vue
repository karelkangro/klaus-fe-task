<template>
  <router-view />
</template>

<style lang="scss">
@font-face {
  font-family: "SF Pro Text Regular";
  font-weight: 400;
  src: url("./assets/fonts/SFProText-Regular.ttf");
}

:root {
  // border radius
  --border-radius-4: 0.25rem;
  --border-radius-8: 0.5rem;
  // spacing
  --space-0-25: 0.25rem;
  --space-0-5: 0.5rem;
  --space-0-75: 0.75rem;
  --space-1: 1rem;
  --space-1-25: 1.25rem;
  --space-1-5: 1.5rem;
  --space-2: 2rem;
  --space-2-5: 2.5rem;
  --space-3: 3rem;
  --space-4: 4rem;
  --space-5: 5rem;
  --space-6: 6rem;
  --space-8: 8rem;
  --space-10: 10rem;
  --space-12: 12rem;
  --space-16: 16rem;
  --space-20: 20rem;
  --space-24: 24rem;
  --space-32: 32rem;
  --space-40: 40rem;
  --space-48: 48rem;
  --space-56: 56rem;
  --space-64: 64rem;
}

html,
body {
  font-size: var(--font-size-base);
}
body {
  background: var(--gray-20);
  margin: 0;
}

ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}

button {
  cursor: pointer;
}

#app {
  font-family: "SF Pro Text Regular", Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-weight: 500;
  font-size: var(--text-lg);
  color: var(--gray-90);
}
</style>
