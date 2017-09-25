// document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 100 + 'px';
// console.log("window.innerWidth");
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