<script setup lang="ts">
import { useDarkMode } from '../stores/useDarkMode';

const darkMode = useDarkMode();


</script>

<template>
    <div id="layout-wrapper">
        <PageHeader></PageHeader>
        <div class="main-content">
            <div class="page-content">
                <div class="container-fluid">
                    <slot></slot>
                </div>
            </div>

        </div>
    </div>
</template>