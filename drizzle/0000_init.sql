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
