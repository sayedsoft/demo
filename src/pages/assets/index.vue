<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGlobalState } from '/@src/stores/appSettings';
import { dex } from '/@src/composable/useSettingsApp';
import iconAssetPage from '/@src/assets/icons/coins.json'
import { useRouter } from 'vue-router';
const isLoading = ref(false)

const _balances = dex().balances
console.log(_balances.value)
const balances: any[] = []
for (let i = 0; i < _balances.value.length; i++) {
    const _balance = _balances.value[i];
    const token = dex().tokenOf(_balance.token_id)
    balances.push({
        balance: _balance.balance,
        converted_balance: _balance.converted_balance,
        token: token,
        depost: dex().totalOf('DEPOSIT', _balance.token_id),
        token_icon: 'youdex-font-' + new String(token.token_code).toLowerCase()
    })
}

const assets = ref<any[]>(balances)
const router = useRouter()

const gotoDeposit = (token: any) => {
    router.push({
        name: 'assets-deposit',
        query: { token: token }
    })
}


const gotoWithdraw = (token: any) => {
    router.push({
        name: 'assets-withdrawal',
        query: { token: token }
    })
}


</script>

<template>



    <Breadcrumb title="Assets"></Breadcrumb>


    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="iconAssetPage" :height="40" :width="40" />
                        Assets
                    </h4>
                </div>
                <div class="card-body p-0">

                    <div class="table-responsive">
                        <table class="table table-centered table-borderless table-nowrap mb-0"
                            style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                            <thead class="table-light t-b">
                                <tr>
                                    <th>Token</th>
                                    <th>Balance</th>
                                    <th>Total Deposited</th>
                                    <th colspan="2">Action</th>
                                </tr>
                                <!-- end tr -->
                            </thead>
                            <!-- end thead -->
                            <tbody>


                                <tr v-for="(asset, index)  of assets">

                                    <td>
                                        <div class="d-flex">
                                            <div class="me-3">
                                                <i :class="asset.token_icon" class=" asset-icon"></i>
                                            </div>

                                            <div>
                                                <h5 class="font-size-16 text-truncate mb-1">
                                                    <a class="text-white">{{ asset.token.token_code }}</a>
                                                </h5>
                                                <p class="text-muted mb-0 font-size-11 text-uppercase">
                                                    {{ asset.token.blockchain }}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <h6 class="mb-1 font-size-13">
                                            <CommaNum :num="asset.balance"></CommaNum>
                                        </h6>
                                        <p class="text-success text-uppercase  mb-0 font-size-14">
                                            ≈{{ asset.converted_balance }}$</p>
                                    </td>

                                    <td>
                                        <h6 class="mb-1 font-size-13">
                                            <CommaNum :num="asset.depost.value"></CommaNum>
                                        </h6>
                                        <p class="text-success text-uppercase  mb-0 font-size-14">
                                            ≈{{ asset.depost.converted }}$</p>

                                    </td>

                                    <td style="width: 134px">
                                        <button :disabled="!asset.token.withdrawable"
                                            @click="gotoWithdraw(asset.token.token_code)"
                                            class="btn btn-soft-success bt-l btn-sm">
                                            <i class="ri-logout-box-r-line"></i> Withdraw
                                        </button>

                                        <button :disabled="!asset.token.payable"
                                            @click="gotoDeposit(asset.token.token_code)"
                                            class="btn btn-soft-success   btn-sm">
                                            <i class=" ri-wallet-2-line"></i> Deposit
                                        </button>
                                    </td>
                                </tr>


                            </tbody>
                            <!-- end tbody -->
                        </table>
                        <!-- end table -->
                    </div>
                    <!-- end tableresponsive -->
                </div>
            </div>

        </div>
        <div class="col-lg-4">
        </div>

    </div>

</template>

<style lang="scss">
.t-b {
    border-top: 1px solid #1d222e !important;
}

.bt-l {
    margin-right: 10px;
}
</style>
