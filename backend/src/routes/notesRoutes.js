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

// Notes routes
router.get("/", getAllNotes);
router.get("/search", searchNotes);
router.get("/:id", getNoteById);
router.get("/:id/rating", getRating);

router.post("/", auth, uploadNotes.single("file"), createNote);
router.put("/:id", auth, uploadNotes.single("file"), updateNote);
router.delete("/:id", auth, deleteNote);
router.post("/:id/rate", auth, rateNote);

// Comments routes 
router.post("/:noteId/comments", auth, createComment);
router.get("/:noteId/comments", getCommentsByNote);
router.put("/comments/:id", auth, updateComment);
router.delete("/comments/:id", auth, deleteComment);


export default router;
