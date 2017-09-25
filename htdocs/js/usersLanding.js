$("#province").change(function(){
    console.log("nihao ");
        $.ajax({
            type:'post',
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr",
            data:'',
            dataType:'json',
            success:function(data){
                console.log(data);
            }

        })


});

