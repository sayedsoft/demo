/**
 * This is a store that hold left panel state
 * It could be one of the ActivePanelId
 *
 * Using useStorage from @vueuse/core allow persistance storage accross tabs/sessions
 *
 * We can import and set activePanel anywhere in our project
 * @see /src/components/partials/toolbars/Toolbar.vue
 * @see /src/components/partials/panels/ActivityPanel.vue
 */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'


export const globalEvents = defineStore('globalEvents', () => {
  const globalEvent = useStorage<any>('global-event', 'none')

  const globalEvent2 = useStorage<any>('global-event-2', 'none')

  function setEvent2(event: any) {
    globalEvent2.value = event
  }

  function getEvent2() {
    return globalEvent2.value
  }

  function setEvent(event: any) {
    globalEvent.value = event
  }

  function getEvent() {
    return globalEvent.value
  }

  return {
    globalEvent,
    setEvent,
    getEvent,

    globalEvent2,
    setEvent2,
    getEvent2
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
  import.meta.hot.accept(acceptHMRUpdate(globalEvents, import.meta.hot))
}
