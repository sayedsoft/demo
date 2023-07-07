<route lang="yaml">
meta:
  requiresNotAuth: true
</route>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { Field, useForm } from 'vee-validate'
import * as yup from 'yup'

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
const redirect = route.query.redirect as string

const schema = yup.object({
  email: yup
    .string()
    .required()
    .email(),
})

const { handleSubmit, setErrors } = useForm({
  validationSchema: schema,
})


const onSumbit = handleSubmit(async (values) => {
  console.table(values)
  if (isLoading.value) {
    return
  }
  const api = useApi()
  isLoading.value = true
  try {
    const data: AxiosResponse = await api.get<any[]>(
      'forgot-password?email=' + values.email
    )
    notif.success(data.data.message)
    router.push({ name: 'auth-validateresetpassword' })
  } catch (error: any) {
    notif.dismissAll()
    if (error.response.status == 401) {
      notif.error('Please check your email')
      setErrors(error.response.data)
    }
    if (error.response.status == 402) {
      notif.error(error.response.message)
    } else {
      notif.error('Please try again')
    }
  } finally {
    isLoading.value = false
  }
})


useHead({
  title: 'Youdex | Reset password',
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
                <div class="p-3">
                  <h4 class="font-size-18 text-muted mt-2 text-center">Forget password!</h4>
                  <p class="text-muted text-center mb-4">Type your email address.</p>
                  <form @submit="onSumbit" class="">
                    <Field v-slot="{ field, errorMessage }" name="email">


                      <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                        <div class="col-12">
                          <input class="form-control" v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                            type="text" required placeholder="E-mail">
                        </div>
                        <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                          aria-hidden="false">
                          <li class="parsley-required">{{ errorMessage }}</li>
                        </ul>

                      </div>



                    </Field>


                    <div class="row mb-4 mt-4">
                      <div class="col-12">
                        <b-button variant="primary" v-if="isLoading" disabled>
                          <b-spinner small></b-spinner>
                          <span class="visually-hidden">Loading...</span>
                        </b-button>

                        <b-button type="submit" v-if="!isLoading" variant="success">
                          Reset
                        </b-button>
                      </div>
                    </div>
                    <!-- end row -->

                  </form>
                </div>
              </div>
              <!-- end cardbody -->
            </div>
            <!-- end card -->
            <div class="mt-5 text-center">
              <p>Don't need ?<RouterLink to="/auth/login" class="fw-bold text-primary"> Login
                  Now </RouterLink>
              </p>
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

<style scoped lang="scss">
.parsley-errors-list>li {
  margin-left: 13px;
}
</style>