import mongoose from "mongoose";
import { getNoteModel } from "../models/note.js";
import { getUserModel } from "../models/user.js";

// GET ALL NOTES
export const getAllNotes = async (req, res) => {
  try {
    const Note = getNoteModel();
    const User = getUserModel();

    // fetch all notes from notesDB
    const notes = await Note.find().sort({ createdAt: -1 });

    // if there are no notes, return empty
    if (!notes.length) return res.json([]);

    // fetch all unique user IDs from notes
    const ownerIds = notes.map(n => n.owner);
    const uniqueOwnerIds = [...new Set(ownerIds.map(id => id.toString()))];

    // fetch all users from usersDB in one go
    const users = await User.find({ _id: { $in: uniqueOwnerIds } }).select("name email");

    // create lookup table { userId: userObject }
    const userMap = {};
    users.forEach(u => { userMap[u._id.toString()] = u; });

    // attach user to each note
    const notesWithOwner = notes.map(note => {
      const owner = userMap[note.owner.toString()] || null;
      return { ...note.toObject(), owner };
    });

    res.json(notesWithOwner);
  } catch (error) {
    console.error("Error fetching notes:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET SINGLE NOTE
export const getNoteById = async (req, res) => {
  try {
    const Note = getNoteModel();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid note ID" });

    const note = await Note.findById(id)
      .populate("owner", "name email")
      .populate("comments.user", "name email");

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// CREATE NOTE – AUTH REQUIRED
export const createNote = async (req, res) => {
  try {
    const Note = getNoteModel();
    const User = getUserModel();
    const { title, content } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const note = new Note({
      title,
      content,
      fileUrl,
      owner: req.user.id,
    });

    const savedNote = await note.save();

    // Manual populate
    const owner = await User.findById(savedNote.owner).select("name email");
    const populatedNote = { ...savedNote.toObject(), owner };

    res.status(201).json(populatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateNote = async (req, res) => {
  try {
    const Note = getNoteModel();
    const User = getUserModel();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid note ID" });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!req.user || (note.owner.toString() !== req.user.id && req.user.role !== "admin"))
      return res.status(403).json({ message: "Unauthorized" });

    if (req.body.title) note.title = req.body.title;
    if (req.body.content) note.content = req.body.content;
    if (req.file) note.fileUrl = `/uploads/${req.file.filename}`;

    const updatedNote = await note.save();

    // Manual populate
    const owner = await User.findById(updatedNote.owner).select("name email");
    const populatedNote = { ...updatedNote.toObject(), owner };

    res.status(200).json(populatedNote);
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// DELETE NOTE – AUTH + OWNER/ADMIN
export const deleteNote = async (req, res) => {
  try {
    const Note = getNoteModel();

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid note ID" });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Unauthorized" });

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ADD/UPDATE RATING – AUTH REQUIRED
export const rateNote = async (req, res) => {
  try {
    const Note = getNoteModel();

    const { id } = req.params;
    const { value } = req.body; // 1–5

    if (!value || value < 1 || value > 5)
      return res.status(400).json({ message: "Rating must be 1–5" });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const existing = note.ratings.find(r => r.user.toString() === req.user.id);
    if (existing) existing.value = value;
    else note.ratings.push({ user: req.user.id, value });

    await note.save();
    res.status(200).json(note.ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET RATING – PUBLIC
export const getRating = async (req, res) => {
  try {
    const Note = getNoteModel();

    const { id } = req.params;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const avg = note.ratings.reduce((sum, r) => sum + r.value, 0) / (note.ratings.length || 1);
    res.status(200).json({ average: avg, total: note.ratings.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// SEARCH NOTES – PUBLIC
export const searchNotes = async (req, res) => {
  try {
    const Note = getNoteModel();

    const { q } = req.query;

    if (!q) return res.status(400).json({ message: "Search query required" });

    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ]
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};