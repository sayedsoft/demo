<script setup lang="ts" >
import { computed, ref, watch } from 'vue';
import { useGlobalState } from '/@src/stores/appSettings';
import { dex } from '/@src/composable/useSettingsApp';
import icons from '/@src/assets/icons/rocket.json'
import * as yup from 'yup'
import { Field, useForm } from 'vee-validate'
import { useApi } from '/@src/stores/useApi';
import { useNotyf } from '/@src/composable/useNotyf';
import { AxiosResponse } from 'axios';
import ConfirmModal from '../modals/ConfirmModal.vue';
import { globalEvents } from '/@src/stores/globalEvents';
import LastOrders from './LastOrders.vue';


const globalEvent = globalEvents()


const exchangeSettings = ref<any>()

const isLoading = ref(false)

const confirmMode = ref(true)

const pair = ref(dex().pairOf('USDTU2'))

const price = ref(pair.value.price);

const baseAsset = ref(dex().tokenOf(pair.value.base_asset))

const baseBalance = computed(() => dex().balanceOf(pair.value.base_asset).balance)

const quoteAsset = ref(dex().tokenOf(pair.value.quote_asset))

const quoteBalance = computed(() => dex().balanceOf(pair.value.quote_asset).balance)

const pairName = ref(baseAsset.value.token_code + '/' + quoteAsset.value.token_code)

const amountBase = ref(0)

const amountQuote = ref(0)

const setMaxBase = () => {
    amountBase.value = dex().nf(baseBalance.value)
    setFieldValue('amountBase', baseBalance.value)
    calculateAssetAmmount('base')
}

const setMaxQuote = () => {
    amountQuote.value = dex().nf(quoteBalance.value)
    setFieldValue('amountQuote', quoteBalance.value)
    calculateAssetAmmount('quote')
}

const calculateAssetAmmount = (from: 'base' | 'quote') => {
    let type = (from == 'base') ? 'buy' : 'sell'
    let __amount = 0;
    if (type == 'buy') { __amount = amountBase.value } else if (type == 'sell') { __amount = amountQuote.value }

    if (isNaN(__amount)) {
        amountBase.value = 0
        amountQuote.value = 0
        return;
    }


    if (type == 'buy') {
        __amount = parseFloat(amountBase.value as any) / parseFloat(price.value);
        __amount = dex().nf(__amount)
        amountQuote.value = __amount
        setFieldValue('amountQuote', __amount)

    } else if (type == 'sell') {
        __amount = parseFloat(amountQuote.value as any) * parseFloat(price.value);
        __amount = dex().nf(__amount)
        amountBase.value = __amount
        setFieldValue('amountBase', __amount)
    }


}


const schema = yup.object({
    amountBase: yup
        .number()
        .required().label('Amount ' + baseAsset.value.token_code),
    amountQuote: yup.number().required().label('Amount ' + quoteBalance.value.token_code),
})


const { handleSubmit, setFieldValue, resetForm } = useForm
    ({
        validationSchema: schema,
    })

const notif = useNotyf()

const selectedSide = ref('')

const saveOrder = handleSubmit(async (values) => {


    const api = useApi();
    isLoading.value = true
    try {
        let dataForm = {
            base_amount: values.amountBase,
            qoute_amount: values.amountQuote,
            type: selectedSide.value,
            pair_id: pair.value.id
        }

        const data: AxiosResponse = await api.post<any[]>('exchange/order-save', dataForm);

        globalEvent.setEvent('updateBalance')

        globalEvent.setEvent2('ordersHasUpdated')

        resetForm()

        notif.success('Order has been sent!')


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

const confirm = (mode: 'SELL' | 'BUY') => {
    selectedSide.value = mode
    confirmModal.value.show();
}


</script>
<template>

    <div class="card">
        <div class="card-header custom-h">
            <h4 class="card-title h2  mb-0 ">
                <Vue3Lottie class="w-h-icon" :animationData="icons" :height="40" :width="40" /> Exchange <small>
                    ({{                      pairName                      }})
                </small>
            </h4>
        </div>
        <div class="card-body exchange">
            <div class="row">
                <form @submit="saveOrder">
                    <Field v-slot="{ field, errorMessage }" name="amountBase">


                        <div class="form-group mb-3 row">
                            <div class="col-12">
                                <label>{{                      baseAsset.token_code                      }}
                                    Amount</label>
                                <div class="input-group flex-nowrap">
                                    <span class="input-group-text" id="addon-wrapping"><span class=" asset-icon"
                                            :class="'youdex-font-' + (baseAsset.token_code).toLowerCase()"></span>
                                    </span>
                                    <input class="form-control " @keyup="calculateAssetAmmount('base')"
                                        v-model="amountBase" v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                                        type="text" required placeholder="Amount">
                                </div>
                                <h6 class="input-btn-text" @click="setMaxBase()"> Set Max
                                    balance:
                                    <b> {{                      dex().nf(baseBalance)                      }}
                                    </b>
                                </h6>

                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">
                                        {{                      errorMessage                      }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </Field>

                    <div class="icon">
                        <i class="youdex-font-switch-38"></i>
                    </div>

                    <Field v-slot="{ field, errorMessage }" name="amountQuote">


                        <div class="form-group mb-3 row">
                            <div class="col-12">
                                <label>{{                      quoteAsset.token_code                      }}
                                    Amount</label>
                                <div class="input-group flex-nowrap">
                                    <span class="input-group-text" id="addon-wrapping"><span class=" asset-icon"
                                            :class="'youdex-font-' + (quoteAsset.token_code).toLowerCase()"></span>
                                    </span>
                                    <input class="form-control " @keyup="calculateAssetAmmount('quote')"
                                        v-model="amountQuote" v-bind="field" :class="!errorMessage ? '' : 'is-invalid'"
                                        type="text" required placeholder="Amount">
                                </div>
                                <h6 class="input-btn-text" @click="setMaxQuote()"> Set Max
                                    balance:
                                    <b> {{                      dex().nf(quoteBalance)                      }}
                                    </b>
                                </h6>

                                <ul v-if="errorMessage" class="parsley-errors-list filled" id="parsley-id-11"
                                    aria-hidden="false">
                                    <li class="parsley-required">
                                        {{                      errorMessage                      }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </Field>


                    <div class="row">
                        <div class="col-12">
                            <div class="line mt-2 mb-2"></div>
                            <div class="detail text-right mt-2 mb-4">
                                <h5 class="text-left mt-4">Order Details</h5>
                                <h6 class="inv-details">
                                    <span class="inv-label text-left">Per token price
                                        <small>({{                                             quoteAsset.token_code                                             }})</small>:
                                    </span>
                                    <span class="inv-val">
                                        {{                                              pair.price                                             }}
                                    </span>

                                </h6>


                                <h6 class="inv-details">
                                    <span class="inv-label text-left">Total
                                        <small>({{                                             baseAsset.token_code                                             }})</small>:
                                    </span>
                                    <span class="inv-val">
                                        {{                                               amountBase                                              }}
                                    </span>
                                </h6>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="line mt-2 mb-4"></div>
                </div>

                <div class="col-6">

                    <b-button class="mx-1 w-100" @click="confirm('BUY')" type="button" :disabled="isLoading"
                        variant="success">
                        Buy {{                      quoteAsset.token_code                      }}
                    </b-button>
                </div>

                <div class="col-6">


                    <b-button @click="confirm('SELL')" class="mx-1 w-100" type="submit" :disabled="isLoading"
                        variant="danger">
                        Sell {{    quoteAsset.token_code    }}
                    </b-button>

                </div>

            </div>

        </div>

        <ConfirmModal :title="'Confirm your order'" ref="confirmModal">
            <template #modalcontent>
                <p class="h6 mb-4">Are you sure to do that?</p>
                <p><b>Base amount :</b> {{       amountBase      }}
                    ({{    baseAsset.token_code     }})
                </p>
                <p><b>Qoute amount :</b>
                    {{    amountQuote     }}
                    ({{     quoteAsset.token_code    }})
                </p>
            </template>
            <template #modalfooter>

                <button type="button" class="btn btn-m-s btn-secondary" data-bs-dismiss="modal">
                    Close
                </button>


                <b-button variant="primary" class=" btn-m-s" v-if="isLoading" disabled>
                    <b-spinner small></b-spinner>
                    <span class="visually-hidden">Loading...</span>
                </b-button>

                <button @click="saveOrder" type="submit" class="btn btn-m-s btn-success" v-if="!isLoading">
                    Save
                </button>

            </template>
        </ConfirmModal>

    </div>

</template>

<style lang="scss">
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
</style>