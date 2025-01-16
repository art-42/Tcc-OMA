import { Note, NoteResponse } from "@/interfaces/Note";
import { User, UserResponse } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import { StorageAccessFramework } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';


const API_URL = 'http://192.168.0.14:5001';

const convertBlobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob); // This will return a base64-encoded string
  });
};

const getExtensionFromType= (type: string): string => {

  // Mapping of MIME types to file extensions
  const mimeTypeToExtension: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/zip': '.zip',
    // Add more MIME types as needed
  };

  // Return the corresponding extension or '.bin' if MIME type is not in the map
  return mimeTypeToExtension[type] || '.bin';
};

const getTypeFromBase64 = (base64Data: string): string => {
  // Extract MIME type from the base64 data
  return base64Data.split(';')[0].split(':')[1];

};

const getMimeTypeFromUri = (uri: string): string => {
  // Mapping of common file extensions to MIME types
  const extensionToMimeType: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.zip': 'application/zip',
    // Add more extensions as needed
  };

  // Extract the file extension from the URI
  const extension = uri.slice(uri.lastIndexOf('.'));

  // Return the corresponding MIME type or 'application/octet-stream' if extension is not found
  return extensionToMimeType[extension] || 'application/octet-stream';
};



export const noteService = {

  createNote: async (note: Note): Promise<any> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');

      let file64 = undefined;

      if (note.fileUri) {
        const fetchedFile = await fetch(note.fileUri);
        const blob = await fetchedFile.blob();

        file64 = await convertBlobToBase64(blob);

      }

      // Create the Note object with the required structure
      const noteValue = {
        title: note.title,
        type: note.type,
        groupId: note.groupId,
        content: file64 ?? note.text, // Attach the FormData as content
      };

      const response = await fetch(`${API_URL}/notes/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

      let file64 = undefined;

      if (note.fileUri) {
        const fetchedFile = await fetch(note.fileUri);
        const blob = await fetchedFile.blob();

        file64 = await convertBlobToBase64(blob);

      }

      // Create the Note object with the required structure
      const noteValue = {
        title: note.title,
        type: note.type,
        groupId: note.groupId,
        content: file64 ?? note.text, // Attach the FormData as content
      };

      const response = await fetch(`${API_URL}/notes/${userId}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

  downloadNoteFile: async (noteId: string): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      if (!userId) {
        throw new Error('User not found in AsyncStorage');
      }
  
      const fileUrl = `${API_URL}/notes/download/${noteId}/${userId}/file`;
  
      const response = await fetch(fileUrl,{
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const json =  await response.json();
          
      const base64Data = json.content.split(',')[1];

      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        throw new Error('Sem permissão');

      }

      const directoryUri = permissions.directoryUri;
      if (!directoryUri) {
        throw new Error('Falha');

      }

      const type = getTypeFromBase64(json.content)
      const extension = getExtensionFromType(type)

      const uri = await StorageAccessFramework.createFileAsync(
        directoryUri, 
        `teste${extension}`, 
        type
      );

      await FileSystem.writeAsStringAsync(uri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: uri,
        flags: 1,
        type: type,
      });
  
      return uri;
    } catch (error) {
      console.error('Error downloading the note file:', error);
      throw error;
    }
  },

  openNoteFile: (fileUri: string): void => {
      const type = getMimeTypeFromUri(fileUri);

      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: fileUri,
        flags: 1,
        type: type,
      });
  },
};
