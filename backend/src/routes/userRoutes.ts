import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { createCategory, getCategories, deleteCategory } from "../controllers/categoryController";

import {
  getGroupsByDate,
  getGroupsByCategory,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController';

import {
  addNoteToGroup,
  getNotesByGroup
} from '../controllers/noteController';

import {
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
  getAllNotes,
} from '../controllers/noteController';

const router = express.Router();

// Rotas do CRUD
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get("/groups/date/:categoryId/:userId", getGroupsByDate);
router.get("/groups/:categoryId/:userId", getGroupsByCategory);
router.post("/groups", createGroup);
router.get("/groups/:id",  getGroupById); // Buscar grupo por ID
router.put("/groups/:id",  updateGroup); // Atualizar grupo
router.delete("/groups/:id",  deleteGroup); // Deletar grupo


// Rotas para Anotações
router.post("/notes", addNoteToGroup);
router.get("/notes/:groupId", getNotesByGroup);
router.post("/category", createCategory);
router.get("/categories", getCategories);
router.delete("/category/:id", deleteCategory);

router.post("/notes", createNote); 
router.get("/notes", getAllNotes);
router.get("/notes/:id", getNoteById);
router.put("/notes/:id", updateNote); 
router.delete("/notes/:id", deleteNote);


export default router;
