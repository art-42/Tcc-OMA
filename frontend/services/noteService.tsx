import { Note, NoteResponse } from "@/interfaces/Note";
import { User, UserResponse } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://192.168.0.14:5001';

export const noteService = {

  createNote: async (note: Note): Promise<any> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');

      let formData = undefined

      if (note.fileUri) {
        const fetchedFile = await fetch(note.fileUri);
        const blob = await fetchedFile.blob();

        // Create the FormData object
        formData = new FormData();

        // Append the file as a Blob to the FormData object
        formData.append('file', blob, 'uploaded-file'); // 'uploaded-file' can be replaced by the actual file name
      }

      // Create the Note object with the required structure
      const noteValue = {
        title: note.title,
        groupId: note.groupId,
        content: formData ?? note.text, // Attach the FormData as content
      };

      const response = await fetch(`${API_URL}/notes/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': note.fileUri ? 'multipart/form-data' : 'application/json',
        },
        body: JSON.stringify(noteValue),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateNote: async (id : string, note: Note): Promise<any> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');

      let formData = new FormData();

      if (note.fileUri) {
        const fetchedFile = await fetch(note.fileUri);
        const blob = await fetchedFile.blob();

        // Append the file as a Blob to the FormData object
        formData.append('file', blob, 'uploaded-file'); // 'uploaded-file' can be replaced by the actual file name
      }

      // Create the Note object with the required structure
      const noteValue = {
        title: note.title,
        groupId: note.groupId,
        content: formData ?? note.text, // Attach the FormData as content
      };

      const response = await fetch(`${API_URL}/notes/${userId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': note.fileUri ? 'multipart/form-data' : 'application/json',
        },
        body: JSON.stringify(noteValue),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
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

  deleteNote: async (noteId: string): Promise<NoteResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/notes/${userId}/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

};
