import mongoose from "mongoose";
import { getCommentModel } from "../models/comment.js";
import { getNoteModel } from "../models/note.js";
import { getUserModel } from "../models/user.js"; // <-- needed for populate

export const createComment = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const Note = getNoteModel();
    const { content } = req.body;
    const { noteId } = req.params; // <-- get noteId from params

    if (!noteId || !content)
      return res.status(400).json({ message: "Note ID and content required" });

    if (!mongoose.Types.ObjectId.isValid(noteId))
      return res.status(400).json({ message: "Invalid note ID" });

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const comment = new Comment({
      note: noteId,
      user: req.user.id,
      content,
    });

    const savedComment = await comment.save();

    // Populate user info
    const populatedComment = await Comment.findById(savedComment._id)
      .populate("user", "name email");

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get comments for a note
export const getCommentsByNote = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const User = getUserModel();
    const { noteId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(noteId))
      return res.status(400).json({ message: "Invalid note ID" });

    const comments = await Comment.find({ note: noteId }).sort({ createdAt: 1 });

    // Manually populate user info
    const commentsWithUser = await Promise.all(
      comments.map(async (c) => {
        const user = await User.findById(c.user).select("name email");
        return { ...c.toObject(), user };
      })
    );

    res.status(200).json(commentsWithUser);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update comment
export const updateComment = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const User = getUserModel();
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid comment ID" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    comment.content = content || comment.content;
    const updatedComment = await comment.save();

    const user = await User.findById(updatedComment.user).select("name email");
    const populatedComment = { ...updatedComment.toObject(), user };

    res.status(200).json(populatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const Comment = getCommentModel();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid comment ID" });

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
