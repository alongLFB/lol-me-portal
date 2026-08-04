-- Populate English titles for Sections
UPDATE `sections` SET `title_en` = 'Beginner & Game Client' WHERE `id` = 1;
UPDATE `sections` SET `title_en` = 'Community Voice Chat' WHERE `id` = 2;
UPDATE `sections` SET `title_en` = 'Ranked Boosting Utilities' WHERE `id` = 3;
UPDATE `sections` SET `title_en` = 'Match Stats & AI Analysis' WHERE `id` = 4;
UPDATE `sections` SET `title_en` = 'Community Roster & Leaderboard' WHERE `id` = 5;
UPDATE `sections` SET `title_en` = 'LOL Account Sharing & Management' WHERE `id` = 6;

-- Populate English titles & descriptions for Portal Items
UPDATE `portal_items` SET `title_en` = 'ME Server Client Download', `desc_en` = 'Riot uses a unified launcher; server region depends on your account.' WHERE `id` = 1;
UPDATE `portal_items` SET `title_en` = 'Account Registration & Transfer', `desc_en` = 'Official Riot guide answering region transfer & account FAQs.' WHERE `id` = 2;
UPDATE `portal_items` SET `title_en` = 'Official Discord Server', `desc_en` = 'Find teammates and join voice chat in our Discord server!' WHERE `id` = 3;
UPDATE `portal_items` SET `title_en` = 'Discord Voice Optimizer', `desc_en` = 'Drover: Utility tool for optimizing Discord voice experience.' WHERE `id` = 4;
UPDATE `portal_items` SET `title_en` = 'League Akari', `desc_en` = 'Auto-accept match & champ select lobby ID inspection tool.' WHERE `id` = 5;
UPDATE `portal_items` SET `title_en` = 'Lobby Reveal', `desc_en` = 'Powerful tool to inspect teammates IDs during champ lobby select.' WHERE `id` = 6;
UPDATE `portal_items` SET `title_en` = 'Golden Road Minigame', `desc_en` = 'Fun interactive minigame to play during queue wait times.' WHERE `id` = 7;
UPDATE `portal_items` SET `title_en` = 'OP.GG Stats Lookup', `desc_en` = 'World leading League of Legends player & hero stats platform.' WHERE `id` = 8;
UPDATE `portal_items` SET `title_en` = 'AI Summoner Oracle', `desc_en` = 'Enter your Riot ID for AI-powered roast and analysis on recent matches.' WHERE `id` = 9;
UPDATE `portal_items` SET `title_en` = 'Member Info Registration', `desc_en` = 'New members please register your info here for team matching.' WHERE `id` = 10;
UPDATE `portal_items` SET `title_en` = 'Community Roster Sheet', `desc_en` = 'View member IDs sheet and official community ranking stats!' WHERE `id` = 11;
UPDATE `portal_items` SET `title_en` = 'LOL Account Manager', `desc_en` = 'Manage and share community LOL accounts.' WHERE `id` = 12;
