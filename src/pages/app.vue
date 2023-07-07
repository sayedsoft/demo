<route lang="yaml">
meta:
  requiresAuth: true
</route>
 
<script setup lang="ts">

import { useRoute } from 'vue-router'
import ExchangeCard from '../components/cards/ExchangeCard.vue';
import stakedIcon from '/@src/assets/icons/staked.json'
import AssetsCard from '../components/cards/AssetsCard.vue'
import { useHead } from '@vueuse/head';
import { dex } from '../composable/useSettingsApp';
import { ref } from 'vue';
import LastOrders from '../components/cards/LastOrders.vue';
import LastStakes from '../components/cards/LastStakes.vue';
import StakeCard from '../components/cards/StakeCard.vue';

const token_id = ref(2);
const token = ref(dex().tokenOf(token_id.value));
const staked = ref(dex().totalOf('STAKED', 2))
const stakeProfits = ref(dex().totalOf('STAKEPROFIT', 2))
const referralIncome = ref(dex().totalOf('REFERRALINCOME', 2))
const token_icon = ref('youdex-font-' + new String(token.value.token_code).toLowerCase())
useHead({
    title: 'Youdex | Dashboard',
})
</script>

<template>
    <AppLayout>

        <Breadcrumb title="Dashboard"></Breadcrumb>

        <div class="row">
            <div class="col-lg-8">
                <div class="row">
                    <HomeSliders class="mb-4"></HomeSliders>
                </div>
                <div class="row carts">

                    <!-- end col -->
                    <div class="col-xl-4 col-md-6">
                        <div class="card overflow-hidden">
                            <div class="card-content">
                                <div class="card-body with-p cleartfix">
                                    <div class="media align-items-stretch">
                                        <div class="with-icon">
                                            <div class="icon-width">
                                                <h4 class="asset_name">
                                                    <i :class="token_icon" class="asset-icon"></i>
                                                </h4>
                                                <h6> {{token.token_code}}</h6>
                                            </div>
                                            <div>
                                                <div class="align-self-center">
                                                    <h1 class="mb-0 h4">
                                                        {{ staked.value }}
                                                    </h1>
                                                </div>
                                                <div class="media-body">
                                                    <span>≈{{ staked.converted }}$</span>
                                                    <h4 class="mt-2 title-s">Total Staked</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card -->
                    </div>
                    <!-- end col -->

                    <!-- end col -->
                    <div class="col-xl-4 col-md-6">
                        <div class="card overflow-hidden">
                            <div class="card-content">
                                <div class="card-body with-p cleartfix">
                                    <div class="media align-items-stretch">
                                        <div class="with-icon">
                                            <div class="icon-width">
                                                <h4 class="asset_name">
                                                    <i :class="token_icon" class="asset-icon"></i>
                                                </h4>
                                                <h6> {{token.token_code}}</h6>
                                            </div>
                                            <div>
                                                <div class="align-self-center">
                                                    <h1 class="mb-0 h4">
                                                        {{ stakeProfits.value }}
                                                    </h1>
                                                </div>
                                                <div class="media-body">
                                                    <span>≈{{ stakeProfits.converted }}$</span>
                                                    <h4 class="mt-2 h6 title-s">Total Profits</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card -->
                    </div>
                    <!-- end col -->


                    <!-- end col -->
                    <div class="col-xl-4 col-md-6">
                        <div class="card overflow-hidden">
                            <div class="card-content">
                                <div class="card-body with-p cleartfix">
                                    <div class="media align-items-stretch">
                                        <div class="with-icon">
                                            <div class="icon-width">
                                                <h4 class="asset_name">
                                                    <i :class="token_icon" class="asset-icon"></i>
                                                </h4>
                                                <h6> {{token.token_code}}</h6>
                                            </div>
                                            <div>
                                                <div class="align-self-center">
                                                    <h1 class="mb-0 h4">
                                                        {{ referralIncome.value }}
                                                    </h1>
                                                </div>
                                                <div class="media-body">
                                                    <span>≈{{ referralIncome.converted }}$</span>
                                                    <h4 class="mt-2 h6 title-s">Referral Income</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- end card -->
                    </div>
                    <!-- end col -->

                </div>
                <!-- end row -->
                <div class="row">
                    <div class="col-12">
                        <StakeCard></StakeCard>
                    </div>

                </div>
                <div class="row">
                    <div class="col-12">
                        <LastStakes></LastStakes>
                    </div>
                    <div class="col-12">
                        <LastOrders></LastOrders>
                    </div>


                </div>
            </div>

            <div class="col-lg-4">
                <AssetsCard></AssetsCard>


                <ExchangeCard></ExchangeCard>


                <InviteCard></InviteCard>

            </div>
            <!-- end col -->
        </div>



    </AppLayout>
</template>
<style lang="scss">
.with-icon {
    display: flex;

    .icon-width {
        .asset_name {
            font-size: 1em;
        }

        text-align: center;
        width: auto;
        padding: 1em;
        border-right: 1px solid #404552;
        margin-right: 1em;
    }

}

.with-p {
    padding: 1.4em 0.7em;
}

.title-s {
    font-size: .8em;
}
</style>
  