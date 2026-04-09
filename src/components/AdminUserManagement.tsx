import { useState, useEffect } from "react";
import {
  Users, Plus, Shield, Save, Loader2, RefreshCw,
  Eye, Pencil, Ban, Search, Trash2, UserPlus, UserMinus,
  Mail, Clock, ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  PERMISSION_KEYS, PERMISSION_LABELS, PERMISSION_GROUPS,
  PRESETS, type PermissionKey, type AccessLevel,
} from "@/hooks/usePermissions";

interface AdminUser {
  user_id: string;
  email: string;
  role: string;
  role_created_at: string;
  user_created_at: string;
  permissions: Record<string, string>;
}

const ACCESS_ICONS: Record<AccessLevel, { icon: typeof Eye; label: string; color: string }> = {
  edit: { icon: Pencil, label: "แก้ไขได้", color: "text-green-600 bg-green-500/15 border-green-500/30 font-bold" },
  view: { icon: Eye, label: "ดูได้", color: "text-blue-600 bg-blue-500/15 border-blue-500/30 font-bold" },
  none: { icon: Ban, label: "ไม่มีสิทธิ์", color: "text-muted-foreground bg-muted border-border font-medium" },
};

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-background text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";

const roleColors: Record<string, string> = {
  super_admin: "bg-primary/15 text-primary border-primary/30",
  admin: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  moderator: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
};

const AdminUserManagement = () => {
  const { user, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editPerms, setEditPerms] = useState<Record<PermissionKey, AccessLevel>>({} as any);
  const [saving, setSaving] = useState(false);

  // Add user
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<"admin" | "moderator">("admin");
  const [addPreset, setAddPreset] = useState("sales_staff");
  const [adding, setAdding] = useState(false);
  const [searchResult, setSearchResult] = useState<{ user_id: string; email: string } | null>(null);
  const [searching, setSearching] = useState(false);

  // ── Fetch admin users with emails via RPC ──
  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const { data: users, error } = await supabase.rpc("get_admin_users");
      if (error) throw error;
      if (!users) { setAdminUsers([]); return; }

      // Fetch permissions
      const userIds = users.map((u: any) => u.user_id);
      const { data: perms } = await (supabase.from as any)("admin_permissions")
        .select("user_id, permission_key, access_level")
        .in("user_id", userIds);

      const result: AdminUser[] = users.map((u: any) => {
        const userPerms: Record<string, string> = {};
        if (perms) {
          perms.filter((p: any) => p.user_id === u.user_id).forEach((p: any) => {
            userPerms[p.permission_key] = p.access_level;
          });
        }
        return {
          user_id: u.user_id,
          email: u.email || `User ${u.user_id.slice(0, 8)}...`,
          role: u.role,
          role_created_at: u.role_created_at,
          user_created_at: u.user_created_at,
          permissions: userPerms,
        };
      });

      setAdminUsers(result);
    } catch (err: any) {
      console.error("Failed to fetch admin users:", err);
      toast({ title: "โหลดข้อมูลไม่สำเร็จ", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminUsers(); }, []);

  // ── Search user by email ──
  const handleSearchEmail = async () => {
    if (!addEmail || !addEmail.includes("@")) {
      toast({ title: "กรุณากรอกอีเมลให้ถูกต้อง", variant: "destructive" });
      return;
    }
    setSearching(true);
    setSearchResult(null);
    try {
      const { data, error } = await supabase.rpc("lookup_user_by_email", { _email: addEmail.trim().toLowerCase() });
      if (error) throw error;
      if (data && data.length > 0) {
        const found = data[0];
        // Check if already admin
        const alreadyAdmin = adminUsers.some((u) => u.user_id === found.user_id);
        if (alreadyAdmin) {
          toast({ title: "ผู้ใช้นี้เป็น Admin อยู่แล้ว" });
          setSearchResult(null);
        } else {
          setSearchResult({ user_id: found.user_id, email: found.email });
          toast({ title: `พบผู้ใช้: ${found.email}` });
        }
      } else {
        toast({ title: "ไม่พบผู้ใช้ในระบบ", description: "ผู้ใช้ต้องสมัครสมาชิกก่อนจึงจะเพิ่มเป็น Admin ได้", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "ค้นหาไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
    setSearching(false);
  };

  // ── Add user as admin ──
  const handleAddUser = async () => {
    if (!searchResult) return;
    setAdding(true);
    try {
      // Insert role
      const { error: roleError } = await (supabase.from as any)("user_roles").insert({
        user_id: searchResult.user_id,
        role: addRole,
      });
      if (roleError) throw roleError;

      // Insert permissions from preset
      const preset = PRESETS[addPreset];
      if (preset) {
        const inserts = PERMISSION_KEYS.map((key) => ({
          user_id: searchResult.user_id,
          permission_key: key,
          access_level: preset.permissions[key],
        }));
        try {
          await (supabase.from as any)("admin_permissions").insert(inserts);
        } catch {}
      }

      toast({ title: `เพิ่ม ${searchResult.email} เป็น ${roleLabels[addRole]} สำเร็จ` });
      setShowAddForm(false);
      setAddEmail("");
      setSearchResult(null);
      fetchAdminUsers();
    } catch (err: any) {
      toast({ title: "เพิ่มไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
    setAdding(false);
  };

  // ── Remove user from admin ──
  const handleRemoveUser = async (u: AdminUser) => {
    if (u.role === "super_admin") {
      toast({ title: "ไม่สามารถลบ Super Admin ได้", variant: "destructive" });
      return;
    }
    if (!confirm(`ลบสิทธิ์ Admin ของ ${u.email}?\nผู้ใช้จะไม่สามารถเข้า Admin Dashboard ได้อีก`)) return;

    try {
      const { data, error } = await supabase.rpc("remove_admin_user", { _user_id: u.user_id });
      if (error) throw error;
      if (data === false) {
        toast({ title: "ไม่สามารถลบ Super Admin ได้", variant: "destructive" });
        return;
      }
      toast({ title: `ลบสิทธิ์ Admin ของ ${u.email} แล้ว` });
      if (selectedUser?.user_id === u.user_id) setSelectedUser(null);
      fetchAdminUsers();
    } catch (err: any) {
      toast({ title: "ลบไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
  };

  // ── Permission editing ──
  const selectUser = (u: AdminUser) => {
    setSelectedUser(u);
    const perms: Record<PermissionKey, AccessLevel> = {} as any;
    for (const key of PERMISSION_KEYS) {
      perms[key] = (u.permissions[key] as AccessLevel) || (u.role === "super_admin" ? "edit" : "none");
    }
    setEditPerms(perms);
  };

  const applyPreset = (presetId: string) => {
    const preset = PRESETS[presetId];
    if (preset) setEditPerms({ ...preset.permissions });
  };

  const togglePermission = (key: PermissionKey) => {
    setEditPerms((prev) => {
      const current = prev[key];
      const next: AccessLevel = current === "none" ? "view" : current === "view" ? "edit" : "none";
      return { ...prev, [key]: next };
    });
  };

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await (supabase.from as any)("admin_permissions")
        .delete()
        .eq("user_id", selectedUser.user_id);

      const inserts = PERMISSION_KEYS.map((key) => ({
        user_id: selectedUser.user_id,
        permission_key: key,
        access_level: editPerms[key] || "none",
      }));

      const { error } = await (supabase.from as any)("admin_permissions").insert(inserts);
      if (error) throw error;

      toast({ title: `บันทึกสิทธิ์ของ ${selectedUser.email} สำเร็จ` });
      fetchAdminUsers();
    } catch (err: any) {
      toast({ title: "บันทึกไม่สำเร็จ", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  // ── Render ──
  if (!isSuperAdmin) {
    return (
      <div className="card-surface rounded-xl p-14 text-center text-base text-muted-foreground font-medium">
        <Shield size={40} className="mx-auto mb-4 opacity-25" />
        <p>เฉพาะ Super Admin เท่านั้นที่จัดการผู้ใช้ได้</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2.5">
          <Users size={22} className="text-primary" /> จัดการผู้ใช้ Admin ({adminUsers.length} คน)
        </h3>
        <div className="flex gap-3">
          <button onClick={fetchAdminUsers} className="flex items-center gap-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> รีเฟรช
          </button>
          <button
            onClick={() => { setShowAddForm(!showAddForm); setSearchResult(null); setAddEmail(""); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UserPlus size={16} /> เพิ่ม Admin
          </button>
        </div>
      </div>

      {/* ═══ Add User Form ═══ */}
      {showAddForm && (
        <div className="card-surface rounded-xl p-6 space-y-5 animate-fade-in">
          <h4 className="text-lg font-extrabold text-foreground flex items-center gap-2.5">
            <UserPlus size={20} className="text-primary" /> เพิ่ม Admin ใหม่
          </h4>

          {/* Step 1: Search by email */}
          <div>
            <label className="block text-base font-bold text-foreground mb-2">ค้นหาผู้ใช้ด้วยอีเมล</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={addEmail}
                  onChange={(e) => { setAddEmail(e.target.value); setSearchResult(null); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchEmail()}
                  className={`${inputClass} pl-10`}
                  placeholder="พิมพ์อีเมลแล้วกดค้นหา เช่น staff@entgroup.co.th"
                />
              </div>
              <button
                onClick={handleSearchEmail}
                disabled={searching || !addEmail}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-secondary text-foreground text-base font-bold hover:bg-secondary/80 transition-colors disabled:opacity-50"
              >
                {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                ค้นหา
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">ผู้ใช้ต้องสมัครสมาชิกในเว็บไซต์ก่อน จึงจะเพิ่มเป็น Admin ได้</p>
          </div>

          {/* Step 2: Found user → set role + preset */}
          {searchResult && (
            <div className="border-2 border-primary/30 bg-primary/5 rounded-xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Mail size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-foreground">{searchResult.email}</p>
                  <p className="text-sm text-muted-foreground">User ID: {searchResult.user_id.slice(0, 12)}...</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-foreground mb-2">บทบาท</label>
                  <select value={addRole} onChange={(e) => setAddRole(e.target.value as any)} className={inputClass}>
                    <option value="admin">Admin — เข้า Dashboard ได้</option>
                    <option value="moderator">Moderator — สิทธิ์จำกัด</option>
                  </select>
                </div>
                <div>
                  <label className="block text-base font-bold text-foreground mb-2">ชุดสิทธิ์เริ่มต้น</label>
                  <select value={addPreset} onChange={(e) => setAddPreset(e.target.value)} className={inputClass}>
                    {Object.entries(PRESETS).filter(([id]) => id !== "super_admin").map(([id, preset]) => (
                      <option key={id} value={id}>{preset.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddUser}
                  disabled={adding}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-sm"
                >
                  {adding ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  เพิ่ม {searchResult.email} เป็น {roleLabels[addRole]}
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setSearchResult(null); setAddEmail(""); }}
                  className="px-5 py-3 rounded-lg border border-border text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ User List + Permission Editor ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: User list */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : adminUsers.length === 0 ? (
            <div className="card-surface rounded-xl p-12 text-center text-base text-muted-foreground">ไม่มี Admin ในระบบ</div>
          ) : (
            adminUsers.map((u) => {
              const isSelected = selectedUser?.user_id === u.user_id;
              const editCount = Object.values(u.permissions).filter((v) => v === "edit").length;
              const viewCount = Object.values(u.permissions).filter((v) => v === "view").length;
              const isSelf = u.user_id === user?.id;

              return (
                <div
                  key={u.user_id}
                  className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <button onClick={() => selectUser(u)} className="flex-1 text-left">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-base font-extrabold text-foreground">{u.email}</span>
                        {isSelf && <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-bold">คุณ</span>}
                      </div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className={`text-sm px-3 py-1 rounded-full border font-bold ${roleColors[u.role] || roleColors.admin}`}>
                          {roleLabels[u.role] || u.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5"><Pencil size={13} /> {editCount} edit</span>
                        <span className="flex items-center gap-1.5"><Eye size={13} /> {viewCount} view</span>
                        <span className="flex items-center gap-1.5"><Clock size={13} /> {new Date(u.role_created_at).toLocaleDateString("th-TH")}</span>
                      </div>
                    </button>

                    {/* Remove button (not for super_admin or self) */}
                    {u.role !== "super_admin" && !isSelf && (
                      <button
                        onClick={() => handleRemoveUser(u)}
                        className="p-2.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="ลบสิทธิ์ Admin"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Permission editor */}
        <div className="lg:col-span-3">
          {selectedUser ? (
            <div className="card-surface rounded-xl p-6 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-lg font-extrabold text-foreground">{selectedUser.email}</h4>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-sm px-3 py-1 rounded-full border font-bold ${roleColors[selectedUser.role] || roleColors.admin}`}>
                      {roleLabels[selectedUser.role] || selectedUser.role}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">สมาชิกตั้งแต่ {new Date(selectedUser.user_created_at).toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
                <select
                  onChange={(e) => applyPreset(e.target.value)}
                  className="text-base font-bold px-4 py-2.5 rounded-lg border border-border bg-background text-foreground"
                  defaultValue=""
                >
                  <option value="" disabled>ใช้ชุดสิทธิ์สำเร็จรูป...</option>
                  {Object.entries(PRESETS).map(([id, preset]) => (
                    <option key={id} value={id}>{preset.label}</option>
                  ))}
                </select>
              </div>

              {/* Permission grid */}
              <div className="space-y-5">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground mb-2.5">{group.label}</p>
                    <div className="space-y-2">
                      {group.keys.map((key) => {
                        const level = editPerms[key] || "none";
                        const config = ACCESS_ICONS[level];
                        const Icon = config.icon;
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/30 transition-colors"
                          >
                            <div>
                              <span className="text-base font-bold text-foreground">{PERMISSION_LABELS[key]}</span>
                              <span className="text-sm text-muted-foreground ml-2.5 font-medium">{key}</span>
                            </div>
                            <button
                              onClick={() => togglePermission(key)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors ${config.color}`}
                              title="คลิกเพื่อเปลี่ยน: ไม่มีสิทธิ์ → ดูได้ → แก้ไขได้"
                            >
                              <Icon size={15} /> {config.label}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border text-sm text-muted-foreground font-medium">
                <span>คลิกปุ่มเพื่อสลับ:</span>
                <span className="flex items-center gap-1.5"><Ban size={13} /> ไม่มีสิทธิ์</span>
                <span>→</span>
                <span className="flex items-center gap-1.5"><Eye size={13} /> ดูได้</span>
                <span>→</span>
                <span className="flex items-center gap-1.5"><Pencil size={13} /> แก้ไขได้</span>
              </div>

              {/* Save */}
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="w-full mt-5 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-extrabold hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-sm"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                บันทึกสิทธิ์
              </button>
            </div>
          ) : (
            <div className="card-surface rounded-xl p-14 text-center text-base text-muted-foreground font-medium">
              <Shield size={36} className="mx-auto mb-4 opacity-25" />
              เลือก Admin จากรายการเพื่อจัดการสิทธิ์
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;
