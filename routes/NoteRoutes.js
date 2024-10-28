// noteRoutes.js
import { Router } from 'express';
import * as NoteController from '../controller/NoteController.js';
import authCheck from '../middleware/authMiddleware.js';

const router = Router();
router.get('/notes', authCheck, NoteController.getAllNotes);

// Get single note
router.get('/notes/:id', authCheck, NoteController.getNote);

// Create new note
router.post('/notes', authCheck, NoteController.createNote);

// Update note
router.put('/notes/:id', authCheck, NoteController.updateNote);

// Delete note
router.delete('/notes/:id', authCheck, NoteController.deleteNote);

export default router;