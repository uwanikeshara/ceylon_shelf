import React, { useEffect, useState } from "react";
import AdminForm from "../components/forms/AdminForm";
import UserTable from "../components/tables/UserTable";
import Dialog from "../components/Dialog";
import { getAllUsers, deleteUser, adminSignUp } from "../services/authService";
import type { User } from "../types/User";
import toast from "react-hot-toast";
import { MdAdminPanelSettings, MdSync } from "react-icons/md";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string | null;
  }>({ open: false, userId: null });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load staff list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (userId: string) => {
    setConfirmDialog({ open: true, userId });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.userId) return;
    try {
      await deleteUser(confirmDialog.userId);
      toast.success("User access revoked");
      fetchUsers();
    } catch {
      toast.error("Failed to remove user");
    } finally {
      setConfirmDialog({ open: false, userId: null });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, userId: null });
  };

  const handleAdminSignUp = async (values: Omit<User, "role">) => {
    try {
      await adminSignUp(values);
      toast.success("New administrator account created");
      fetchUsers();
    } catch {
      toast.error("Failed to register admin user");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-emerald-500/10 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MdAdminPanelSettings className="w-4 h-4" />
            <span>Staff Security Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">System Staff & Administrators</h1>
          <p className="text-xs text-slate-400 mt-1">Manage portal access credentials, roles, and staff privileges</p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition cursor-pointer"
          title="Refresh Users"
        >
          <MdSync className={`w-5 h-5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg font-extrabold text-white mb-4 pb-3 border-b border-slate-800">
            Create Administrative Account
          </h2>
          <AdminForm onSubmit={handleAdminSignUp} />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-extrabold text-white mb-4">Registered Staff Members</h2>
          <UserTable users={users} loading={loading} onDelete={handleDelete} />
        </div>
      </div>

      <Dialog
        isOpen={confirmDialog.open}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Revoke Staff Credentials"
      >
        <p className="text-slate-300 text-sm leading-relaxed">
          Are you sure you want to remove this staff account? Access privileges will be immediately revoked.
        </p>
      </Dialog>
    </div>
  );
};

export default UserPage;