import { Request, Response } from "express";
import Category from "../models/Category"; 
import User from "../models/User"; 

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const newCategory = new Category({
      name,
      userId,
    });

    await newCategory.save();
    res.status(201).json({ category: newCategory });
  } catch (err) {
    console.error("Erro ao criar categoria:", err);
    res.status(500).json({ error: "Erro ao criar categoria." });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ error: "Usuário não fornecido." });
    }

    const categorias = await Category.find({ userId });
    res.status(200).json({ categorias });
  } catch (err) {
    console.error("Erro ao buscar categorias:", err);
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
};


export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; 
    const { name, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, userId },
      { new: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    res.status(200).json({ category: updatedCategory });
  } catch (err) {
    console.error("Erro ao atualizar categoria:", err);
    res.status(500).json({ error: "Erro ao atualizar categoria." });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    res.status(200).json({ message: "Categoria deletada com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar categoria:", err);
    res.status(500).json({ error: "Erro ao deletar categoria." });
  }
};

export const searchCategory = async (req: Request, res: Response) => {
  try {
    const { userId, query } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "O ID do usuário é obrigatório." });
    }

    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "O termo de busca é obrigatório." });
    }

    const categorias = await Category.find({
      userId,
      name: { $regex: query, $options: "i" }
    });

    const result = {
      categorias
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao realizar a busca geral:", err);
    res.status(500).json({ error: "Erro ao realizar a busca." });
  }
};
