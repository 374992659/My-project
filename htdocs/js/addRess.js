var addRess=function(){
    $(document).ready(function(){
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            type:"post",
            success:function(data) {
                data=jsDecodeData( data );
                var result = data.data;
                console.log(result);
                $(function () {
                    var pro = $("#province"),
                        city = $("#city"),
                        dAC = $("#districtAndCounty"),
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
var addRess1=function(){
    $(document).ready(function(){
        $.ajax({
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            type:"post",
            success:function(data) {
                data=jsDecodeData( data );
                var result = data.data;
                $(function () {
                    var pro = $(".province"),
                        city = $(".city"),
                        dAC = $("#districtAndCounty"),
                        num1 = null,
                        num2 = null;
                    init();
                    <!-- 省改变 -->
                    pro.change(function () {
                        var num1=$(this).val();
                        city.find("option").eq(0).siblings().remove();
                        dAC.find("option").eq(0).siblings().remove();
                        if (num1 !== 0) {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].parent_id!=="0000"&& result[i].parent_id===num1) {
                                    console.log(12314);
                                    var $item = $("<option value="+result[i].id +">" + result[i].name + "</option>");
                                    city.append($item);
                                }
                            }
                        }
                    });
                    function init() {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].parent_id==="0000") {
                                var item = $("<option value="+result[i].id+" parent_id="+result[i].parent_id +">"+result[i].name+"</option>");
                                pro.append(item);
                            }
                        }
                    }
                });
            }
        });
    });



};