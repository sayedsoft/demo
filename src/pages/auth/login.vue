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
import AuthLogo from '/@src/components/AuthLogo.vue'
import { apiGetter } from '/@src/libs/apiGetter'

const isLoading = ref(false)
const route = useRoute()
const router = useRouter()
const redirect = route.query.redirect as string

const schema = yup.object({
  email: yup
    .string()
    .required()
    .email(),
  password: yup.string().required(),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const onLogin = handleSubmit(async (values) => {
  if (isLoading.value) return;

  isLoading.value = true


  try {
    const data: any = await apiGetter().login(values, redirect)
    if (!data.data.user.hasVerifiedEmail) {
      router.push({ name: 'mustverifyemail' })
    } else if (redirect && redirect != null) {
      router.push(redirect)
    } else {
      router.push({ name: 'app' })
    }
  } catch (error) {

  }

  isLoading.value = false

})


useHead({
  title: 'Youdex | Login',
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
                  <h4 class="font-size-18 text-muted mt-2 text-center">Welcome!</h4>
                  <p class="text-muted text-center mb-4">Sign in to continue to Youdex.</p>
                  <form @submit="onLogin" class="">
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



                    <div class="mb-3 row mt-4">
                      <div class="col-sm-6">
                        <div class="form-checkbox">
                          <input type="checkbox" class="form-check-input me-1" value="remember-me" name="remember"
                            id="customControlInline">
                          <label class="form-check-label" for="customControlInline">Remember me</label>
                        </div>
                      </div>

                      <!-- end col -->
                      <div class="col-sm-6 text-end">
                        <router-link to="/auth/resetpassword" class="text-muted"><i class="mdi mdi-lock"></i> Forgot
                          your password?</router-link>
                      </div>
                      <!-- end col -->
                    </div>
                    <!-- end row -->



                    <div class="row mb-4 mt-4">
                      <div class="col-12">
                        <b-button variant="primary" v-if="isLoading" disabled>
                          <b-spinner small></b-spinner>
                          <span class="visually-hidden">Loading...</span>
                        </b-button>

                        <b-button type="submit" v-if="!isLoading" variant="success">
                          Login
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
              <p>Don't have an account ?
                <RouterLink to="/auth/signup" class="fw-bold text-primary"> Signup Now
                </RouterLink>

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