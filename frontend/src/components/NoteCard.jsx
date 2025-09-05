import { PenSquareIcon, Trash2Icon, StarIcon, SendIcon } from 'lucide-react';
import { Link } from "react-router";
import { formatDate } from '../lib/utils.js';
import api from '../lib/axios.js'; 
import toast from 'react-hot-toast';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/authContext.jsx';

const NoteCard = ({ note, setNotes }) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Delete Note
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const token = user?.token || localStorage.getItem("token");
      await api.delete(`/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => prev.filter(n => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  // ✅ Add Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Comment cannot be empty");

    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem("token");
      const res = await api.post(`/notes/${note._id}/comments`, { text: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotes(prev =>
        prev.map(n => n._id === note._id ? res.data : n)
      );
      setComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Rating
  const handleRating = async (value) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await api.post(`/notes/${note._id}/rate`, { value }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotes(prev =>
        prev.map(n => n._id === note._id ? res.data : n)
      );
      toast.success("Rating submitted!");
    } catch (error) {
      console.error("Rating error:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  // ✅ Calculate average rating
  const avgRating = note.ratings?.length
    ? (note.ratings.reduce((a, r) => a + r.value, 0) / note.ratings.length).toFixed(1)
    : "No ratings";

  // Only owner can edit/delete
  const isOwner = user && user.id === note.owner;

  return (
    <div className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF90]'>
      <div className='card-body'>
        <div className="flex justify-between items-start">
          <h3 className='card-title'>{note.title}</h3>
          {isOwner && (
            <span className="badge badge-sm badge-primary ml-2">Your Note</span>
          )}
        </div>

        <p className='line-clamp-3 mt-2'>{note.content}</p>

        {note.fileUrl && (
          <a
            href={`http://localhost:5001/${note.fileUrl.replaceAll("\\", "/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className='btn btn-sm btn-outline mt-2'
          >
            View File
          </a>
        )}

        {/* ⭐ Rating Section */}
        <div className="mt-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(star => (
              <button
                key={star}
                onClick={() => user && handleRating(star)}
                className={`transition-colors ${note.ratings?.some(r => r.user === user?.id && r.value >= star) ? "text-yellow-400" : "text-gray-400"}`}
              >
                <StarIcon className="size-5" />
              </button>
            ))}
          </div>
          <p className="text-sm mt-1">Avg Rating: {avgRating}</p>
        </div>

        {/* 💬 Comments Section */}
        <div className="mt-3">
          {user && (
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input input-bordered input-sm flex-1"
              />
              <button type="submit" disabled={loading} className="btn btn-sm btn-primary">
                <SendIcon className="size-4" />
              </button>
            </form>
          )}
          <ul className="mt-2 space-y-1">
            {note.comments?.map((c, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                • {c.text}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: Date + Actions */}
        <div className='card-actions justify-between items-center mt-4'>
          <span className='text-sm text-base-content/60'>
            {formatDate(new Date(note.createdAt))}
          </span>

          {isOwner && (
            <div className='flex items-center gap-1'>
              <Link to={`/update/${note._id}`} className="btn btn-ghost btn-xs text-primary">
                <PenSquareIcon className='size-4' />
              </Link>
              <button className='btn btn-ghost btn-xs text-error' onClick={handleDelete}>
                <Trash2Icon className='size-4' />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
