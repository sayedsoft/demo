<script setup lang="ts">
import { string } from 'yup';


export type DFFieldProps = {
    label?: any
    type?: any
    name?: any
}


const props = {
    label: {
        default: undefined,
        require: true
    },
    typeFeild: {
        default: 'text',
        require: true
    },
    nameFeild: {
        default: '',
        require: true
    },
    feild: {
        require: true
    },
    errorMessage: {
        require: true
    }
}

</script>

<template>


</template>