<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import { number } from "yup";
import { useApi } from "/@src/composable/useApi";
import { useNotyf } from "/@src/composable/useNotyf";
import { AxiosResponse } from "axios";
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'
import { globalEvents } from "/@src/stores/globalEvents";
const props = defineProps({
    token_id: {
        default: "",
    }
});


let modalEle = ref<any>(null);

onMounted(() => {
    thisModalObj = new Modal(modalEle.value);
});

function _show() {
    thisModalObj.show();
}

function _hide() {
    thisModalObj.show();
}


defineExpose({ show: _show, hide: _hide });


let thisModalObj: any = null;


const schema = yup.object({
    wallet: yup
        .string()
        .required().label('Wallet address'),
    label: yup.string().required().label('Label wallet'),
})

const { handleSubmit, setErrors } = useForm({
    validationSchema: schema,
})



const isLoading = ref(false)
const api = useApi()
const notif = useNotyf()

const saveWallet = handleSubmit(async (values) => {
    if (isLoading.value) return

    isLoading.value = true
    try {
        const data: AxiosResponse = await api.post<any[]>('new-wallet', {
            'token_id': props?.token_id,
            'wallet': values.wallet,
            'label': values.label
        });

        const globalEvent = globalEvents()
        globalEvent.setEvent('updateWallets')

        console.log(thisModalObj)
        thisModalObj.hide();

    } catch (error: any) {


        notif.dismissAll()

        if (error.response.status == 401) {
            notif.error('Check wallet feilds')
            setErrors(error.response.data)
        } else {
            notif.error('Please try again')
        }


    } finally {
        isLoading.value = false
    }
})


</script>

<template>

    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalEle">
        <div class="modal-dialog">


            <div class="modal-content">

                <form @submit="saveWallet" class="">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Add new wallet</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">

                        <Field v-slot="{ field, errorMessage }" name="wallet">


                            <div class="form-group mb-3 row" :class="!errorMessage ? '' : 'is-invalid'">
                                <div class="col-12">
                                    <label> Wallet address</label>
                                    <input class="form-control" v-bind="field"
                                        :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                        placeholder="Wallet address">
                                </div>
                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">{{  errorMessage  }}</li>
                                </ul>

                            </div>



                        </Field>


                        <Field v-slot="{ field, errorMessage }" name="label">


                            <div class="form-group mb-3 row">
                                <div class="col-12">
                                    <label>Label wallet address</label>
                                    <input class="form-control " v-bind="field"
                                        :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                        placeholder="Label">
                                </div>
                                <span v-if="errorMessage" class="invalid-feedback" role="alert">
                                    <strong>{{  errorMessage  }}</strong>
                                </span>

                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">{{  errorMessage  }}</li>
                                </ul>
                            </div>


                        </Field>







                    </div>
                    <div class="modal-footer">


                        <button type="button" class="btn btn-m-s btn-secondary" data-bs-dismiss="modal">
                            Close
                        </button>


                        <b-button variant="primary" class=" btn-m-s" v-if="isLoading" disabled>
                            <b-spinner small></b-spinner>
                            <span class="visually-hidden">Loading...</span>
                        </b-button>

                        <button type="submit" class="btn btn-m-s btn-success" v-if="!isLoading">
                            Save
                        </button>

                    </div>
                </form>

            </div>
        </div>
    </div>




</template>

<style lang="scss">
.btn-m-s {
    width: auto;
}
</style>