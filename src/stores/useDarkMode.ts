import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'

export type UserData = Record<string, any> | null

export type Mode = 'dark' | 'light'


export const useDarkMode = defineStore('darkMode', () => {
  // token will be synced with local storage
  // @see https://vueuse.org/core/usestorage/

  /**
   * Auth
   */
  const darkmode = useStorage('darkmode', 'dark')


  function changeMode(mode: Mode) {
    if (mode == 'dark') darkmode.value = 'ligt'
    else darkmode.value = 'dark'
  }


  return {
    useDarkMode,
    changeMode
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
  import.meta.hot.accept(acceptHMRUpdate(useDarkMode, import.meta.hot))
}
