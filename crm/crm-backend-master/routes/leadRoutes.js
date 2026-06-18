import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead,
  addNote,
} from "../controllers/leadController.js";

const router = express.Router();

router.post("/", createLead);

router.get("/", protect, getLeads);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);
router.post("/:id/note", protect, addNote);

export default router;
