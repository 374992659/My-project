CREATE TABLE  if not exists `user_info_$city_id` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `phone` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '电话号码(为空则用户没有验证手机号)',
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `nickname` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '昵称',
  `realname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `account_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户唯一识别符 采用区域+手机号形式',
  `signature` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '个性签名',
  `wechat_num` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '微信账号',
  `qq_num` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'qq账号',
  `portrait` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `user_garden` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户所属小区，可以为多个用分号间隔，小区唯一识别符、role角色。role(0:未认证，1:业主，2：租户,3:管委会成员，4:管委会主任)\r\n如：garden_code,role;garden_code,role格式',
  `default_garden` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '用户默认所属小区，可以为多个用分号间隔，小区唯一识别符、role角色。role(0:未认证，1:业主，2：租户,3:管委会成员，4:管委会主任)\r\n如：garden_code,role',
  `age` int(3) unsigned DEFAULT NULL COMMENT '年龄',
  `hobby` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '爱好 （描述下自己吧，两百字以内）',
  `is_online` tinyint(1) NOT NULL DEFAULT '0' COMMENT '在线状态 0：离线 1：在线',
  `create_time` int(10) unsigned NOT NULL COMMENT '注册时间',
  `create_addr_code` int(10) unsigned NOT NULL COMMENT '注册地的区域id',
  `sex` tinyint(1) NOT NULL DEFAULT '0' COMMENT '性别 0：保密 1：男 2：女',
  UNIQUE KEY `account_code` (`account_code`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户信息库，由区域分表';

CREATE DATABASE if not exists friends_and_group_$account_code;
CREATE DATABASE if not exists garden_$province_id;

use  friends_and_group_$account_code;
CREATE TABLE  if not exists `friends-chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(20) NOT NULL COMMENT '发送人 格式区域id，用户id',
  `sendee_code` varchar(20) NOT NULL COMMENT '接收者 格式：区域id，用户id',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='好友聊天记录';

CREATE TABLE  if not exists `friends_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户唯一标识。区域id+手机号的形式',
  `group_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '分组名',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:禁用或删除 1：启用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户好友分组表';
INSERT INTO `friends_group` ( `id`, `user_code`, `group_name`) VALUES ( 1,$account_code, '我的好友');
CREATE TABLE  if not exists `group_chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '发送人user_code',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看',
  `group_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '消息所属群的code'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE  if not exists `group_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别符',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群号码',
  `group_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户识别码',
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户头像',
  `role` tinyint(1) unsigned NOT NULL COMMENT '角色 1：创建人 2：管理员 3：普通成员',
  `status` int(11) unsigned COMMENT '用户状态 此处保存禁言期限时间戳'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群用户列表';

CREATE TABLE  if not exists `group_vote` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '内容',
  `picture` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '图片 ',
  `choice` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '投票选择项  数组序列化之后存进这里',
  `type` tinyint(2) NOT NULL COMMENT '投票类型',
  `create_time` int(11) NOT NULL COMMENT '投票创建时间',
  `end_time` int(11) NOT NULL COMMENT '投票结束时间',
  `anonymous` tinyint(2) NOT NULL COMMENT '是否支持匿名  0：不支持 1：支持'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群投票';

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
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户个人好友表';

CREATE TABLE  if not exists `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `group_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别码',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '生成规则 user_area表的id+随机字符串',
  `num_limit` int(4) NOT NULL DEFAULT '200' COMMENT '群用户上限',
  `role` tinyint(1) unsigned NOT NULL DEFAULT '3' COMMENT '角色 1：创建人 2：管理员 3：普通成员',
  `new_message_num` int(11) unsigned COMMENT '新消息数量',
  `group_type` tinyint(2) unsigned NOT NULL COMMENT '群分类id'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户的所有群';

use garden_$province_id;

CREATE TABLE  if not exists `date_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `garden_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '小区标识符',
  `route_plan` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '路线规划',
  `type` tinyint(2) NOT NULL COMMENT '游玩类型 1：自驾 2：徒步 3：骑车',
  `total_num` int(5) NOT NULL COMMENT '目标人数',
  `pay_type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '费用类型',
  `consumption_per_person` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '人均消费',
  `target_location` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '目的地',
  `venue` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '集合地点',
  `start_time` int(11) NOT NULL COMMENT '开始时间',
  `end_time` int(11) NOT NULL COMMENT '回归时间',
  `play_content` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '玩耍内容',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '发起人用户昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '发起人头像',
  `contact_information` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '发起人联系方式',
  `picture` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '场景图片',
  `create_time` int(11) NOT NULL COMMENT '发起时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='约玩表';

CREATE TABLE  if not exists `date_enroll_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `nickname` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '报名人昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '报名人头像',
  `contact_information` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '报名人联系方式',
  `date_id` int(11) NOT NULL COMMENT '约玩id',
  `status` tinyint(2) NOT NULL COMMENT '报名状态  0：已取消 1：已报名',
  `pay_status` tinyint(2) NOT NULL COMMENT '支付状态',
  `create_time` int(11) NOT NULL COMMENT '报名时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='约玩报名表';

CREATE TABLE  if not exists `garden_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `garden_name` varchar(255) NOT NULL COMMENT '小区名称',
  `area_id` varchar(10) NOT NULL COMMENT '区域编号',
  `address` varchar(255) NOT NULL COMMENT '详细地址',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `garden_code` varchar(255) NOT NULL COMMENT '小区识别码   采用创建地区的编号+随机字符串的方式',
  `garden_user` text NOT NULL COMMENT '小区用户列表  序列化后的数组 array（''user_code''=>role,） role 为用户在小区的角色 0： 没有任何身份 1：业主 2：租户 3：业委会 4：业委会主任 '
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='小区表 在省份内按市区分表';

CREATE TABLE  if not exists `subject_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY  COMMENT '自增主键',
  `garden_code` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '话题对应小区标识符',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '话题标题',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '话题内容',
  `picture` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '话题图片',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `type` tinyint(2) NOT NULL COMMENT '话题类型 1：普通讨论话题 2：投票讨论话题',
  `choise` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '投票选择 可为多个选项,最多四个具体格式如下 A:xxx;B:xxxx;C:xxx;D:xxx',
  `plan` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '解决方案',
  `pay` decimal(8,2) DEFAULT NULL COMMENT '费用支出',
  `status` tinyint(2) unsigned NOT NULL DEFAULT '1' COMMENT '话题状态。0：删除 1：讨论/投票中 2：已投票通过 3：已投票否决'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题表';

CREATE TABLE  if not exists `subject_choise_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT  '自增主键',
  `subject_id` int(11) NOT NULL,
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `choise` char(1) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户选择 ',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题选择表';

CREATE TABLE  if not exists `subject_comment_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT  '自增主键',
  `subject_id` int(11) NOT NULL,
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像',
  `content` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '评论内容',
  `create_time` int(11) NOT NULL COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题评论表';

CREATE TABLE  if not exists `subject_praise_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY  COMMENT '自增主键',
  `subject_id` int(11) NOT NULL COMMENT '话题id',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `praise_status` tinyint(2) NOT NULL COMMENT '用户点赞状态 0:取消 1：已点赞 ',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题点赞表';

use certification_application;
CREATE TABLE  if not exists `owner_application_$city_id` (
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

CREATE TABLE  if not exists `tenant_application_$city_id` (
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

use baseinfo;