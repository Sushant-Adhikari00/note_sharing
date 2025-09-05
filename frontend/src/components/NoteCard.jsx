import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { Link } from "react-router";
import { formatDate } from '../lib/utils.js';
import api from '../lib/axios.js'; 
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

const NoteCard = ({ note, setNotes }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure to delete this note?")) return;
    try {
      const token = user.token || localStorage.getItem("token");
      await api.delete(`/notes/${note._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes((prev) => prev.filter(n => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  const isOwner = user && user.id === note.owner;

  return (
    <div className='card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF90]'>
      <div className='card-body'>
        <h3 className='card-title'>{note.title}</h3>
        <p className='line-clamp-3'>{note.content}</p>

        {note.fileUrl && (
          <a
            href={`http://localhost:5001/${note.fileUrl.replace("\\", "/")}`}
            target="_blank"
            rel="noopener noreferrer"
            className='btn btn-sm btn-outline mt-2'
          >
            View File
          </a>
        )}

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
