'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Swords, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

interface ItemData {
  id: number;
  section_id: number;
  title: string;
  desc: string;
  link: string;
  icon: string;
  color: string;
  border_glow: string;
  shadow_glow: string;
  featured: boolean;
  sort_order: number;
}

interface SectionData {
  id: number;
  title: string;
  full_width: boolean;
  sort_order: number;
  items: ItemData[];
}

interface PortalData {
  settings: Record<string, string>;
  sections: SectionData[];
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent =
    ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[name] || ExternalLink;
  return <IconComponent className={className} />;
}

export default function Home() {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const settings = res.ok ? await res.json() : {};
      
      const secRes = await fetch('/api/admin/sections');
      const sections: SectionData[] = secRes.ok ? await secRes.json() : [];

      if (sections.length > 0) {
        const sectionsWithItems = await Promise.all(
          sections.map(async (sec) => {
            const itemRes = await fetch(`/api/admin/items?sectionId=${sec.id}`);
            const items = itemRes.ok ? await itemRes.json() : [];
            return { ...sec, items };
          })
        );
        setData({ settings, sections: sectionsWithItems });
      } else {
        // Fallback to static data API or default
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fallback default content if data loading returns null / empty
  const headerTitle = data?.settings?.header_title || "LOL 中东服玩家社区门户";
  const headerSubtitle = data?.settings?.header_subtitle || "汇聚中东服华人群友，一站式开黑工具与数据看板。";
  const alertTitle = data?.settings?.alert_title || "群友行动指引";
  const alertContent = data?.settings?.alert_content || "提醒进群后将群昵称修改为：“游戏ID#后缀 + 段位 + 主玩位置”（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。";

  const defaultSections: SectionData[] = [
    {
      id: 1,
      title: "新手起航与客户端",
      full_width: false,
      sort_order: 0,
      items: [
        {
          id: 1,
          section_id: 1,
          title: "中东服官方下载",
          desc: "外服共用同一个客户端，服务器取决于账号所属地区。",
          link: "https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.me1.exe",
          icon: "Download",
          color: "text-hextech-blue",
          border_glow: "group-hover:border-hextech-blue/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
          featured: false,
          sort_order: 0,
        },
        {
          id: 2,
          section_id: 1,
          title: "账号注册与转服教程",
          desc: "Riot 官方教程，解答跨区与账号相关问题。",
          link: "https://support-leagueoflegends.riotgames.com/hc/zh-tw/articles/201751684--%E8%8B%B1%E9%9B%84%E8%81%AF%E7%9B%9F-%E5%9C%B0%E5%8D%80%E4%BC%BA%E6%9C%8D%E5%99%A8",
          icon: "BookOpen",
          color: "text-lol-gold",
          border_glow: "group-hover:border-lol-gold/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(200,155,60,0.3)]",
          featured: false,
          sort_order: 1,
        },
      ],
    },
    {
      id: 2,
      title: "社群开黑语音",
      full_width: false,
      sort_order: 1,
      items: [
        {
          id: 3,
          section_id: 2,
          title: "Discord 专属频道",
          desc: "寻找车队、语音开黑，点击即刻加入华人聚集地！",
          link: "https://discord.gg/UJpAURGy6E",
          icon: "Headset",
          color: "text-[#5865F2]",
          border_glow: "group-hover:border-[#5865F2]/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.4)]",
          featured: true,
          sort_order: 0,
        },
        {
          id: 4,
          section_id: 2,
          title: "DC 语音优化工具",
          desc: "Drover：用于优化和支持 Discord 语音体验的辅助工具。",
          link: "https://github.com/hdrover/discord-drover",
          icon: "Zap",
          color: "text-slate-300",
          border_glow: "group-hover:border-slate-300/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]",
          featured: false,
          sort_order: 1,
        },
      ],
    },
    {
      id: 3,
      title: "游戏上分神器",
      full_width: false,
      sort_order: 2,
      items: [
        {
          id: 5,
          section_id: 3,
          title: "League Akari",
          desc: "LOL 自动接收对局 + 选人阶段查看队友 ID 避坑神器。",
          link: "https://leagueakari.github.io/",
          icon: "Trophy",
          color: "text-red-400",
          border_glow: "group-hover:border-red-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]",
          featured: false,
          sort_order: 0,
        },
        {
          id: 6,
          section_id: 3,
          title: "Lobby Reveal",
          desc: "另一款功能强大的选人阶段查看队友 ID 避坑工具。",
          link: "https://lobbyreveal.app/",
          icon: "Eye",
          color: "text-purple-400",
          border_glow: "group-hover:border-purple-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
          featured: false,
          sort_order: 1,
        },
        {
          id: 7,
          section_id: 3,
          title: "黄金之路网页小游戏",
          desc: "趣味互动推荐，排队闲暇之余的娱乐神器。",
          link: "https://goldenroadlol.alonglfb.com/",
          icon: "Gamepad2",
          color: "text-amber-400",
          border_glow: "group-hover:border-amber-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]",
          featured: false,
          sort_order: 2,
        },
      ],
    },
    {
      id: 4,
      title: "战绩查询与数据评估",
      full_width: false,
      sort_order: 3,
      items: [
        {
          id: 8,
          section_id: 4,
          title: "OP.GG 战绩查询",
          desc: "全球最权威的英雄联盟玩家战绩、英雄数据查询平台。",
          link: "https://op.gg/zh-cn",
          icon: "Search",
          color: "text-blue-400",
          border_glow: "group-hover:border-blue-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]",
          featured: false,
          sort_order: 0,
        },
        {
          id: 9,
          section_id: 4,
          title: "AI 召唤师神谕",
          desc: "输入你的 Riot ID，让虚空枢纽的 AI 为你的近期战绩给出最毒舌或最激情的裁决。",
          link: "https://loleval.alonglfb.com/zh",
          icon: "Activity",
          color: "text-purple-400",
          border_glow: "group-hover:border-purple-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]",
          featured: false,
          sort_order: 1,
        },
      ],
    },
    {
      id: 5,
      title: "群友数据与排行榜",
      full_width: true,
      sort_order: 4,
      items: [
        {
          id: 10,
          section_id: 5,
          title: "中东服群友资料录入",
          desc: "新群友请务必在此录入信息，方便大家认识与组队。",
          link: "https://group-melol.alonglfb.com",
          icon: "UserPlus",
          color: "text-hextech-blue",
          border_glow: "group-hover:border-hextech-blue/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
          featured: false,
          sort_order: 0,
        },
        {
          id: 11,
          section_id: 5,
          title: "群友大合集在线表格",
          desc: "添加 ID 方便开黑，同时群主将基于此数据制作【群内中东排行榜统计】！",
          link: "https://docs.google.com/spreadsheets/d/1uC4hdBxfkCHCT4EPc60OqGifrboigXdyJ2RAgVE16sA/edit?usp=sharing",
          icon: "Table",
          color: "text-green-400",
          border_glow: "group-hover:border-green-400/50",
          shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]",
          featured: false,
          sort_order: 1,
        },
      ],
    },
  ];

  const sectionsToRender = data?.sections && data.sections.length > 0 ? data.sections : defaultSections;

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-200">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hextech-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lol-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 relative z-10">

        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
            <Swords className="w-8 h-8 text-lol-gold mr-3" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-white to-slate-400">
              {headerTitle}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>

          {/* Alert Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 mx-auto max-w-3xl bg-hextech-dark/10 border border-hextech-blue/30 rounded-xl p-4 md:p-5 flex flex-col items-center text-center backdrop-blur-md shadow-[0_0_20px_rgba(10,200,185,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hextech-blue to-transparent" />
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-hextech-blue mr-2" />
              <h3 className="font-semibold text-slate-100 text-lg">{alertTitle}</h3>
            </div>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {alertContent}
            </p>
          </motion.div>
        </motion.header>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-hextech-blue mr-3" />
            <span>加载数据中...</span>
          </div>
        ) : (
          /* Content Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col space-y-12 md:space-y-16"
          >
            {sectionsToRender.map((section, idx) => {
              const gridCols = section.items.length === 3 
                ? 'grid-cols-1 md:grid-cols-3' 
                : 'grid-cols-1 md:grid-cols-2';

              return (
                <div key={section.id || idx} className="space-y-6">
                  {/* 居中对称的标题 */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center justify-center">
                    <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-lol-gold mr-4 opacity-70" />
                    {section.title}
                    <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-lol-gold ml-4 opacity-70" />
                  </h2>

                  <div className={`grid ${gridCols} gap-4 md:gap-6`}>
                    {section.items.map((item, itemIdx) => (
                      <motion.a
                        key={item.id || itemIdx}
                        variants={itemVariants}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          group relative flex flex-col items-center text-center p-6 md:p-8 rounded-2xl 
                          bg-slate-900/40 backdrop-blur-md border border-white/5 
                          transition-all duration-300 ease-out
                          hover:-translate-y-1 ${item.border_glow} ${item.shadow_glow}
                          ${item.featured ? 'bg-gradient-to-br from-[#5865F2]/10 to-transparent border-[#5865F2]/20' : ''}
                        `}
                      >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* External Link Icon (Top Right) */}
                        <ExternalLink className="absolute top-5 right-5 w-5 h-5 text-slate-500 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 z-20" />

                        {/* 居中的图标 */}
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${item.color} group-hover:scale-110 transition-transform duration-300 mb-5 relative z-10`}>
                          <DynamicIcon name={item.icon} className="w-8 h-8 md:w-10 md:h-10" />
                        </div>

                        {/* 居中的文字 */}
                        <div className="relative z-10 flex-1 flex flex-col">
                          <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-white transition-colors mb-3">
                            {item.title}
                          </h3>
                          <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-slate-500 flex items-center justify-between"
        >
          <p>© {new Date().getFullYear()} LOL 中东服华人社区. GLHF.</p>
          <a href="/admin" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            管理后台
          </a>
        </motion.footer>

      </div>
    </main>
  );
}
