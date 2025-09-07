import { useState, useEffect, useContext } from "react";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";
import NoteCardSkeleton from "../components/NoteCardSkeleton.jsx"; // Import the skeleton
import { AuthContext } from "../context/authContext.jsx";
import { Link } from "react-router";

const HomePage = ({ searchQuery }) => {
  const { user } = useContext(AuthContext);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
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
  }, [searchQuery]); // Add searchQuery to dependency array

  const filteredNotes = notes.filter(
    (note) =>
      (note.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Determine which notes to display
  const notesToDisplay = filteredNotes;

  return (
    <div className="min-h-screen">
      {isRateLimited && <RateLimitedUI />}

      <div className="container mx-auto p-4 mt-6">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, index) => (
              <NoteCardSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && filteredNotes.length === 0 && !isRateLimited && (
          <NotesNotFound />
        )}

        {!loading && filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
