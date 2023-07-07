<script setup lang="ts">
import { AxiosResponse } from 'axios'


</script>

<template>


    <Breadcrumb title="Exchange"></Breadcrumb>

    <div class="row">

        <div class="col-lg-8">
            <ExchangeCard></ExchangeCard>

            <LastOrders></LastOrders>
        </div>

        <div class="col-lg-4">
            <AssetsCard></AssetsCard>
        </div>
    </div>

</template>

<style lang="scss">
</style>
