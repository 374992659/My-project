CREATE TABLE `date_$city_id` (
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

CREATE TABLE `date_enroll_$city_id` (
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

CREATE TABLE `garden_$city_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '自增主键',
  `garden_name` varchar(255) NOT NULL COMMENT '小区名称',
  `area_id` varchar(10) NOT NULL COMMENT '区域编号',
  `address` varchar(255) NOT NULL COMMENT '详细地址',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `garden_code` varchar(255) NOT NULL COMMENT '小区识别码   采用创建地区的编号+随机字符串的方式',
  `garden_user` text NOT NULL COMMENT '小区用户列表  序列化后的数组 array（''user_code''=>role,） role 为用户在小区的角色 0： 没有任何身份 1：业主 2：租户 3：业委会 4：业委会主任 '
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='小区表 在省份内按市区分表';

CREATE TABLE `subject_$city_id` (
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

CREATE TABLE `subject_choise_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT  '自增主键',
  `subject_id` int(11) NOT NULL,
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `choise` char(1) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户选择 ',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题选择表';

CREATE TABLE `subject_comment_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT  '自增主键',
  `subject_id` int(11) NOT NULL,
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像',
  `content` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '评论内容',
  `create_time` int(11) NOT NULL COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题评论表';

CREATE TABLE `subject_praise_$city_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY  COMMENT '自增主键',
  `subject_id` int(11) NOT NULL COMMENT '话题id',
  `user_code` varchar(20) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户id 格式：区域id,手机号',
  `praise_status` tinyint(2) NOT NULL COMMENT '用户点赞状态 0:取消 1：已点赞 ',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `nickname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `portrait` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '用户头像'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='话题点赞表';

