CREATE TABLE  if not exists `user_info_$city_id` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `account` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '电话号码(为空则用户没有验证手机号)',
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `nickname` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '昵称',
  `realname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `account_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户唯一识别符 采用区域+acount_num',
  `signature` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个性签名',
  `wechat_num` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信账号',
  `qq_num` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'qq账号',
  `portrait` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `user_garden` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户所属小区，可以为多个用分号间隔，小区唯一识别符、role角色。role(0:未认证，1:业主，2：租户,3:管委会成员，4:管委会主任)\r\n如：garden_code,role;garden_code,role格式',
  `default_garden` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户默认所属小区，可以为多个用分号间隔，小区唯一识别符、role角色。role(0:未认证，1:业主，2：租户,3:管委会成员，4:管委会主任)\r\n如：garden_code,role',
  `birth_month` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '出生月份',
  `birth_year` char(4) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '出生年份',
  `hobby` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '爱好 （描述下自己吧，两百字以内）',
  `is_online` tinyint(1) NOT NULL DEFAULT '0' COMMENT '在线状态 0：离线 1：在线',
  `create_time` int(10) unsigned NOT NULL COMMENT '注册时间',
  `create_addr_code` int(10) unsigned NOT NULL COMMENT '注册地的区域id',
  `sex` tinyint(1) DEFAULT '0' COMMENT '性别 0：保密 1：男 2：女',
  `total_point` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '总积分',
  `id_card_ num` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '身份证编号',
  `role` tinyint(4) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_code` (`account_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户信息库，由区域分表';

CREATE DATABASE if not exists friends_and_group_$account_code;

CREATE DATABASE if not exists garden_$province_id;

CREATE DATABASE if not exists certification_application;

use  friends_and_group_$account_code;

CREATE TABLE  if not exists `friends_chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(50) NOT NULL COMMENT '发送人 格式区域id，用户id',
  `sendee_code` varchar(50) NOT NULL COMMENT '接收者 格式：区域id，用户id',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='好友聊天记录';

CREATE TABLE if NOT EXISTS `friends_apply` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `user_nickname` varchar(100) NOT NULL COMMENT '用户昵称',
  `user_portrait` varchar(500) NOT NULL COMMENT '用户头像',
  `create_time` int(11) NOT NULL COMMENT '申请时间',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '处理状态 1：已处理 0：未处理',
  `result` tinyint(2) DEFAULT NULL COMMENT '处理结果   1：接受 2：拒绝',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='好友申请消息';

CREATE TABLE  if not exists `friends_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(255)  NOT NULL COMMENT '用户唯一标识。区域id+手机号的形式',
  `group_name` varchar(255) NOT NULL DEFAULT '' COMMENT '分组名',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:禁用或删除 1：启用'
) ENGINE=InnoDB DEFAULT CHARSET=utf8  COMMENT='用户好友分组表';
INSERT INTO `friends_group` ( `id`, `user_code`, `group_name`) VALUES ( 1,'$account_code', '我的好友');

CREATE TABLE  if not exists `group_chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '发送人user_code',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看',
  `group_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '消息所属群的code'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE if NOT EXISTS `offline_user_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_code` varchar(50) NOT NULL COMMENT '发送人code',
  `content` varchar(500) NOT NULL COMMENT '发送内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `type` tinyint(2) NOT NULL COMMENT '消息类型 1：文字消息 2：语音消息 3:图片消息4：文件消息',
  PRIMARY KEY (`id`),
  KEY `sender_code` (`sender_code`),
  KEY `type` (`type`),
  KEY `send_time` (`send_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='离线消息表';

CREATE TABLE if not exists `vote_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vote_id` int(11) NOT NULL COMMENT '投票id',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `group_num` varchar(50) NOT NULL COMMENT '所属群号',
  `choised` varchar(100) NOT NULL COMMENT '选项',
  `choice_content` varchar(255) NOT NULL COMMENT '选项内容',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `vote_id` (`vote_id`),
  KEY `user_code` (`user_code`),
  KEY `choised` (`choised`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投票记录';

CREATE TABLE  if not exists `group_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别符',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群号码',
  `group_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `user_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户识别码',
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户头像',
  `role` tinyint(1) unsigned NOT NULL COMMENT '角色 1：创建人 2：管理员 3：普通成员',
  `status` int(11) unsigned COMMENT '用户状态 此处保存禁言期限时间戳'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群用户列表';

CREATE TABLE  if not exists `group_vote` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容',
  `picture` varchar(255) COLLATE utf8_unicode_ci  COMMENT '图片 ',
  `choice` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '投票选择项  数组序列化之后存进这里',
  `type` tinyint(2) NOT NULL COMMENT '投票类型',
  `create_time` int(11) NOT NULL COMMENT '投票创建时间',
  `end_time` int(11) NOT NULL COMMENT '投票结束时间',
  `anonymous` tinyint(2) NOT NULL COMMENT '是否支持匿名  0：不支持 1：支持',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '所属群号',
  `user_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '创建人',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '头像',
  `garden_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '投票所属小区 小区code',
  `total_user` int(10) NOT NULL DEFAULT '1' COMMENT '参与人数',
  KEY `group_num` (`group_num`),
  KEY `garden_code` (`garden_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群投票';

CREATE TABLE  if not exists `user_friends` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户识别码。采用区域id+用户手机号的样式。',
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '自己的昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '自己的头像',
  `friend_user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户好友识别码，采用区域id+用户手机号的样式。',
  `friend_nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '好友用户昵称',
  `friend_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '好友头像',
  `group_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '该好友分组id',
  `friend_signature` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '好友个性签名',
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户个人好友表';

CREATE TABLE  if not exists `group_notice` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `title` varchar(100) NOT NULL COMMENT '公告标题',
  `content` varchar(500) NOT NULL COMMENT '公告内容',
  `portrait` varchar(500) NOT NULL COMMENT '公告图片',
  `user_code` varchar(50) NOT NULL COMMENT '创建人code',
  `nickname` varchar(20) NOT NULL COMMENT '创建人昵称',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `group_num` varchar(20) NOT NULL COMMENT '所属群号码',
  PRIMARY KEY (`id`),
  KEY `group_num` (`group_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='群公告';

CREATE TABLE  if not exists `group_picture` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `picture_path` varchar(500) NOT NULL COMMENT '图片路径',
  `title` varchar(100) DEFAULT NULL COMMENT '标题',
  `user_code` varchar(50) NOT NULL COMMENT '创建人code',
  `user_portrait` varchar(255) DEFAULT NULL COMMENT '创建人头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `nickname` varchar(20) DEFAULT NULL COMMENT '创建人昵称',
  `group_num` varchar(20) DEFAULT NULL COMMENT '所属群号码',
  PRIMARY KEY (`id`),
  KEY `group_num` (`group_num`) USING BTREE,
  KEY `user_code` (`user_code`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='群相册';


CREATE TABLE if NOT EXISTS `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `group_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别码',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '生成规则 user_area表的id+随机字符串',
  `num_limit` int(4) NOT NULL DEFAULT '200' COMMENT '群用户上限',
  `role` tinyint(1) unsigned NOT NULL DEFAULT '3' COMMENT '角色 1：创建人 2：管理员 3：普通成员',
  `new_message_num` int(11) unsigned DEFAULT NULL COMMENT '新消息数量',
  `group_type` tinyint(2) unsigned NOT NULL COMMENT '群分类id',
  `status` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '群状态 1:正常 2：解散',
  `garden_code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '小区code type为3时为必填项',
  `community_status` tinyint(2) DEFAULT '1' COMMENT '1:正常 2:禁言',
  PRIMARY KEY (`id`),
  KEY `group_num` (`group_num`),
  KEY `role` (`role`),
  KEY `group_type` (`group_type`),
  KEY `status` (`status`),
  KEY `garden_code` (`garden_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户的所有群';

CREATE TABLE  if not exists `group_subject` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` varchar(500) NOT NULL COMMENT '内容',
  `picture` varchar(500) DEFAULT NULL COMMENT '图片',
  `group_num` varchar(20) NOT NULL COMMENT '群号码',
  `user_code` varchar(50) NOT NULL COMMENT '创建人code',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `read_num` int(11) NOT NULL DEFAULT '0' COMMENT '阅读数量',
  `commont_num` int(11) NOT NULL DEFAULT '0' COMMENT '评论数量',
   `likes_num` int(11) NOT NULL DEFAULT '0' COMMENT '点赞数量',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`) USING BTREE,
  KEY `group_num` (`group_num`) USING BTREE,
  KEY `create_time` (`create_time`) USING BTREE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='群话题表';

CREATE TABLE  if not exists `group_activity` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '标题',
  `start_time` int(11) NOT NULL COMMENT '开始时间',
  `end_time` int(11) NOT NULL COMMENT '结束时间',
  `destination` varchar(255) NOT NULL COMMENT '目的地',
  `collection_place` varchar(255) NOT NULL COMMENT '集合地点',
  `collection_time` int(11) NOT NULL COMMENT '集合时间',
  `contact` varchar(20) NOT NULL COMMENT '联系人',
  `phone` varchar(20) NOT NULL COMMENT '联系人电话',
  `transport` tinyint(2) NOT NULL COMMENT '交通方式',
  `garden_code` varchar(50) NOT NULL COMMENT '小区code',
  `garden_name` varchar(100) NOT NULL COMMENT '小区名称',
  `total_num` varchar(10) NOT NULL COMMENT '目标人数',
  `cost_type` tinyint(2) NOT NULL COMMENT '消费类型',
  `average_cost` varchar(255) NOT NULL COMMENT '人均消费 免费为0',
  `enrollment_num` int(11) NOT NULL DEFAULT '0' COMMENT '报名人数',
  `rote_planning` varchar(500) DEFAULT NULL COMMENT '路线规划',
  `tag` varchar(255) DEFAULT NULL COMMENT '标签',
  `picture` varchar(500) DEFAULT NULL COMMENT '图片展示',
  `detailed_introduction` varchar(500) DEFAULT NULL COMMENT '详细介绍',
  `user_code` varchar(255) NOT NULL COMMENT '用户code',
  `nickname` varchar(255) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `group_num` varchar(20) NOT NULL COMMENT '所属群',
  PRIMARY KEY (`id`),
  KEY `start_time` (`start_time`),
  KEY `end_time` (`end_time`),
  KEY `group_num` (`group_num`),
  KEY `user_code` (`user_code`),
  KEY `garden_code` (`garden_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='群活动';

CREATE TABLE  if not exists `group_activity_registration` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL COMMENT '活动id',
  `group_num` varchar(20) NOT NULL COMMENT '群号码',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `nickname` varchar(100) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  KEY `user_code` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='群活动报名';

CREATE TABLE if NOT EXISTS `my_subject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `garden_code` varchar(100) NOT NULL COMMENT '所属小区code',
  `subject_id` int(11) NOT NULL COMMENT '话题id',
  PRIMARY KEY (`id`),
  KEY `garden_code` (`garden_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='我的话题关联表';

CREATE TABLE if NOT EXISTS `point_record` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name_id` int(11) unsigned NOT NULL COMMENT '积分类型id',
  `name` varchar(255)  NOT NULL COMMENT '积分类型名称',
  `type` tinyint(2) unsigned NOT NULL COMMENT '加分/减分 1：加分 2：减分',
  `value` int(11) unsigned NOT NULL COMMENT '分值',
  `create_time` int(11) unsigned NOT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `create_time` (`create_time`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='积分操作表';

use garden_$province_id;

CREATE TABLE  if not exists `garden_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `garden_name` varchar(255) NOT NULL COMMENT '小区名称',
  `area_id` varchar(10) NOT NULL COMMENT '区域编号',
  `address` varchar(255) NOT NULL COMMENT '详细地址',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `garden_code` varchar(255) NOT NULL COMMENT '小区识别码   采用创建地区的编号+随机字符串的方式',
  `garden_user` text NOT NULL COMMENT '小区用户列表  序列化后的数组 array（''user_code''=>role,） role 为用户在小区的角色 0： 没有任何身份 1：业主 2：租户 3：业委会 4：业委会主任 '
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小区表 在省份内按市区分表';

CREATE TABLE if NOT EXISTS `garden_message_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '通知标题',
  `content` varchar(1000) NOT NULL COMMENT '通知内容',
  `garden_code` varchar(50) NOT NULL COMMENT '小区code',
  `garden_name` varchar(255) NOT NULL COMMENT '小区名称',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `garden_code` (`garden_code`),
  KEY `create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小区通知表';

CREATE TABLE if NOT EXISTS `garden_opinion_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '意见标题',
  `content` varchar(1000) NOT NULL COMMENT '意见内容',
  `picture` varchar(500) DEFAULT NULL COMMENT '图片',
  `garden_code` varchar(50) NOT NULL COMMENT '小区code',
  `garden_name` varchar(100) NOT NULL COMMENT '小区名称',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `nickname` varchar(100) NOT NULL COMMENT '创建人昵称',
  `portrait` varchar(255) NOT NULL COMMENT '创建人头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '处理状态 1：暂未受理 2：正在处理 3:已采纳 4：意见驳回 5已完成',
  `dealer_code` varchar(50) DEFAULT NULL COMMENT '处理人code',
  `dealer_name` varchar(100) DEFAULT NULL COMMENT '处理人名称',
  `dealer_phone` varchar(20) DEFAULT NULL COMMENT '处理人联系方式',
  `remarks` varchar(500) DEFAULT NULL COMMENT '处理备注',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  KEY `garden_code` (`garden_code`),
  KEY `create_time` (`create_time`),
  KEY `status` (`status`),
  KEY `dealer_code` (`dealer_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小区意见箱';

CREATE TABLE if NOT EXISTS `garden_room_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `city_id` char(4) NOT NULL COMMENT '城市id',
  `garden_code` varchar(20) NOT NULL COMMENT '小区code',
  `room_num` varchar(10) NOT NULL COMMENT '房间号码',
  `user_code` varchar(50) DEFAULT NULL COMMENT '用户code',
  `role` tinyint(4) NOT NULL COMMENT '角色 1：业主或业主相关  2：租户或租户相关',
  `relation_name` varchar(50) DEFAULT NULL COMMENT '家庭身份  （与业主/主租户关系）',
  `real_name` varchar(20) DEFAULT NULL COMMENT '真实姓名',
  `create_time` int(11) unsigned NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `city_id` (`city_id`),
  KEY `room_num` (`room_num`),
  KEY `role` (`role`),
  KEY `create_time` (`create_time`),
  KEY `user_code` (`user_code`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='小区房间';

CREATE TABLE if not EXISTS `subject_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '话题标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '话题内容',
  `garden_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区名',
  `garden_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '话题对应小区标识符',
  `choise` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '选择项',
  `end_time` int(11) NOT NULL,
  `picture` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '话题图片',
  `type` tinyint(2) NOT NULL DEFAULT '1' COMMENT '投票类型 1：单选 2：多选',
  `is_public` tinyint(2) unsigned NOT NULL  COMMENT '2:不公开 1：公开',
  `is_push` tinyint(2) NOT NULL COMMENT '2：不需要推送 1:需要推送',
  `user_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户code',
  `nickname` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `read_num` int(11) NOT NULL DEFAULT '0' COMMENT '阅读量',
  `commont_num` int(11) NOT NULL DEFAULT '0' COMMENT '评论数',
  `likes_num` int(11) NOT NULL DEFAULT '0' COMMENT '点赞数',
  `total_votes` int(11) NOT NULL DEFAULT '0' COMMENT '总票数',
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `garden_code` (`garden_code`),
  KEY `end_time` (`end_time`),
  KEY `is_public` (`is_public`),
  KEY `user_code` (`user_code`),
  KEY `create_time` (`create_time`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='小区话题表';

CREATE TABLE if NOT EXISTS `adverse_$city_id` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
  `garden_code` varchar(100) DEFAULT NULL COMMENT '小区code 可不填',
  `title` varchar(100) NOT NULL COMMENT '标题',
  `content` varchar(500) NOT NULL COMMENT '内容',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `nickname` varchar(255) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT ' 创建时间',
  `is_public` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1:不公开 2:公开',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  KEY `is_public` (`is_public`),
  KEY `garden_code` (`garden_code`),
  KEY `create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='广告表';

CREATE TABLE if NOT EXISTS `activity_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '标题',
  `start_time` int(11) NOT NULL COMMENT '开始时间',
  `end_time` int(11) NOT NULL COMMENT '结束时间',
  `destination` varchar(255) NOT NULL COMMENT '目的地',
  `collection_place` varchar(255) NOT NULL COMMENT '集合地点',
  `collection_time` int(11) NOT NULL COMMENT '集合时间',
  `contact` varchar(20) NOT NULL COMMENT '联系人',
  `phone` varchar(20) NOT NULL COMMENT '联系人电话',
  `transport` tinyint(2) NOT NULL COMMENT '交通方式',
  `garden_code` varchar(50) NOT NULL COMMENT '小区code',
  `garden_name` varchar(100) NOT NULL COMMENT '小区名称',
  `total_num` varchar(10) NOT NULL COMMENT '目标人数',
  `cost_type` tinyint(2) NOT NULL COMMENT '消费类型',
  `average_cost` varchar(255) NOT NULL COMMENT '人均消费 免费为0',
  `enrollment_num` int(11) NOT NULL DEFAULT '0' COMMENT '报名人数',
  `rote_planning` varchar(500) DEFAULT NULL COMMENT '路线规划',
  `tag` varchar(255) DEFAULT NULL COMMENT '标签',
  `picture` varchar(500) DEFAULT NULL COMMENT '图片展示',
  `detailed_introduction` varchar(500) DEFAULT NULL COMMENT '详细介绍',
  `user_code` varchar(255) NOT NULL COMMENT '用户code',
  `nickname` varchar(255) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `start_time` (`start_time`),
  KEY `end_time` (`end_time`),
  KEY `user_code` (`user_code`),
  KEY `garden_code` (`garden_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='约玩表';

CREATE TABLE if NOT EXISTS `activity_registration_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL COMMENT '活动id',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `nickname` varchar(100) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `activity_id` (`activity_id`),
  KEY `user_code` (`user_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动报名';

use certification_application;

CREATE TABLE  if not exists `owner_application_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `real_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '手机号码',
  `room_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '房号',
  `pictures` varchar(500) COLLATE utf8_unicode_ci  COMMENT '帮助认证的照片(如：房产证或者购房合同)',
  `id_card_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证号码',
  `id_card_pictures` varchar(500) COLLATE utf8_unicode_ci  COMMENT '身份证照片（正反面）',
  `garden_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区code',
  `garden_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区名字',
  `garden_picture` varchar(500) COLLATE utf8_unicode_ci  COMMENT '小区照片',
  `city_id` int(4) NOT NULL COMMENT '小区所属城市',
  `garden_addr` varchar(255) COLLATE utf8_unicode_ci  COMMENT '小区地址',
  `yourself_picture` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个人照片',
  `role` tinyint(2) NOT NULL COMMENT '身份 1：房主 2:其他   默认第一位认证的人为房主',
  `relation_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '不是房主则填入关系名称',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '申请状态：0：审核中 1：已通过 2:驳回',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  KEY `room_num` (`room_num`),
  KEY `garden_id` (`garden_code`),
  KEY `status` (`status`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='业主认证申请';


CREATE TABLE  if not exists `tenant_application_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `user_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户code',
  `real_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '手机号码',
  `room_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '房号',
  `id_card_num` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '身份证号码',
  `id_card_pictures` varchar(500) COLLATE utf8_unicode_ci  COMMENT '身份证照片（正反面）',
  `pictures` varchar(500) COLLATE utf8_unicode_ci  COMMENT '帮助认证的照片(如：租房合同照片)',
  `yourself_picture` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个人照片',
  `owner_id_card_num` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '业主身份证号',
  `owner_id_card_picture` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '业主身份证照片（正反面）',
  `garden_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区code',
  `garden_name` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区名字',
  `city_id` int(4) NOT NULL COMMENT '小区所属城市',
  `garden_addr` varchar(255) COLLATE utf8_unicode_ci COMMENT '小区详细地址',
  `role` tinyint(2) NOT NULL COMMENT '身份 1：主租户  2：其他   默认第一位认证的人为主租户',
  `relation_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '和主租户的关系  ',
  `contract_period` int(11) NOT NULL COMMENT '合同期限',
  `status` tinyint(2) NOT NULL DEFAULT '0' COMMENT '申请状态：0：审核中 1：已审核 2：驳回',
  PRIMARY KEY (`id`),
  KEY `user_code` (`user_code`),
  KEY `garden_code` (`garden_code`),
  KEY `status` (`status`),
  KEY `room_num` (`room_num`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='租户认证申请';


use baseinfo;