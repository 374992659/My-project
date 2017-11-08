$(documnet).ready(function(){
    // 参数：apptoken
    var apptoken=localStorage.getItem("apptoken");
    // 参数：real_name 真实姓名
    var real_name=$("#renterName").val();
    // 参数：phone 手机号码
    var phone=$("#renterPhone").val();
    // 参数：room_num 房号
    var houseNum=$("#houseNum option:selected").val();
    var floorNum=$("#floorNum option:selected").val();
    var roomNum=$("#roomNum option:selected").val();
    var room_num=houseNum+"-"+floorNum+"-"+roomNum;
    // 参数：id_card_num 身份证号码
    var id_card_num=$("#renter_owner_Identity").val();
    // 参数：id_card_pictures 身份证照片
    var A=$(".flockHeadA img").attr("src");
    var B=$(".flockHeadB img").attr("src");
    var id_card_pictures="{'a':'"+A+"','b':'"+B+"'}";
    // 参数：owner_id_card_num 房东身份证号码 可填
    var owner_id_card_num=$("#renter_IdentityCard").val();
    // 参数：owner_id_card_picture 房东身份证照片 可填
    var ownerA=$(".ownerFlockHeadA img").attr("src");
    var ownerB=$(".ownerFlockHeadB img").attr("src");
    var owner_id_card_picture="{'a':'"+ownerA+"','b':'"+ownerB+"'}";
    // 参数：city_id 小区所在城市
    var city_id=$("#city option:selected").val();
    // 参数：garden_name 小区名
    var garden_name=$("#houseName").val();
    // 参数：garden_code 小区code 可填 用户若选择检索出的小区则传递其code至后台否则不传递
    var garden_code="";
    // 参数：garden_addr 楼盘地址
    var garden_addr=$("#province option:selected").text()+$("#city option:selected").text()+$("#houseName").val();
    // 参数：contract_period 合同期限 10位时间戳 整型
    var contract_period=
    // 参数：pictures 合同照
    // 参数：yourself_picture 个人照片 可填


});