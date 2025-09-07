import { PenSquareIcon, Trash2Icon, StarIcon, SendIcon } from 'lucide-react';
import { Link } from "react-router";
import { formatDate } from '../lib/utils.js';
import api from '../lib/axios.js'; 
import toast from 'react-hot-toast';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/authContext.jsx';

const NoteCard = ({ note, setNotes }) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(note.comments || []); // local state

  // Determine if current user is owner
  const isOwner = user && note.owner && (user.id === (note.owner._id || note.owner).toString());

  // Fetch comments on load
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/notes/${note._id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Fetch comments error:", err);
      }
    };
    fetchComments();
  }, [note._id]);

  // Delete Note
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = user?.token || localStorage.getItem("token");
      await api.delete(`/notes/${note._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setNotes(prev => prev.filter(n => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  // Add Comment
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Comment cannot be empty");

    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem("token");

      const res = await api.post(
        `/notes/${note._id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(prev => [...prev, res.data]); // update local state
      setComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = user?.token || localStorage.getItem("token");
      await api.delete(`/notes/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } });

      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      console.error("Delete comment error:", err);
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // Add Rating
  const handleRating = async (value) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await api.post(`/notes/${note._id}/rate`, { value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => prev.map(n => n._id === note._id ? res.data : n));
      toast.success("Rating submitted!");
    } catch (error) {
      console.error("Rating error:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  // Calculate average rating
  const avgRating = note.ratings?.length
    ? (note.ratings.reduce((a, r) => a + r.value, 0) / note.ratings.length).toFixed(1)
    : "No ratings";

  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-primary/20'>
      <div className='card-body'>
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className='card-title text-primary'>{note.title}</h3>
          {isOwner && <span className="badge badge-sm badge-primary ml-2">Your Note</span>}
        </div>

        {/* Content */}
        <p className='line-clamp-3 mt-2 text-base-content/80'>{note.content}</p>

        {/* File link */}
        {note.fileUrl && (
          <a
            href={`${import.meta.env.VITE_API_URL || "http://localhost:5001"}${note.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className='btn btn-sm btn-outline btn-primary mt-2'
          >
            View File
          </a>
        )}

        {/* Owner Info */}
        <p className="text-sm text-base-content/60 mt-1">
          Posted by: {note.owner?.name || "Unknown"}
        </p>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => user && handleRating(star)}
              className={`transition-colors text-yellow-400 ${note.ratings?.some(r => r.user === user?.id && r.value >= star) ? "opacity-100" : "opacity-30"}`}
            >
              <StarIcon className="size-5" />
            </button>
          ))}
          <span className="text-sm ml-2 text-base-content/60">Avg Rating: {avgRating}</span>
        </div>

        {/* Comments */}
        <div className="mt-3">
          {user && (
            <form onSubmit={handleComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input input-bordered input-sm flex-1 bg-base-200"
              />
              <button type="submit" disabled={loading} className="btn btn-sm btn-primary">
                <SendIcon className="size-4" />
              </button>
            </form>
          )}
          <ul className="mt-2 space-y-1">
            {comments.map((c) => {
              const canDelete = user && (c.user?._id === user.id || user.role === "admin");
              return (
                <li key={c._id} className="text-sm text-base-content/70 flex justify-between items-center">
                  <span>
                    • {c.content || c.text}{" "}
                    <span className="text-xs text-base-content/50">
                      - {c.user?.name || "Unknown"}
                    </span>
                  </span>
                  {canDelete && (
                    <button
                      className="btn btn-ghost btn-xs text-error"
                      onClick={() => handleDeleteComment(c._id)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
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

