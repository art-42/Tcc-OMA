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
  addTagNote,
  getNotesByGroup,
  saveFileUri,
  getNoteById,
  updateNote,
  deleteNote,
  getAllNotes,
  generatePdfEndpoint,
 
  getContent,
} from '../controllers/noteController';
import path from 'path';


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
router.get("/searchGroups/:userId/:query",searchGroup);
router.get("/notes/export/:userId/:groupId",generatePdfEndpoint);


// Rotas para notes
router.post("/notes/:userId", addNoteToGroup);
router.get("/notes/group/:userId/:groupId", getNotesByGroup);
router.get("/notes/:userId", getAllNotes);
router.get("/notes/:userId/:noteId", getNoteById);
router.put("/notes/:userId/:noteId", updateNote); 
router.delete("/notes/:userId/:noteId", deleteNote);
router.put("/notes/uri/:userId/:noteId", saveFileUri);
router.put("/notes/tag/:userId/:noteId", addTagNote);  
router.get("/notes/content/:noteId",getContent);


// Rotas para categories
router.post("/category", createCategory);
router.get("/categories/:userId", getCategories);
router.delete("/category/:id", deleteCategory);
router.put("/category/:id", updateCategory);
router.get("/searchCategories/:userId/:query",searchCategory);


router.get("/search/:userId/:query",search)//pesquisa o termo em notas, grupos


export default router;
