import React, { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { useToast } from "../context/ToastContext.tsx";
import { ImageUploader } from "../components/ImageUploader.tsx";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  section: string;
  label: string;
  type: string;
}

export const ContentPage: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [contentValues, setContentValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<string>("brand");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { success, error } = useToast();

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/content", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems(data.data || []);
        setContentValues(data.map || {});
      }
    } catch {
      error("Failed to load website content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleChange = (key: string, val: string) => {
    setContentValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = Object.keys(contentValues).map((key) => ({
        key,
        value: contentValues[key],
      }));

      const res = await fetch("/api/admin/content/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: payload }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success("Website content saved and published!");
      } else {
        error(data.message || "Failed to update content.");
      }
    } catch {
      error("Network error while saving content.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "brand", label: "Logo & Branding" },
    { id: "hero", label: "Hero Section" },
    { id: "about", label: "About Section" },
    { id: "activities", label: "Activities Copy" },
    { id: "join", label: "Join Section" },
    { id: "footer", label: "Footer & Socials" },
  ];

  const currentSectionItems = items.filter((item) => item.section === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Website Content Editor</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Update public headings, narrative text, logo branding, and links directly
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> PUBLISHING...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> SAVE CHANGES
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#00ff66]/20 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-mono text-xs tracking-wider rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#040e06] text-[#00ff66] border-t-2 border-[#00ff66] font-bold"
                : "text-[#88aa90] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form Fields */}
      <div className="bg-[#030905] rounded-xl border border-[#00ff66]/20 p-6">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading content entries...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            {currentSectionItems.map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span className="text-[#00ff66]">&gt;</span> {item.label}
                  </label>
                  <span className="text-[10px] font-mono text-[#88aa90]">{item.key}</span>
                </div>

                {item.type === "image" ? (
                  <div className="p-4 rounded-xl bg-[#020703] border border-[#00ff66]/20 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg bg-[#040e06] border border-[#00ff66]/30 flex items-center justify-center p-2 flex-shrink-0">
                        <img
                          src={contentValues[item.key] ?? item.value}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/logo.png";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-white">Current Logo Preview</p>
                        <p className="font-mono text-[11px] text-[#88aa90]">
                          Displayed in the floating navbar on every page.
                        </p>
                      </div>
                    </div>
                    <ImageUploader
                      value={contentValues[item.key] ?? item.value}
                      onChange={(url) => handleChange(item.key, url)}
                      label="Upload New Logo or Enter URL"
                    />
                  </div>
                ) : item.type === "textarea" ? (
                  <textarea
                    rows={4}
                    value={contentValues[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg p-3 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                  />
                ) : (
                  <input
                    type={item.type === "url" ? "url" : "text"}
                    value={contentValues[item.key] ?? item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full bg-[#020603] border border-[#00ff66]/25 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                  />
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-[#00ff66]/15 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#88aa90]">
                Changes are immediately reflected on the live website.
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#00ff66] hover:bg-[#00e65b] text-black font-mono font-bold text-xs tracking-wider px-5 py-2.5 rounded-lg flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};