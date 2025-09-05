import { getUserModel } from "../models/user.js";
import { getNoteModel } from "../models/note.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  const User = getUserModel();
  const users = await User.find().select("-password");
  res.json(users);
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const User = getUserModel();

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user ID" });

  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();
  res.json({ message: `User role updated to ${role}`, user });
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const User = getUserModel();

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid user ID" });

  await User.findByIdAndDelete(id);
  res.json({ message: "User deleted successfully" });
};

export const getAllNotes = async (req, res) => {
  const Note = getNoteModel();
  const User = getUserModel();
  const notes = await Note.find().lean();

  // Populate owner name
  for (let note of notes) {
    const owner = await User.findById(note.owner);
    note.ownerName = owner?.name || "Unknown";
  }

  res.json(notes);
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const Note = getNoteModel();

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ message: "Invalid note ID" });

  await Note.findByIdAndDelete(id);
  res.json({ message: "Note deleted successfully" });
};
