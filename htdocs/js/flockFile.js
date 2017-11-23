$(document).ready(function(){
//上传文件
    $('#uploaderInput').change(function(e) {
        var Url=window.URL.createObjectURL(this.files[0]) ;
        var formData= new FormData();
        var apptoken=localStorage.getItem("apptoken");
        formData.append("file",$("#uploaderInput")[0].files[0]);
        //文件信息
       var  flockFile=$("#uploaderInput")[0].files[0];
        var data=["",JSON.stringify({"apptoken":apptoken})];
        var json=jsEncryptData(data);
        formData.append("data",json);
        console.log(formData);
        // 文件大小
        var fileSize=flockFile.size;
        //文件名字
        var fileName=flockFile.name;
        //谁发的
        $.ajax({
            type:"POST",
            url:url+"ChatMessage_uploadGroupFile",
            fileElementId:'uploaderInput',
            data:formData,
            processData : false,
            contentType : false,
            secureuri:false,
            success : function(data){
                // 解密
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    console.log(data.data[0]);
                    var html=`
                      <a href="http://wx.junxiang.ren/project/${data.data[0]}" class="weui-media-box weui-media-box_appmsg" download="${fileName}">
                    <div class="weui-media-box__hd">
                        <img class="weui-media-box__thumb" src="image/file.jpg">
                    </div>
                    <div class="weui-media-box__bd">
                        <h4 class="weui-media-box__title" style="font-size: 15px">${fileName}</h4>
                        <div class="writerTime" style="font-size: 10px">
                            <span class="size">${fileSize}</span>来自
                            <span class="writer" style="font-size: 10px;color: blue">你大爷</span>
                            <span class="pubTime" style="font-size: 10px">2017.06.02</span>
                        </div>
                    </div>
                </a>  
                    
                    `;
                    $(".fileList").prepend(html);
                }
            },
            error:function (data) {
                console.log(data);
            }
        });

    });



});