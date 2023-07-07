<script lang="ts" setup>
import { watch } from 'vue';
import { globalEvents } from './stores/globalEvents';
import { useUserSession } from './stores/userSession';
import { useApi } from '/@src/composable/useApi'

const globalEvent = globalEvents()
const userSession = useUserSession()
const api = useApi()



watch(globalEvent, async () => {

  if (globalEvent.globalEvent == 'updateBalance') {
    const { data: user } = await api.post('/me')
    userSession.setAccounting(user.user.accounting)
  }

  globalEvent.setEvent('updateBalanceHasDone')

})

</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade-slow" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>