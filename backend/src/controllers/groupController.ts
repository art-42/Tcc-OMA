import { Request, Response } from "express";
import Group from "../models/Group";
import User from "../models/User"; 
import Category from "../models/Category"; 
import Note from "../models/Note";

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Categoria não encontrada." });
      }
    }

    const newGroup = new Group({ name, categoryId: categoryId || null, userId });

    await newGroup.save();

    res.status(201).json({ message: "Grupo criado com sucesso!", group: newGroup });
  } catch (err) {
    console.error("Erro ao criar grupo:", err);
    res.status(500).json({ error: "Erro ao criar grupo." });
  }
};

export const getAllGroupsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const groups = await Group.find({ userId }).lean();

    const groupsWithCategory = await Promise.all(
      groups.map(async (group) => {
        const category = await Category.findById(group.categoryId);
        const categoryName = category ? category.name : "Sem categoria";

        return {
          ...group,
          categoryName,
        };
      })
    );

    res.status(200).json(groupsWithCategory);
  } catch (err) {
    console.error("Erro ao buscar grupos por usuário:", err);
    res.status(500).json({ error: "Erro ao buscar grupos." });
  }
};

export const getGroupsByDate = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const groups = await Group.find({ userId }).sort({ createdAt: -1 }).lean();

    const groupsByDate: { [date: string]: any[] } = {};
    for (const group of groups) {
      const category = await Category.findById(group.categoryId);
      const categoryName = category ? category.name : "Sem categoria";
      const date = group.createdAt instanceof Date ? group.createdAt.toISOString().split("T")[0] : null;

      if (date) {
        if (!groupsByDate[date]) {
          groupsByDate[date] = [];
        }
        groupsByDate[date].push({
          ...group,
          categoryName,
        });
      }
    }

    res.status(200).json(groupsByDate);
  } catch (err) {
    console.error("Erro ao buscar grupos por data:", err);
    res.status(500).json({ error: "Erro ao buscar grupos." });
  }
};


export const getGroupsByCategory = async (req: Request, res: Response) => {
  try {
    const { userId, categoryId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ error: "Categoria não encontrada." });
    }

    const groups = await Group.find({ userId, categoryId });

    const groupsWithCategoryName = groups.map(group => ({
      ...group.toObject(), 
      categoryName: category.name,
    }));

    res.status(200).json({ groups: groupsWithCategoryName });
  } catch (err) {
    console.error("Erro ao buscar grupos por categoria:", err);
    res.status(500).json({ error: "Erro ao buscar grupos." });
  }
};




export const searchGroupByName = async (req: Request, res: Response) => {
  try {
    const { name, userId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const group = await Group.findOne({ name: { $regex: name, $options: "i" }, userId });

    if (!group) {
      return res.status(404).json({ error: "Grupo não encontrado." });
    }

    res.status(200).json({ group });
  } catch (err) {
    console.error("Erro ao buscar grupo:", err);
    res.status(500).json({ error: "Erro ao buscar grupo." });
  }
};



export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const group = await Group.findOne({ _id: groupId, userId });

    if (!group) {
      return res.status(404).json({ error: "Grupo não encontrado." });
    }

    res.status(200).json({ group });
  } catch (err) {
    console.error("Erro ao buscar grupo:", err);
    res.status(500).json({ error: "Erro ao buscar grupo." });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { groupId,userId } = req.params;
    const { name, categoryId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ error: "Categoria não encontrada." });
      }
    }

    const updatedGroup = await Group.findOneAndUpdate(
      { _id: groupId, userId },
      { name, categoryId: categoryId || null },
      { new: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ error: "Grupo não encontrado." });
    }

    res.status(200).json({ message: "Grupo atualizado com sucesso!", group: updatedGroup });
  } catch (err) {
    console.error("Erro ao atualizar grupo:", err);
    res.status(500).json({ error: "Erro ao atualizar grupo." });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const deletedGroup = await Group.findOneAndDelete({ _id: groupId, userId });

    if (!deletedGroup) {
      return res.status(404).json({ error: "Grupo não encontrado." });
    }

    // Apagar todas as notas associadas ao grupo
    await Note.deleteMany({ userId, groupId });

    res.status(200).json({ message: "Grupo e suas notas excluídos com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir grupo:", err);
    res.status(500).json({ error: "Erro ao excluir grupo." });
  }
};



export const search = async (req: Request, res: Response) => {
  try {
      const { userId, query } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: "O ID do usuário é obrigatório." });
      }
  
      if (!query || query.trim() === "") {
        return res.status(400).json({ error: "O termo de busca é obrigatório." });
      }
  
      let notes: any[] = [];
  
      const textNotes = await Note.find({
        userId,
        type: "texto",
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { tag: { $regex: query, $options: "i" } }
        ]
      });
  
      const otherNotes = await Note.find({
        userId,
        type: { $ne: "texto" },
        $or: [
          { title: { $regex: query, $options: "i" } },
          { tag: { $regex: query, $options: "i" } }
        ]
      });
  
      notes = [...textNotes, ...otherNotes];

      const formattedNotes = notes.map(note => {
        if (note.type === "texto") {
          return note; 
        }
        return {
          ...note.toObject(),
          content: undefined,
        };
      });

      const groups = await Group.find({
        userId,
        name: { $regex: query, $options: "i" }
      });  
  
      const result = {
        notes: formattedNotes,
        groups
      };
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Erro ao realizar a busca geral:", err);
      res.status(500).json({ error: "Erro ao realizar a busca." });
    }
};

export const searchGroup = async (req: Request, res: Response) => {
    try {
      const { userId, query } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: "O ID do usuário é obrigatório." });
      }
  
      if (!query || query.trim() === "") {
        return res.status(400).json({ error: "O termo de busca é obrigatório." });
      }

  
      const groups = await Group.find({
        userId,
        name: { $regex: query, $options: "i" }
      });
  
      const result = {
        groups
      };
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Erro ao realizar a busca geral:", err);
      res.status(500).json({ error: "Erro ao realizar a busca." });
    }
};
