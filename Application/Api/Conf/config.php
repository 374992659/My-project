<?php
return array(
	//'配置项'=>'配置值'

    //app加密
    'APP_KEY'	=> array(
        'AES_IV'				=> '5efd3f6550e20330', //偏移量
        'AES_KEY'				=> '625202f5549e061d', //秘钥
        'TOKEN_AES_IV'			=> '5edd3f6060e20220', //偏移量
        'TOKEN_AES_KEY'			=> '622102f9149e022d', //秘钥
        'SIGN_PRIVATE_KEY'		=> "./Application/Api/Key/app_server_sign_private.pem",     //服务端私钥
        'SIGN_PUBLIC_KEY'		=> "./Application/Api/Key/app_client_sign_public.pem",      //客户端公钥
    ),

    'LANG_SWITCH_ON' => true,   // 开启语言包功能
    'LANG_AUTO_DETECT' => true, // 自动侦测语言 开启多语言功能后有效
    'DEFAULT_LANG'        => 'zh-cn',
    'LANG_LIST'        => 'zh-cn', // 允许切换的语言列表 用逗号分隔
    'VAR_LANGUAGE'     => 'l', // 默认语言切换变量

    'APP_VERSION'=>array(
        'IOS'                   => '1.0.0',  //ios最新版本号
        'ANDROID'           => '1.0.0',//android最新版本号
        ),
    'POINT_CONFIG'=>array(
        'REGISTER'=>1,                   //注册id
        'INVITE_REGISTER'=>2,        //邀请注册id
        'SING_IN'=>3,                   //签到id
        'COMMENT'=>4,               //评论id
        'LIKES'=>5,                         //点赞id
        'CERTIFICATION'=>6,         //实名认证id
        'ADD_NUM'=>7,               //添加成员id
        'IMPROVE_DATA'=>8,      //完善资料id
        'DAY_LIMIT'=>9,                 //每日得分上限id
        'DEL_COMMENT'=>10,//删除评论id
        'CANCEL_LIKES'=>11,         //取消点赞id
        'DEL_NUM'=>12,                  //删除成员id
    ),
    //群文件过期时间
    'GROUP_FILE_LIFE'=>60*60*24*120,//120天
    //活动配置
    'ACTIVITY_TRANSPORT'=>array(
        '1'=>'汽车自驾',
        '2'=>'徒步',
        '3'=>'自行车骑行',
        '4'=>'摩托车骑行',
    ),
    'COST_TYPE'=>array(
        '1'=>'AA制',
        '2'=>'自驾游',
        '3'=>'发布人请客',
    ),
    //数据库sql文件存放路径
    'SQL_PATH'      => './Application/Api/Sql/',
    //微信公众号
    'APPID'             =>'wx3a8d29551364f089',
    'APPSECRET'     =>'d6ced1ed28305e5ab8ad6794df07635d',
    'WEIXIN_API_TOKEN'  =>'tokenlv',
    'ENCODINGAESKEY'    =>'T2CGwfnGK3CSzo0WV879VtPcnSeRzU8yuib82EXds3P',
    //百度地图
    'MAPAK'         =>'uxOw0r15yGpM6bF5ZxeCRPjTZsiMvfEO',
);