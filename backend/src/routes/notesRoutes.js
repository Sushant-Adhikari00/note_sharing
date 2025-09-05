import express from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  rateNote,
  getRating,
  searchNotes
} from "../controllers/notesController.js";
import { uploadNotes } from "../middleware/uploadNotes.js";
import { auth } from "../middleware/authMiddleware.js";
import {
  createComment,
  getCommentsByNote,
  updateComment,
  deleteComment,
} from "../controllers/commentsControllers.js";


const router = express.Router();

// Public routes
router.get("/", getAllNotes);       
router.get("/:id", getNoteById);
router.get("/:id/rating", getRating);
router.get("/search", searchNotes); 
router.get("/:noteId", getCommentsByNote);  

// Restricted routes
router.post("/", auth, uploadNotes.single("file"), createNote);
router.put("/:id", auth, uploadNotes.single("file"), updateNote);
router.delete("/:id", auth, deleteNote);
router.post("/", auth, createComment);
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);
router.post("/:id/rate", auth, rateNote);

export default router;
