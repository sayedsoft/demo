 <script setup lang="ts">
 import { ref } from 'vue'
 import { useRouter, useRoute } from 'vue-router'
 import { useHead } from '@vueuse/head'
 import { useApi } from '../composable/useApi'
 import { AxiosResponse } from 'axios'
 import { useNotyf } from '../composable/useNotyf'
 import { useUserSession } from '../stores/userSession'
 import AuthLogo from '../components/AuthLogo.vue'
 
 const userSession = useUserSession()
 const router = useRouter()
 const isLoading = ref(false)
 const notyf = useNotyf()
 
 useHead({
   title: 'Not found',
 })
 </script>

<template>


  <AuthLayout>

    <div class="account-pages my-5 pt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body">
                <div class="text-center mt-4">
                  <div class="mb-3">
                    <AuthLogo></AuthLogo>
                  </div>
                </div>
                <div class="p-3 text-center">
                  <h4 class="font-size-18 text-muted mt-2 text-center">Under contract</h4>


                  <b-button to="/" variant="primary" class="mt-4">
                    Go to home
                  </b-button>



                </div>
              </div>
              <!-- end cardbody -->
            </div>
            <!-- end card -->


          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>

  </AuthLayout>

</template>