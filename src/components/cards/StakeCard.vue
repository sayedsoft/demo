<script setup lang="ts" >
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useGlobalState } from '/@src/stores/appSettings';
import { dex, stake } from '/@src/composable/useSettingsApp';
import icons from '/@src/assets/icons/staked.json'
import checkedp from '/@src/assets/icons/cheked-p.json'
import checked from '/@src/assets/icons/checked.json'
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'
import { useApi } from '/@src/stores/useApi';
import { useNotyf } from '/@src/composable/useNotyf';
import { AxiosResponse } from 'axios';
import ConfirmModal from '../modals/ConfirmModal.vue';
import { globalEvents } from '/@src/stores/globalEvents';
import LastOrders from './LastOrders.vue';
import { ContentLoader } from 'vue-content-loader'

const globalEvent = globalEvents(), notif = useNotyf(), isLoading = ref(false)

const api = useApi();

const isLoadingPreview = ref(false)

const token_id = 2;

const hasPlans = ref(false)

const asset = ref(dex().tokenOf(token_id))

const balance = computed(() => dex().balanceOf(token_id).balance)

const plans = ref(dex().stakePlansOf(2))

const selectedPlan = ref<any>()

const lastGettedAmount = ref(0)

const lastGettedPlan = ref(0)

onBeforeMount(() => {
    if (plans.value.length > 0) {
        hasPlans.value = true
        selectedPlan.value = plans.value[1]
    }
})

const amountStake = ref(0)

const schema = yup.object({
    amount: yup.number().required().label('Amount ' + asset.value.token_code),
})


const { handleSubmit, setFieldValue, resetForm } = useForm
    ({
        validationSchema: schema,
    })


const setMaxBase = () => {
    amountStake.value = dex().nf(balance.value)
    setFieldValue('amount', balance.value)
    calculateAssetAmmount()
}


const saveStake = handleSubmit(async (values) => {


    const api = useApi();
    isLoading.value = true
    try {
        let dataForm = {
            plan_id: selectedPlan.value.id,
            amount: amountStake.value
        }

        const data: AxiosResponse = await api.post<any[]>('stake/stake-save', dataForm);

        globalEvent.setEvent('updateBalance')

        globalEvent.setEvent2('stakeHasUpdated')

        resetForm()

        notif.success('Stake request has been sent!')


        confirmModal.value.hide();


    } catch (error: any) {
        console.log(error)


        notif.dismissAll()
        notif.error(error.response.data.message)
    } finally {
        isLoading.value = false
    }



})

let confirmModal = ref<any>(null);

const confirm = () => {
    confirmModal.value.show();
}

const debounce = async (fn: Function, delay: any, ...args) => {
    var timeoutID: any = null
    const ff = async (...args: any) => {
        clearTimeout(timeoutID)
        var that = this
        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
    await ff(args)
}

const totalProfits = ref(0)

const profitPeriodAmount = ref(0)

const profitPeriodCount = ref(0)

const periodAmount = ref(0)

const setPlan = async (plan) => {
    selectedPlan.value = plan
    await calculateAssetAmmount()
}

const resetData = () => {
    totalProfits.value = 0

    profitPeriodAmount.value = 0
}

const calculateAssetAmmount = async () => {
    await debounce(async () => {

        if ((lastGettedAmount.value == amountStake.value || amountStake.value <= 0) && lastGettedPlan.value == selectedPlan.value.id) { return }


        if (isLoadingPreview.value) { return }

        if (amountStake.value <= 0) { return }

        isLoadingPreview.value = true
        try {

            let dataForm = {
                plan_id: selectedPlan.value.id,
                amount: amountStake.value
            }

            const data: AxiosResponse = await api.post<any[]>('stake/stake-validate', dataForm);
            let stakeData = data.data.data
            lastGettedAmount.value = amountStake.value
            lastGettedPlan.value = stakeData.plan_id

            profitPeriodCount.value = 0

            totalProfits.value = dex().nf(stakeData.total_profits)

            profitPeriodAmount.value = dex().nf(stakeData.profit_period_amount)

            profitPeriodCount.value = stakeData.profit_period_count

        } catch (error: any) {

            resetData()

            notif.dismissAll()
            notif.error(error.response.data.message)
        } finally {
            isLoading.value = false
            isLoadingPreview.value = false
        }



    }, 750)
}



</script>
<template>

    <div class="card">
        <div class="card-header custom-h">
            <h4 class="card-title h2  mb-0 ">
                <Vue3Lottie class="w-h-icon" :animationData="icons" :height="40" :width="40" /> Join
                {{ asset.token_code }}
                stake
                Plans
            </h4>
        </div>
        <div class="card-body exchange">

            <div class="row" v-if="hasPlans">
                <div class="col-xl-6 col-sm-6">
                    <h5 class="mb-4 ">Stake amount</h5>
                    <form @submit="confirm">


                        <Field v-slot="{ field, errorMessage }" name="amount">


                            <div class="form-group mb-3 row">
                                <div class="col-12">
                                    <label>{{ asset.token_code }}
                                        Amount</label>
                                    <div class="input-group flex-nowrap">
                                        <span class="input-group-text" id="addon-wrapping"><span class=" asset-icon"
                                                :class="'youdex-font-' + (asset.token_code).toLowerCase()"></span>
                                        </span>
                                        <input :readonly="isLoadingPreview" class="form-control "
                                            @keyup="calculateAssetAmmount()" v-model="amountStake" v-bind="field"
                                            :class="!errorMessage ? '' : 'is-invalid'" type="text" required
                                            placeholder="Amount">
                                    </div>
                                    <h6 class="input-btn-text" @click="setMaxBase()"> Set Max
                                        balance:
                                        <b> {{ dex().nf(balance) }}
                                        </b>
                                    </h6>

                                    <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                        aria-hidden="false">
                                        <li class="parsley-required">
                                            {{ errorMessage }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </Field>

                    </form>

                    <div class="row mt-4">

                        <h5 class="mb-4 ">Stake plans</h5>
                        <div class="plan-selec" @click="setPlan(_plan)"
                            :class="_plan.id == selectedPlan.id ? 'plan-selected' : ''"
                            v-for="(_plan, index)  of plans">

                            <div class="cont">
                                <div class="selected-icon">
                                    <Vue3Lottie v-if="selectedPlan.id == _plan.id" class="w-h-icon" :loop="false"
                                        :autoPlay="true" :animationData="checked" :height="20" :width="20" />
                                    <Vue3Lottie v-else class="w-h-icon" :loop="false" :autoPlay="false"
                                        :animationData="checkedp" :height="20" :width="20" />

                                </div>
                                <div class="titles">
                                    <p class="h6 ">
                                        {{ _plan.name }}
                                    </p>
                                    <p class="mb-0">
                                        <span class="sub-title">
                                            <b> Profit:</b>
                                            {{ _plan.percentile_profit }}%
                                            {{ _plan.period_type }}
                                        </span>

                                        <span class="sub-title">
                                            <b> Profit Period:</b>
                                            {{ _plan.percentile_profit }}%
                                            {{ stake().getPeriodName(_plan.profit_period_type) }}
                                        </span>
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="col-xl-6 col-sm-6">

                    <div class="row mt-0 profits">

                        <h5 class="mb-4 mt-1 text-left">Stake Profits</h5>


                        <div class="col-xl-6 col-sm-6">
                            <i class="ri-calendar-event-line"></i>
                            <h5>{{ stake().getPeriodName(selectedPlan.profit_period_type) }} profit</h5>

                            <div v-if="isLoadingPreview" class="u-box mt-4">
                                <content-loader viewBox="0 0 340 84" :speed="2" primaryColor="#2d3448"
                                    secondaryColor="#1d222e">
                                    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
                                    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
                                    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
                                    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
                                    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
                                    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
                                    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                </content-loader>
                            </div>
                            <div v-else>
                                <p class="h4 mb-2">
                                    <CommaNum :num="profitPeriodAmount"></CommaNum>

                                </p>
                                <p class="h4 mt-1">
                                    <span class="font-size-13 mb-2" style="opacity: .8">

                                        ({{ profitPeriodCount }}) {{ selectedPlan.profit_period_type }}</span>
                                </p>
                            </div>

                        </div>



                        <div class="col-xl-6 col-sm-6">
                            <i class="ri-calendar-check-line"></i>
                            <h5>Total profit</h5>
                            <div v-if="isLoadingPreview" class="u-box mt-4 mb-4">
                                <content-loader viewBox="0 0 340 84" :speed="2" primaryColor="#2d3448"
                                    secondaryColor="#1d222e">
                                    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
                                    <rect x="76" y="0" rx="3" ry="3" width="140" height="11" />
                                    <rect x="127" y="48" rx="3" ry="3" width="53" height="11" />
                                    <rect x="187" y="48" rx="3" ry="3" width="72" height="11" />
                                    <rect x="18" y="48" rx="3" ry="3" width="100" height="11" />
                                    <rect x="0" y="71" rx="3" ry="3" width="37" height="11" />
                                    <rect x="18" y="23" rx="3" ry="3" width="140" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                    <rect x="166" y="23" rx="3" ry="3" width="173" height="11" />
                                </content-loader>
                            </div>
                            <div v-else>
                                <p class="h4 mb-2">
                                    <CommaNum :num="totalProfits"></CommaNum>

                                </p>
                                <p class="h4 mt-1">
                                    <span class="font-size-13 mb-2" style="opacity: .8">
                                        ≈{{ selectedPlan.percentile_profit }}%</span>
                                </p>
                            </div>

                        </div>
                        <div class="line mt-2 mb-2"></div>
                    </div>
                    <div class="row ">
                        <div class="col-12">
                            <h5 class="mb-4 mt-3 text-left">Stake details</h5>
                            <ul>
                                <li><b> Profit period:</b> {{ stake().getPeriodName(selectedPlan.profit_period_type) }}
                                </li>
                                <li><b> Stake period:</b> {{ stake().getPeriodName(selectedPlan.period_type) }}
                                </li>
                                <li><b> Count profit period:</b> ({{ profitPeriodCount }})
                                    {{ selectedPlan.profit_period_type }}
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="line mt-2 mb-4"></div>

                    <b-button variant="primary" class="btn-r btn-m-s" v-if="isLoading" disabled>
                        <b-spinner small></b-spinner>
                        <span class="visually-hidden">Loading...</span>
                    </b-button>

                    <button @click="confirm" :disabled="isLoadingPreview" type="submit"
                        class="btn btn-m-s btn-r btn-success" v-if="!isLoading">
                        Start stake
                    </button>
                </div>


            </div>

        </div>

        <ConfirmModal :title="'Confirm your order'" ref="confirmModal">
            <template #modalcontent>
                <p class="h6 mb-4">Are you sure to do that?</p>
                <ul>
                    <li><b> Profit period:</b> {{ stake().getPeriodName(selectedPlan.profit_period_type) }}
                    </li>
                    <li><b> Stake period:</b> {{ stake().getPeriodName(selectedPlan.period_type) }}
                    </li>
                    <li><b> Count profit period:</b> ({{ profitPeriodCount }})
                        {{ selectedPlan.profit_period_type }}
                    </li>
                    <li><b> Stake amount:</b> {{ dex().nf(amountStake) }}
                    </li>
                </ul>

            </template>
            <template #modalfooter>

                <button type="button" class="btn btn-m-s btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>


                <b-button variant="primary" class=" btn-m-s" v-if="isLoading" disabled>
                    <b-spinner small></b-spinner>
                    <span class="visually-hidden">Loading...</span>
                </b-button>

                <button @click="saveStake" type="submit" class="btn btn-m-s btn-success" v-if="!isLoading">
                    Save
                </button>

            </template>
        </ConfirmModal>

    </div>

</template>

<style lang="scss">
.btn-r {
    float: right;
    min-width: 120px;

}

.cont {
    transition: all 0.500s;
    width: 100%;
    border: 1px solid #737476;
    margin-bottom: 20px;
    border-radius: 15px;
    padding: 12px 12px;
    display: flex;
    cursor: pointer;

    .sub-title {
        width: 100%;
        display: block;
    }

    .selected-icon {
        margin-right: 10px;
        margin-top: 14px;
    }
}

.plan-selected {
    .cont {
        border: 1px solid #33c38f;
    }

}

.hidden {
    display: none;
}

.text-right {
    text-align: right;
}

.text-left {
    text-align: left;
}


.inv-label {
    min-width: 50%;
    text-align: left;
    display: inline-block;
    position: relative;
}

.inv-val {
    min-width: 50%;
    display: inline-block;
    text-align: right;
    display: inline-block;
    position: relative;
    font-size: 1.2em;

}

.w-h-icon {
    width: 40px;
    display: -webkit-inline-box;
}

.custom-h {
    padding: 0.575rem 1.75rem;

    .card-title {
        font-size: 1.4em;
        font-weight: 400;
        margin: 0;
    }
}

.ft-c {
    text-transform: capitalize;
}
</style>