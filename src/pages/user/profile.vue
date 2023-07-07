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
    first_name: yup.string().required().label('First name'),
    last_name: yup.string().required().label('last name'),
    mobile_number: yup.number().required().label('Mobile number')
})

const { handleSubmit, setFieldValue } = useForm({
    validationSchema: schema,
})
setFieldValue('first_name', userSession.getUser().first_name)
setFieldValue('last_name', userSession.getUser().last_name)
setFieldValue('mobile_number', userSession.getUser().mobile_number)


const onSumbit = handleSubmit(async (values) => {
    if (isLoading.value) {
        return
    }
    const api = useApi()
    isLoading.value = true
    try {
        const data: AxiosResponse = await api.post<any[]>('profile', values)
        notif.success('Profile updated')
    } catch (error: any) {
        notif.dismissAll()
        if (error.response.status == 401) {
            notif.error(error.response.data.message)
        } else {
            notif.error('Please try again')
        }
    } finally {
        isLoading.value = false
    }
})


const schema2Form = yup.object({
    current_password: yup.string().required().label('Current password'),
    new_password: yup.string().required(),
    new_confirm_password: yup
        .string()
        .required()
        .oneOf([yup.ref('new_password')]),
})

const form2 = useForm({
    validationSchema: schema2Form,
})


const onSumbitPassword = form2.handleSubmit(async (values) => {
    if (isLoading.value) {
        return
    }
    const api = useApi()
    isLoading.value = true
    try {
        const data: AxiosResponse = await api.post<any[]>('change-password', values)
        notif.success('Password updated')
    } catch (error: any) {
        notif.dismissAll()
        if (error.response.status == 401) {
            notif.error(error.response.data.message)
        } else {
            notif.error('Please try again')
        }
    } finally {
        isLoading.value = false
    }
})

const fullname = ref(userSession.getUserName());
const registration = ref(userSession.getUser().created_at);

useHead({
    title: 'Youdex | Profile',
})
</script>

<template>

    <div class="row">
        <div class="col-xl-8 col-lg-12 col-sm-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title h5  mb-0 ">Profile Details</h4>
                </div>
                <div class="card-body">
                    <div class="basic-form">

                        <form @submit="onSumbit" class="">
                            <div class="row">


                                <div class="col-md-6">


                                    <Field v-slot="{ field, errorMessage }" name="first_name">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">First name</label>
                                                <input name="first_name" v-model="userSession.getUser().first_name"
                                                    class="form-control" v-bind="field"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                                    placeholder="First name">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>

                                </div>
                                <div class="col-md-6">


                                    <Field v-slot="{ field, errorMessage }" name="last_name">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">Last name</label>
                                                <input class="form-control" v-bind="field"
                                                    v-model="userSession.getUser().last_name"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                                    placeholder="Last name">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>


                                </div>
                                <div class="col-md-12">

                                    <Field v-slot="{ field, errorMessage }" name="mobile_number">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">Mobile Number</label>
                                                <input class="form-control" v-bind="field"
                                                    v-model="userSession.getUser().mobile_number"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="number" required
                                                    placeholder="Mobile Number">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>


                                </div>

                            </div>
                        </form>

                    </div>
                </div>
                <div class="card-footer">
                    <b-button class="fr" variant="primary" v-if="isLoading" disabled>
                        <b-spinner small></b-spinner>
                        <span class="visually-hidden">Loading...</span>
                    </b-button>

                    <b-button @click="onSumbit" class="mx-1 fr " type="submit" v-if="!isLoading" variant="success">
                        Save
                    </b-button>
                </div>
            </div>


            <div class="card">
                <div class="card-header">
                    <h4 class="card-title h5  mb-0 ">Change login password</h4>
                </div>
                <div class="card-body">
                    <div class="basic-form">

                        <form @submit="onSumbitPassword" class="">
                            <div class="row">


                                <div class="col-md-12">


                                    <Field v-slot="{ field, errorMessage }" name="current_password">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">Current password</label>
                                                <input class="form-control" v-bind="field"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="password" required
                                                    placeholder="Current password">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>

                                </div>
                                <div class="col-md-6">

                                    <Field v-slot="{ field, errorMessage }" name="new_password">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">New password</label>
                                                <input class="form-control" v-bind="field"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="password" required
                                                    placeholder="New password">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>


                                </div>
                                <div class="col-md-6">

                                    <Field v-slot="{ field, errorMessage }" name="new_confirm_password">


                                        <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                            <div class="col-12">
                                                <label class="labels">Confirm New password</label>
                                                <input class="form-control" v-bind="field"
                                                    :class="!errorMessage ? '' : 'is-invalid'" type="password" required
                                                    placeholder="Confirm New password">
                                            </div>
                                            <ul v-if="errorMessage" class="parsley-errors-list filled"
                                                id="parsley-id-11" aria-hidden="false">
                                                <li class="parsley-required">{{ errorMessage }}</li>
                                            </ul>

                                        </div>



                                    </Field>


                                </div>

                            </div>
                        </form>

                    </div>
                </div>
                <div class="card-footer">
                    <b-button class="fr" variant="primary" v-if="isLoading" disabled>
                        <b-spinner small></b-spinner>
                        <span class="visually-hidden">Loading...</span>
                    </b-button>

                    <b-button @click="onSumbitPassword" class="mx-1 fr " type="submit" v-if="!isLoading"
                        variant="success">
                        Update password
                    </b-button>
                </div>
            </div>


        </div>

        <div class="col-xl-4 col-lg-12 col-sm-12">
            <div class="card overflow-hidden">
                <div class="text-center p-3 overlay-box" style="background-image: url(/src/assets/images/big/img1.jpg)">
                    <div style="width:100%">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                            style="enable-background:new 0 0 512 512; width: 100px" xml:space="preserve">
                            <g>
                                <g>
                                    <path style="fill: #d56cf5" d="M437.02,74.981C388.667,26.629,324.38,0,256,0S123.333,26.629,74.98,74.981C26.629,123.333,0,187.62,0,256
			s26.629,132.667,74.98,181.019C123.333,485.371,187.62,512,256,512s132.667-26.629,181.02-74.981
			C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.981z M256,482c-60.844,0-116.142-24.177-156.812-63.419
			C121.212,351.287,184.487,305,256,305s134.788,46.287,156.813,113.582C372.142,457.823,316.844,482,256,482z M181,200
			c0-41.355,33.645-75,75-75c41.355,0,75,33.645,75,75s-33.645,75-75,75C214.645,275,181,241.355,181,200z M435.34,393.354
			c-22.07-51.635-65.404-90.869-117.777-108.35C343.863,265.904,361,234.918,361,200c0-57.897-47.103-105-105-105
			c-57.897,0-105,47.103-105,105c0,34.918,17.137,65.904,43.438,85.004c-52.374,17.481-95.708,56.715-117.778,108.35
			C47.414,355.259,30,307.628,30,256C30,131.383,131.383,30,256,30s226,101.383,226,226C482,307.628,464.586,355.259,435.34,393.354
			z" />
                                </g>
                            </g>
                        </svg>

                    </div>
                    <h3 class="mt-3 h5 mb-1">{{ fullname }}</h3>
                    <p class="mb-0">User</p>
                </div>
                <ul class="list-group list-group-flush mb-4">
                    <li class="list-group-item d-flex justify-content-between"><span class="mb-0">Registration date
                        </span> {{ registration }}</li>
                </ul>
            </div>
        </div>

    </div>

</template>

<style lang="scss" >
.fr {
    float: right
}
</style>