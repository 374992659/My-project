
$(document).ready(function(){
    <!--我创建的群-->
    $(".creaFlock").click(function(){
        console.log(123);
        if($(".myCreate").is(":hidden")){
            $(".myCreate").show();
            $(".creaFlBtn").css("transform","rotate(90deg)");
        }else{
            $(".myCreate").hide();
            $(".creaFlBtn").removeAttr("style");
        }
    });
    <!--我管理的群-->
    $(".manageFlock").click(function(){
        if($(".myManage").is(":hidden")){
            $(".myManage").show();
            $(".manageFlBtn").css("transform","rotate(90deg)");
        }else{
            $(".myManage").hide();
            $(".manageFlBtn").removeAttr("style");
        }
    });

    <!--我加入的群-->
    $(".joinFlock").click(function(){
        if($(".myJoin").is(":hidden")){
            $(".myJoin").show();
            $(".joinFlBtn").css("transform","rotate(90deg)");
        }else{
            $(".myJoin").hide();
            $(".joinFlBtn").removeAttr("style");
        }
    });

});
