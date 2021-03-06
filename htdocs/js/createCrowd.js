$(document).ready(function(){
    "use strict";
    (function(){
        //获取apptoken
        var apptoken=localStorage.getItem("apptoken");
        //数据格式转换
        var data=["",JSON.stringify({"apptoken":apptoken})];
        //数据加密
        console.log(data);
        var jsonEncryptDate=jsEncryptData(data);
        //发起ajax请求
        $.ajax({
            url:url+"group_getMyGroup",
            type:"POST",
            data:{"data":jsonEncryptDate},
            success:function(data,e){
                console.log(data);
                //数据解密
                var data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(123);
                    localStorage.setItem("apptoken",data.apptoken);
                    var myGroup="",
                        myGroupNum="",
                        manageGroup="",
                        manageGroupNum="",
                        joinGroup="",
                        joinGroupNum="";
                    $.each(data.data,function(i,item){
                        console.log(item);
                        if(parseInt(item.role)===1){
                            console.log(i);
                            myGroup+=`
                        <div class="weui-media-box weui-media-box_appmsg saveGroupNum" title="${item.group_num}">
                            <div class="weui-media-box__hd" style="width:50px;height: 50px;border-radius: 50px;overflow: hidden">
                                <img  title="${item.group_code}"  style="width: 50px;height: 50px" class="weui-media-box__thumb " src="http://wx.junxiang.ren/project/${item.group_portrait}" alt="" >
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${item.group_name}</h4>
                                <p class="weui-media-box__desc">${item.group_type_name}</p>
                            </div>
                        </div>
                            `;
                            myGroupNum++;
                        }else if(parseInt(item.role)===2){
                            manageGroup+=`
                        <div class="weui-media-box weui-media-box_appmsg saveGroupNum" title="${item.group_num}">
                            <div class="weui-media-box__hd" style="width:50px;height: 50px;border-radius: 50px;overflow: hidden">
                                <img title="${item.group_code}"  style="width: 50px;height: 50px" class="weui-media-box__thumb " src="http://wx.junxiang.ren/project/${item.group_portrait}" alt="" >
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 18px">${item.group_name}</h4>
                                <p class="weui-media-box__desc">${item.group_type_name}</p>
                            </div>
                        </div>
                            `;
                            manageGroupNum++;
                        }else{
                            console.log(i);
                            joinGroup+=`
                        <div class="weui-media-box weui-media-box_appmsg saveGroupNum" title="${item.group_num}">
                            <div class="weui-media-box__hd" style="width:50px;height: 50px;border-radius: 50px;overflow: hidden">
                                <img title="${item.group_code}" style="width: 50px;height: 50px" class="weui-media-box__thumb " src="http://wx.junxiang.ren/project/${item.group_portrait}" alt="" >
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 15px">${item.group_name}</h4>
                                <p class="weui-media-box__desc">${item.group_type_name}</p>
                            </div>
                        </div>
                            `;
                            joinGroupNum++;
                        }
                    });
                    $(".myCreate").append(myGroup);
                    $(".myGroupNum").append(myGroupNum);

                    $(".myManage").append(manageGroup);
                    $(".manageGroupNum").append(manageGroupNum);

                    $(".myJoin").append(joinGroup);
                    $(".joinGroupNum").append(joinGroupNum);
                }
            }
        })
    })();
    $(".particpation").click(function(){
        var that=$(this);
        var groupList=that.find(".groupList");
        var img=that.find(".imgBtn");
        if(groupList.is(":hidden")){
            groupList.show();
            img.css("transform","rotate(90deg)");
        }else{
            groupList.hide();
            img.removeAttr("style");
        }
    });
    // 跳转页面之前保存群号码
    $(".groupList").on("click",".saveGroupNum",function(){
        console.log(132);
        //保存群头像
        var group_header=$(this).find("img").attr("src"),
        // 获取当前group_num群号码
            group_num=$(this).attr("title"),
        // 获取group_code
            group_code=$(this).find("img").attr("title"),
        // 获取群名字
            group_name=$(this).find("h4").html();
        // 存在本地
        localStorage.setItem("group_num",group_num);
        localStorage.setItem("group_code",group_code);
        localStorage.setItem("group_header",group_header);
        localStorage.setItem("group_name",group_name);
        window.location.href="flockChat.html";
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
