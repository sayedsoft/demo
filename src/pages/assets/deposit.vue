<script setup lang="ts">
import { AxiosResponse } from 'axios';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { dex } from '/@src/composable/useSettingsApp';
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf';
import { useUserSession } from '/@src/stores/userSession';
import walletIcon from '/@src/assets/icons/wallet.json'
import { useClipboard } from '@vueuse/core';
import QrcodeVue from 'qrcode.vue'
import copyIcon from '/@src/assets/icons/copy.json'
import historyIcon from '/@src/assets/icons/history.json'
import readMe from '/@src/assets/icons/readme.json'

import dateFormat, { masks } from "dateformat";

const route = useRoute()
const router = useRouter()

const tokenParam = route.query.token as string
const tokenValid = ref(false)
const token = ref()

const isLoading = ref(false)
const api = useApi()
const notif = useNotyf()

const deposits = ref<any[]>()
const address = ref('')
const deposited = ref<any>('0.0000')
const depositedConverted = ref('0.0000')

const userSession = useUserSession()

const getDepostis = async () => {
    isLoading.value = true
    userSession.setLoading(true)
    try {
        var data: AxiosResponse = await api.post<any>('deposit', { token_id: token.value.id })
        deposits.value = data.data.deposits
        address.value = data.data.wallet


        isLoading.value = false
    } catch (error: any) {
        isLoading.value = false
        console.log(error)
        notif.error('Try again')
    }

    userSession.setLoading(false)

}


onBeforeMount(async () => {
    if (tokenParam == undefined || tokenParam == '' || typeof tokenParam != 'string') {
        router.push('/')
    }

    const _token = dex().tokenOf(tokenParam)
    console.log(_token)
    if (_token == undefined) {
        router.push({ name: 'notfound' })
        return
    }

    if (!_token.payable) {
        router.push({ name: 'notfound' })
        return
    }

    token.value = _token

    await getDepostis()
    let getDeposted = dex().totalOf('DEPOSIT', token.value.id)

    deposited.value = getDeposted.value
    depositedConverted.value = getDeposted.converted

    console.log(deposited.value)
})

const tokenIcon = (token: any) => {
    return 'youdex-font-' + new String(token.token_code).toLowerCase()
}
const { text, copy, copied, isSupported } = useClipboard()

onMounted(async () => {

})

const copyLink = () => {
    copy(address.value)
        .then(() => {
            notif.success('Copied Successfully')
        }).catch(() => {
            notif.error('Failed to copy')
        })
}


</script>
<template>

    <Breadcrumb :title="'Deposit ' + token.token_code"></Breadcrumb>
    <div class="row">

        <div class="col-xl-8 ">
            <div class="card mb-4">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="walletIcon" :height="40" :width="40" /> Deposit
                        {{ token.token_code }} Token
                    </h4>
                </div>
                <div class="card-body exchange">

                    <p>Join with youdex referral system by inviting a new members. copy following link:</p>
                    <div class="qr">
                        <QrcodeVue :value="address" :size="200" :margin="2" level="H">
                        </QrcodeVue>
                    </div>
                    <div class="input-group mt-4 input-group mb-3">

                        <input type="text" v-model="address" disabled class="form-control" aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm">

                        <div class="input-group-prepend">
                            <span @click="copyLink()" class="input-group-text clp" id="inputGroup-sizing-sm">
                                Copy

                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="historyIcon" :height="40" :width="40" /> Deposit
                        history
                    </h4>
                </div>
                <div class="card-body p-0">

                    <div class="table-responsive" v-if="deposits?.length">
                        <table class="table table-centered border table-nowrap mb-0"
                            style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th colspan="2">Blockchain Scan</th>
                                </tr>
                                <!-- end tr -->
                            </thead>
                            <!-- end thead -->
                            <tbody>
                                <tr v-for="(row, index)  of deposits">
                                    <td> {{ dateFormat(row.created_at, 'mmm d, yyyy') }} </td>
                                    <td>
                                        <CommaNum :num="row.amount"></CommaNum>
                                    </td>
                                    <td>
                                        <b-badge variant="success">Confirmed</b-badge>
                                    </td>
                                    <td><a :href="row.tronscan" target="_blank">Show</a> </td>
                                </tr>

                            </tbody>
                            <!-- end tbody -->
                        </table>
                    </div>

                    <div class="no-data text-center" v-else>

                        <p class="text-muted mt-5 mb-5">No records yet</p>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-4">
            <!-- end col -->

            <div class="card overflow-hidden" v-if="deposited != null">
                <div class="card-content">
                    <div class="card-body cleartfix">
                        <div class="media align-items-stretch">
                            <div class="row">
                                <div class="col-3 pr-0 r-b">
                                    <h4 class="asset_name asset_name_c text-center">
                                        <p><i :class="tokenIcon(token)" class="asset-icon"></i></p>
                                        <p>{{ token.token_code }}</p>
                                    </h4>
                                </div>
                                <div class="col-8">
                                    <div class="align-self-center">
                                        <h1 class="mb-0 h4">
                                            <CommaNum :num="deposited"></CommaNum>
                                        </h1>
                                    </div>
                                    <div class="media-body">
                                        <span>≈{{ depositedConverted }}$</span>
                                        <h4 class="mt-2 h6">Total deposited</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card overflow-hidden">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="readMe" :height="40" :width="40" /> Read me
                    </h4>
                </div>
                <div class="card-content">
                    <div class="card-body cleartfix">
                        <h6>Before deposit</h6>
                        <ul>
                            <li>wallet format is <b>TRC20</b> (TRON Blockchain).</li>
                            <li>You can send USDT Token just, when you sen an other any token you will loss it.</li>
                            <li>After send any amount to your wallet you will receive a confirmation email in 1-10 mins
                                and amount will be added to your balance.</li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- end card -->

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

.btn-mdd {
    float: right;
}
</style>