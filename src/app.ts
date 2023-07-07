import { createApp as createClientApp, h, Suspense } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import { createRouter } from './router'
import VueroApp from './App.vue'
import { createApi } from '/@src/composable/useApi'
import BootstrapVue3 from 'bootstrap-vue-3'
import Vue3Lottie from 'vue3-lottie'
import Donut from 'vue-css-donut-chart';


import './styles'


export type VueroAppContext = Awaited<ReturnType<typeof createApp>>

import { registerGlobalComponents, registerRouterNavigationGuards } from './app-custom'

export async function createApp() {
  const head = createHead()
  const router = createRouter()
  const pinia = createPinia()
  const api = createApi()

  const app = createClientApp({
    // This is the global app setup function
    setup() {

      return () => {

        return h(Suspense, null, {
          default: () => h(VueroApp),
        })
      }
    },
  })

  const vuero = {
    app,
    api,
    router,
    head,
    pinia,
  }


  app.use(BootstrapVue3);

  app.use(Vue3Lottie);

  await registerGlobalComponents(vuero)
  app.use(vuero.pinia)
  app.use(vuero.head)

  await registerRouterNavigationGuards(vuero)

  app.use(vuero.router)


  app.use(Donut);

  return vuero
}
