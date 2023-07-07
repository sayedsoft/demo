 <script setup lang="ts">
 import { ref } from 'vue'
 import { useRouter, useRoute } from 'vue-router'
 import { useHead } from '@vueuse/head'
 import { useApi } from '../composable/useApi'
 import { AxiosResponse } from 'axios'
 import { useNotyf } from '../composable/useNotyf'
 import { useUserSession } from '../stores/userSession'
 
 const userSession = useUserSession()
 const router = useRouter()
 const isLoading = ref(false)
 const notyf = useNotyf()
 
 const checkVerify = async () => {
   try {
     const api = useApi()
     const user = await api.post('/me')
     if (user.data.hasVerifiedEmail) {
       userSession.setUser(user.data.user)
       router.push({ name: 'app' })
     }
   } catch (error) { }
 }
 
 checkVerify()
 
 const resendEmail = async () => {
   const api = useApi()
   isLoading.value = true
   try {
     const data: AxiosResponse = await api.post<any[]>('/email/verify/resend')
     notyf.success(data.data.message)
   } catch (error: any) {
     console.log(error)
     notyf.dismissAll()
     notyf.error('Bir Hata Oluştu bir daha deneyiniz')
   } finally {
     isLoading.value = false
   }
 }
 
 
 const logout = () => {
   userSession.logoutUser()
   router.push({ name: 'auth' })
 }
 
 setInterval(() => {
   //checkVerify()
 }, 1500)
 
 useHead({
   title: 'Email verify',
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
                    <a href="#" class="">
                      <img src="/src/assets/images/youdex.svg" alt="" height="50" class="auth-logo logo-dark mx-auto">
                      <img src="/src/assets/images/youdex.svg" alt="" height="50" class="auth-logo logo-light mx-auto">
                    </a>
                  </div>
                </div>
                <div class="p-3 text-center">
                  <h4 class="font-size-18 text-muted mt-2 text-center">Verify your mail</h4>
                  <p class="text-muted text-center mb-4">Go to mailbox and click verify mail!.</p>

                  <b-button variant="primary" v-if="isLoading" disabled>
                    <b-spinner small></b-spinner>
                    <span class="visually-hidden">Loading...</span>
                  </b-button>

                  <b-button class="mx-1" @click="resendEmail()" v-if="!isLoading" variant="success">Resend</b-button>



                </div>
              </div>
              <!-- end cardbody -->
            </div>
            <!-- end card -->
            <div class="mt-5 text-center">
              <p>Don't want?<a @click="logout()" class="fw-bold text-primary"> Logout
                  Now </a></p>
              <p>©
                2023 All copyrights reserved by Youdex.
              </p>
            </div>

          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>

  </AuthLayout>

</template>