<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import { dex } from '/@src/composable/useSettingsApp';

const props = defineProps<{
    num: string
}>()

const num = computed(() => props.num)
const hasCo = computed(() => dex().numHasComma(num.value))
const comma = computed(() => dex().numComppor(num.value)) 
</script>

<template>
    <span class="formatted_num" v-if="hasCo">
        <span class="org_num">{{ comma[0] }}</span>
        <span class="dec_point">.</span>
        <span class="dec_num">{{ comma[1] }}</span>
    </span>

    <span class="formatted_num" v-else>
        <span class="org_num">{{ num }}</span>
    </span>
</template>

<style>
</style>