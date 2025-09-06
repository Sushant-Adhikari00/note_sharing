// src/models/commentModel.js
import mongoose from "mongoose";
import { getNotesDB } from "../config/db.js";

const commentSchema = new mongoose.Schema(
  {
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

let commentModel;
export const getCommentModel = () => {
  const db = getNotesDB();
  if (!commentModel) {
    commentModel = db.model("Comment", commentSchema);
  }
  return commentModel;
};
