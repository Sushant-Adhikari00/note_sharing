import mongoose from "mongoose";
import { getNotesDB } from "../config/db.js";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    fileUrl: String,
    owner: { type: String, required: true }, // userId from auth
  },
  { timestamps: true }
);

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
