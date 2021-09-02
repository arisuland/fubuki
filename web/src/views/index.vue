<template>
  <button v-on:click="createShit">fuck</button>
</template>

<script lang="ts">
export default {
  methods: {
    createShit() {
      console.log('fuck');
      this.$store.commit('setUser', { shit: 'fuck' });
    },
  },
};
</script>
