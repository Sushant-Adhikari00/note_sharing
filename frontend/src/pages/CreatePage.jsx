import { useState, useContext } from "react";
import { XIcon } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { AuthContext } from "../context/authContext";

const CreatePage = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return toast.error("Title and content are required");
    if (!file) return toast.error("File is required");

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    if (!allowedTypes.includes(file.type)) {
      return toast.error("Only PDF, JPG/PNG, PPT, PPTX files are allowed");
    }

    if (!user) return toast.error("You must be logged in to create a note");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("file", file);

      const token = user.token || localStorage.getItem("token");

      await api.post("/notes", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error(error.response?.data?.message || "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    toast("Returning to notes!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="card bg-base-100 shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">Create New Note</h2>
            <button
              onClick={goBack}
              className="btn btn-ghost btn-sm flex items-center gap-2 text-base-content/70"
            >
              <XIcon className="size-4" /> Close
            </button>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Note Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter a concise title for your note"
                className="input input-bordered w-full bg-base-200 text-base-content focus:border-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Content</span>
              </label>
              <textarea
                placeholder="Write the detailed content of your note here..."
                className="textarea textarea-bordered h-48 w-full bg-base-200 text-base-content focus:border-primary"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content">Upload File (PDF, JPG, PNG, PPT, PPTX)</span>
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.ppt,.pptx"
                className="file-input file-input-bordered w-full bg-base-200 text-base-content file-input-primary"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
