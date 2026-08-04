-- Migration: Add bilingual columns to Cloudflare D1 Database
ALTER TABLE `sections` ADD COLUMN `title_en` text;
ALTER TABLE `portal_items` ADD COLUMN `title_en` text;
ALTER TABLE `portal_items` ADD COLUMN `desc_en` text;

-- Seed English Site Settings
INSERT OR IGNORE INTO `site_settings` (`key`, `value`) VALUES
('header_title_en', 'LOL Middle East Community Portal'),
('header_subtitle_en', 'Hub for League of Legends ME Server Chinese Community. Tools & Leaderboards.'),
('alert_title_en', 'Community Action Guide'),
('alert_content_en', 'Please change your group nickname to: Riot ID#Tag - Rank - Main Position (e.g. Faker#KR1 - Challenger - MID).'),
('footer_copyright_en', '© 2026 LOL ME Chinese Community. GLHF.');
