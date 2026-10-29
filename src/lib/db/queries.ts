import { eq, asc } from "drizzle-orm";
import { db, withNoStore } from "./client";
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
  title_en?: string;
  fullWidth?: boolean;
  sortOrder?: number;
  items: {
    id?: number;
    title: string;
    title_en?: string;
    desc: string;
    desc_en?: string;
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
  header_title_en: "LOL Middle East Community Portal",
  header_subtitle: "汇聚中东服华人群友，一站式开黑工具与数据看板。",
  header_subtitle_en: "Hub for League of Legends ME Server Chinese Community. Tools & Leaderboards.",
  alert_title: "群友行动指引",
  alert_title_en: "Community Action Guide",
  alert_content: "提醒进群后将群昵称修改为：“游戏ID#后缀 + 段位 + 主玩位置”（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。",
  alert_content_en: "Please change your group nickname to: 'Riot ID#Tag - Rank - Main Position' (e.g. Faker#KR1 - Challenger - MID).",
  footer_copyright: `© ${new Date().getFullYear()} LOL 中东服华人社区. GLHF.`,
  footer_copyright_en: `© ${new Date().getFullYear()} LOL ME Chinese Community. GLHF.`,
};

export const DEFAULT_SECTIONS: DefaultSection[] = [
  {
    title: "新手起航与客户端",
    title_en: "Beginner & Game Client",
    fullWidth: false,
    sortOrder: 0,
    items: [
      {
        title: "中东服官方下载",
        title_en: "ME Server Client Download",
        desc: "外服共用同一个客户端，服务器取决于账号所属地区。",
        desc_en: "Riot uses a unified launcher; server region depends on your account.",
        link: "https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.me1.exe",
        icon: "Download",
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
        sortOrder: 0,
      },
      {
        title: "账号注册与转服教程",
        title_en: "Account Registration & Transfer",
        desc: "Riot 官方教程，解答跨区与账号相关问题。",
        desc_en: "Official Riot guide answering region transfer & account FAQs.",
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
    title_en: "Community Voice Chat",
    fullWidth: false,
    sortOrder: 1,
    items: [
      {
        title: "Discord 专属频道",
        title_en: "Official Discord Server",
        desc: "寻找车队、语音开黑，点击即刻加入华人聚集地！",
        desc_en: "Find teammates and join voice chat in our Discord server!",
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
        title_en: "Discord Voice Optimizer",
        desc: "Drover：用于优化和支持 Discord 语音体验的辅助工具。",
        desc_en: "Drover: Utility tool for optimizing Discord voice experience.",
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
    title_en: "Ranked Boosting Utilities",
    fullWidth: false,
    sortOrder: 2,
    items: [
      {
        title: "League Akari",
        title_en: "League Akari",
        desc: "LOL 自动接收对局 + 选人阶段查看队友 ID 避坑神器。",
        desc_en: "Auto-accept match & champ select lobby ID inspection tool.",
        link: "https://leagueakari.github.io/",
        icon: "Trophy",
        color: "text-red-400",
        borderGlow: "group-hover:border-red-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]",
        sortOrder: 0,
      },
      {
        title: "Lobby Reveal",
        title_en: "Lobby Reveal",
        desc: "另一款功能强大的选人阶段查看队友 ID 避坑工具。",
        desc_en: "Powerful tool to inspect teammates' IDs during champ lobby select.",
        link: "https://lobbyreveal.app/",
        icon: "Eye",
        color: "text-purple-400",
        borderGlow: "group-hover:border-purple-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        sortOrder: 1,
      },
      {
        title: "黄金之路网页小游戏",
        title_en: "Golden Road Minigame",
        desc: "趣味互动推荐，排队闲暇之余的娱乐神器。",
        desc_en: "Fun interactive minigame to play during queue wait times.",
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
    title_en: "Match Stats & AI Analysis",
    fullWidth: false,
    sortOrder: 3,
    items: [
      {
        title: "OP.GG 战绩查询",
        title_en: "OP.GG Stats Lookup",
        desc: "全球最权威的英雄联盟玩家战绩、英雄数据查询平台。",
        desc_en: "World leading League of Legends player & hero stats platform.",
        link: "https://op.gg/zh-cn",
        icon: "Search",
        color: "text-blue-400",
        borderGlow: "group-hover:border-blue-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
        sortOrder: 0,
      },
      {
        title: "AI 召唤师神谕",
        title_en: "AI Summoner Oracle",
        desc: "输入你的 Riot ID，让虚空枢纽的 AI 为你的近期战绩给出最毒舌或最激情的裁决。",
        desc_en: "Enter your Riot ID for AI-powered roast and analysis on recent matches.",
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
    title_en: "Community Roster & Leaderboard",
    fullWidth: true,
    sortOrder: 4,
    items: [
      {
        title: "中东服群友资料录入",
        title_en: "Member Info Registration",
        desc: "新群友请务必在此录入信息，方便大家认识与组队。",
        desc_en: "New members please register your info here for team matching.",
        link: "https://group-melol.alonglfb.com",
        icon: "UserPlus",
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
        sortOrder: 0,
      },
      {
        title: "群友大合集在线表格",
        title_en: "Community Roster Sheet",
        desc: "添加 ID 方便开黑，同时群主将基于此数据制作【群内中东排行榜统计】！",
        desc_en: "View member IDs sheet and official community ranking stats!",
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
        title_en: secDef.title_en || secDef.title,
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
            title_en: itemDef.title_en || itemDef.title,
            desc: itemDef.desc,
            desc_en: itemDef.desc_en || itemDef.desc,
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

export async function getSiteSettings(noStore?: boolean): Promise<Record<string, string>> {
  const queryFn = async () => {
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
  };
  return noStore ? withNoStore(queryFn) : queryFn();
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
    title_en?: string | null;
    full_width: boolean;
    sort_order: number;
    items: PortalItem[];
  }[];
}> {
  try {
    let allSections = await db.select().from(sections).orderBy(asc(sections.sort_order));

    if (allSections.length === 0) {
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
        title_en: sec.title_en,
        full_width: sec.fullWidth ?? false,
        sort_order: sec.sortOrder ?? secIdx,
        items: sec.items.map((item, itemIdx) => ({
          id: itemIdx + 1,
          section_id: secIdx + 1,
          title: item.title,
          title_en: item.title_en ?? item.title,
          desc: item.desc,
          desc_en: item.desc_en ?? item.desc,
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
  return withNoStore(async () => {
    let list = await db.select().from(sections).orderBy(asc(sections.sort_order));
    if (list.length === 0) {
      await seedDefaultData();
      list = await db.select().from(sections).orderBy(asc(sections.sort_order));
    }
    return list;
  });
}

export async function createSection(data: NewSection) {
  return db.insert(sections).values(data).returning();
}

export async function updateSection(id: number, data: Partial<NewSection>) {
  return db.update(sections).set(data).where(eq(sections.id, id)).returning();
}

export async function deleteSection(id: number) {
  return db.delete(sections).where(eq(sections.id, id)).returning({ id: sections.id });
}

// ─── Item CRUD ────────────────────────────────────────────────────────────────

export async function getItemsBySectionId(sectionId: number): Promise<PortalItem[]> {
  return withNoStore(async () => {
    return await db
      .select()
      .from(portalItems)
      .where(eq(portalItems.section_id, sectionId))
      .orderBy(asc(portalItems.sort_order));
  });
}

export async function createPortalItem(data: NewPortalItem) {
  return db.insert(portalItems).values(data).returning();
}

export async function updatePortalItem(id: number, data: Partial<NewPortalItem>) {
  return db.update(portalItems).set(data).where(eq(portalItems.id, id)).returning();
}

export async function deletePortalItem(id: number) {
  return db.delete(portalItems).where(eq(portalItems.id, id)).returning({ id: portalItems.id });
}
