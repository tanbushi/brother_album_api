-- 建库

drop database if exists brother_album;

CREATE DATABASE brother_album DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

use brother_album;

CREATE TABLE `user` (
  `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `nickname` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '昵称',
  `token` VARCHAR(200) NOT NULL DEFAULT '' COMMENT 'token 登录标识',
  `avatar` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '头像',
  `description` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '简评',
  `signature` VARCHAR(200) NOT NULL DEFAULT'' COMMENT '个性签名',
  `gender` INT(11) NOT NULL DEFAULT '0' COMMENT '1男 2女 0未知',
  `score` INT(11) NOT NULL DEFAULT '0' COMMENT '分数',
  `coin` INT(11) NOT NULL DEFAULT '0' COMMENT '金币',
  `country` varchar(200) NOT NULL DEFAULT '' COMMENT '国家',
  `province` varchar(200) NOT NULL DEFAULT '' COMMENT '省',
  `city` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '所在城市',
  `language` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '语言',
  `birthday` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '生日',
  `constellation` VARCHAR(200) NOT NULL DEFAULT '未填写' COMMENT '星座',
  `mobile` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '手机号',
  `email` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '邮箱',
  `device` varchar(500) NOT NULL DEFAULT '' COMMENT '设备信息',
  `registerIp` varchar(200) NOT NULL DEFAULT '' COMMENT '注册IP',
  
  `extra` VARCHAR(10000) NOT NULL DEFAULT '' COMMENT '备用字段',
  `created` INT(11) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated` INT(11) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `isDeleted` INT(11) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created`),
  KEY `idx_updated` (`updated`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE `xcxuserauth` (
  `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `userId` BIGINT(20) unsigned NOT NULL COMMENT '用户ID',
  `type` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '三方登录类型，',
  `openId` VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'openId',
  `unionId` VARCHAR(100) NOT NULL DEFAULT '' COMMENT 'unionId',
  `sessionKey` VARCHAR(500) NOT NULL DEFAULT '' COMMENT 'sessionKey',

  `extra` VARCHAR(10000) NOT NULL DEFAULT '' COMMENT '备用字段',
  `created` BIGINT(11) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated` BIGINT(11) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `isDeleted` INT(11) NOT NULL DEFAULT '0' COMMENT '0 未删除 1已删除',
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created`),
  KEY `idx_updated` (`updated`),
  KEY `idx_openId_unionId` (`openId`,`unionId`)
) ENGINE=InnoDB AUTO_INCREMENT=8001 DEFAULT CHARSET=utf8mb4 COMMENT='小程序授权信息表';

CREATE TABLE `picture` (
  `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `userId` BIGINT(20) unsigned NOT NULL COMMENT '对应用户表的id',
  `url` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '照片url',
  `description` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '描述',
  `time` INT(11) unsigned NOT NULL DEFAULT '0' COMMENT '照片时间',
  `position` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '位置',

  `extra` VARCHAR(10000) NOT NULL DEFAULT '' COMMENT '备用字段',
  `created` INT(11) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated` INT(11) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `isDeleted` INT(11) NOT NULL DEFAULT '0' COMMENT '0未删除 1已删除',
  PRIMARY KEY (`id`),
  KEY `idx_created` (`created`),
  KEY `idx_updated` (`updated`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COMMENT='照片表';
