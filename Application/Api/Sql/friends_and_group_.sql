CREATE TABLE `friends-chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(20) NOT NULL COMMENT '发送人 格式区域id，用户id',
  `sendee_code` varchar(20) NOT NULL COMMENT '接收者 格式：区域id，用户id',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='好友聊天记录';

CREATE TABLE `friends_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户唯一标识。区域id+手机号的形式',
  `gruop_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '分组名',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:禁用或删除 1：启用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户好友分组表';

CREATE TABLE `group_chat_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `sender_code` varchar(20) CHARACTER SET utf8 NOT NULL COMMENT '发送人user_code',
  `is_sender` tinyint(1) unsigned NOT NULL COMMENT '该消息是否由我发送  1：我发送的消息  2：不是我发送的消息',
  `type` tinyint(2) NOT NULL COMMENT '消息类型。1：文字消息 2：语音消息 3:图片消息 4：文件消息',
  `content` varchar(255) CHARACTER SET utf8 NOT NULL COMMENT '消息内容',
  `send_time` int(11) NOT NULL COMMENT '发送时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '查看状态 0：未查看 1：已查看',
  `group_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '消息所属群的code'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `group_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别符',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群号码',
  `group_name` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户识别码',
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群用户头像'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='群用户列表';

CREATE TABLE `group_vote` (
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

CREATE TABLE `user_friends` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户识别码。采用区域id+用户手机号的样式。',
  `nickname` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '自己的昵称',
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '自己的头像',
  `friend_user_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户好友识别码，采用区域id+用户手机号的样式。',
  `friend_nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '好友用户昵称',
  `friend_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '好友头像',
  `group_id` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '该好友分组id'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户个人好友表';

CREATE TABLE `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `group_name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '群名称',
  `group_portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '群头像',
  `group_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '群唯一识别码',
  `group_num` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '生成规则 user_area表的id+随机字符串',
  `num_limit` int(4) NOT NULL DEFAULT '200' COMMENT '群用户上限',
  `is_founder` tinyint(1) unsigned NOT NULL COMMENT '是否是创建人 0：不是创建人 1：是创建人',
  `new_message_num` int(11) unsigned NOT NULL COMMENT '新消息数量'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户的所有群';

