import express from "express";
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/notesController.js";
import { uploadNotes } from "../middleware/uploadNotes.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllNotes);       
router.get("/:id", getNoteById);     

// Restricted routes
router.post("/", auth, uploadNotes.single("file"), createNote);
router.put("/:id", auth, uploadNotes.single("file"), updateNote);
router.delete("/:id", auth, deleteNote);

export default router;
