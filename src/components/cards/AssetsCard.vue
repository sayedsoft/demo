<script setup lang="ts" >
import { computed, ref, watch } from 'vue';
import { useGlobalState } from '/@src/stores/appSettings';
import { dex } from '/@src/composable/useSettingsApp';
import iconAsset from '/@src/assets/icons/coins.json'
import QrcodeVue from 'qrcode.vue'
import { globalEvents } from '/@src/stores/globalEvents';

const isLoading = ref(false)

const _balances = ref<any>(dex().balances)

const balances = ref<any>()

const globalEvent = globalEvents()

const assets = ref<any>(balances.value)

const setBalances = () => {
    _balances.value = dex().balances
    balances.value = []
    for (let i = 0; i < _balances.value.length; i++) {
        let token_id = _balances.value[i].token_id
        const _balance = _balances.value[i]
        const token = dex().tokenOf(token_id)
        balances.value.push({
            balance: _balance.balance,
            converted_balance: _balance.converted_balance,
            token: token,
            token_icon: 'youdex-font-' + new String(token.token_code).toLowerCase()
        })
    }
    assets.value = balances.value
}


watch(globalEvent, async () => {
    if (globalEvent.globalEvent == 'updateBalanceHasDone') {
        setBalances()
    }
})




setBalances()

</script>

<template>
    <div class="card">
        <div class="card-header custom-h">
            <h4 class="card-title h2  mb-0 ">
                <Vue3Lottie class="w-h-icon" :animationData="iconAsset" :height="40" :width="40" /> Assets
            </h4>
        </div>
        <div class="card-body assets">
            <div v-for="(asset, index)  of assets">
                <div class="row">
                    <div class="col-8">
                        <h3 c="">
                            <CommaNum :num="asset.balance"></CommaNum>

                            <span class="asset_currency">
                                ≈{{                                            asset.converted_balance                                            }}$</span>
                        </h3>
                        <h4 class="asset_name">
                            <i :class="asset.token_icon" class=" asset-icon"></i>
                            {{                                            asset.token.token_code                                            }}
                        </h4>
                    </div>

                </div>


                <div v-if="index != Object.keys(assets).length - 1" class="line mb-4"></div>

            </div>


            <RouterLink class="btn btn-soft-primary btn-md mt-4" to="assets">Manage<i
                    class="mdi mdi-arrow-right ms-1"></i></RouterLink>


        </div>
    </div>
</template> 