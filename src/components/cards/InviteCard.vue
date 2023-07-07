<script setup lang="ts" >
import { computed, ref } from 'vue';
import { useGlobalState } from '/@src/stores/appSettings';
import { dex } from '/@src/composable/useSettingsApp';
import icons from '/@src/assets/icons/pep.json'
import copyIcon from '/@src/assets/icons/copy.json'
import { useClipboard } from '@vueuse/core';
import { useNotyf } from '/@src/composable/useNotyf';
import QrcodeVue from 'qrcode.vue'
import {
    useUserSession
} from "/@src/stores/userSession";
import { useRoute, useRouter } from 'vue-router';
const router = useRouter()
const route = useRoute()
const { text, copy, copied, isSupported } = useClipboard()


const referral_code = ref<string>(useUserSession().getRefCode());

const signLink = router.getRoutes().find(r => r.name == 'auth-signup')
const path = import.meta.env.VITE_APP_URL + signLink?.path + '?referralcode=' + referral_code.value
const notif = useNotyf()
const referral_link = ref<string>(path);
const copyLink = () => {
    copy(path)
        .then(() => {
            notif.success('Copied Successfully')
        })
        .catch(() => {
            notif.error('Failed to copy')
        })
}

</script>

<template>
    <div class="card">
        <div class="card-header custom-h">
            <h4 class="card-title h2  mb-0 ">
                <Vue3Lottie class="w-h-icon" :animationData="icons" :height="40" :width="40" /> Invite to earn
            </h4>
        </div>
        <div class="card-body exchange">

            <p>Join with youdex referral system by inviting a new members. copy following link:</p>

            <div class="qr">
                <QrcodeVue :value="referral_link" :size="170" :margin="2" level="H">
                </QrcodeVue>
            </div>

            <div class="form-group mt-3 row">
                <div class="col-12">
                    <input class="form-control" v-model="referral_link" type="text" required placeholder="">
                </div>

            </div>

            <button @click="copyLink()" class="btn w-100 btn-soft-primary btn-md mt-4"><i class="ri-copy-line me-2"></i>
                <Vue3Lottie class="w-h-icon" :animationData="copyIcon" :height="20" /> Copy Link
            </button>

        </div>
    </div>
</template> 

<style lang="scss">
.qr {
    canvas {
        display: block;
        margin: auto;
    }
}
</style>