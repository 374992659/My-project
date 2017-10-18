$(document).ready(function(){
    // 获取群号码
    var code=localStorage.getItem("group_num");
    // 获取apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 获取投票id
    var vote_id=localStorage.getItem("vote_id");
    // 数据格式转换
    data =["",JSON.stringify({"apptoken":apptoken,"group_num":code,"vote_id":vote_id})];
// 加密
    jsonEncryptData=jsEncryptData(data);
    console.log(data);
    $.ajax({
        url:url+"group_getVoteInfo",
        type:"POST",
        data:{"data":jsonEncryptData},
        success:function (data) {
            // 解密
            data=jsDecodeData(data);
            console.log(data);
            if(data.errcode===0){
                localStorage.setItem("apptoken",data.apptoken);
                var result=data.data;
                var voteList="";
                console.log(result.vote_info);
                $.each(result.choice,function(i,item){
                    console.log(item);
                   voteList+=`
                    <label class="weui-cell weui-check__label" for="x11">
                        <div class="weui-cell__bd">
                            <p>${item.comtent}</p>
                        </div>
                        <div class="weui-cell__ft">
                            <input type="radio" class="weui-check" name="radio1" id="x11">
                            <span class="weui-icon-checked"></span>
                        </div>
                    </label>
                    `
                });
               var html=`
                 <div class="weui-panel__bd">
                        <div  class="weui-media-box weui-media-box_appmsg">
                            <div class="weui-media-box__hd">
                                <img class="weui-media-box__thumb" src="${result.portrait}">
                            </div>
                            <div class="weui-media-box__bd">
                                <h4 class="weui-media-box__title" style="font-size: 13px">${result.nickname}</h4>
                                <span class="weui-media-box__desc" style="font-size: 10px">${result.create_time}</span>
                                <button class="right" class="delBtn" title="${result.vote_id}">删除</button>
                            </div>
                        </div>
                        <div class="weui-media-box__bd">
                            <h4 class="weui-media-box__title" style="font-size: 10px">${result.title}</h4>
                            <ul>
                                <li class="lf">
                                    <img src="http://wx.junxiang.ren/project/${result.picture}" alt="" class="topic">
                                </li>
                            </ul>
                            <div style="text-align: right;font-size: 10px;color: #b2b2b2">
                                <span class="lf">单选</span>
                                <span class="lf">（匿名投票）</span> 票数：<span>${result.total_user}</span>
                            </div>
                        </div>
                    </div>
                        <!--选项-->
                    <div class="weui-cells weui-cells_radio optionList" style="display: block">

                    </div>
                            <!--截止时间-->
                    <div class="weui-cells">
                        <div class="weui-cell">
                            <div class="weui-cell__bd" style="color: #bbbbbb">
                                <span>截止时间：</span>
                                <span>${result.end_time}</span>
                            </div>
                        </div>
                    </div>
                    <div class="demos-content-padded">
                        <button class="weui-btn weui-btn_primary">投票</button>
                    </div>
                `;
                $(".voteContent").append(html);
                $(".optionList").append(voteList);
                //删除功能
                $(".voteContent").on("click",".weui-media-box .weui-media-box__bd .delBtn",function(){
                    // 获取群号
                    var code=localStorage.getItem("group_num");
                    // 获取投票id
                    var vote_id=$(this).attr("title");
                    // 获取apptoken
                    var apptoken=localStorage.getItem("apptoken");
                    // 数据格式转换
                    data=["",JSON.stringify({"apptoken":apptoken,"group_num":code,"vote_id":vote_id})];
                    // 加密
                    jsonEncryptData=jsEncryptData(data);
                    $.ajax({
                        url:url+"group_delVote",
                        type:"POST",
                        data:{"data":jsonEncryptData},
                        success:function (data) {
                            // 解密
                            data=jsDecodeData(data);
                            if(data.errcode===0){
                                localStorage.setItem("apptoken",data.apptoken);
                                console.log("删除成功")
                            }else{
                                console.log(data.errmsg);
                            }
                        }
                    })

                })
            }else{
                console.log(data.errmsg);
            }
        }
    })
});