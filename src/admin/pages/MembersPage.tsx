import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Check, X, ArrowUpDown, Eye, EyeOff, Loader2 } from "lucide-react";
import { Modal } from "../components/Modal.tsx";
import { ConfirmDialog } from "../components/ConfirmDialog.tsx";
import { ImageUploader } from "../components/ImageUploader.tsx";
import { useToast } from "../context/ToastContext.tsx";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio?: string | null;
  photoUrl: string;
  modalPhotoUrl?: string | null;
  instagram?: string | null;
  github?: string | null;
  linkedin?: string | null;
  otherUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
}

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "Computer Science & Engineering",
    bio: "",
    photoUrl: "",
    modalPhotoUrl: "",
    instagram: "",
    github: "",
    linkedin: "",
    otherUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const { success, error } = useToast();

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/members", { credentials: "include" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMembers(data.data || []);
      } else {
        error("Failed to load members.");
      }
    } catch {
      error("Network error while loading members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      department: "Computer Science & Engineering",
      bio: "",
      photoUrl: "",
      modalPhotoUrl: "",
      instagram: "https://instagram.com",
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      otherUrl: "",
      displayOrder: members.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      bio: member.bio || "",
      photoUrl: member.photoUrl,
      modalPhotoUrl: member.modalPhotoUrl || "",
      instagram: member.instagram || "",
      github: member.github || "",
      linkedin: member.linkedin || "",
      otherUrl: member.otherUrl || "",
      displayOrder: member.displayOrder,
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.photoUrl) {
      error("Name, designation, and photo are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingMember
        ? `/api/admin/members/${editingMember.id}`
        : "/api/admin/members";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        success(editingMember ? "Member updated successfully!" : "Member added successfully!");
        setIsModalOpen(false);
        loadMembers();
      } else {
        error(data.message || "Failed to save member.");
      }
    } catch {
      error("Network error saving member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/members/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        success("Member deleted.");
        setDeleteId(null);
        loadMembers();
      } else {
        error(data.message || "Failed to delete member.");
      }
    } catch {
      error("Network error deleting member.");
    }
  };

  const toggleStatus = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !member.isActive }),
      });
      if (res.ok) {
        success(`Member ${!member.isActive ? "published" : "unpublished"}.`);
        loadMembers();
      }
    } catch {
      error("Failed to update member status.");
    }
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-mono text-white">Team Members &amp; Leadership</h2>
          <p className="font-mono text-xs text-[#88aa90]">
            Manage leadership roster, designations, biographies, and photos
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-wider px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> ADD TEAM MEMBER
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-4 bg-[#030905] p-3 rounded-xl border border-[#00ff66]/20">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, designation, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none"
          />
        </div>
        <span className="font-mono text-xs text-[#88aa90] whitespace-nowrap">
          {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
        </span>
      </div>

      {/* Members Table */}
      <div className="bg-[#030905] rounded-xl border border-[#00ff66]/20 overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#00ff66] animate-spin" />
            <p className="font-mono text-xs text-[#88aa90]">Loading roster from database...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-sm text-[#88aa90]">No team members found.</p>
            <button
              onClick={openAddModal}
              className="mt-3 text-xs font-mono text-[#00ff66] hover:underline"
            >
              Add the first member &rarr;
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#040e06] border-b border-[#00ff66]/20 text-[#00ff66] uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-12">#</th>
                  <th className="p-4">Member</th>
                  <th className="p-4">Designation</th>
                  <th className="p-4">Socials</th>
                  <th className="p-4 text-center">Order</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#00ff66]/10">
                {filteredMembers.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-[#051408]/60 transition-colors">
                    <td className="p-4 text-[#88aa90]">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.photoUrl}
                          alt={m.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#00ff66]/30 bg-black"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/logo.png";
                          }}
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{m.name}</p>
                          <p className="text-[11px] text-[#88aa90]">{m.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-semibold tracking-wider">
                        {m.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[#88aa90]">
                        {m.github && (
                          <a
                            href={m.github}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            GH
                          </a>
                        )}
                        {m.linkedin && (
                          <a
                            href={m.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            LI
                          </a>
                        )}
                        {m.instagram && (
                          <a
                            href={m.instagram}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#00ff66]"
                          >
                            IG
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center text-[#88aa90] font-bold">{m.displayOrder}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleStatus(m)}
                        title={m.isActive ? "Click to unpublish" : "Click to publish"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-wider transition-colors ${
                          m.isActive
                            ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {m.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {m.isActive ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(m)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
                          title="Edit member"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(m.id)}
                          className="p-1.5 rounded-lg text-[#88aa90] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete member"
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

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Elston Herold Pereira"
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Designation / Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. PRESIDENT, TREASURER, LEAD"
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
                Display Order
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

          {/* Photos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader
              label="Primary Photograph *"
              value={formData.photoUrl}
              onChange={(url) => setFormData({ ...formData, photoUrl: url })}
            />
            <ImageUploader
              label="Modal Spotlight Photograph (Optional)"
              value={formData.modalPhotoUrl}
              onChange={(url) => setFormData({ ...formData, modalPhotoUrl: url })}
            />
          </div>

          <div>
            <label className="block font-mono text-xs text-[#00ff66] uppercase mb-1">
              Short Biography (Optional)
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief description of contributions or vision..."
              className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="border-t border-[#00ff66]/15 pt-3">
            <h4 className="font-mono text-xs text-[#00ff66] uppercase mb-3">Social Profiles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#88aa90] mb-1">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#020603] border border-[#00ff66]/20 focus:border-[#00ff66] rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="memberActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded bg-black border-[#00ff66]/30 text-[#00ff66] focus:ring-0"
            />
            <label htmlFor="memberActive" className="font-mono text-xs text-white select-none">
              Publish on public website
            </label>
          </div>

          {/* Buttons */}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : (
                "Save Member"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Team Member"
        message="Are you sure you want to remove this team member? They will no longer appear on the leadership roster."
        confirmLabel="Confirm Delete"
      />
    </div>
  );
};