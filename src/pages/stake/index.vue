<script setup lang="ts">
import { AxiosResponse } from 'axios'


</script>

<template>


    <Breadcrumb title="Stake"></Breadcrumb>

    <div class="row">

        <div class="col-lg-8">
            <LastStakes></LastStakes>

            <StakeCard></StakeCard>
        </div>

        <div class="col-lg-4">
            <AssetsCard></AssetsCard>
        </div>
    </div>

</template>

<style lang="scss">
</style>
