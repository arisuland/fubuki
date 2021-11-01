<template>
  <div class="flex container">
    <!-- navbar :D -->
    <nav
      class="items-center justify-center flex bg-gray-800 bg-opacity-90 py-4 px-12 my-4 mx-auto shadow-2xl w-full"
    ></nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      baseLanguage: 'en_US',
      description: '☔ Translation made with simplicity, yet robust.',
      languages: [
        {
          code: 'en_US',
          flag: '🇺🇸',
          full: 'English (US)',
          completed: 100, // percentage
          manager: '24008241693782017',
        },
      ],

      updatedAt: new Date(),
      createdAt: new Date(),
      owner: {
        description: 'dumb. (づ ᴗ _ᴗ)づ♡',
        updatedAt: new Date(),
        createdAt: new Date(),
        username: 'noel',
        disabled: false,

        // Admin, Owner (of this isntance), Cutie, Founder :^)
        flags: (1 << 0) | (1 << 1) | (1 << 3) | (1 << 4),
        name: 'Noel',
        id: '24008241693782017',
      },

      flags: 0, // no flags towards this project
      name: 'arisu',
    };
  },
});
</script>
