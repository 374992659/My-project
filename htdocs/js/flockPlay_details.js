$(document).ready(function(){
    // 时间戳转换函数
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
    }
    "use strict";
        // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
        // 获取群号
   group_num=localStorage.getItem("group_num"),
        // 获取活动id
   activity_id=localStorage.getItem("activity_id"),
    // 数据格式转换
   data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"activity_id":activity_id})];
     // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(jsonEncryptData);
    console.log(data);
    $.ajax({
        url:url+"group_getGroupActivityInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success: function (data) {
                // 解密
                var data=jsDecodeData(data);
                console.log(data);
                if (data.errcode === 0) {
                    var result = data.data;
                    localStorage.setItem("apptoken",data.apptoken);
                    var picStr=result.picture;
                    var picObj=JSON.parse(picStr);
                    var pic="";
                    var tag="";
                    if(picObj){
                        $.each(picObj,function(i,item){
                            pic+=`
                        <div class="swiper-slide"><img src="${item}" style="height:200px"/></div>
                        `
                        });
                    }

                    var tagStr=result.tag;
                    var tagObj=JSON.parse(tagStr);
                    if(tagObj){
                        $.each(tagObj,function(i,item){
                            tag+=`
                        <div class="weui-flex__item"><div class="placeholder">${item}</div></div>
                        `
                        });
                    }

                    var html=`              
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    //<div class="swiper-slide">
                    //    <img alt="" src="http://wx.okair.net/wxpic/wxb2c/indexpage/index_banner1.jpg">
                    //</div>
                    //<div class="swiper-slide">
                    //    <img alt="" src="http://wx.okair.net/wxpic/wxb2c/indexpage/index_banner2.jpg">
                    //</div>
                    //<div class="swiper-slide">
                    //    <img alt="" src="http://wx.okair.net/wxpic/wxb2c/indexpage/index_banner3.jpg">
                    //</div>
                </div>
                <div class="swiper-pagination"></div> <!--需要轮播序号的时候写-->
            </div>
        <!--标签-->
        <div class="weui-flex">
            // <div class="weui-flex__item"><div class="placeholder">美女</div></div>
            // <div class="weui-flex__item"><div class="placeholder">帅哥</div></div>
            // <div class="weui-flex__item"><div class="placeholder">自驾</div></div>
            // <div class="weui-flex__item"><div class="placeholder">happy</div></div>
        </div>
        <!--标题-->
        <div class="weui-cell" style="padding: 0">
            <div class="weui-cell__bd">
                <p style="font-size: 15px;font-weight: bold">标题：${result.title}</p>
            </div>
        </div>
        <!--活动内容-->
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>开始时间：${getLocalTime(result.start_time)}</p>
            </div>         
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                    <p>结束时间：${getLocalTime(result.end_time)}</p>
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>集合地点：${result.collection_place}</p>
            </div>
            
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>集合时间：${getLocalTime(result.collection_time)}</p>
            </div>
           
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>发起人：${result.contact}</p>
            </div>
           
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>联系方式：${result.phone}</p>
            </div>
          
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>所属小区：${result.garden_name}</p>
            </div>          
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>目标人数：${result.total_num}</p>
            </div>
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>费用类型：${result.cost_type}</p>
            </div>            
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>预计人均消费：${result.average_cost}</p>
            </div>          
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>目的地：${result.destination}</p>
            </div>           
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>交通工具：${result.transport}</p>
            </div>            
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>线路规划：${result.rote_planning}</p>
            </div>      
       </div>
        <div class="weui-cells">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <p>更多介绍：${result.detailed_introduction}</p>
                </div>
            </div>
        </div>
               
              <!--按钮-->
        <button class="weui-btn weui-btn_primary Btn" style="margin-top: 10px" value="${result.id}" title="${result.enroll_status}" id="${result.group_num}"></button>   
               <table class="enrollList">
             <tr>
                <td>报名人信息</td>
                <td>总人数 <span>${result.enroll_total}</span></td>
             </tr>
        </table>  
                `;
                    var enrollList="";
                    if(result.enroll_list){
                        $.each(result.enroll_list,function (i,item) {
                            var httP=item.portrait.split(":")[0];
                            var pic="";
                            if(httP==="http"){
                                pic=item.portrait;
                            }else{
                                pic="http://wx.junxiang.ren/project/"+item.portrait
                            }
                            enrollList+=`
                            <tr>
                                <td>
                                    <div  class="weui-media-box weui-media-box_appmsg">
                                        <div class="weui-media-box__hd">
                                            <img class="weui-media-box__thumb" src="${pic}" alt="">
                                        </div>
                                        <div class="weui-media-box__bd">
                                            <h4 class="weui-media-box__title" style="text-align: left">${item.name}</h4>
                                            <a href="tel:15928698477" class="weui-media-box__desc" style="text-align: left">${item.phone}</a>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    ${item.num}
                                </td>
                            </tr>
                        
                        `
                        })
                    }
                    console.log(result.enroll_status);
                    console.log(typeof result.enroll_status);
                    $("#flockPlay_details").html(html);
                    $(".swiper-wrapper").html(pic);
                    $(".weui-flex").html(tag);
                    $(".enrollList").append(enrollList);
                    if (parseInt(result.enroll_status)===0){
                        console.log("我要报名");
                        $(".Btn").html("我要报名");
                    }else if(parseInt(result.enroll_status)===1){
                        console.log("取消报名");
                        $(".Btn").html("取消报名");
                    }
                }
            }

    });
    var mySwiper = new Swiper('.swiper-container', {
        pagination : '.swiper-pagination',
        loop : true,
        autoplay : 3000
    });
    var mySwiper = new Swiper('.swiper-container', {
        pagination : '.swiper-pagination',
        loop : true,
        autoplay : 3000,
        autoplayDisableOnInteraction : false    /* 注意此参数，默认为true */
    });
    // 我要报名
    $("#flockPlay_details").on("click", ".Btn", function () {
        var status=$(this).attr("title");
        var group_num=$(this).attr("id");
        var activity_id=$(this).attr("value");
        //报名
        if(parseInt(status)===0){
            localStorage.setItem("activity_id",activity_id);
            window.location.href = "flockPlay_apply.html";
        }else{//取消报名
            if(confirm("取消报名")){
                var data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"activity_id":activity_id})];
                var jsonEncryptData=jsEncryptData(data);
                $.ajax({
                    url:url+"group_cancelGroupActivityEnroll",
                    type:"POST",
                    data:{"data":jsonEncryptData},
                    success:function(data){
                        var data=jsDecodeData(data);
                        console.log(data);
                        if(data.errcode===0){
                            localStorage.setItem("apptoken",data.apptoken);
                            window.location.reload()
                        }else{
                            showHide(data.errmsg)
                        }

                    }
                })
            }
        }
    });
    $(function(){
        pushHistory();
        window.addEventListener("popstate", function(e) {
            window.location.href="flockPlay.html";
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