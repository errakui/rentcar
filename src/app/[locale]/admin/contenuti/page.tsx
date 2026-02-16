"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Loader2, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AdminContentPage() {
  const t = useTranslations("admin");
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", content: "", active: true });

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      });
  }, []);

  const resetForm = () => {
    setForm({ title: "", slug: "", content: "", active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, id: editingId } : form;

    const res = await fetch("/api/admin/content", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      if (editingId) {
        setPages((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      } else {
        setPages((prev) => [...prev, data]);
      }
      resetForm();
    }
    setSaving(false);
  };

  const handleEdit = (page: any) => {
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      active: page.active,
    });
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("deletePage"))) return;
    const res = await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-2">{t("contentTitle")}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {t("contentSubtitle")}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> {t("newPage")}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="card p-6 mb-8 animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-field">{t("pageTitle")} *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: editingId ? form.slug : slugify(title),
                  });
                }}
                className="input-field"
                required
                placeholder={t("pageTitlePlaceholder")}
              />
            </div>
            <div>
              <label className="label-field">{t("pageSlug")} *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="input-field"
                required
                placeholder={t("pageTitlePlaceholder")}
              />
            </div>
          </div>
          <div>
            <label className="label-field">{t("pageContent")}</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="input-field min-h-[300px] font-mono text-sm"
              placeholder={t("pageContentPlaceholder")}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="accent-white"
            />
            <span className="text-sm text-gray-400">{t("pageActive")}</span>
          </label>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? t("updatePage") : t("createPage")}
            </button>
            <button type="button" onClick={resetForm} className="btn-ghost text-sm">
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {pages.length === 0 && !showForm ? (
        <div className="card p-12 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 text-gray-600" />
          <p className="text-gray-500">{t("noPages")}</p>
          <p className="text-xs text-gray-600 mt-1">
            {t("noPagesHint")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <h3 className="text-sm font-medium">{page.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">/{page.slug}</p>
                </div>
                {page.active ? (
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <Eye className="w-3 h-3" /> {t("visible")}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <EyeOff className="w-3 h-3" /> {t("hidden")}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(page)}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                >
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDelete(page.id)}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
