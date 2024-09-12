<template>
<div id="container"></div>

</template>
<script setup>
import * as Cesium from "cesium" 

import { onMounted } from "vue";
onMounted(() => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMjE1M2IyNy03ZTU1LTRmYTUtYTI2OS1jZjI2ZTRmNTU3Y2IiLCJpZCI6MjMyOTE5LCJpYXQiOjE3MjI5MjgwMDB9.r-V590GMmLIYY31pN17z0KBxUapfaXN_xciHahKDaXA'; 
    const viewer = new Cesium.Viewer('container')


})

</script>

<style>


</style>