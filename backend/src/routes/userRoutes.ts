import express from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { createCategory, getCategories, deleteCategory, updateCategory, searchCategory } from "../controllers/categoryController";

import {
  getGroupsByDate,
  getGroupsByCategory,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  search,
  getAllGroupsByUser,
  searchGroup
} from '../controllers/groupController';

import {
  addNoteToGroup,
  getNotesByGroup,
  searchNote
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
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

router.get("/groups/date/:userId", getGroupsByDate);
router.get("/groups/:categoryId/:userId", getGroupsByCategory);
router.post("/groups", createGroup);
router.get("/groups/:id",  getGroupById); 
router.put("/groups/:groupId/:userId",  updateGroup); 
router.delete("/groups/:groupId/:userId",  deleteGroup);
router.get("/grupos/get/allGroups/:userId",getAllGroupsByUser);
router.get("/searchGroups/:userId/:query",searchGroup)


// Rotas para Anotações
router.post("/notes/:userId", addNoteToGroup);
router.get("/notes/group/:userId/:groupId", getNotesByGroup);
router.post("/category", createCategory);
router.get("/categories/:userId", getCategories);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", updateCategory);
router.get("/searchCategories/:userId/:query",searchCategory)

//router.post("/notes", createNote); 
router.get("/notes/:userId", getAllNotes);
router.get("/notes/:userId/:noteId", getNoteById);
router.put("/notes/:userId/:noteId", updateNote); 
router.delete("/notes/:userId/:noteId", deleteNote);
router.get("/searchNotes/:userId/:query",searchNote)


router.get("/search/:userId/:query",search)//pesquisa o termo em notas, grupos e categorias




export default router;
