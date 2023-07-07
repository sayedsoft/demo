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
    title: {
        default: "",
        type: String
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
    thisModalObj.hide();
}


defineExpose({ show: _show, hide: _hide });


let thisModalObj: any = null;


const isLoading = ref(false)
const api = useApi()
const notif = useNotyf()


</script>

<template>

    <div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="" aria-hidden="true" ref="modalEle">

        <div class="modal-dialog">



            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModal"> {{     props.title     }} </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="modalcontent"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="modalfooter"></slot>
                </div>
            </div>


        </div>
    </div>




</template>

<style lang=" scss">

</style>
