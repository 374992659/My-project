
var addRess=function (){
    $.ajax({
        type:'post',
        url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr&is_wap=1",
        data:'',
        success:function(data){
            data=jsDecodeData(data);
            var result=data.data;
            var province=[];
            console.log(result);
           for(i=0;i<result.length;i++){
               console.log(result[i]);
               if(result[i].parent_id=="0000"){
                   province.push(result[i].name);
               }
           }
            console.log(province);
            cimProvice(province);
        }
    });
    // 省份
    function cimProvice(province){
        for(var i=0;i<province.length;i++){
            var $pro=$(" <option value=\"0\">"+province[i]+"</option>");
            $(".province").append($pro)
        }
    }
    function changPro(){

    }

};
addRess();
// $(".province").change(function(){
//     console.log("nihao ");
//
// });

