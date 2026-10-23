'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import * as Icons from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LocaleToggle } from "@/components/layout/LocaleToggle";
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  Layers,
  Search,
  Grid,
  X,
  Palette,
  Globe,
} from "lucide-react";

interface SectionData {
  id: number;
  title: string;
  title_en?: string;
  full_width: boolean;
  sort_order: number;
  items?: ItemData[];
}

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

const ALL_LUCIDE_ICONS: string[] = Object.keys(Icons).filter((key) => {
  if (key === "Icon" || key.startsWith("Lucide") || key === "default" || key === "createLucideIcon") return false;
  return key[0] === key[0].toUpperCase();
});

const POPULAR_ICONS = [
  "Download",
  "BookOpen",
  "Headset",
  "Zap",
  "Trophy",
  "Eye",
  "Gamepad2",
  "Search",
  "Activity",
  "UserPlus",
  "Table",
  "ExternalLink",
  "Droplet",
  "Globe",
  "ShieldCheck",
  "Sparkles",
  "Share2",
  "MessageSquare",
  "HelpCircle",
  "Info",
  "Folder",
  "Link",
  "Flame",
  "Star",
  "Heart",
  "Code",
  "Terminal",
  "Award",
  "Bell",
  "Bookmark",
  "Box",
  "Calendar",
  "Camera",
  "Check",
  "Compass",
  "Cpu",
  "Crown",
  "Database",
  "FileText",
  "Gift",
  "Layers",
  "Lightbulb",
  "Lock",
  "MapPin",
  "Maximize2",
  "Monitor",
  "Music",
  "Package",
  "Phone",
  "Play",
  "Rocket",
  "Server",
  "Shield",
  "ShoppingBag",
  "Smile",
  "Sword",
  "Swords",
  "Target",
  "ThumbsUp",
  "Users",
  "Video",
  "Wrench",
];

const COLOR_PRESETS = [
  { name: "海克斯蓝", value: "text-hextech-blue", bg: "#0ac8b9" },
  { name: "英雄联盟金", value: "text-lol-gold", bg: "#c89b3c" },
  { name: "Discord 蓝", value: "text-[#5865F2]", bg: "#5865F2" },
  { name: "虚空紫", value: "text-purple-400", bg: "#c084fc" },
  { name: "暴击红", value: "text-red-400", bg: "#f87171" },
  { name: "琥珀金", value: "text-amber-400", bg: "#fbbf24" },
  { name: "蔚蓝", value: "text-blue-400", bg: "#60a5fa" },
  { name: "祖安绿", value: "text-green-400", bg: "#4ade80" },
  { name: "翡翠绿", value: "text-emerald-400", bg: "#34d399" },
  { name: "青空蓝", value: "text-cyan-400", bg: "#22d3ee" },
  { name: "白银白", value: "text-slate-300", bg: "#cbd5e1" },
  { name: "玫瑰粉", value: "text-pink-400", bg: "#f472b6" },
  { name: "烈焰橙", value: "text-orange-400", bg: "#fb923c" },
  { name: "恕瑞玛黄", value: "text-yellow-300", bg: "#fde047" },
];

function getIconComponent(name: string) {
  if (!name || !name.trim()) return Icons.ExternalLink;

  const iconsMap = (Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>;
  const trimmed = name.trim();

  if (iconsMap[trimmed]) return iconsMap[trimmed];

  const pascalName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (iconsMap[pascalName]) return iconsMap[pascalName];

  const lowerName = trimmed.toLowerCase();
  const foundKey = Object.keys(iconsMap).find((k) => k.toLowerCase() === lowerName);
  if (foundKey && iconsMap[foundKey]) return iconsMap[foundKey];

  return Icons.ExternalLink;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = getIconComponent(name);
  return <IconComponent className={className} />;
}

import { useI18n } from "@/components/providers/I18nProvider";

export default function AdminDashboardPage() {
  const tAdmin = useTranslations("admin");
  const { locale } = useI18n();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"settings" | "sections" | "items">("settings");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state with bilingual support
  const [settings, setSettings] = useState({
    header_title: "",
    header_title_en: "",
    header_subtitle: "",
    header_subtitle_en: "",
    alert_title: "",
    alert_title_en: "",
    alert_content: "",
    alert_content_en: "",
    footer_copyright: "",
    footer_copyright_en: "",
  });

  // Sections & Items state
  const [sectionsList, setSectionsList] = useState<SectionData[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [itemsList, setItemsList] = useState<ItemData[]>([]);

  // Section modal state
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Partial<SectionData> | null>(null);

  // Item modal state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ItemData> | null>(null);

  // Icon Picker Modal state
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Auth check
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push(`/${locale}/admin/login`);
        return;
      }

      // Fetch Settings
      const settingsRes = await fetch("/api/admin/settings", { cache: "no-store" });
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const defaultFooter = `© ${new Date().getFullYear()} LOL 中东服华人社区. GLHF.`;
        setSettings({
          header_title: data.header_title || "LOL 中东服玩家社区门户",
          header_title_en: data.header_title_en || "LOL Middle East Community Portal",
          header_subtitle: data.header_subtitle || "汇聚中东服华人群友，一站式开黑工具与数据看板。",
          header_subtitle_en: data.header_subtitle_en || "Hub for League of Legends ME Server Chinese Community. Tools & Leaderboards.",
          alert_title: data.alert_title || "群友行动指引",
          alert_title_en: data.alert_title_en || "Community Action Guide",
          alert_content: data.alert_content || "提醒进群后将群昵称修改为：“游戏ID#后缀 + 段位 + 主玩位置”（例如：Faker#KR1 - 王者 - 中单），方便组队五黑。",
          alert_content_en: data.alert_content_en || "Please change your group nickname to: 'Riot ID#Tag - Rank - Main Position' (e.g. Faker#KR1 - Challenger - MID).",
          footer_copyright: data.footer_copyright || defaultFooter,
          footer_copyright_en: data.footer_copyright_en || `© ${new Date().getFullYear()} LOL ME Chinese Community. GLHF.`,
        });
      }

      // Fetch Sections
      const sectionsRes = await fetch("/api/admin/sections", { cache: "no-store" });
      if (sectionsRes.ok) {
        const secData: SectionData[] = await sectionsRes.json();
        setSectionsList(secData);
        if (secData.length > 0) {
          const currentValid = secData.some((s) => s.id === selectedSectionId);
          const nextSecId = currentValid && selectedSectionId ? selectedSectionId : secData[0].id;
          setSelectedSectionId(nextSecId);
          fetchItems(nextSecId);
        }
      }
    } catch {
      showMessage("error", tAdmin("load_error"));
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (secId: number) => {
    try {
      const itemsRes = await fetch(`/api/admin/items?sectionId=${secId}`, {
        cache: "no-store",
      });
      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItemsList(data);
      }
    } catch {
      showMessage("error", tAdmin("fetch_items_error"));
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/admin/login`);
  };

  const filteredIcons = useMemo(() => {
    const query = iconSearchQuery.trim().toLowerCase();
    if (!query) {
      return POPULAR_ICONS;
    }
    return ALL_LUCIDE_ICONS.filter((icon) => icon.toLowerCase().includes(query)).slice(0, 150);
  }, [iconSearchQuery]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showMessage("success", tAdmin("settings.save_success"));
      } else {
        throw new Error("保存失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "保存设置失败");
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection?.title) return;

    try {
      const isEdit = !!editingSection.id;
      const res = await fetch("/api/admin/sections", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSection),
      });

      if (res.ok) {
        showMessage("success", tAdmin("section_save_success"));
        setSectionModalOpen(false);
        setEditingSection(null);
        fetchData();
      } else {
        throw new Error(tAdmin("op_failed"));
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : tAdmin("op_failed"));
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm(tAdmin("sections.delete_confirm"))) return;
    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("success", tAdmin("section_delete_success"));
        fetchData();
      } else {
        throw new Error(tAdmin("op_failed"));
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : tAdmin("op_failed"));
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem.section_id) return;

    try {
      const isEdit = !!editingItem.id;
      const targetSectionId = Number(editingItem.section_id);
      const res = await fetch("/api/admin/items", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingItem,
          section_id: targetSectionId,
        }),
      });

      if (res.ok) {
        showMessage("success", tAdmin("item_save_success"));
        setItemModalOpen(false);
        setSelectedSectionId(targetSectionId);
        fetchItems(targetSectionId);
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || tAdmin("op_failed"));
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : tAdmin("op_failed"));
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm(tAdmin("items.delete_confirm"))) return;
    try {
      const res = await fetch(`/api/admin/items?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("success", tAdmin("item_delete_success"));
        if (selectedSectionId) fetchItems(selectedSectionId);
      } else {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || tAdmin("op_failed"));
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : tAdmin("op_failed"));
    }
  };

  if (loading && sectionsList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-hextech-blue mr-3" />
        <span>{tAdmin("loading")}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4 md:p-8 relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/90 border border-slate-200/80 dark:bg-slate-900/60 dark:border-white/10 backdrop-blur-xl shadow-md transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-hextech-blue/10 border border-hextech-blue/30 text-hextech-blue">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{tAdmin("dashboard_title")}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tAdmin("dashboard_subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <LocaleToggle />
            <ThemeToggle />
            <a
              href={`/${locale}`}
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-slate-300 text-xs font-medium transition-colors inline-flex items-center"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              {tAdmin("preview_site")}
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-medium text-red-500 dark:text-red-400 transition-colors inline-flex items-center cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              {tAdmin("logout")}
            </button>
          </div>
        </header>

        {/* Global Toast Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center shadow-lg transition-all ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/30 text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
            )}
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-white/10 gap-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x cursor-pointer ${
              activeTab === "settings"
                ? "bg-white border-slate-200/80 text-hextech-blue dark:bg-slate-900 dark:border-white/10 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            {tAdmin("tabs.settings")}
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x cursor-pointer ${
              activeTab === "sections"
                ? "bg-white border-slate-200/80 text-hextech-blue dark:bg-slate-900 dark:border-white/10 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <FolderKanban className="w-4 h-4 mr-2" />
            {tAdmin("tabs.sections")} ({sectionsList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("items");
              if (selectedSectionId) fetchItems(selectedSectionId);
            }}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x cursor-pointer ${
              activeTab === "items"
                ? "bg-white border-slate-200/80 text-hextech-blue dark:bg-slate-900 dark:border-white/10 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            {tAdmin("tabs.items")}
          </button>
        </div>

        {/* TAB 1: SITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white/90 border border-slate-200/80 dark:bg-slate-900/60 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-md space-y-6 transition-colors">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-hextech-blue mr-2" />
              {tAdmin("settings.card_title")}
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {tAdmin("settings.header_title")}
                  </label>
                  <input
                    type="text"
                    value={settings.header_title}
                    onChange={(e) => setSettings({ ...settings, header_title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hextech-blue uppercase tracking-wider mb-2 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {tAdmin("settings.header_title_en")}
                  </label>
                  <input
                    type="text"
                    value={settings.header_title_en}
                    onChange={(e) => setSettings({ ...settings, header_title_en: e.target.value })}
                    placeholder="LOL Middle East Community Portal"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {tAdmin("settings.header_subtitle")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.header_subtitle}
                    onChange={(e) => setSettings({ ...settings, header_subtitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hextech-blue uppercase tracking-wider mb-2 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {tAdmin("settings.header_subtitle_en")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.header_subtitle_en}
                    onChange={(e) => setSettings({ ...settings, header_subtitle_en: e.target.value })}
                    placeholder="Hub for League of Legends ME Server Chinese Community. Tools & Leaderboards."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {tAdmin("settings.alert_title")}
                  </label>
                  <input
                    type="text"
                    value={settings.alert_title}
                    onChange={(e) => setSettings({ ...settings, alert_title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hextech-blue uppercase tracking-wider mb-2 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {tAdmin("settings.alert_title_en")}
                  </label>
                  <input
                    type="text"
                    value={settings.alert_title_en}
                    onChange={(e) => setSettings({ ...settings, alert_title_en: e.target.value })}
                    placeholder="Community Action Guide"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {tAdmin("settings.alert_content")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.alert_content}
                    onChange={(e) => setSettings({ ...settings, alert_content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hextech-blue uppercase tracking-wider mb-2 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {tAdmin("settings.alert_content_en")}
                  </label>
                  <textarea
                    rows={3}
                    value={settings.alert_content_en}
                    onChange={(e) => setSettings({ ...settings, alert_content_en: e.target.value })}
                    placeholder="Please change your group nickname to: Riot ID#Tag - Rank - Main Position"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {tAdmin("settings.footer_copyright")}
                  </label>
                  <input
                    type="text"
                    value={settings.footer_copyright}
                    onChange={(e) => setSettings({ ...settings, footer_copyright: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-hextech-blue uppercase tracking-wider mb-2 flex items-center">
                    <Globe className="w-3.5 h-3.5 mr-1" />
                    {tAdmin("settings.footer_copyright_en")}
                  </label>
                  <input
                    type="text"
                    value={settings.footer_copyright_en}
                    onChange={(e) => setSettings({ ...settings, footer_copyright_en: e.target.value })}
                    placeholder="© 2026 LOL ME Chinese Community. GLHF."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950/60 dark:border-white/10 dark:text-white focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {tAdmin("settings.save_btn")}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SECTIONS MANAGEMENT */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{tAdmin("sections.list_title")}</h2>
              <button
                onClick={() => {
                  setEditingSection({ title: "", title_en: "", sort_order: sectionsList.length, full_width: false });
                  setSectionModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {tAdmin("sections.add_btn")}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sectionsList.map((sec) => (
                <div
                  key={sec.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900/60 dark:border-white/10 flex items-center justify-between shadow-sm transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-slate-900 dark:text-white text-base">
                        {locale === "en" ? sec.title_en || sec.title : sec.title}
                      </span>
                      {locale === "en" && sec.title && sec.title_en && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">({sec.title})</span>
                      )}
                      {locale !== "en" && sec.title_en && (
                        <span className="text-xs text-hextech-blue font-mono">({sec.title_en})</span>
                      )}
                      {sec.full_width && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/20 dark:border-amber-500/30">
                          {tAdmin("sections.full_width")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tAdmin("sections.sort_order")}: {sec.sort_order}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingSection(sec);
                        setSectionModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ITEMS MANAGEMENT */}
        {activeTab === "items" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{tAdmin("items.select_section")}</span>
                <select
                  value={selectedSectionId || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedSectionId(id);
                    fetchItems(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-white/10 dark:text-white text-sm focus:outline-none focus:border-hextech-blue shadow-sm"
                >
                  {sectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title} {sec.title_en ? `(${sec.title_en})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  if (!selectedSectionId) return;
                  setEditingItem({
                    section_id: selectedSectionId,
                    title: "",
                    title_en: "",
                    desc: "",
                    desc_en: "",
                    link: "",
                    icon: "ExternalLink",
                    color: "text-hextech-blue",
                    border_glow: "group-hover:border-hextech-blue/50",
                    shadow_glow: "group-hover:shadow-[0_0_30px_-5px_rgba(10,200,185,0.3)]",
                    featured: false,
                    sort_order: itemsList.length,
                  });
                  setItemModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {tAdmin("items.add_btn")}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itemsList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 dark:bg-slate-900/60 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 ${item.color} flex items-center justify-center shrink-0`}>
                          <DynamicIcon name={item.icon} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center space-x-2">
                            <span>{locale === "en" ? item.title_en || item.title : item.title}</span>
                            {locale === "en" && item.title && item.title_en && (
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">({item.title})</span>
                            )}
                            {locale !== "en" && item.title_en && (
                              <span className="text-xs text-hextech-blue font-normal">({item.title_en})</span>
                            )}
                          </h3>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            {tAdmin("items.icon_label")} <code className="text-hextech-blue">{item.icon}</code>
                          </span>
                        </div>
                      </div>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-hextech-blue/10 text-hextech-blue border border-hextech-blue/30">
                          {tAdmin("items.featured_tag")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      {locale === "en" ? item.desc_en || item.desc : item.desc}
                    </p>
                    {locale === "en" && item.desc && item.desc_en && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 italic mb-3">ZH: {item.desc}</p>
                    )}
                    {locale !== "en" && item.desc_en && (
                      <p className="text-xs text-hextech-blue/80 italic mb-3">EN: {item.desc_en}</p>
                    )}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-hextech-blue hover:underline inline-flex items-center break-all"
                    >
                      <ExternalLink className="w-3 h-3 mr-1 shrink-0" />
                      {item.link}
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{tAdmin("items.sort_order")}: {item.sort_order}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setItemModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* SECTION MODAL */}
      {sectionModalOpen && editingSection && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/10 rounded-2xl p-6 w-full max-w-md space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingSection.id ? tAdmin("sections.modal_edit") : tAdmin("sections.modal_add")}
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("sections.title_zh")}</label>
                <input
                  type="text"
                  required
                  value={editingSection.title || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-hextech-blue mb-1 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  {tAdmin("sections.title_en")}
                </label>
                <input
                  type="text"
                  value={editingSection.title_en || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, title_en: e.target.value })}
                  placeholder="e.g. Beginner & Game Client"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("sections.sort_hint")}</label>
                <input
                  type="number"
                  value={editingSection.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, sort_order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="full_width"
                  checked={!!editingSection.full_width}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, full_width: e.target.checked })
                  }
                  className="rounded border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-hextech-blue focus:ring-0"
                />
                <label htmlFor="full_width" className="text-sm text-slate-700 dark:text-slate-300">
                  {tAdmin("sections.full_width")}
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {tAdmin("sections.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-hextech-blue text-slate-950 text-xs font-bold"
                >
                  {tAdmin("sections.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ITEM MODAL */}
      {itemModalOpen && editingItem && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem.id ? tAdmin("items.modal_edit") : tAdmin("items.modal_add")}
            </h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("items.section_belong")}</label>
                <select
                  value={editingItem.section_id || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, section_id: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                >
                  {sectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title} {sec.title_en ? `(${sec.title_en})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("items.title_zh")}</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-hextech-blue mb-1 flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    {tAdmin("items.title_en")}
                  </label>
                  <input
                    type="text"
                    value={editingItem.title_en || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, title_en: e.target.value })}
                    placeholder="e.g. ME Client Download"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("items.desc_zh")}</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.desc || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-hextech-blue mb-1 flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  {tAdmin("items.desc_en")}
                </label>
                <textarea
                  rows={2}
                  value={editingItem.desc_en || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, desc_en: e.target.value })}
                  placeholder="e.g. Unified Riot launcher for ME server."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("items.link_url")}</label>
                <input
                  type="url"
                  required
                  value={editingItem.link || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              {/* Icon Selector Section */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {tAdmin("items.icon_section_title")}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIconSearchQuery("");
                      setIconPickerOpen(true);
                    }}
                    className="flex items-center space-x-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-hextech-blue/50 transition-all group cursor-pointer"
                  >
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 group-hover:text-hextech-blue">{tAdmin("items.open_picker")}</span>
                    <div className={editingItem.color || "text-hextech-blue"}>
                      <DynamicIcon name={editingItem.icon || "ExternalLink"} className="w-5 h-5" />
                    </div>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] text-slate-600 dark:text-slate-400">{tAdmin("items.icon_label")}</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIconSearchQuery("");
                        setIconPickerOpen(true);
                      }}
                      className="text-[10px] text-hextech-blue hover:underline inline-flex items-center cursor-pointer"
                    >
                      <Grid className="w-3 h-3 mr-0.5" />
                      {tAdmin("items.open_full_picker")}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editingItem.icon !== undefined ? editingItem.icon : "ExternalLink"}
                    onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                    placeholder={tAdmin("items.icon_name_placeholder")}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-white/10 dark:text-white text-sm"
                  />
                </div>

                {/* Quick Icon Selector Buttons */}
                <div>
                  <span className="block text-[11px] text-slate-600 dark:text-slate-400 mb-2">{tAdmin("items.popular_icons_label")}</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                    {POPULAR_ICONS.slice(0, 14).map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, icon: iconName })}
                        className={`px-2 py-1 rounded-lg text-xs flex items-center space-x-1 border transition-all cursor-pointer ${
                          editingItem.icon?.toLowerCase() === iconName.toLowerCase()
                            ? "bg-hextech-blue/20 border-hextech-blue text-hextech-blue font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 dark:bg-slate-900/80 dark:border-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20"
                        }`}
                      >
                        <DynamicIcon name={iconName} className="w-3.5 h-3.5" />
                        <span>{iconName}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIconSearchQuery("");
                        setIconPickerOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg text-xs flex items-center space-x-1 border bg-hextech-blue/10 border-hextech-blue/40 text-hextech-blue hover:bg-hextech-blue/20 transition-all font-semibold cursor-pointer"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>{tAdmin("items.more_icons")}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Selector Section (WYSIWYG Palette) */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-950/60 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                    <Palette className="w-4 h-4 text-hextech-blue mr-1.5" />
                    {tAdmin("items.color_section_title")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">{tAdmin("items.live_icon")}</span>
                    <div className={editingItem.color || "text-hextech-blue"}>
                      <DynamicIcon name={editingItem.icon || "ExternalLink"} className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1">
                  {COLOR_PRESETS.map((c) => {
                    const isSelected = editingItem.color === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, color: c.value })}
                        className={`p-2 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white border-hextech-blue ring-1 ring-hextech-blue text-slate-900 font-bold dark:bg-slate-900 dark:text-white"
                            : "bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-slate-900/60 dark:border-white/5 dark:text-slate-400 dark:hover:text-white"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow"
                          style={{ backgroundColor: c.bg }}
                        />
                        <span className="text-xs truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">{tAdmin("items.custom_color_label")}</label>
                  <input
                    type="text"
                    value={editingItem.color || "text-hextech-blue"}
                    onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })}
                    placeholder="如 text-hextech-blue / text-[#ff0055]"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 dark:bg-slate-900 dark:border-white/10 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{tAdmin("sections.sort_hint")}</label>
                <input
                  type="number"
                  value={editingItem.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, sort_order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 dark:bg-slate-950 dark:border-white/10 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="item_featured"
                  checked={!!editingItem.featured}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, featured: e.target.checked })
                  }
                  className="rounded border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-hextech-blue focus:ring-0"
                />
                <label htmlFor="item_featured" className="text-sm text-slate-700 dark:text-slate-300">
                  {tAdmin("items.featured_check")}
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer"
                >
                  {tAdmin("sections.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-hextech-blue text-slate-950 text-xs font-bold cursor-pointer"
                >
                  {tAdmin("sections.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ICON PICKER MODAL */}
      {iconPickerOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
          <div className="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-white/10 rounded-2xl p-6 w-full max-w-3xl space-y-6 max-h-[85vh] flex flex-col shadow-2xl transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <Grid className="w-5 h-5 text-hextech-blue" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{tAdmin("icon_picker.title")}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">({filteredIcons.length} {tAdmin("icon_picker.count")})</span>
              </div>
              <button
                onClick={() => setIconPickerOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={iconSearchQuery}
                onChange={(e) => setIconSearchQuery(e.target.value)}
                placeholder={tAdmin("icon_picker.search_placeholder")}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-white/10 dark:text-white dark:placeholder-slate-500 focus:outline-none focus:border-hextech-blue text-sm shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 p-1">
              {filteredIcons.map((iconName) => {
                const isSelected = editingItem?.icon?.toLowerCase() === iconName.toLowerCase();
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      if (editingItem) {
                        setEditingItem({ ...editingItem, icon: iconName });
                      }
                      setIconPickerOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-hextech-blue/20 border-hextech-blue text-hextech-blue font-bold shadow-md scale-105"
                        : "bg-white border-slate-200 hover:border-hextech-blue/50 hover:bg-slate-50 text-slate-700 hover:text-slate-900 dark:bg-slate-950/60 dark:border-white/5 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    <DynamicIcon name={iconName} className="w-6 h-6 shrink-0" />
                    <span className="text-[11px] truncate w-full text-center font-mono">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-200 dark:border-white/10 pt-4 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
              <span>{tAdmin("icon_picker.tip")}</span>
              <button
                type="button"
                onClick={() => setIconPickerOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-medium cursor-pointer"
              >
                {tAdmin("icon_picker.close")}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
