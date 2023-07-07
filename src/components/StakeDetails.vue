<script setup lang="ts">
import { AxiosResponse } from 'axios'
import { ref } from 'vue'
import { useApi } from '/@src/composable/useApi'
import { useNotyf } from '/@src/composable/useNotyf'
import { useUserSession } from '/@src/stores/userSession'
import { ContentLoader } from 'vue-content-loader'
import iconsMember from '/@src/assets/icons/member.json'
import iconsUp from '/@src/assets/icons/arrow-down.json'
import iconsDown from '/@src/assets/icons/arrpw-up.json'
import { dex, stake } from '../composable/useSettingsApp'
const userSession = useUserSession()



const props = defineProps<{
    stake?: any
}>()

const notif = useNotyf()

const plan = ref(props.stake.plan)

const totalProfits = ref(0)

const token = ref(dex().tokenOf(props.stake.plan.token_id))

const details = ref(props.stake.stake_details)

const profitPeriodCount = ref(props.stake.stake_details.profit_period_count)

profitPeriodCount.value = (parseInt(profitPeriodCount.value) !== 0) ? 1 : profitPeriodCount.value

const profitPeriodAmount = ref(0)

const sections = [
    { label: 'Red section', value: profitPeriodCount.value, color: '#33c38f' }
]

const loading = ref(false)

</script>

<template>

    <div class="row">
        <div class="col-xl-4 col-sm-4">

            <vc-donut :size="100" :unit="'px'" :foreground="'#4c556d'" :background="'#252c3b'" :sections="sections">
                <h6 class="cbm"> {{ details.deserved_profit_period }} </h6>
                <span>{{ details.profit_period_type }}</span>
            </vc-donut>

            <h5 class="mb-2 mt-4 text-center">
                <CommaNum :num="props.stake.amount"></CommaNum> <small>{{ token.token_code }}</small>
            </h5>

            <p class="mt-0 text-center">Period count ({{ details.profit_period_type }})
                {{ details.profit_period_count }} /
                {{ details.deserved_profit_period }}</p>

        </div>

        <div class="col-xl-8 col-sm-8">

            <div class="row mt-0 profits">



                <div class="col-xl-6 col-sm-6">
                    <p class="h3 mb-2">
                        <CommaNum :num="details.total_profits"></CommaNum>
                    </p>

                    <span class="h6 mb-2 text-muted">total profit</span>
                </div>



                <div class="col-xl-6 col-sm-6">
                    <p class="h3 mb-2">
                        <CommaNum :num="details.deserved_profit"></CommaNum>
                    </p>

                    <span class="h6 mb-2 text-muted">Deserved profit</span>
                </div>

            </div>
            <div class="row ">
                <div class="col-12">
                    <div class="line mt-4 mb-2"></div>
                    <h5 class="mb-4 mt-3 text-left">Stake details</h5>
                    <ul>
                        <li><b> Profit period:</b> {{ stake().getPeriodName(plan.profit_period_type) }}
                        </li>
                        <li><b> Stake period:</b> {{ stake().getPeriodName(plan.period_type) }}
                        </li>
                        <li><b> Count profit period:</b> ({{ profitPeriodCount }})
                            {{ plan.profit_period_type }}
                        </li>
                        <li><b> Status: </b>
                            <b-badge :variant="props.stake.status_class">{{ props.stake.status_title }}
                            </b-badge>
                        </li>
                    </ul>
                </div>

            </div>
        </div>



    </div>


</template>

<style lang="scss">
.cbm {
    margin: auto;
    display: block;
}
</style>