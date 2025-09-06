import mongoose from "mongoose";
import { getNotesDB } from "../config/db.js";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
  },
  { timestamps: true }
);

let noteModel;
export const getNoteModel = () => {
  if (noteModel) return noteModel;
  const db = getNotesDB();
  if (!db) throw new Error("Notes database not initialized");
  noteModel = db.model("Note", noteSchema);
  return noteModel;
};
