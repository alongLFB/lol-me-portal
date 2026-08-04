import { eq, asc } from "drizzle-orm";
import { db } from "./client";
import {
  siteSettings,
  sections,
  portalItems,
  type Section,
  type PortalItem,
  type NewSection,
  type NewPortalItem,
} from "./schema";

export interface DefaultSection {
  id?: number;
  title: string;
  fullWidth?: boolean;
  sortOrder?: number;
  items: {
    id?: number;
    title: string;
    desc: string;
    link: string;
    icon: string;
    color: string;
    borderGlow: string;
    shadowGlow: string;
    featured?: boolean;
    sortOrder?: number;
  }[];
}

export const DEFAULT_SITE_SETTINGS: Record<string, string> = {
  header_title: "LOL 中东服玩家社区门户",
  header_subtitle: "汇聚中东服华人群友，一站式开黑工具与数据看板。",
  alert_title: "群友行动指引",
  alert_content: "提醒进群后将群昵称修改为：“游戏ID#后缀 + 段位 + 主玩位置”（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。",
};

export const DEFAULT_SECTIONS: DefaultSection[] = [
  {
    title: "新手起航与客户端",
    fullWidth: false,
    sortOrder: 0,
    items: [
      {
        title: "中东服官方下载",
        desc: "外服共用同一个客户端，服务器取决于账号所属地区。",
        link: "https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.me1.exe",
        icon: "Download",
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
        sortOrder: 0,
      },
      {
        title: "账号注册与转服教程",
        desc: "Riot 官方教程，解答跨区与账号相关问题。",
        link: "https://support-leagueoflegends.riotgames.com/hc/zh-tw/articles/201751684--%E8%8B%B1%E9%9B%84%E8%81%AF%E7%9B%9F-%E5%9C%B0%E5%8D%80%E4%BC%BA%E6%9C%8D%E5%99%A8",
        icon: "BookOpen",
        color: "text-lol-gold",
        borderGlow: "group-hover:border-lol-gold/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(200,155,60,0.3)]",
        sortOrder: 1,
      },
    ],
  },
  {
    title: "社群开黑语音",
    fullWidth: false,
    sortOrder: 1,
    items: [
      {
        title: "Discord 专属频道",
        desc: "寻找车队、语音开黑，点击即刻加入华人聚集地！",
        link: "https://discord.gg/UJpAURGy6E",
        icon: "Headset",
        color: "text-[#5865F2]",
        borderGlow: "group-hover:border-[#5865F2]/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.4)]",
        featured: true,
        sortOrder: 0,
      },
      {
        title: "DC 语音优化工具",
        desc: "Drover：用于优化和支持 Discord 语音体验的辅助工具。",
        link: "https://github.com/hdrover/discord-drover",
        icon: "Zap",
        color: "text-slate-300",
        borderGlow: "group-hover:border-slate-300/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]",
        sortOrder: 1,
      },
    ],
  },
  {
    title: "游戏上分神器",
    fullWidth: false,
    sortOrder: 2,
    items: [
      {
        title: "League Akari",
        desc: "LOL 自动接收对局 + 选人阶段查看队友 ID 避坑神器。",
        link: "https://leagueakari.github.io/",
        icon: "Trophy",
        color: "text-red-400",
        borderGlow: "group-hover:border-red-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]",
        sortOrder: 0,
      },
      {
        title: "Lobby Reveal",
        desc: "另一款功能强大的选人阶段查看队友 ID 避坑工具。",
        link: "https://lobbyreveal.app/",
        icon: "Eye",
        color: "text-purple-400",
        borderGlow: "group-hover:border-purple-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        sortOrder: 1,
      },
      {
        title: "黄金之路网页小游戏",
        desc: "趣味互动推荐，排队闲暇之余的娱乐神器。",
        link: "https://goldenroadlol.alonglfb.com/",
        icon: "Gamepad2",
        color: "text-amber-400",
        borderGlow: "group-hover:border-amber-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]",
        sortOrder: 2,
      },
    ],
  },
  {
    title: "战绩查询与数据评估",
    fullWidth: false,
    sortOrder: 3,
    items: [
      {
        title: "OP.GG 战绩查询",
        desc: "全球最权威的英雄联盟玩家战绩、英雄数据查询平台。",
        link: "https://op.gg/zh-cn",
        icon: "Search",
        color: "text-blue-400",
        borderGlow: "group-hover:border-blue-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
        sortOrder: 0,
      },
      {
        title: "AI 召唤师神谕",
        desc: "输入你的 Riot ID，让虚空枢纽的 AI 为你的近期战绩给出最毒舌或最激情的裁决。",
        link: "https://loleval.alonglfb.com/zh",
        icon: "Activity",
        color: "text-purple-400",
        borderGlow: "group-hover:border-purple-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]",
        sortOrder: 1,
      },
    ],
  },
  {
    title: "群友数据与排行榜",
    fullWidth: true,
    sortOrder: 4,
    items: [
      {
        title: "中东服群友资料录入",
        desc: "新群友请务必在此录入信息，方便大家认识与组队。",
        link: "https://group-melol.alonglfb.com",
        icon: "UserPlus",
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
        sortOrder: 0,
      },
      {
        title: "群友大合集在线表格",
        desc: "添加 ID 方便开黑，同时群主将基于此数据制作【群内中东排行榜统计】！",
        link: "https://docs.google.com/spreadsheets/d/1uC4hdBxfkCHCT4EPc60OqGifrboigXdyJ2RAgVE16sA/edit?usp=sharing",
        icon: "Table",
        color: "text-green-400",
        borderGlow: "group-hover:border-green-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]",
        sortOrder: 1,
      },
    ],
  },
];

export async function seedDefaultData() {
  try {
    for (const [key, value] of Object.entries(DEFAULT_SITE_SETTINGS)) {
      await updateSiteSetting(key, value);
    }

    for (let secIdx = 0; secIdx < DEFAULT_SECTIONS.length; secIdx++) {
      const secDef = DEFAULT_SECTIONS[secIdx];
      const insertedSec = await createSection({
        title: secDef.title,
        sort_order: secDef.sortOrder ?? secIdx,
        full_width: secDef.fullWidth ?? false,
      });

      const secId = insertedSec[0]?.id;
      if (secId) {
        for (let itemIdx = 0; itemIdx < secDef.items.length; itemIdx++) {
          const itemDef = secDef.items[itemIdx];
          await createPortalItem({
            section_id: secId,
            title: itemDef.title,
            desc: itemDef.desc,
            link: itemDef.link,
            icon: itemDef.icon,
            color: itemDef.color,
            border_glow: itemDef.borderGlow,
            shadow_glow: itemDef.shadowGlow,
            featured: itemDef.featured ?? false,
            sort_order: itemDef.sortOrder ?? itemIdx,
          });
        }
      }
    }
    console.log("Successfully auto-seeded default portal data into D1 database!");
  } catch (err) {
    console.warn("Auto-seeding failed:", err);
  }
}

// ─── Site Settings Queries ───────────────────────────────────────────────────

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    const settings = { ...DEFAULT_SITE_SETTINGS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch (error) {
    console.warn("Using default site settings due to D1 query failure:", error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSetting(key: string, value: string) {
  return db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value },
    })
    .returning();
}

// ─── Full Portal Data Queries ────────────────────────────────────────────────

export async function getPortalData(): Promise<{
  settings: Record<string, string>;
  sections: {
    id: number;
    title: string;
    full_width: boolean;
    sort_order: number;
    items: PortalItem[];
  }[];
}> {
  try {
    let allSections = await db.select().from(sections).orderBy(asc(sections.sort_order));

    if (allSections.length === 0) {
      // Auto-seed empty database
      await seedDefaultData();
      allSections = await db.select().from(sections).orderBy(asc(sections.sort_order));
    }

    const [settingsMap, allItems] = await Promise.all([
      getSiteSettings(),
      db.select().from(portalItems).orderBy(asc(portalItems.sort_order)),
    ]);

    const itemsBySection = new Map<number, PortalItem[]>();
    for (const item of allItems) {
      const list = itemsBySection.get(item.section_id) || [];
      list.push(item);
      itemsBySection.set(item.section_id, list);
    }

    return {
      settings: settingsMap,
      sections: allSections.map((sec) => ({
        ...sec,
        items: itemsBySection.get(sec.id) || [],
      })),
    };
  } catch (error) {
    console.warn("Using fallback default portal data due to DB error:", error);
    return {
      settings: DEFAULT_SITE_SETTINGS,
      sections: DEFAULT_SECTIONS.map((sec, secIdx) => ({
        id: secIdx + 1,
        title: sec.title,
        full_width: sec.fullWidth ?? false,
        sort_order: sec.sortOrder ?? secIdx,
        items: sec.items.map((item, itemIdx) => ({
          id: itemIdx + 1,
          section_id: secIdx + 1,
          title: item.title,
          desc: item.desc,
          link: item.link,
          icon: item.icon,
          color: item.color,
          border_glow: item.borderGlow,
          shadow_glow: item.shadowGlow,
          featured: item.featured ?? false,
          sort_order: item.sortOrder ?? itemIdx,
          created_at: new Date().toISOString(),
        })),
      })),
    };
  }
}

// ─── Section CRUD ─────────────────────────────────────────────────────────────

export async function getAllSections(): Promise<Section[]> {
  try {
    let list = await db.select().from(sections).orderBy(asc(sections.sort_order));
    if (list.length === 0) {
      await seedDefaultData();
      list = await db.select().from(sections).orderBy(asc(sections.sort_order));
    }
    return list;
  } catch (error) {
    console.warn("Using fallback empty/default sections due to DB error:", error);
    return DEFAULT_SECTIONS.map((sec, secIdx) => ({
      id: secIdx + 1,
      title: sec.title,
      sort_order: sec.sortOrder ?? secIdx,
      full_width: sec.fullWidth ?? false,
      created_at: new Date().toISOString(),
    }));
  }
}

export async function createSection(data: NewSection) {
  return db.insert(sections).values(data).returning();
}

export async function updateSection(id: number, data: Partial<NewSection>) {
  return db.update(sections).set(data).where(eq(sections.id, id)).returning();
}

export async function deleteSection(id: number) {
  return db.delete(sections).where(eq(sections.id, id));
}

// ─── Item CRUD ────────────────────────────────────────────────────────────────

export async function getItemsBySectionId(sectionId: number): Promise<PortalItem[]> {
  try {
    return await db
      .select()
      .from(portalItems)
      .where(eq(portalItems.section_id, sectionId))
      .orderBy(asc(portalItems.sort_order));
  } catch (error) {
    console.warn("Using fallback default items for section due to DB error:", error);
    const secIndex = sectionId - 1;
    const secDef = DEFAULT_SECTIONS[secIndex];
    if (!secDef) return [];
    return secDef.items.map((item, itemIdx) => ({
      id: itemIdx + 1,
      section_id: sectionId,
      title: item.title,
      desc: item.desc,
      link: item.link,
      icon: item.icon,
      color: item.color,
      border_glow: item.borderGlow,
      shadow_glow: item.shadowGlow,
      featured: item.featured ?? false,
      sort_order: item.sortOrder ?? itemIdx,
      created_at: new Date().toISOString(),
    }));
  }
}

export async function createPortalItem(data: NewPortalItem) {
  return db.insert(portalItems).values(data).returning();
}

export async function updatePortalItem(id: number, data: Partial<NewPortalItem>) {
  return db.update(portalItems).set(data).where(eq(portalItems.id, id)).returning();
}

export async function deletePortalItem(id: number) {
  return db.delete(portalItems).where(eq(portalItems.id, id));
}
