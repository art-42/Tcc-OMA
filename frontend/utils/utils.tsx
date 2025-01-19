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
        console.log(await FileSystem.readDirectoryAsync(cacheDirectory));
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    } 
  }
}

