$(document).ready(function(){
    $('#uploaderInput').change(function(event) {
        // ������� <input> ��ȡ�ļ��� HTML5 js ����
        var files = event.target.files, file;
        //��ȡͼƬ·��
        var url=files[0].name;
        localStorage.setItem("url",url);
        //��ȡapptoken
        var apptoken=localStorage.getItem("apptoken");
        //Ԥ��ͼƬ
        if (files && files.length > 0) {
            var data = new FormData();
            console.log(data);
            // ��ȡĿǰ�ϴ����ļ�·��
            file = files[0];
            // ���ڿ���̨�����������������ʲô
            console.log(file.name);

            // ��ô���ǿ�����һ�������ļ���СУ��Ķ���
            if(file.size > 1024 * 1024 * 2) {
                alert('ͼƬ��С���ܳ��� 2MB!');
                return false;
            }
            // !!!!!!
            // �����ǹؼ��Ĺؼ���ͨ����� file ��������һ�����õ�ͼ�� URL
            // ��ȡ window �� URL ����
            var URL = window.URL || window.webkitURL;
            // ͨ�� file ����Ŀ�� url
            var imgURL = URL.createObjectURL(file);
            var upload=$(".upload");
            var flockHead=$(".flockHead");
            if(upload.is(":hidden")){
                upload.show();
                flockHead.hide();
            }else{
                upload.hide();
                flockHead.show();
                $('.flockHead img').attr('src', imgURL);
            }

        }
        //��ͼƬ��apptoken��������ת��

        //��������
        //�ϴ�ͼƬ
        //$.ajax({
        //    url:url+"group_uploadGroupP",
        //    type:"POST",
        //    data:{},
        //    success:function(data){
        //
        //    }
        //});
    });
    $(".createBtn").click(function(){
        //��ȡȺͷ��
        var url=localStorage.getItem("url");
        //��ȡȺ����
        var name=$("#flockName").val();
        //��ȡȺ����id
        var  id=$("#flockClass option:selected").val();
        console.log(id);
        //��ȡapptoken
        var apptoken=localStorage.getItem("apptoken");
        //��ȡС��code�����

        //���ݸ�ʽת��
        data=["",JSON.stringify({"group_name":name,"group_portrait":url,"group_type":id,"apptoken":apptoken})]
        console.log(data);
        //���ݼ���
        jsonEncryptDate=jsEncryptData(data);
        //����ajax����
        $.ajax({
            url:url+"group_addGroup",
            type:"POST",
            data:{"data":data},
            success:function(data){
                //��������
                data=jsDecodeData(data);
                console.log(data);
                if(data.errcode===0){
                    localStorage.setItem("apptoken",data.apptoken);
                    alert("�����ɹ�");
                    window.location.href="createCrowd.html"
                }else{
                    if(data.errcode===114){
                        alert("��¼��ʱ�����µ�¼");
                        //window.location.href="landing.html"
                    }else{
                        alert(data.errmsg);
                    }
                }
            }
        })
    });
});

