import * as FileSystem from 'expo-file-system';

export const utils = {
  clearCache: async () => {
    const cacheDirectory = FileSystem.cacheDirectory;
    if(cacheDirectory){
      try {
        const files = await FileSystem.readDirectoryAsync(cacheDirectory);
        for (const file of files) {
          const fileUri = cacheDirectory + file;
          await FileSystem.deleteAsync(fileUri, { idempotent: true });
        }
      } catch (error) {
        console.log('Error clearing cache:', error);
      }
    } 
  },
  
  convertBlobToBase64: async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

