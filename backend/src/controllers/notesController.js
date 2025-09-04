import Note from "../models/note.js";
import fs from "fs";
import path from "path";

// GET all notes
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET note by ID
export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}

// CREATE a note
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const note = new Note({
      title,
      content,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}

// UPDATE a note
export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.file) {
      const filePath = path.resolve(note.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

      note.fileUrl = req.file.path;
      note.fileType = req.file.mimetype;
    }

    if (title) note.title = title;
    if (content) note.content = content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);

  } catch (error) {
    console.error("Error in updateNote:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE a note
export async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const filePath = path.resolve(note.fileUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Note deleted successfully!" });

  } catch (error) {
    console.error("Error in deleteNote:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
}
