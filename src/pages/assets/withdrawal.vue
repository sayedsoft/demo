<script setup lang="ts">
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
import historyIcon from '/@src/assets/icons/history.json'
import plusIcon from '/@src/assets/icons/plus.json'
import UserWallets from "/@src/components/modals/UserWallets.vue";
import { globalEvents } from "/@src/stores/globalEvents";
import dateFormat, { masks } from "dateformat";
const globalEvent = globalEvents()

let thisModal = ref<any>(null);


const route = useRoute()
const router = useRouter()

const userSession = useUserSession()
const withdrawalSettings = ref<any>()

const withdrawn = ref<any>('0.0000')
const withdrawnConverted = ref('0.0000')
const balance = ref<any>()
const amount = ref(0)
const amountFee = ref(0)
const amountTotal = computed(() => {
    if (amount.value <= 0) { return 0 }
    withdrawalSettings.value = token.value.withdrawal_token_settings
    const feeFace = withdrawalSettings.value.fee_face
    if (feeFace.type == 'fixed') {
        amountFee.value = dex().nf(parseFloat(feeFace.fixed_amount))
        return dex().nf(amount.value - amountFee.value)
    }
    return amount.value
})


const setBabalnces = () => {
    let getWithdrawn = dex().totalOf('WITHDRAW', token.value.id)

    withdrawn.value = getWithdrawn.value
    withdrawnConverted.value = getWithdrawn.converted

    withdrawalSettings.value = token.value.withdrawal_token_settings
    balance.value = dex().balanceOf(token.value.id).balance

    if (balance.value == 0) { amount.value = 0 }
}

onBeforeMount(async () => {
    if (tokenParam == undefined || tokenParam == '' || typeof tokenParam != 'string') {
        router.push('/')
    }

    const _token = dex().tokenOf(tokenParam)
    if (_token == undefined) {
        router.push({ name: 'notfound' })
        return
    }

    if (!_token.withdrawable) {
        router.push({ name: 'notfound' })
        return
    }

    token.value = _token

    await getWithdrawals()

    setBabalnces()
})


const tokenParam = route.query.token as string
const token = ref()

const isLoading = ref(false)
const api = useApi()
const notif = useNotyf()

const withdrawals = ref<any[]>()
const wallets = ref<any[]>()



const getWithdrawals = async () => {
    isLoading.value = true
    userSession.setLoading(true)
    try {

        var data: AxiosResponse = await api.post<any>('userWithdrawals', { token_id: token.value.id })
        wallets.value = data.data.wallets
        withdrawals.value = data.data.user_withdrawals

        isLoading.value = false
    } catch (error: any) {
        isLoading.value = false
        console.log(error)
        notif.error('Try again')
    }

    userSession.setLoading(false)

}


watch(globalEvent, async () => {
    if (globalEvent.globalEvent == 'updateWallets') {
        await getWithdrawals()
        globalEvent.setEvent('none')

    }
})

const tokenIcon = (token: any) => {
    return 'youdex-font-' + new String(token.token_code).toLowerCase()
}

const schema = yup.object({
    amount: yup
        .number()
        .required(),
    wallet: yup.string().required(),
})


const { handleSubmit, setFieldValue, resetForm } = useForm({
    validationSchema: schema,
})


const saveWithdraw = handleSubmit(async (values) => {

    const api = useApi();
    isLoading.value = true
    try {
        const data: AxiosResponse = await api.post<any[]>('withdraw', {
            'token_id': token.value.id,
            'user_wallet_id': values.wallet,
            'amount': values.amount
        });

        resetForm()

        await getWithdrawals()

        globalEvent.setEvent('updateBalance')

        notif.success('Withdrawal request has been sent!')



    } catch (error: any) {
        console.log(error)
        notif.dismissAll()
        notif.error(error.response.data.message)
    } finally {
        isLoading.value = false
    }
})

const setMax = () => {
    amount.value = dex().nf(balance.value)
    setFieldValue('amount', amount.value)
}




</script>

<template>

    <div>
        <Breadcrumb :title="'Withdrawal ' + token.token_code"></Breadcrumb>
    </div>


    <div class="row">


        <div class="col-lg-8 col-sm-12">

            <div class="card">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="coinsIcon" :height="40" :width="40" /> Withdraw
                        <small>
                            ({{      token.token_code      }})
                        </small>
                    </h4>
                </div>
                <div class="card-body exchange">


                    <form @submit="saveWithdraw">
                        <Field v-slot="{ field, errorMessage }" name="amount">


                            <div class="form-group mb-3 row">
                                <div class="col-12">
                                    <label>Amount</label>
                                    <input class="form-control " v-model="amount" v-bind="field"
                                        :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                        placeholder="Amount">
                                </div>
                                <h6 class="input-btn-text" @click="setMax()"> Set Max
                                    balance:
                                    <b> {{      dex().nf(balance)      }} </b>
                                </h6>

                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">{{      errorMessage      }}</li>
                                </ul>
                            </div>


                        </Field>


                        <div class="line mt-4 mb-4"></div>
                        <Field v-slot="{ field, errorMessage }" name="wallet">
                            <div class="form-group mb-3 row" :class="wallets?.length ? '' : 'hidden'">
                                <div class="col-12">
                                    <label>Wallet address (TRC20)</label>
                                    <select :class="!errorMessage ? '' : 'is-invalid'" v-bind="field"
                                        class="form-select" name="wallet">
                                        <option v-for="(row, index)  of wallets" :value="row.id">
                                            {{      row.label      }} - {{      row.wallet      }}
                                        </option>
                                    </select>

                                </div>
                                <p class="mt-2 add-new text-right" @click="thisModal.show()"> Add new wallet
                                </p>
                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">{{      errorMessage      }}</li>
                                </ul>
                            </div>
                            <div class="add-box text-center mb-3 " @click="thisModal.show()"
                                :class="!wallets?.length && !isLoading ? '' : 'hidden'">
                                <h6>Add new wallet</h6>
                                <Vue3Lottie class="w-h-icon" :animationData="plusIcon" :height="40" :width="40" />

                            </div>
                        </Field>

                        <div class="row">


                            <div class="col-12">
                                <div class="line mt-2 mb-2"></div>
                                <div class="detail text-right mt-2 mb-0">
                                    <h5 class="text-left mt-4">Withdraw Details</h5>
                                    <h6 class="inv-details">
                                        <span class="inv-label text-left">Amount
                                            <small>({{      token.token_code      }})</small>:
                                        </span>
                                        <span class="inv-val">
                                            {{      amount      }}
                                        </span>

                                    </h6>

                                    <h6 class="inv-details">
                                        <span class="inv-label text-left">Fee amount
                                            <small>({{      token.token_code      }})</small>:
                                        </span>
                                        <span class="inv-val">
                                            {{      amountFee      }}
                                        </span>
                                    </h6>

                                    <h6 class="inv-details">
                                        <span class="inv-label text-left">Total
                                            <small>({{      token.token_code      }})</small>:
                                        </span>
                                        <span class="inv-val">
                                            {{      amountTotal      }}
                                        </span>
                                    </h6>
                                </div>

                            </div>





                            <div class="col-12 mt-4">

                                <div class="line mt-0 mb-4"></div>

                                <b-button class="btn-m-s" variant="primary" v-if="isLoading" disabled>
                                    <b-spinner small></b-spinner>
                                    <span class="visually-hidden">Loading...</span>
                                </b-button>

                                <b-button class="mx-1 btn-m-s" type="submit" v-if="!isLoading" variant="danger">
                                    Withdraw
                                </b-button>
                            </div>
                        </div>

                    </form>

                </div>
            </div>

            <div class="card mb-4">
                <div class="card-header custom-h">
                    <h4 class="card-title h2  mb-0 ">
                        <Vue3Lottie class="w-h-icon" :animationData="historyIcon" :height="40" :width="40" /> Withdrawal
                        history
                    </h4>
                </div>
                <div class="card-body p-0">

                    <div class="table-responsive" v-if="withdrawals?.length">
                        <table class="table table-centered border table-nowrap mb-0"
                            style="border-collapse: collapse; border-spacing: 0; width: 100%;">
                            <thead class="table-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Amount Fee</th>
                                    <th>Status</th>
                                </tr>
                                <!-- end tr -->
                            </thead>
                            <!-- end thead -->
                            <tbody>
                                <tr v-for="(row, index)  of withdrawals">
                                    <td> {{      dateFormat(row.created_at, 'mmm d, yyyy')      }} </td>
                                    <td>
                                        <CommaNum :num="row.amount"></CommaNum>
                                    </td>
                                    <td>
                                        <CommaNum :num="row.amount_fee"></CommaNum>
                                    </td>
                                    <td>
                                        <b-badge :variant="row.status_class">{{      row.status_title      }}</b-badge>
                                    </td>

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

        <div class="col-lg-4 col-sm-12">

            <div class="card overflow-hidden" v-if="withdrawn != null">
                <div class="card-content">
                    <div class="card-body cleartfix">
                        <div class="media align-items-stretch">
                            <div class="row">
                                <div class="col-3 pr-0 r-b">
                                    <h4 class="asset_name asset_name_c text-center">
                                        <p><i :class="tokenIcon(token)" class="asset-icon"></i></p>
                                        <p>{{      token.token_code      }}</p>
                                    </h4>
                                </div>
                                <div class="col-8">
                                    <div class="align-self-center">
                                        <h1 class="mb-0 h4">
                                            <CommaNum :num="withdrawn"></CommaNum>
                                        </h1>
                                    </div>
                                    <div class="media-body">
                                        <span>≈{{      withdrawnConverted      }}$</span>
                                        <h4 class="mt-2 h6">Total withdrawn</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>




        <!-- end col -->
    </div>
    <UserWallets v-if="!isLoading" :token_id="token.id" ref="thisModal">
    </UserWallets>



</template>

<style lang="scss">
.add-new {
    cursor: pointer;
}

.btn-m-s {
    width: auto;
    float: right;
}

.hidden {
    display: none;
}

.add-box {
    border: 1px solid #404552;
    border-radius: 10px;
    min-height: 30px;
    width: 100%;
    padding: 20px;
    cursor: pointer;
}
</style>
