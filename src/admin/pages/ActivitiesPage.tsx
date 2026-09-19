import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, Loader2, Layers } from "lucide-react";
import { Modal } from "../components/Modal.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { useToast } from "../context/ToastContext.tsx";

interface Activity {
  id: string;
  numberId?: string | null;
  title: string;
  description?: string | null;
  photoUrl?: string | null;
  date?: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    numberId: "",
    title: "",
    description: "",
    displayOrder: 0,
    isPublished: true,
  });

  const { success, error } = useToast();

  const loadActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/activities", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setActivities(data.data || []);
      }
    } catch {
      error("Failed to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const openAddModal = () => {
    setEditingActivity(null);
    const nextNum = String(activities.length + 1).padStart(2, "0");
    setFormData({
      numberId: nextNum,
      title: "",
      description: "",
      displayOrder: activities.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (act: Activity) => {
    setEditingActivity(act);
    setFormData({
      numberId: act.numberId || "",
      title: act.title,
      description: act.description || "",
      displayOrder: act.displayOrder,
      isPublished: act.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      error("Title is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingActivity
        ? `/api/admin/activities/${editingActivity.id}`
        : "/api/admin/activities";
      const method = editingActivity ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(editingActivity ? "Activity updated!" : "Activity added!");
        setIsModalOpen(false);
        loadActivities();
      } else {
        error(data.message || "Failed to save activity.");
      }
    } catch {
      error("Network error saving activity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/activities/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        success("Activity removed.");
        setDeleteId(null);
        loadActivities();
      }
    } catch {
      error("Failed to delete activity.");
    }
  };

  const togglePublish = async (act: Activity) => {
    try {
      const res = await fetch(`/api/admin/activities/${act.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isPublished: !act.isPublished }),
      });
      if (res.ok) {
        success(`Activity ${!act.isPublished ? "published" : "hidden"}.`);
        loadActivities();
      }
    } catch {
      error("Failed to update status.");
    }
  };

  const filtered = activities.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.numberId && a.numberId.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Activities Archive</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Manage technical sessions, industrial visits, workshops, and hackathons
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> ADD ACTIVITY
        </button>
      </div>

      <div className="flex items-center gap-4 bg-[#030905] p-3 rounded-xl border border-[#00ff66]/20">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search activities by title or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none"
          />
        </div>
        <span className="font-mono text-xs text-[#88aa90]">
          {filtered.length} {filtered.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="bg-[#030905] rounded-xl border border-[#00ff66]/20 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading activities...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[#88aa90]">No activities recorded yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 text-xs font-mono text-[#00ff66] hover:underline"
            >
              Add activity &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#040e06] border-b border-[#00ff66]/20 text-[#00ff66] uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-16">Code</th>
                  <th className="p-4">Activity Title</th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff66]/10">
                {filtered.map((act) => (
                  <tr key={act.id} className="hover:bg-[#051408]/60 transition-colors">
                    <td className="p-4 text-[#00ff66] font-bold">
                      {act.numberId || "--"}
                    </td>
                    <td className="p-4 font-bold text-white text-sm">
                      {act.title}
                    </td>
                    <td className="p-4 text-center text-[#88aa90]">{act.displayOrder}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => togglePublish(act)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-colors ${
                          act.isPublished
                            ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {act.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {act.isPublished ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(act)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(act.id)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingActivity ? "Edit Activity" : "Add Activity"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Index / Code
              </label>
              <input
                type="text"
                value={formData.numberId}
                onChange={(e) => setFormData({ ...formData, numberId: e.target.value })}
                placeholder="01"
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Applied Machine Learning"
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
              Brief Description / Details (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resource person, syllabus covered, or lab details..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="actActive"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4 rounded bg-black border-[#00ff66]/30 text-[#00ff66]"
            />
            <label htmlFor="actActive" className="font-mono text-xs text-white">
              Display on public archive grid
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#00ff66]/20">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg font-mono text-xs text-[#88aa90] hover:text-white border border-[#00ff66]/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#00ff66] hover:bg-[#00e65b] text-black font-mono font-bold text-xs tracking-wider px-5 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Activity"
        message="Are you sure you want to remove this activity from the archive?"
      />
    </div>
  );
};