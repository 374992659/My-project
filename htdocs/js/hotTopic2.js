$(document).ready(function(){
    "use strict";
    //构造函数
    function hotTopicList(apptoken,city_id,garden_code){
        // apptoken
        this.apptoken=apptoken;
        // 城市id在注册的时候就存本地
        this.city_id=city_id;
        // 小区id
        this.garden_code=garden_code;
        this.hotTopic=function(){
            // 数据格式转换
            console.log(123);
            var data=["",JSON.stringify({"apptoken":apptoken,"city_id":city_id,"garden_code":garden_code})];
            // 加密
            var jsonEncryptData=jsEncryptData(data);
            console.log(data);
            $.ajax({
                url:url+"Subject_getSubjectList",
                type:"POST",
                data:{"data":jsonEncryptData},
                success:function(data){
                    // 解密
                    console.log(data);
                    var data=jsDecodeData(data);
                    console.log(data);
                    if(data.errcode===0){
                        var html="";
                        localStorage.setItem("apptoken",data.apptoken);
                        $.each(data.data,function(i,item){
                            if(parseInt(item.status)===1){
                                html+=`
                    <div  class="hotTopicA" value="${item.subject_id}" title="${item.garden_code}">
                        <div class="weui-media-box weui-media-box_text" style="padding-bottom: 5px;border-bottom: 1px solid #b2b2b2">
                            <div class="headline">
                                <h4 class="weui-media-box__title lf" style="font-size: 15px;">${item.title}</h4>
                                <span class="right" style="font-size: 13px;color: red">未解决</span>
                            </div>

                            <p class="weui-media-box__desc" style="font-size: 12px">${item.content}</p>
                            <div style="font-size: 12px;text-align: right;color: #c2c0be">阅读量 <span>${item.read_num}</span> 回帖数 <span>${item.commont_num}</span></div>
                        </div>
                    </div>                          
                            `
                            }else{
                                html+=`
                    <div class="hotTopicA" value="${item.subject_id}" title="${item.garden_code}">
                        <div class="weui-media-box weui-media-box_text" style="padding-bottom: 5px;border-bottom: 1px solid #b2b2b2">
                            <div class="headline">
                                <h4 class="weui-media-box__title lf" style="font-size: 15px;">${item.title}</h4>
                                <span class="right" style="font-size: 13px;color: green">已解决</span>
                            </div>

                            <p class="weui-media-box__desc" style="font-size: 12px">${item.content}</p>
                            <div style="font-size: 12px;text-align: right;color: #c2c0be">阅读量 <span>${item.read_num}</span> 回帖数 <span>${item.commont_num}</span></div>
                        </div>
                    </div>                          
                            `

                            }

                        });
                        $(".hotTopicList").append(html)
                    }else{
                      $(".hotTopicList").html(data.errmsg);
                    }
                }
            })
        }
    }
    //功能 获取认证小区情况
    (function(){
        // 获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        $.ajax({
            url:url+"UserCenter_getApplicationGarden",
            type:"POST",
            data:{"data":json},
            success:function(data){
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    var html="";
                    $.each(data.data,function(i,item){
                        html+=`
                         <option title="${item.garden_code}">${item.garden_name}</option>                     
                        `
                    });
                    $("#plot").append(html);
                }
            }
        })
    })();

    // 获取apptoken
    var apptokne=localStorage.getItem("apptoken"),
        garden_code="",
    // 获取城市id
        city_id=localStorage.getItem("city_id");
    // 页面加载的时候传参数调用构造函数
    var hot=new hotTopicList(apptokne,city_id,garden_code);
    hot.hotTopic();
    // 功能2  城市发生改变的时候
    $("#city").change(function(){
        $(".hotTopicList").empty();
        // 获取改变的城市id
        var  city_id= $("#city option:selected").val();
        var  garden_code=$("#plot option:selected").attr("title");
        localStorage.setItem("city_id",city_id);
        var cityChange=new hotTopicList(apptokne,city_id,garden_code);
        cityChange.hotTopic();
    });
    // 功能3 当小区发送改变的时候
    $("#plot").change(function(){
        $(".hotTopicList").empty();
        var  city_id= $("#city option:selected").val();
        var  garden_code=$("#plot option:selected").attr("title");
        var cityChange=new hotTopicList(apptokne,city_id,garden_code);
        cityChange.hotTopic();
    });
    // 功能4 在页面跳转前把话题id和话题发布所属小区存在本地下一个页面加载的时候调用
    $(".hotTopicList").on("click",".hotTopicA",function () {
        // 获取话题id
        var id=$(this).attr("value"),
        // 获取所属小区
           code=$(this).attr("title");
        console.log("页面跳转");
        console.log(id);
        console.log(code);
        if(id&&code){
            localStorage.setItem("subject_id",id);
            localStorage.setItem("garden_code",code);
            window.location.href="hotTopic_myTopicText.html";
        }

    });
    $(function(){
        pushHistory();
        window.addEventListener("popstate", function(e) {
            window.location.href="index.html";
        }, true);
        function pushHistory() {
            var state = {
                title: "title",
                url: "#"
            };
            window.history.pushState(state, "title", "#");
        }
    });
});