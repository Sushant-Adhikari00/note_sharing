import express from "express";
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from "../controllers/notesController.js";
import { uploadNotes } from "../middleware/uploadNotes.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/upload", uploadNotes.single("file"), createNote);
router.put("/:id", uploadNotes.single("file"), updateNote);
router.delete("/:id", deleteNote);

export default router;
