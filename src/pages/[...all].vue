<script setup lang="ts">
/**
 * This is a Vue Component that will be
 * automatically mapped to a catch allpath on vue-router (404).
 *
 * You will be able to access this page  at http://localhost:3000/non-existing-page
 *
 * Read more about routing:
 * @see /vite.config.ts
 * @see /src/router.ts
 */

import { useHead } from '@vueuse/head'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'


const route = useRoute()

onMounted(() => {
  /**
   * replacing path with a leading /404 allow us to detect this
   * on nginx to return a real 404 status code
   *
   * @see /src/nginx/vuejs.conf
   */
  if (!route.path.startsWith('/404')) {
   // window.location.href = `/404${route.fullPath}`
  }
})

useHead({
  title: `Youdex`,
  meta: [
    {
      name: 'robots',
      content: 'noindex',
    },
  ],
})
</script>


<template>
 
</template>
