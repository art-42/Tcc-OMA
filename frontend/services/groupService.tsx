import { Group, GroupResponse, GroupsResponse } from "@/interfaces/Group";
import { User, UserResponse } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = 'http://192.168.0.14:5001';

export const groupService = {

  // Create a new user (POST)
  createGroup: async (group: Group): Promise<GroupResponse> => {
    try {
      const id = await AsyncStorage.getItem('idUser');
      if(id){
        group.userId = id;
      }
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Create a new user (POST)
  getGroupsByCategory: async (): Promise<GroupsResponse> => {
    try {
      const categoryId = "676dd3208ef78e9739363744"
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/groups/${categoryId}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

};
