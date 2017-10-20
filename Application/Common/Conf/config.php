<?php
return array(
    //'配置项'=>'配置值'
    'DB_TYPE' 		=> 	'mysql', //数据库类型
    'DB_HOST' 		=> 	'localhost', //服务器地址
    'DB_NAME' 		=>	'baseinfo', //数据库名
    'DB_USER' 		=>	'root', //用户名
    'DB_PWD'  		=> 	'meiyijiayuan1709', //密码
    'DB_PORT' 		=> 	3306, //端口
    'DB_PREFIX'		=>	'', //表前缀
    'DB_CHARSET'	=> 	'utf8', //字符集
    'DB_DEBUG'  	=>  TRUE, //数据库调试模式 开启后可以记录SQL日志
    'DB_CONFIG_DEFAULT' => 'mysql://root:meiyijiayuan1709@localhost:3306/baseinfo',
    'DB_USER_FRIENDS' => 'mysql://root:meiyijiayuan1709@localhost:3306/friends_and_group_',//用户分库
    'DB_CERTIFICATION_APPLICATION' => 'mysql://root:meiyijiayuan1709@localhost:3306/certification_application',
    'DB_GARDEN' => 'mysql://root:meiyijiayuan1709@localhost:3306/garden_',//省份分库


//    //缓存方式
//    'DATA_CACHE_TYPE' => 'Memcache',
//    //v\ 缓存服务器地址
//    'MEMCACHE_HOST'   => 'tcp://127.0.0.1:11111',
//    //指定默认的缓存时长为3600 秒,没有会出错
//    'DATA_CACHE_TIME' => '3600',

    'REDIS_HOST' => '127.0.0.1',
    'REDIS_PORT' => '6379',

    'URL_ROUTER_ON' 	=> true, // url路由开关
    'DEFAULT_MODULE'	=>	'Admin', //默认模块
    'URL_MODEL'     	=>	3,

    //短信配置
    'ACCESSKEYID' => 'LTAIUOMwO8P9xsNK',//阿里云获取
    'ACCESSKEYSECRET' => 'XbWTqLbgluYjapREuszmJJpk6q4GEM',//阿里云获取

    'CAPTCHA_INTERVAL_SECOND' => 60,  //短信间隔60秒
    'SMS_VALIDITY'   => 10,                   //短信有效时间10分钟

 );