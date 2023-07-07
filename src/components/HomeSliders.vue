<script setup lang="ts">
import { ref } from 'vue';
import { VueperSlides, VueperSlide } from 'vueperslides'
const slides = ref([
    {
        title: 'Slide #1',
        content: 'Slide 1 content.',
        image: '/assets/images/banner-1.jpg'
    },
    {
        title: 'Slide #2',
        content: 'Slide 2 content.',
        image: '/assets/images/banner-2.jpg'
    }
]) 
</script>

<template>

    <vueper-slides autoplay>
        <vueper-slide v-for="(slide, i) in slides" :key="i" :image="slide.image">
        </vueper-slide>
    </vueper-slides>

</template>