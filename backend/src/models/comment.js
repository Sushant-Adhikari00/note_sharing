import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    note: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const getCommentModel = () => {
  if (!mongoose.models.Comment) {
    return mongoose.model("Comment", commentSchema);
  }
  return mongoose.models.Comment;
};
