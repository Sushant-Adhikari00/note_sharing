import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true }, // MIME type
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);
