'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, Variants } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Swords, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LocaleToggle } from '@/components/layout/LocaleToggle';

interface ItemData {
  id: number;
  section_id: number;
  title: string;
  title_en?: string;
  desc: string;
  desc_en?: string;
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
  title_en?: string;
  full_width: boolean;
  sort_order: number;
  items: ItemData[];
}

interface PortalData {
  settings: Record<string, string>;
  sections: SectionData[];
}

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

function getIconComponent(name: string) {
  if (!name || !name.trim()) return ExternalLink;

  const iconsMap = (Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>;
  const trimmed = name.trim();

  if (iconsMap[trimmed]) return iconsMap[trimmed];

  const pascalName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (iconsMap[pascalName]) return iconsMap[pascalName];

  const lowerName = trimmed.toLowerCase();
  const foundKey = Object.keys(iconsMap).find((k) => k.toLowerCase() === lowerName);
  if (foundKey && iconsMap[foundKey]) return iconsMap[foundKey];

  return ExternalLink;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} />;
}

import { useI18n } from '@/components/providers/I18nProvider';

export default function Home() {
  const tHome = useTranslations("home");
  const tNav = useTranslations("nav");
  const { locale } = useI18n();

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
        setData(null);
      }
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Locale-aware settings with i18n fallback
  const isEn = locale === 'en';
  const headerTitle =
    (isEn && data?.settings?.header_title_en) ||
    data?.settings?.header_title ||
    tHome("title");

  const headerSubtitle =
    (isEn && data?.settings?.header_subtitle_en) ||
    data?.settings?.header_subtitle ||
    tHome("subtitle");

  const alertTitle =
    (isEn && data?.settings?.alert_title_en) ||
    data?.settings?.alert_title ||
    tHome("alert_title");

  const alertContent =
    (isEn && data?.settings?.alert_content_en) ||
    data?.settings?.alert_content ||
    tHome("alert_content");

  const footerCopyright =
    (isEn && data?.settings?.footer_copyright_en) ||
    data?.settings?.footer_copyright ||
    tHome("footer_copyright");

  const sectionsToRender = data?.sections || [];

  return (
    <main className="min-h-screen relative overflow-hidden text-slate-800 dark:text-slate-200">
      {/* Background Decorators */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-hextech-blue/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lol-gold/5 blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-16 relative z-10">

        {/* Top Control Bar: Theme & Language Toggle */}
        <div className="flex items-center space-x-3 justify-end mb-8">
          <LocaleToggle />
          <ThemeToggle />
        </div>

        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-white/70 border border-slate-200/80 dark:bg-white/5 dark:border-white/10 backdrop-blur-md shadow-xl dark:shadow-2xl">
            <Swords className="w-8 h-8 text-lol-gold mr-3 shrink-0" />
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-100 dark:via-white dark:to-slate-400">
              {headerTitle}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>

          {/* Alert Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 mx-auto max-w-3xl bg-white/80 border border-hextech-blue/40 dark:bg-hextech-dark/10 dark:border-hextech-blue/30 rounded-2xl p-4 md:p-6 flex flex-col items-center text-center backdrop-blur-md shadow-lg dark:shadow-[0_0_20px_rgba(10,200,185,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hextech-blue to-transparent" />
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-hextech-blue mr-2 shrink-0" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">{alertTitle}</h3>
            </div>
            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {alertContent}
            </p>
          </motion.div>
        </motion.header>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 dark:text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-hextech-blue mr-3" />
            <span>{tHome("loading")}</span>
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

              const secTitle = (isEn && section.title_en) || section.title;

              return (
                <div key={section.id || idx} className="space-y-6">
                  {/* 居中对称的标题 */}
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center justify-center">
                    <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-lol-gold mr-4 opacity-70" />
                    {secTitle}
                    <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-lol-gold ml-4 opacity-70" />
                  </h2>

                  <div className={`grid ${gridCols} gap-4 md:gap-6`}>
                    {section.items.map((item, itemIdx) => {
                      const itemTitle = (isEn && item.title_en) || item.title;
                      const itemDesc = (isEn && item.desc_en) || item.desc;

                      return (
                        <motion.a
                          key={item.id || itemIdx}
                          variants={itemVariants}
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`
                            group relative flex flex-col items-center text-center p-6 md:p-8 rounded-2xl 
                            bg-white/80 border border-slate-200/80 shadow-md
                            dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/5 dark:shadow-none
                            transition-all duration-300 ease-out
                            hover:-translate-y-1 ${item.border_glow} ${item.shadow_glow}
                            ${item.featured ? 'bg-gradient-to-br from-[#5865F2]/10 to-transparent border-[#5865F2]/30' : ''}
                          `}
                        >
                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-hextech-blue/[0.04] dark:from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* External Link Icon (Top Right) */}
                          <ExternalLink className="absolute top-5 right-5 w-5 h-5 text-slate-400 dark:text-slate-500 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 z-20" />

                          {/* 居中的图标 */}
                          <div className={`p-4 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 ${item.color} group-hover:scale-110 transition-transform duration-300 mb-5 relative z-10`}>
                            <DynamicIcon name={item.icon} className="w-8 h-8 md:w-10 md:h-10" />
                          </div>

                          {/* 居中的文字 */}
                          <div className="relative z-10 flex-1 flex flex-col">
                            <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-hextech-blue dark:group-hover:text-white transition-colors mb-3">
                              {itemTitle}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors leading-relaxed">
                              {itemDesc}
                            </p>
                          </div>
                        </motion.a>
                      );
                    })}
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
          className="mt-20 pt-8 border-t border-slate-200 dark:border-white/10 text-center text-sm text-slate-500 flex items-center justify-between"
        >
          <p>{footerCopyright}</p>
          <a href={`/${locale}/admin`} className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-600 dark:hover:text-slate-400 transition-colors">
            {tNav("admin")}
          </a>
        </motion.footer>

      </div>
    </main>
  );
}
