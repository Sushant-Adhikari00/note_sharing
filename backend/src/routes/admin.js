import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/admin.js";
import { getUserModel } from "../models/user.js";
import { getNoteModel } from "../models/note.js";

const router = express.Router();

// GET all users
router.get("/users", auth, admin, async (req, res) => {
  try {
    
    const User = getUserModel();
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all notes
router.get("/notes", auth, admin, async (req, res) => {
  try {
    const Note = getNoteModel();
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/users/:id", auth, admin, async (req, res) => {
  try {
    const User = getUserModel();
    const { id } = req.params;
    if (id === req.user.id) return res.status(400).json({ message: "Cannot delete yourself" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE note
router.delete("/notes/:id", auth, admin, async (req, res) => {
  try {
    const Note = getNoteModel();
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;