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
  key: yup.string().required(),
  password: yup.string().required(),
  password_confirmation: yup
    .string()
    .required()
    .oneOf([yup.ref('password')]),
})
const { handleSubmit, setErrors } = useForm({
  validationSchema: schema,
})


const onLogin = handleSubmit(async (values) => {
  if (isLoading.value) {
    return
  }
  const api = useApi()
  isLoading.value = true
  try {
    const data: AxiosResponse = await api.post<LoginData[]>('forgot-password', values)
    notif.success(data.data.message)
    router.push({ name: 'auth-login' })
  } catch (error: any) {
    notif.dismissAll()
    if (error.response.status == 401) {
      notif.error('')
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
                  <h4 class="font-size-18 text-muted mt-2 text-center">Set new password!</h4>
                  <p class="text-muted text-center mb-4">Type your new password.</p>
                  <form @submit="onLogin" class="">



                    <Field v-slot="{ field, errorMessage }" name="password">


                      <div class="form-group mb-3 row">
                        <div class="col-12">
                          <input class="form-control " v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                            type="password" required placeholder="Password">
                        </div>
                        <span v-if="errorMessage" class="invalid-feedback" role="alert">
                          <strong>{{ errorMessage }}</strong>
                        </span>

                        <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                          aria-hidden="false">
                          <li class="parsley-required">{{ errorMessage }}</li>
                        </ul>


                      </div>



                    </Field>

                    <Field v-slot="{ field, errorMessage }" name="password_confirmation">


                      <div class="form-group mb-3 row">
                        <div class="col-12">
                          <input class="form-control " v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                            type="password" required placeholder="Password confirm">
                        </div>
                        <span v-if="errorMessage" class="invalid-feedback" role="alert">
                          <strong>{{ errorMessage }}</strong>
                        </span>

                        <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                          aria-hidden="false">
                          <li class="parsley-required">{{ errorMessage }}</li>
                        </ul>


                      </div>



                    </Field>


                    <Field v-slot="{ field, errorMessage }" name="key">


                      <div class="form-group mb-3 row">
                        <div class="col-12">
                          <input class="form-control " v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                            type="password" required placeholder="Reset code">
                        </div>
                        <span v-if="errorMessage" class="invalid-feedback" role="alert">
                          <strong>{{ errorMessage }}</strong>
                        </span>

                        <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                          aria-hidden="false">
                          <li class="parsley-required">{{ errorMessage }}</li>
                        </ul>


                      </div>



                    </Field>

                    <div class="row mb-4">
                      <b-button variant="primary" v-if="isLoading" disabled>
                        <b-spinner small></b-spinner>
                        <span class="visually-hidden">Loading...</span>
                      </b-button>

                      <b-button class="mx-1" type="submit" v-if="!isLoading" variant="success">
                        Save pssword
                      </b-button>
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