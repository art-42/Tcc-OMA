import { Note, NoteResponse } from "@/interfaces/Note";
import { User, UserResponse } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://192.168.0.14:5001';

export const noteService = {

  createNote: async (note: Note): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  updateNote: async (id : string, note: Note): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      console.log(error)
      throw error;
    }
  },

  getNoteById: async (noteId: string): Promise<NoteResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/notes/${userId}/${noteId}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getNotesByGroup: async (groupId: string): Promise<NoteResponse[]> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/notes/group/${userId}/${groupId}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },


};
