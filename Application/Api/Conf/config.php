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
    'SQL_PATH'      => './Application/Api/Sql/'

);