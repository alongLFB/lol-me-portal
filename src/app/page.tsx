'use client';

import { motion, Variants } from 'framer-motion';
import {
  Download,
  BookOpen,
  Headset,
  Zap,
  Trophy,
  Gamepad2,
  UserPlus,
  Table,
  AlertCircle,
  ExternalLink,
  Swords,
  Search,
  Activity
} from 'lucide-react';

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

const sections = [
  {
    title: "新手起航与客户端",
    items: [
      {
        title: "中东服官方下载",
        desc: "外服共用同一个客户端，服务器取决于账号所属地区。",
        link: "https://lol.secure.dyn.riotcdn.net/channels/public/x/installer/current/live.me1.exe",
        icon: Download,
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]"
      },
      {
        title: "账号注册与转服教程",
        desc: "Riot 官方教程，解答跨区与账号相关问题。",
        link: "https://support-leagueoflegends.riotgames.com/hc/zh-tw/articles/201751684--%E8%8B%B1%E9%9B%84%E8%81%AF%E7%9B%9F-%E5%9C%B0%E5%8D%80%E4%BC%BA%E6%9C%8D%E5%99%A8",
        icon: BookOpen,
        color: "text-lol-gold",
        borderGlow: "group-hover:border-lol-gold/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(200,155,60,0.3)]"
      }
    ]
  },
  {
    title: "社群开黑语音",
    items: [
      {
        title: "Discord 专属频道",
        desc: "寻找车队、语音开黑，点击即刻加入华人聚集地！",
        link: "https://discord.gg/UJpAURGy6E",
        icon: Headset,
        color: "text-[#5865F2]",
        borderGlow: "group-hover:border-[#5865F2]/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.4)]",
        featured: true
      },
      {
        title: "DC 语音优化工具",
        desc: "Drover：用于优化和支持 Discord 语音体验的辅助工具。",
        link: "https://github.com/hdrover/discord-drover",
        icon: Zap,
        color: "text-slate-300",
        borderGlow: "group-hover:border-slate-300/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
      }
    ]
  },
  {
    title: "游戏上分神器",
    items: [
      {
        title: "HyperBoost Reveal",
        desc: "LOL 自动接收对局 + 选人阶段查看队友 ID 避坑神器。",
        link: "https://hyperboost.gg/reveal",
        icon: Trophy,
        color: "text-red-400",
        borderGlow: "group-hover:border-red-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(248,113,113,0.3)]"
      },
      {
        title: "黄金之路网页小游戏",
        desc: "趣味互动推荐，排队闲暇之余的娱乐神器。",
        link: "https://goldenroadlol.alonglfb.com/",
        icon: Gamepad2,
        color: "text-amber-400",
        borderGlow: "group-hover:border-amber-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]"
      }
    ]
  },
  {
    title: "战绩查询与数据评估",
    items: [
      {
        title: "OP.GG 战绩查询",
        desc: "全球最权威的英雄联盟玩家战绩、英雄数据查询平台。",
        link: "https://op.gg/zh-cn",
        icon: Search,
        color: "text-blue-400",
        borderGlow: "group-hover:border-blue-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(96,165,250,0.3)]"
      },
      {
        title: "玩家价值评估",
        desc: "输入游戏 ID 快速评估玩家真实表现与价值。",
        link: "https://loleval.alonglfb.com/zh",
        icon: Activity,
        color: "text-purple-400",
        borderGlow: "group-hover:border-purple-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(192,132,252,0.3)]"
      }
    ]
  },
  {
    title: "群友数据与排行榜",
    fullWidth: true,
    items: [
      {
        title: "中东服群友资料录入",
        desc: "新群友请务必在此录入信息，方便大家认识与组队。",
        link: "https://group-melol.alonglfb.com",
        icon: UserPlus,
        color: "text-hextech-blue",
        borderGlow: "group-hover:border-hextech-blue/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]"
      },
      {
        title: "群友大合集在线表格",
        desc: "添加 ID 方便开黑，同时群主将基于此数据制作【群内中东排行榜统计】！",
        link: "https://docs.google.com/spreadsheets/d/1uC4hdBxfkCHCT4EPc60OqGifrboigXdyJ2RAgVE16sA/edit?usp=sharing",
        icon: Table,
        color: "text-green-400",
        borderGlow: "group-hover:border-green-400/50",
        shadowGlow: "group-hover:shadow-[0_0_30px_-5px_rgba(74,222,128,0.3)]"
      }
    ]
  }
];

export default function Home() {
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
              LOL 中东服玩家社区门户
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            汇聚中东服华人群友，<span className="text-hextech-blue font-medium">一站式</span>开黑工具与数据看板。
          </p>

          {/* Alert Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 mx-auto max-w-3xl bg-hextech-dark/10 border border-hextech-blue/30 rounded-xl p-4 md:p-5 flex items-start text-left backdrop-blur-md shadow-[0_0_20px_rgba(10,200,185,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-hextech-blue" />
            <AlertCircle className="w-6 h-6 text-hextech-blue shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="font-semibold text-slate-100 mb-1">群友行动指引</h3>
              <p className="text-sm md:text-base text-slate-300">
                提醒进群后将群昵称修改为：<strong className="text-hextech-blue">“游戏ID#后缀 + 段位 + 主玩位置”</strong><br />
                <span className="text-slate-400 text-sm mt-1 inline-block">（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。</span>
              </p>
            </div>
          </motion.div>
        </motion.header>

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {sections.map((section, idx) => (
            <div key={idx} className={`space-y-4 ${section.fullWidth ? 'md:col-span-2' : ''}`}>
              <h2 className="text-xl font-bold text-slate-100 flex items-center mb-6">
                <span className="w-8 h-[2px] bg-gradient-to-r from-lol-gold to-transparent mr-3" />
                {section.title}
              </h2>

              <div className={`grid grid-cols-1 ${section.fullWidth ? 'md:grid-cols-2' : ''} gap-4`}>
                {section.items.map((item, itemIdx) => (
                  <motion.a
                    key={itemIdx}
                    variants={itemVariants}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group relative flex flex-col p-5 md:p-6 rounded-2xl 
                      bg-slate-900/40 backdrop-blur-md border border-white/5 
                      transition-all duration-300 ease-out
                      hover:-translate-y-1 ${item.borderGlow} ${item.shadowGlow}
                      ${'featured' in item && item.featured ? 'bg-gradient-to-br from-[#5865F2]/10 to-transparent border-[#5865F2]/20' : ''}
                    `}
                  >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-6 h-6 md:w-7 md:h-7" />
                      </div>
                      <ExternalLink className="w-5 h-5 text-slate-500 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 pt-8 border-t border-white/10 text-center text-sm text-slate-500"
        >
          <p>© {new Date().getFullYear()} LOL 中东服华人社区. GLHF.</p>
        </motion.footer>

      </div>
    </main>
  );
}
