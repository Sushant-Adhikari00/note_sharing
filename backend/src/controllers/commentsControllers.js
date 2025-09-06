import mongoose from "mongoose";
import { getCommentModel } from "../models/comment.js";
import { getNoteModel } from "../models/note.js";
import { getUserModel } from "../models/user.js"; // <-- needed for populate



// controllers/commentsController.js
export const createComment = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const User = getUserModel();
    const { content } = req.body;
    const { noteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noteId))
      return res.status(400).json({ message: "Invalid note ID" });

    const comment = new Comment({
      note: noteId,
      user: req.user.id,
      content,
    });

    const savedComment = await comment.save();

    // populate user info from usersDB
    const user = await User.findById(savedComment.user).select("name email");
    const populatedComment = { ...savedComment.toObject(), user };

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Comment creation error:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


export const getCommentsByNote = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const User = getUserModel();
    const { noteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noteId))
      return res.status(400).json({ message: "Invalid note ID" });

    const comments = await Comment.find({ note: noteId }).sort({ createdAt: 1 });

    const userIds = comments.map(c => c.user);
    const users = await User.find({ _id: { $in: userIds } }).select("name email");
    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u);

    const commentsWithUser = comments.map(c => {
      return { ...c.toObject(), user: userMap[c.user.toString()] || null };
    });

    res.status(200).json(commentsWithUser);
  } catch (error) {
    console.error("Error fetching comments:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const { id } = req.params; // comment ID

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid comment ID" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment owner or admin can delete
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};