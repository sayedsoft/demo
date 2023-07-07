import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createGlobalState, useLocalStorage, useStorage } from '@vueuse/core'
import th from '../assets/libs/@fullcalendar/core/locales/th'
import { useUserSession } from './userSession'
import { useApi } from './useApi'

export type UserData = Record<string, any> | null


export const useGlobalState = createGlobalState(
  () => useStorage('appSettings', []),
)

export async function getRemoteApp() {

  const settings = useGlobalState()
  if (settings.value.length == 0) {
    const { data: app } = await useApi().post('/app')
    settings.value = app
    return settings.value
  }
  return;
}
