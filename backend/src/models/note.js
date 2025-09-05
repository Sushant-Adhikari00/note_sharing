import mongoose from "mongoose";
import { getNotesDB } from "../config/db.js";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  fileUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  ratings: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 }
  }
]
}, { timestamps: true });

let noteModel = null;

export const getNoteModel = () => {
  if (noteModel) {
    return noteModel;
  }
  const db = getNotesDB();
  if (!db) {
    throw new Error("Notes database not initialized");
  }
  noteModel = db.model("Note", noteSchema);
  return noteModel;
};
