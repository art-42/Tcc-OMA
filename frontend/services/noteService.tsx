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
  const extensionToMimeType: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.zip': 'application/zip',
  };

  const extension = uri.slice(uri.lastIndexOf('.'));

  return extensionToMimeType[extension] || 'application/octet-stream';
};

async function createDirectoryIfNotExists(directoryUri: string) {
  const dirInfo = await FileSystem.getInfoAsync(directoryUri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }
};

async function clearSavedDirectory(directoryUri: string) {
  const files = await FileSystem.readDirectoryAsync(directoryUri);

  for (const file of files) {
    const fileUri = `${directoryUri}${file}`;
    await FileSystem.deleteAsync(fileUri);
  }
}


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
        fileName: note.fileName,
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
        fileName: note.fileName,
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

  downloadNoteFile: async (base64: string): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      if (!userId) {
        throw new Error('User not found in AsyncStorage');
      }
            
      const base64Data = base64.split(',')[1];

      const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        throw new Error('Sem permissão');

      }

      const directoryUri = permissions.directoryUri;
      if (!directoryUri) {
        throw new Error('Falha');

      }

      const type = getTypeFromBase64(base64)
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

  viewNoteFile: async (base64: string): Promise<string> => {
    try {
      const base64Data = base64.split(',')[1];
  
      const cacheDirectory = FileSystem.cacheDirectory;
  
      if (!cacheDirectory) {
        throw new Error('Failed to get the document directory');
      }

      createDirectoryIfNotExists(`${cacheDirectory}noteFiles`)

      await clearSavedDirectory(`${cacheDirectory}noteFiles/`);
  
      const type = getTypeFromBase64(base64);
      const extension = getExtensionFromType(type);
  
      const timestamp = Date.now();
      const fileUri = `${cacheDirectory}noteFiles/${timestamp}${extension}`;
  
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const contentUri = await FileSystem.getContentUriAsync(fileUri);
  
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1,
        type: type,
      });

      console.log(await FileSystem.readDirectoryAsync(`${cacheDirectory}noteFiles`));
  
      return fileUri;
    } catch (error) {
      console.error('Error downloading the note file:', error);
      throw error;
    }
  },

  openNoteFile: async (fileUri: string, isFileUri?: boolean): Promise<void> => {
      const type = getMimeTypeFromUri(fileUri);

      if(isFileUri){
        fileUri = await FileSystem.getContentUriAsync(fileUri);
      }

      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: fileUri,
        flags: 1,
        type: type,
      });
  },

  getFileUri: async (base64: string): Promise<string> =>{
    const base64Data = base64.split(',')[1]; // Remove data URI part
  
  // Use the app's document directory
  const cacheDirectory = FileSystem.cacheDirectory;

  if (!cacheDirectory) {
    throw new Error('Failed to get the document directory');
  }

  createDirectoryIfNotExists(`${cacheDirectory}noteFiles`)

  await clearSavedDirectory(`${cacheDirectory}noteFiles/`);

  const type = getTypeFromBase64(base64);
  const extension = getExtensionFromType(type);

  const timestamp = Date.now();

  const fileUri = `${cacheDirectory}noteFiles/${timestamp}${extension}`;

  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  console.log(await FileSystem.readDirectoryAsync(`${cacheDirectory}noteFiles`));

  return fileUri;
  }
};
