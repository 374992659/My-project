use  friends_and_group_$account_code;

CREATE TABLE `group_subject_dynamics_$subject_id` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(2) NOT NULL COMMENT '类型 1：评论 2.话题点赞 3.评论点赞',
  `commont_id` int(11) DEFAULT NULL COMMENT '点赞评论的id',
  `content` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '动态状态',
  `user_code` varchar(50) NOT NULL COMMENT '用户code',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `portrait` varchar(255) NOT NULL COMMENT '头像',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `commont_likes` int(11) DEFAULT NULL COMMENT '评论点赞数量',
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `common_id` (`commont_id`),
  KEY `user_code` (`user_code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='话题动态表';