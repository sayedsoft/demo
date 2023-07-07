<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useApi } from '../composable/useApi'
import { useUserSession } from '../stores/userSession'
const userSession = useUserSession()
const router = useRouter()

try {
  const api = useApi()
  const user = await api.post('/me')
  if (!user.data.hasVerifiedEmail) {
    window.location.reload()
  } else {
    router.push({ name: 'app' })
  }
} catch (error) {
  router.push({ name: 'auth' })
  userSession.logoutUser()
}
</script>

<template></template>