// 获取地理编码
export const getGeoCode = (beginPlace, endPlace) => {
    Amap.plugin('AMap.Geocoder', function () {
        const geocoder = new Amap.Geocoder()
        geocoder.getLocation(beginPlace, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                // console.log(status);
                startlng = result.geocodes[0].location.lng
                startlat = result.geocodes[0].location.lat
            }
        })
    })

    Amap.plugin('AMap.Geocoder', function () {
        const geocoder = new Amap.Geocoder()
        geocoder.getLocation(endPlace, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                endlat = result.geocodes[0].location.lat
                endlng = result.geocodes[0].location.lng
            }
        })
    })

}
// 获取输入框提示
export const getTip = () => {
    Amap.plugin("AMap.AutoComplete", function () {
        var autoOptions = {
            input: "beginPlace", 
        };
        var autoComplete = new Amap.AutoComplete(autoOptions);
    });
    
   
}
