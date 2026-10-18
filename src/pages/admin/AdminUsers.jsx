import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import AdminShell from "./AdminShell";
import { ConfirmDialog, EmptyState } from "../../components/ui";
import { useTitle } from "../../utils/useTitle";
import { adminGetUsers, adminSetUserRole, adminDeleteUser, errorMessage } from "../../service/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { formatDate, initials } from "../../utils/format";

function AdminUsers() {
  useTitle("Users");
  const { user: me } = useAuth();
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [confirm, setConfirm] = useState(null); // { type: "delete" | "role", user }
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminGetUsers()
      .then(({ data }) => setUsers(data))
      .catch((err) => toast(errorMessage(err), "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => !role || u.role === role)
      .filter((u) => !q || [u.name, u.email, u.phone, u.location].some((v) => v?.toLowerCase().includes(q)));
  }, [users, search, role]);

  const run = async () => {
    const { type, user } = confirm;
    try {
      setBusy(true);
      if (type === "delete") {
        await adminDeleteUser(user._id);
        setUsers((list) => list.filter((u) => u._id !== user._id));
        toast("User deleted");
      } else {
        const newRole = user.role === "admin" ? "candidate" : "admin";
        const { data } = await adminSetUserRole(user._id, newRole);
        setUsers((list) => list.map((u) => (u._id === user._id ? { ...u, role: data.role } : u)));
        toast(newRole === "admin" ? `${user.name} is now an admin` : `${user.name} is now a job seeker`);
      }
      setConfirm(null);
    } catch (err) {
      toast(errorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Users">
      <div className="toolbar">
        <div className="input-icon grow">
          <FaSearch aria-hidden="true" />
          <input className="form-control" placeholder="Search name, email or phone" aria-label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ width: "auto" }} value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">
          <option value="">Everyone ({users.length})</option>
          <option value="candidate">Job seekers ({users.filter((u) => u.role === "candidate").length})</option>
          <option value="admin">Admins ({users.filter((u) => u.role === "admin").length})</option>
        </select>
      </div>

      {loading ? (
        <div className="skel" style={{ height: 300 }} />
      ) : shown.length === 0 ? (
        <EmptyState title="No users match">Change the search or role filter.</EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Phone</th><th>Lives in</th><th>Applications</th><th>Joined</th><th>Role</th><th aria-label="Actions" /></tr></thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="avatar" style={{ background: u.role === "admin" ? "var(--navy)" : undefined }}>{initials(u.name)}</span>
                      <div>
                        <div className="fw-semibold">{u.name}{u._id === me._id && <span className="text-steel fw-normal"> (you)</span>}</div>
                        <small className="text-steel">{u.email}</small>
                      </div>
                    </div>
                  </td>
                  <td className="text-nowrap">{u.phone || "—"}</td>
                  <td>{u.location || "—"}</td>
                  <td>{u.applications}</td>
                  <td className="small text-steel text-nowrap">{formatDate(u.createdAt)}</td>
                  <td><span className={`chip ${u.role === "admin" ? "chip-blue" : ""}`}>{u.role === "admin" ? "Admin" : "Job seeker"}</span></td>
                  <td className="text-end text-nowrap">
                    {u._id !== me._id && (
                      <>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm({ type: "role", user: u })}>
                          {u.role === "admin" ? "Remove admin" : "Make admin"}
                        </button>
                        <button type="button" className="btn btn-ghost btn-sm text-danger" onClick={() => setConfirm({ type: "delete", user: u })} aria-label={`Delete ${u.name}`}><FaTrash /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.type === "delete" ? "Delete this user?" : confirm.user.role === "admin" ? "Remove admin access?" : "Give admin access?"}
          message={
            confirm.type === "delete"
              ? `${confirm.user.name}'s account, applications and saved jobs will be deleted permanently.`
              : confirm.user.role === "admin"
                ? `${confirm.user.name} will lose access to the admin panel.`
                : `${confirm.user.name} will be able to post, edit and delete jobs and see every applicant's details.`
          }
          confirmLabel={confirm.type === "delete" ? "Delete user" : confirm.user.role === "admin" ? "Remove admin" : "Make admin"}
          busy={busy}
          onConfirm={run}
          onCancel={() => setConfirm(null)}
        />
      )}
    </AdminShell>
  );
}

export default AdminUsers;
