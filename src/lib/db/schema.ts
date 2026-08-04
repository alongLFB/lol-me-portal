import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ─── Site Settings ─────────────────────────────────────────────────────────────
export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updated_at: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Sections ──────────────────────────────────────────────────────────────────
export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  sort_order: integer("sort_order").notNull().default(0),
  full_width: integer("full_width", { mode: "boolean" })
    .notNull()
    .default(false),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── Portal Items ──────────────────────────────────────────────────────────────
export const portalItems = sqliteTable("portal_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  section_id: integer("section_id")
    .notNull()
    .references(() => sections.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  link: text("link").notNull(),
  icon: text("icon").notNull().default("ExternalLink"),
  color: text("color").notNull().default("text-hextech-blue"),
  border_glow: text("border_glow").notNull().default("group-hover:border-hextech-blue/50"),
  shadow_glow: text("shadow_glow").notNull().default("group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]"),
  featured: integer("featured", { mode: "boolean" })
    .notNull()
    .default(false),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ─── TypeScript Types ───────────────────────────────────────────────────────────
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type NewSection = typeof sections.$inferInsert;
export type PortalItem = typeof portalItems.$inferSelect;
export type NewPortalItem = typeof portalItems.$inferInsert;
