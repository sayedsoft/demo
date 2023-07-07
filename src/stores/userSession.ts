import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import th from '../assets/libs/@fullcalendar/core/locales/th'
import { useApi } from './useApi'
import { useRoute, useRouter } from 'vue-router'
import { useNotyf } from '../composable/useNotyf'
import { getRemoteApp } from './appSettings'

export type UserData = Record<string, any> | null

const notif = useNotyf()


export const useUserSession = defineStore('userSession', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/


  const token = useStorage('token', '')

  const username = useStorage('username', '')

  const referralCode = useStorage('referralCode', '')

  const lastOrders = useStorage('lastOrders', [])

  const user = ref<Partial<UserData>>()

  const accouting = ref<any>()



  const loading = ref(true)

  const userGetted = ref(true)

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')


  function setUser(newUser: Partial<any>) {
    user.value = newUser
    userGetted.value = false
    username.value = newUser.first_name
    setAccounting(newUser.accounting)
    setRefCode(newUser.referral_code)
  }

  function getUser() {
    return user.value
  }

  function getUserName() {
    return username.value

  }

  function setToken(newToken: string) {
    token.value = newToken
  }

  function setRefCode(Code: string) {
    referralCode.value = Code
  }

  function getRefCode() {
    return referralCode.value
  }



  function setAccounting(newUser: any) {
    accouting.value = newUser
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  function getAccounting() {
    return accouting.value
  }

  function getlastOrders() {
    return lastOrders.value
  }


  function setlastOrders(lastOrders) {
    lastOrders.value = lastOrders
  }

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
    username.value = undefined
    referralCode.value = undefined
  }

  function setUserSessions(data: any) {
    try {
      setToken(data.data.access_token)
      setUser(data.data.user)
    } catch (error: any) {
      throw (error)
    }
  }


  /**
   * User Spical
   */

  return {
    user,
    token,
    isLoggedIn,
    loading,
    userGetted,
    username,
    getRefCode,
    getlastOrders,
    setlastOrders,
    setAccounting,
    getAccounting,
    getUserName,
    logoutUser,
    setUser,
    getUser,
    setToken,
    setRefCode,
    setLoading,
    setUserSessions
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserSession, import.meta.hot))
}
