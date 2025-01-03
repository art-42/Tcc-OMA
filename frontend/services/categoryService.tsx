import { CategoriesResponse, Category } from "@/interfaces/Category";
import { Note, NoteResponse } from "@/interfaces/Note";
import { User, UserResponse } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://192.168.0.14:5001';
// const API_URL = 'http://10.0.0.16:5001';

export const categoryService = {

  createCategory: async (category: Category): Promise<any> => {
    try {
      const id = await AsyncStorage.getItem('idUser');

      if(id){
        category.userId = id;
      }
      const response = await fetch(`${API_URL}/category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create category');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/categories/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateCategory: async (id : string, category: Category): Promise<any> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      if(userId){
        category.userId = userId;
      }
      const response = await fetch(`${API_URL}/category/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  deleteCategory: async (id: string): Promise<NoteResponse> => {
    try {

      const response = await fetch(`${API_URL}/category/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  searchCategories: async (value: string): Promise<CategoriesResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/searchCategories/${userId}/${value}`);
      if (!response.ok) {
        throw new Error('Failed to search for category');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

};
