-- Create site_settings table
CREATE TABLE IF NOT EXISTS `site_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);

-- Create sections table
CREATE TABLE IF NOT EXISTS `sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`full_width` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);

-- Create portal_items table
CREATE TABLE IF NOT EXISTS `portal_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section_id` integer NOT NULL,
	`title` text NOT NULL,
	`desc` text NOT NULL,
	`link` text NOT NULL,
	`icon` text DEFAULT 'ExternalLink' NOT NULL,
	`color` text DEFAULT 'text-hextech-blue' NOT NULL,
	`border_glow` text DEFAULT 'group-hover:border-hextech-blue/50' NOT NULL,
	`shadow_glow` text DEFAULT 'group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Seed Site Settings
INSERT OR IGNORE INTO `site_settings` (`key`, `value`) VALUES
('header_title', 'LOL 中东服玩家社区门户'),
('header_subtitle', '汇聚中东服华人群友，一站式开黑工具与数据看板。'),
('alert_title', '群友行动指引'),
('alert_content', '提醒进群后将群昵称修改为：“游戏ID#后缀 + 段位 + 主玩位置”（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。');

-- Seed Sections
INSERT OR IGNORE INTO `sections` (`id`, `title`, `sort_order`, `full_width`) VALUES
(1, '新手起航与客户端', 0, 0),
(2, '社群开黑语音', 1, 0),
(3, '游戏上分神器', 2, 0),
(4, '战绩查询与数据评估', 3, 0),
(5, '群友数据与排行榜', 4, 1);

-- Seed Portal Items
INSERT OR IGNORE INTO `portal_items` (`id`, `section_id`, `title`, `desc`, `link`, `icon`, `color`, `border_glow`, `shadow_glow`, `featured`, `sort_order`) VALUES
(1, 1, '中东服官方下载', '外服共用同一个客户端，服务器取决于账号所属地区。', 'https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.me1.exe', 'Download', 'text-hextech-blue', 'group-hover:border-hextech-blue/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]', 0, 0),
(2, 1, '账号注册与转服教程', 'Riot 官方教程，解答跨区与账号相关问题。', 'https://support-leagueoflegends.riotgames.com/hc/zh-tw/articles/201751684--%E8%8B%B1%E9%9B%84%E8%81%AF%E7%9B%9F-%E5%9C%B0%E5%8D%80%E4%BC%BA%E6%9C%8D%E5%99%A8', 'BookOpen', 'text-lol-gold', 'group-hover:border-lol-gold/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(200,155,60,0.3)]', 0, 1),
(3, 2, 'Discord 专属频道', '寻找车队、语音开黑，点击即刻加入华人聚集地！', 'https://discord.gg/UJpAURGy6E', 'Headset', 'text-[#5865F2]', 'group-hover:border-[#5865F2]/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.4)]', 1, 0),
(4, 2, 'DC 语音优化工具', 'Drover：用于优化和支持 Discord 语音体验的辅助工具。', 'https://github.com/hdrover/discord-drover', 'Zap', 'text-slate-300', 'group-hover:border-slate-300/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]', 0, 1),
(5, 3, 'League Akari', 'LOL 自动接收对局 + 选人阶段查看队友 ID 避坑神器。', 'https://leagueakari.github.io/', 'Trophy', 'text-red-400', 'group-hover:border-red-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]', 0, 0),
(6, 3, 'Lobby Reveal', '另一款功能强大的选人阶段查看队友 ID 避坑工具。', 'https://lobbyreveal.app/', 'Eye', 'text-purple-400', 'group-hover:border-purple-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]', 0, 1),
(7, 3, '黄金之路网页小游戏', '趣味互动推荐，排队闲暇之余的娱乐神器。', 'https://goldenroadlol.alonglfb.com/', 'Gamepad2', 'text-amber-400', 'group-hover:border-amber-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]', 0, 2),
(8, 4, 'OP.GG 战绩查询', '全球最权威的英雄联盟玩家战绩、英雄数据查询平台。', 'https://op.gg/zh-cn', 'Search', 'text-blue-400', 'group-hover:border-blue-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]', 0, 0),
(9, 4, 'AI 召唤师神谕', '输入你的 Riot ID，让虚空枢纽的 AI 为你的近期战绩给出最毒舌或最激情的裁决。', 'https://loleval.alonglfb.com/zh', 'Activity', 'text-purple-400', 'group-hover:border-purple-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]', 0, 1),
(10, 5, '中东服群友资料录入', '新群友请务必在此录入信息，方便大家认识与组队。', 'https://group-melol.alonglfb.com', 'UserPlus', 'text-hextech-blue', 'group-hover:border-hextech-blue/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]', 0, 0),
(11, 5, '群友大合集在线表格', '添加 ID 方便开黑，同时群主将基于此数据制作【群内中东排行榜统计】！', 'https://docs.google.com/spreadsheets/d/1uC4hdBxfkCHCT4EPc60OqGifrboigXdyJ2RAgVE16sA/edit?usp=sharing', 'Table', 'text-green-400', 'group-hover:border-green-400/50', 'group-hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]', 0, 1);
