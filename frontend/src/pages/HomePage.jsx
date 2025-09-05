import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import { AuthContext } from "../context/authContext.jsx";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // 🔍 search state

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const headers = user ? { Authorization: `Bearer ${user.token}` } : {};
        const res = await api.get("/notes", { headers });
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error(error.response?.data?.message || "Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  // 🔹 Filter notes safely with optional chaining
  const filteredNotes = notes.filter(
    (note) =>
      (note.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (note.content ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar onSearch={setSearch} />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}

        {!loading && filteredNotes.length === 0 && !isRateLimited && <NotesNotFound />}

        {!loading && filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
