import { defineAsyncComponent } from 'vue'
import { START_LOCATION } from 'vue-router'
import { useApi } from './composable/useApi'

import { useNotyf } from './composable/useNotyf'
import { getRemoteApp, useGlobalState } from './stores/appSettings'

import { useUserSession } from './stores/userSession'



// Lazy load aditional components
export async function registerGlobalComponents({ app }: any) {
  const background = (await import('./directives/background')).default
  const tooltip = (await import('./directives/tooltip')).default


  app.component(

    'Multiselect',
    defineAsyncComponent({
      loader: () => import('@vueform/multiselect').then((mod) => mod.default),
      delay: 0,
      suspensible: false,
    })
  )
  app.component(

    'Slider',
    defineAsyncComponent({
      loader: () => import('@vueform/slider').then((mod) => mod.default),
      delay: 0,
      suspensible: false,
    })

  )

  app.directive('background', background)
  app.directive('tooltip', tooltip)
}

/**
 * Here we are setting up two router navigation guards
 *
 * We can add meta to pages either by declaring them manualy in the
 * routes declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */


export async function registerRouterNavigationGuards({ router, api }: any) {

  const userSession = useUserSession()
  const notyf = useNotyf()


  router.beforeEach(async (to: any, from: any) => {



    if (to.name == 'login-admin') return


    if (to.meta.requiresNotAuth && userSession.isLoggedIn) {



      return {
        // Will follow the redirection set in /@src/pages/app/index.vue
        name: 'app',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }

    if (from === START_LOCATION && userSession.isLoggedIn) {
      // 1. If the name is not set, it means we are navigating to the first page
      // and we are logged in, so we should check user information from the server
      try {
        // Do api request call to retreive user profile.
        // Note that the api is provided with json-server
        userSession.setLoading(true);
        const { data: user } = await api.post('/me')
        userSession.setUser(user.user)
        userSession.setLoading(false);
        if (!user.user.hasVerifiedEmail && to.name != 'mustverifyemail') {
          return {
            // Will follow the redirection set in /@src/pages/auth/index.vue
            name: 'mustverifyemail',
          }
        }

      } catch (err) {
        console.error(err)
        // delete stored token if it fails
        userSession.logoutUser()
        notyf.error('Your session is invalid')

        if (to.meta.requiresAuth) {
          // redirect the user somewhere
          return {
            // Will follow the redirection set in /@src/pages/auth/index.vue
            name: 'auth',
            // save the location we were at to come back later
            query: { redirect: to.fullPath },
          }
        }
      }

    } else if (to.meta.requiresAuth && !userSession.isLoggedIn) {

      // 2. If the requires auth via requiresAuth meta, check if user is logged in
      // if not, redirect to login page.
      notyf.error({
        message: 'Sorry, you should loggin to access this section (anything will work)',
        duration: 7000,
      })

      return {
        // Will follow the redirection set in /@src/pages/auth/index.vue
        name: 'auth',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }

  })
}
