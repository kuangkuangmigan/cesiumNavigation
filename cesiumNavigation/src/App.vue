<template>
    <div id="container" style="width: 100vw;height: 100vh;"></div>
    <div class="inputBox">
        <input type="text" id="beginPlace" @change="getTip()" v-model="beginPlace">
        <input type="text" id="endPlace" v-model="endPlace">
        <button @click="getPolyline(beginPlace, endPlace)" class="navButton">确定</button>
    </div>
    <div id="amapContainer"></div>
</template>
<script setup>
import * as Cesium from "cesium"
import { onMounted, onUnmounted } from "vue"
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref } from "vue"
let map = null
let viewer = null
let Amap = null
const beginPlace = ref('')
const endPlace = ref('')
let arrStartlng
let arrStartlat
let arrEndlat
let arrEndlng
const getPolyline = (beginPlace, endPlace) => {
    let arrStart = []
    let arrend = []

    //地理编码
    Amap.plugin('AMap.Geocoder', function () {
        const geocoder = new Amap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: beginPlace
        })
        geocoder.getLocation(beginPlace, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                // console.log(status);

                arrStartlng = result.geocodes[0].location.lng
                arrStartlat = result.geocodes[0].location.lat


                arrStart.push(result.geocodes[0].location.lng)
                arrStart.push(result.geocodes[0].location.lat)

            }
        })
    })
    Amap.plugin('AMap.Geocoder', function () {
        const geocoder = new Amap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: endPlace
        })
        geocoder.getLocation(endPlace, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                arrEndlat = result.geocodes[0].location.lat
                arrEndlng = result.geocodes[0].location.lng
                arrend.push(result.geocodes[0].location.lng)
                arrend.push(result.geocodes[0].location.lat)
            }
        })
    })
    if (arrStartlng !== undefined && arrEndlat !== undefined) {
        console.log([arrStartlng, arrStartlat]);
        console.log([arrEndlng, arrEndlat]);

        //导航
    Amap.plugin('AMap.Driving', function () {
        const driving = new Amap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: Amap.DrivingPolicy.LEAST_TIME
        })
        // const startLngLat = arrStart
        // const endLngLat = arrend
        // console.log(arrStartlng);
        // console.log([arrStartlng, arrStartlng]);





        driving.search([arrStartlng, arrStartlat], [arrStartlng, arrStartlat], function (status, result) {
            // 未出错时，result即是对应的路线规划方案
            console.log(status);
            console.log(result);

        })
    })
    }
    else {
        console.log('数据未填充');

    }
    // console.log(arrend);


    

}
const getTip = () => {
    // map.Autocomplete({
    //     datatype:poi,
    //     input:beginPlace,

    // })
}
onMounted(() => {

    // 初始化cesium
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmMjE1M2IyNy03ZTU1LTRmYTUtYTI2OS1jZjI2ZTRmNTU3Y2IiLCJpZCI6MjMyOTE5LCJpYXQiOjE3MjI5MjgwMDB9.r-V590GMmLIYY31pN17z0KBxUapfaXN_xciHahKDaXA';
    viewer = new Cesium.Viewer('container', {
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        // 注意：infoBox可能不是所有Cesium版本都直接支持作为option  
        sceneModePicker: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false,
        infoBox: false
    })

    // 引入高德地图方便使用对应的API
    window._AMapSecurityConfig = {
        securityJsCode: "9483d04db4a59a9463a3b3f49a6420bc",
    };
    AMapLoader.load({
        key: "59fc66433305636cd4a1f73bce3e9798", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Autocomplete", "AMap.Driving", "AMap.Geocoder"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    })
        .then((AMap) => {
            Amap = AMap
            map = new AMap.Map("amapContainer");


        })
        .catch((e) => {
            console.log(e);
        });




})
onUnmounted(() => {
    map?.destroy();
})
</script>

<style>
#beginPlace {
    position: absolute;
    top: 20px;
    left: 100px;
}

#endPlace {
    position: absolute;
    top: 20px;
    left: 320px;
}

.navButton {
    position: absolute;
    top: 20px;
    left: 500px;
}

#amapContainer {
    display: none;
}
</style>