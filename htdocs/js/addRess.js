var addRess=function(){
    $(document).ready(function(){
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            type:"post",
            success:function(data) {
                data=jsDecodeData( data );
                var result = data.data;
               // console.log(result);
                $(function () {
                    var pro = $("#province"),
                        city = $("#city"),
                        dAC = $("districtAndCounty"),
                        num1 = null,
                        num2 = null;
                    init();
                    <!-- 省改变 -->
                    pro.change(function () {
                        var num1=$(this).val();
                        city.find("option").eq(0).siblings().remove();
                        dAC.find("option").eq(0).siblings().remove();
                        if (num1 !== 0) {
                            for (var i = 0; i < result.city.length; i++) {
                                if(num1 === result.city[i].parent_id){
                                    console.log(12314);
                                    var $item = $("<option value="+result.city[i].id +">" + result.city[i].city + "</option>");
                                    city.append($item);
                                }

                            }
                        }
                    });
                    function init() {
                       // console.log("加载省");
                        for (var i = 0; i < result.province.length; i++) {
                            var item = $("<option value="+result.province[i].id+" parent_id="+result.province[i].province +">"+result.province[i].province+"</option>");
                           pro.append(item);
                        }
                    }
                });
            }
        });
    });
};
var addRess1=function(){
    $(document).ready(function(){
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            type:"post",
            success:function(data) {
                data=jsDecodeData( data );
                var result = data.data;
               // console.log(result);
                $(function () {
                    var pro = $(".province1"),
                        city = $(".city1"),
                        dAC = $(".districtAndCounty1"),
                        num1 = null,
                        num2 = null;
                    init();
                    <!-- 省改变 -->
                    pro.change(function () {
                        var num1=$(this).val();
                        city.find("option").eq(0).siblings().remove();
                        dAC.find("option").eq(0).siblings().remove();
                        if (num1 !== 0) {
                            for (var i = 0; i < result.city.length; i++) {
                                if(num1 === result.city[i].parent_id){
                                    console.log(12314);
                                    var $item = $("<option value="+result.city[i].id +">" + result.city[i].city + "</option>");
                                    city.append($item);
                                }

                            }
                        }
                    });
                    function init() {
                        for (var i = 0; i < result.province.length; i++) {
                            var item = $("<option value="+result.province[i].id+" parent_id="+result.province[i].province +">"+result.province[i].province+"</option>");
                            pro.append(item);
                        }
                    }
                });
            }
        });
    });
};
var addRess2=function(){
    $(document).ready(function(){
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            type:"post",
            success:function(data) {
                data=jsDecodeData( data );
                var result = data.data;
                //console.log(result);
                $(function () {
                    var pro = $(".province2"),
                        city = $(".city2"),
                        dAC = $(".districtAndCounty2"),
                        num1 = null,
                        num2 = null;
                    init();
                    <!-- 省改变 -->
                    pro.change(function () {
                        var num1=$(this).val();
                        city.find("option").eq(0).siblings().remove();
                        dAC.find("option").eq(0).siblings().remove();
                        if (num1 !== 0) {
                            for (var i = 0; i < result.city.length; i++) {
                                if(num1 === result.city[i].parent_id){
                                    console.log(12314);
                                    var $item = $("<option value="+result.city[i].id +">" + result.city[i].city + "</option>");
                                    city.append($item);
                                }

                            }
                        }
                    });
                    function init() {
                        for (var i = 0; i < result.province.length; i++) {
                            var item = $("<option value="+result.province[i].id+" parent_id="+result.province[i].province +">"+result.province[i].province+"</option>");
                            pro.append(item);
                        }
                    }
                });
            }
        });
    });
};