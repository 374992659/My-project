$("#province").change(function(){

    console.log("nihao ");
        $.ajax({
            type:'post',
            url:"http://wx.junxiang.ren/project/index.php?m=Api&c=regiest&a=getAreaArr&debugging=test",
            data:'',
            success:function(data){
                console.log(data);


            }

        })


});

