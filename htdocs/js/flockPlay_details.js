$(document).ready(function(){
    "use strict";
        // 获取apptoken
    var apptoken=localStorage.getItem("apptoken"),
        // 获取群号
   group_num=localStorage.getItem("group_num"),
        // 获取活动id
   activity_id=localStorage.getItem("activity_id"),
    // 数据格式转换
   data=["",JSON.stringify({"apptoken":apptoken,"group_num":group_num,"acticity_id":activity_id})];
     // 加密
    var jsonEncryptData=jsEncryptData(data);
    console.log(jsonEncryptData);
    console.log(data);
    $.ajax({
        url:url+"group _getGroupActivityInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
            success: function (data) {
                // 解密
               var data=jsDecodeData(data);
                console.log(data);
                if (data.errcode === 0) {
                    var result = data.data;
                    localStorage.setItem("apptoken", data.apptoekn);
                    var html = `                
        <div class="swiper-container">          
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="swiper-slide"><img src="./image/1.jpg" style="height:200px"/></div>
                <div class="swiper-slide"><img src="./image/2.jpg"  style="height:200px"/></div>
                <div class="swiper-slide"><img src="./image/3.jpg"  style="height:200px"/></div>
            </div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>
        </div>
        <!--标签-->
        <div class="weui-flex">
            <div class="weui-flex__item"><div class="placeholder">美女</div></div>
            <div class="weui-flex__item"><div class="placeholder">帅哥</div></div>
            <div class="weui-flex__item"><div class="placeholder">自驾</div></div>
            <div class="weui-flex__item"><div class="placeholder">happy</div></div>
        </div>
        <!--标题-->
        <div class="weui-cell" style="padding: 0">
            <div class="weui-cell__bd">
                <p style="font-size: 15px;font-weight: bold">${result.title}</p>
            </div>
        </div>
        <!--活动内容-->
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>活动时间：${result.star_time}</p>
            </div>
          
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>集合地点：${result.collection_place}</p>
            </div>
            
        </div>
        <div class="weui-cell">
            <div class="weui-cell__bd">
                <p>集合时间：${result.collection_time}</p>
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
        <div class="weui-cells weui-cells_form">
            <div class="weui-cell">
                <div class="weui-cell__bd">
                    <textarea class="weui-textarea" placeholder="更多内容介绍" rows="3"></textarea>
                    <div class="weui-textarea-counter"><span>0</span>/200</div>
                </div>
            </div>
        </div>
              <!--按钮-->
        <input type="button" class="weui-btn weui-btn_primary Btn" style="margin-top: 10px" value="${result.id}">我要报名</input>
        <!--已报名列表-->  
                
                
                `;
                    if (result.enroll_status === 0) {
                        $(".Btn").attr("disabled", true);
                    }
                    $("#flockPlay_details").html(html);

                }
            }

    });
    // 我要报名
    $("#flockPlay_details").on("click", ".Btn", function () {
        localStorage.setItem("activity_id", $(this).val());
        window.location.href = "flockPlay_apply.html";
    })
});