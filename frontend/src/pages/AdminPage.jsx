import { useState, useEffect, useContext } from "react";
import { Trash2Icon, UserIcon, FileTextIcon } from "lucide-react";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext.jsx";

const AdminPage = () => {
  const { user } = useContext(AuthContext); // logged-in admin
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = user?.token || localStorage.getItem("token");

  // Fetch all users and notes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, notesRes] = await Promise.all([
          api.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/admin/notes", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUsers(usersRes.data);
        setNotes(notesRes.data);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter(u => u._id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/admin/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes((prev) => prev.filter(n => n._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  if (!user || user.role !== "admin") return <p className="p-4 text-center">Access denied</p>;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading && <p className="text-center">Loading...</p>}

      {!loading && (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <UserIcon /> Users
            </h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((u) => (
                  <div key={u._id} className="card bg-base-100 p-4 shadow-sm flex justify-between items-center">
                    <span>{u.name} ({u.email})</span>
                    {u._id !== user.id && ( // prevent deleting self
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileTextIcon /> Notes
            </h2>
            {notes.length === 0 ? (
              <p>No notes found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.map((n) => (
                  <div key={n._id} className="card bg-base-100 p-4 shadow-sm flex justify-between items-center">
                    <span>{n.title}</span>
                    <button
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDeleteNote(n._id)}
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminPage;
