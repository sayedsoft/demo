<route lang="yaml">
meta:
  requiresNotAuth: true
</route>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'
import { useApi } from '/@src/composable/useApi'
import { AxiosError, AxiosResponse } from 'axios'
import { LoginData } from '/@src/data/types'

const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const notif = useNotyf()
const userSession = useUserSession()
const token = route.query.token as string


/*

const login = (async () => {
  if (isLoading.value) {
    return
  }
  const api = useApiWithToken(token)
  isLoading.value = true
  try {
    const data:AxiosResponse = await api.post('me')
    userSession.setToken(data.data.access_token)
    userSession.setUser(data.data.user)
    userSession.setRefCode(data.data.referral_code)
    router.replace({ name: 'app' })
    setTimeout( () => { location.reload() },1000 )
    
  } catch (error: any) {
    notif.dismissAll()
    if (error.response.status == 401) {
      notif.error(error.response.data.message)
    } else {
      notif.error('Bir Hata Oluştu bir daha deneyiniz')
    }
  } finally {
    isLoading.value = false
  }
})
login()
*/


</script>

<template></template>