CREATE TABLE `owner_application_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` int(11) NOT NULL COMMENT '用户id。 区域id+手机号格式',
  `real_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '手机号码',
  `room_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '房号',
  `pictures` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '帮助认证的照片(如：房产证或者购房合同)',
  `id_card_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证号码',
  `id_card_pictures` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证照片（正反面）',
  `garden_id` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区id  格式：区域id，小区id',
  `garden_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区名字',
  `yourself_picture` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个人照片',
  `familly_member` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '家庭成员   格式：关系：姓名；关系：姓名',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '申请状态：0：审核中 1：已审核'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='业主认证申请';

CREATE TABLE `tenant_application_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_id` int(11) NOT NULL COMMENT '用户id 区域id，用户id格式',
  `real_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '手机号码',
  `room_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '房号',
  `id_card_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证号码',
  `id_card_pictures` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证照片（正反面）',
  `pictures` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '帮助认证的照片(如：租房合同照片)',
  `yourself_picture` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个人照片',
  `owner_id_card_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '业主身份证号',
  `owner_id_card_picture` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '业主身份证照片（正反面）',
  `garden_id` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区id  格式：区域id，小区id',
  `garden_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区名字',
  `contract_period` int(11) NOT NULL COMMENT '合同期限',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '申请状态：0：审核中 1：已审核'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='租户认证申请';
