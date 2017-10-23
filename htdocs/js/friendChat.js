
$(document).ready(function(){
        $(".imgBtn").click(function(){
            console.log(123);
            if($(".weui-grids").is(":hidden")){
                $(".weui-grids").show();
            }else{
                $(".weui-grids").hide();
            }
    });
});