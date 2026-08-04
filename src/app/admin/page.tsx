'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
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
} from "lucide-react";

interface SectionData {
  id: number;
  title: string;
  full_width: boolean;
  sort_order: number;
  items?: ItemData[];
}

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

const COMMON_ICONS = [
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
];

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent =
    ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[name] || Icons.ExternalLink;
  return <IconComponent className={className} />;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"settings" | "sections" | "items">("settings");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    header_title: "",
    header_subtitle: "",
    alert_title: "",
    alert_content: "",
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Auth check
      const authRes = await fetch("/api/auth/me");
      if (!authRes.ok) {
        router.push("/admin/login");
        return;
      }

      // Fetch Settings
      const settingsRes = await fetch("/api/admin/settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings({
          header_title: data.header_title || "",
          header_subtitle: data.header_subtitle || "",
          alert_title: data.alert_title || "",
          alert_content: data.alert_content || "",
        });
      }

      // Fetch Sections
      const sectionsRes = await fetch("/api/admin/sections");
      if (sectionsRes.ok) {
        const secData: SectionData[] = await sectionsRes.json();
        setSectionsList(secData);
        if (secData.length > 0 && !selectedSectionId) {
          setSelectedSectionId(secData[0].id);
          fetchItems(secData[0].id);
        }
      }
    } catch {
      showMessage("error", "加载数据失败，请检查数据库配置");
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async (secId: number) => {
    try {
      const itemsRes = await fetch(`/api/admin/items?sectionId=${secId}`);
      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItemsList(data);
      }
    } catch {
      showMessage("error", "获取导航卡片失败");
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // ─── Settings Handlers ───────────────────────────────────────────────────────
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showMessage("success", "全站配置保存成功！");
      } else {
        throw new Error("保存失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "保存设置失败");
    }
  };

  // ─── Section Handlers ────────────────────────────────────────────────────────
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
        showMessage("success", isEdit ? "板块更新成功" : "板块新建成功");
        setSectionModalOpen(false);
        setEditingSection(null);
        fetchData();
      } else {
        throw new Error("操作失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "保存板块失败");
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm("确定要删除该板块及其下所有卡片吗？")) return;
    try {
      const res = await fetch(`/api/admin/sections?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("success", "板块删除成功");
        fetchData();
      } else {
        throw new Error("删除失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "删除失败");
    }
  };

  // ─── Item Handlers ───────────────────────────────────────────────────────────
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem.section_id) return;

    try {
      const isEdit = !!editingItem.id;
      const res = await fetch("/api/admin/items", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        showMessage("success", isEdit ? "卡片更新成功" : "卡片新建成功");
        setItemModalOpen(false);
        if (selectedSectionId) fetchItems(selectedSectionId);
      } else {
        throw new Error("操作失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "保存卡片失败");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("确定要删除该卡片吗？")) return;
    try {
      const res = await fetch(`/api/admin/items?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showMessage("success", "卡片已删除");
        if (selectedSectionId) fetchItems(selectedSectionId);
      } else {
        throw new Error("删除失败");
      }
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "删除失败");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-hextech-blue mr-3" />
        <span>管理后台加载中...</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-hextech-blue/10 border border-hextech-blue/30 text-hextech-blue">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">LOL 中东服门户 · 后台管理</h1>
              <p className="text-xs text-slate-400">实时配置前端页面显示内容与数据库选项</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors inline-flex items-center"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              预览前台
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-xs font-medium text-red-400 transition-colors inline-flex items-center"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              退出登录
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
        <div className="flex border-b border-white/10 gap-2">
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x ${
              activeTab === "settings"
                ? "bg-slate-900 border-white/10 text-hextech-blue"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            全站设置
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x ${
              activeTab === "sections"
                ? "bg-slate-900 border-white/10 text-hextech-blue"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FolderKanban className="w-4 h-4 mr-2" />
            板块分类管理 ({sectionsList.length})
          </button>
          <button
            onClick={() => setActiveTab("items")}
            className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all inline-flex items-center border-t border-x ${
              activeTab === "items"
                ? "bg-slate-900 border-white/10 text-hextech-blue"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            导航卡片管理
          </button>
        </div>

        {/* TAB 1: SITE SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-hextech-blue mr-2" />
              前台 Header 与公告指引设置
            </h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  主标题 (Header Title)
                </label>
                <input
                  type="text"
                  value={settings.header_title}
                  onChange={(e) => setSettings({ ...settings, header_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-hextech-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  副标题 (Header Subtitle)
                </label>
                <input
                  type="text"
                  value={settings.header_subtitle}
                  onChange={(e) => setSettings({ ...settings, header_subtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-hextech-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  提示框标题 (Alert Title)
                </label>
                <input
                  type="text"
                  value={settings.alert_title}
                  onChange={(e) => setSettings({ ...settings, alert_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-hextech-blue text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  提示框内容 (Alert Content)
                </label>
                <textarea
                  rows={3}
                  value={settings.alert_content}
                  onChange={(e) => setSettings({ ...settings, alert_content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/10 text-white focus:outline-none focus:border-hextech-blue text-sm"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                保存全站设置
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SECTIONS MANAGEMENT */}
        {activeTab === "sections" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-white">导航板块列表</h2>
              <button
                onClick={() => {
                  setEditingSection({ title: "", sort_order: sectionsList.length, full_width: false });
                  setSectionModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                新增板块
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {sectionsList.map((sec) => (
                <div
                  key={sec.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-white text-base">{sec.title}</span>
                      {sec.full_width && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          全宽展示
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">排序权重: {sec.sort_order}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingSection(sec);
                        setSectionModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
                <span className="text-sm text-slate-400">选择分类板块：</span>
                <select
                  value={selectedSectionId || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedSectionId(id);
                    fetchItems(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-hextech-blue"
                >
                  {sectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
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
                    desc: "",
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
                className="px-4 py-2.5 rounded-xl bg-hextech-blue text-slate-950 font-bold text-sm hover:bg-hextech-blue/90 transition-all inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                新增卡片
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itemsList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${item.color} flex items-center justify-center shrink-0`}>
                          <DynamicIcon name={item.icon} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{item.title}</h3>
                          <span className="text-[11px] text-slate-400 font-mono">
                            图标: <code className="text-hextech-blue">{item.icon}</code>
                          </span>
                        </div>
                      </div>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-hextech-blue/20 text-hextech-blue border border-hextech-blue/30">
                          高亮推荐
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{item.desc}</p>
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

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-500">
                    <span>排序权重: {item.sort_order}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setItemModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-6">
            <h3 className="text-lg font-bold text-white">
              {editingSection.id ? "编辑板块分类" : "新增板块分类"}
            </h3>
            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">板块标题</label>
                <input
                  type="text"
                  required
                  value={editingSection.title || ""}
                  onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">排序权重 (数字越小越靠前)</label>
                <input
                  type="number"
                  value={editingSection.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, sort_order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
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
                  className="rounded border-white/10 bg-slate-950 text-hextech-blue focus:ring-0"
                />
                <label htmlFor="full_width" className="text-sm text-slate-300">
                  全宽网格展示
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-hextech-blue text-slate-950 text-xs font-bold"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ITEM MODAL */}
      {itemModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white">
              {editingItem.id ? "编辑导航卡片" : "新增导航卡片"}
            </h3>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">所属板块</label>
                <select
                  value={editingItem.section_id || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, section_id: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                >
                  {sectionsList.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">卡片标题</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">描述文本</label>
                <textarea
                  rows={2}
                  required
                  value={editingItem.desc || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">跳转链接 URL</label>
                <input
                  type="url"
                  required
                  value={editingItem.link || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                />
              </div>

              {/* Icon & Color Selector with Live Preview */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Lucide 图标设置与实时预览
                  </label>
                  {/* Live SVG Preview Badge */}
                  <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[11px] text-slate-400">预览:</span>
                    <div className={editingItem.color || "text-hextech-blue"}>
                      <DynamicIcon name={editingItem.icon || "ExternalLink"} className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">图标名称 (Icon Name)</label>
                    <input
                      type="text"
                      value={editingItem.icon || "ExternalLink"}
                      onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                      placeholder="Download / Trophy ..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">图标颜色 Class</label>
                    <input
                      type="text"
                      value={editingItem.color || "text-hextech-blue"}
                      onChange={(e) => setEditingItem({ ...editingItem, color: e.target.value })}
                      placeholder="text-hextech-blue / text-lol-gold"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Quick Icon Selector Buttons */}
                <div>
                  <span className="block text-[11px] text-slate-400 mb-2">常用图标一键选择：</span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {COMMON_ICONS.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setEditingItem({ ...editingItem, icon: iconName })}
                        className={`px-2 py-1 rounded-lg text-xs flex items-center space-x-1 border transition-all ${
                          editingItem.icon === iconName
                            ? "bg-hextech-blue/20 border-hextech-blue text-hextech-blue font-bold"
                            : "bg-slate-900/80 border-white/5 text-slate-400 hover:text-white hover:border-white/20"
                        }`}
                      >
                        <DynamicIcon name={iconName} className="w-3.5 h-3.5" />
                        <span>{iconName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">排序权重 (数字越小越靠前)</label>
                <input
                  type="number"
                  value={editingItem.sort_order ?? 0}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, sort_order: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
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
                  className="rounded border-white/10 bg-slate-950 text-hextech-blue focus:ring-0"
                />
                <label htmlFor="item_featured" className="text-sm text-slate-300">
                  高亮推荐背景 (Featured)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-hextech-blue text-slate-950 text-xs font-bold"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
