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
  getNoteById,
  updateNote,
  deleteNote,
  getAllNotes,
  getNoteFileDownload,
  viewNote
} from '../controllers/noteController';

import upload from "../middleware/upload";

const router = express.Router();

// Rotas do CRUD

// Rotas para user
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.get('/user', getAllUsers);
router.get('/user/:id', getUserById);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

// Rotas para groups
router.get("/groups/date/:userId", getGroupsByDate);
router.get("/groups/category/:categoryId/:userId", getGroupsByCategory);
router.post("/groups", createGroup);
router.get("/groups/:groupId/:userId",  getGroupById); 
router.put("/groups/:groupId/:userId",  updateGroup); 
router.delete("/groups/:groupId/:userId",  deleteGroup);
router.get("/grupos/get/allGroups/:userId",getAllGroupsByUser);
router.get("/searchGroups/:userId/:query",searchGroup)

// Rotas para notes
router.post("/notes/:userId", upload.single("content"),addNoteToGroup);
router.get("/notes/group/:userId/:groupId", getNotesByGroup);
router.get("/notes/view/:userId/:noteId", viewNote);
router.get("/notes/:userId", getAllNotes);
router.get("/notes/download/:noteId/:userId/file",getNoteFileDownload);
router.get("/notes/:userId/:noteId", getNoteById);
router.put("/notes/:userId/:noteId", updateNote); 
router.delete("/notes/:userId/:noteId", deleteNote);
router.get("/searchNotes/:userId/:query",searchNote)

// Rotas para categories
router.post("/category", createCategory);
router.get("/categories/:userId", getCategories);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", updateCategory);
router.get("/searchCategories/:userId/:query",searchCategory)

//router.post("/notes/:userId", upload.single("file"), createNote);


router.get("/search/:userId/:query",search)//pesquisa o termo em notas, grupos




export default router;
