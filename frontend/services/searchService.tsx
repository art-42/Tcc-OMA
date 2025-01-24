import { CategoriesResponse } from "@/interfaces/Category";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://192.168.0.14:5001';
// const API_URL = 'http://10.0.0.16:5001';

export const searchService = {

  search: async (value: string): Promise<CategoriesResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/search/${userId}/${value}`);
      if (!response.ok) {
        throw new Error('Failed to search for results');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

};
