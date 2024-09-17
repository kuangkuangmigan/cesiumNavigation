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
// 用于地理编码
let startlng
let startlat
let endlat
let endlng
// 用于导航
let polyArray = []
let fly = []
let pointResult
let pathArray = []

const getPolyline = (beginPlace, endPlace) => {
    Amap.plugin('AMap.Driving', function () {
        // 多次调用时将数据清空
        polyArray = []
        pathArray = []
        fly = []
        const driving = new Amap.Driving({
            // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
            policy: Amap.DrivingPolicy.LEAST_TIME
        })
        var points = [
            { keyword: beginPlace }, //起始点
            { keyword: endPlace }, //终点
        ]
        driving.search(points, function (status, result) {
            // 未出错时，result即是对应的路线规划方案
        

            pointResult = result.routes[0].steps
            for (let index = 0; index < pointResult.length; index++) {
                pathArray.push(pointResult[index].path)

            }
       

            for (let index = 0; index < pathArray.length; index++) {
                for (let i = 0; i < pathArray[index].length; i++) {
                    polyArray.push(pathArray[index][i].lng)
                    polyArray.push(pathArray[index][i].lat)
                }
            }
            fly.push(polyArray[(polyArray.length / 2) % 2 == 0 ? (polyArray.length / 2) : (polyArray.length / 2) + 1])
            fly.push(polyArray[(polyArray.length / 2) % 2 == 0 ? (polyArray.length / 2) + 1 : (polyArray.length / 2) + 2])
            drawPolyline(polyArray)
        })
    })


}

const drawPolyline = (polyArray) => {
    viewer.entities.removeAll()
    const polyline = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(polyArray),//笛卡尔数组
            width: 3,
            material: Cesium.Color.ORANGE

        }
    })
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(fly[0], fly[1], 2000000),
        duration: 2.5,

    })
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
        securityJsCode: "0e052cef14c393f5d126ef33f78bb34f",
    };
    AMapLoader.load({
        key: "c23f6d06721dd49b9e5eb9a55210b0b6", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.AutoComplete", "AMap.Driving", "AMap.Geocoder"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
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

