<script lang="ts" setup>
import { AxiosResponse } from 'axios'
import { useApi } from '/@src/composable/useApi'
import { Field, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUserSession } from '/@src/stores/userSession'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWindowScroll } from '@vueuse/core'
import { useNotyf } from '/@src/composable/useNotyf'
import { dex } from '/@src/composable/useSettingsApp'
import coinsIcon from '/@src/assets/icons/coins.json'
import historyIcon from '/@src/assets/icons/staked.json'
import plusIcon from '/@src/assets/icons/plus.json'
import UserWallets from "/@src/components/modals/UserWallets.vue";
import { globalEvents } from "/@src/stores/globalEvents";
import dateFormat, { masks } from "dateformat";
import StakeDetails from '../StakeDetails.vue'
const globalEvent = globalEvents()


const isLoading = ref(true)

const notif = useNotyf()

const userSession = useUserSession()

const api = useApi()

const records = ref<any[]>([])

const getRecoders = async (force: boolean = false) => {

    userSession.setLoading(true)
    try {

        var data: AxiosResponse = await api.post<any>('stake/stake-history')
        records.value = data.data.data
        isLoading.value = false
    } catch (error: any) {
        isLoading.value = false
        console.log(error)
        notif.error('Try again')
    }

    userSession.setLoading(false)

}


await getRecoders()

watch(globalEvent, async () => {
    if (globalEvent.globalEvent2 == 'ordersHasUpdated') {
        await getRecoders(true)
    }
    globalEvent.setEvent2('none')
})


</script>
<template>


    <div class="card mb-4">
        <div class="card-header custom-h">
            <h4 class="card-title h2  mb-0 ">
                <Vue3Lottie class="w-h-icon" :animationData="historyIcon" :height="40" :width="40" /> You staked
            </h4>
        </div>
        <div class="card-body" v-if="!isLoading">

            <div class="stake-list" v-if="records?.length">
                <div class="stake-list-item" v-for="(row, index)  of records">
                    <StakeDetails :stake="row"></StakeDetails>
                </div>

            </div>

            <div class="no-data text-center" v-else>

                <p class="text-muted mt-5 mb-5">No records yet</p>

            </div>

        </div>


        <div class="card-body p-0" v-if="isLoading">

            <div class="no-data text-center">

                <content-loader viewBox="0 0 340 84" :speed="2" primaryColor="#282e3e" secondaryColor="#1d222e">
                    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
                    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
                    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
                    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
                    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
                    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
                    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                </content-loader>

            </div>
        </div>
    </div>

</template>