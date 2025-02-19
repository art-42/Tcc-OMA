import { Group, GroupResponse } from "@/interfaces/Group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { noteService } from "./noteService";
import { utils } from "@/utils/utils";

const API_URL = 'http://192.168.0.14:5001';
// const API_URL = 'http://10.0.0.16:5001';

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

  updateGroup: async (groupId: string, group: Group): Promise<GroupResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/groups/${groupId}/${userId}`, {
        method: 'PUT',
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

  deleteGroup: async (groupId: string): Promise<GroupResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');

      const response = await fetch(`${API_URL}/groups/${groupId}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete group');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getGroups: async (): Promise<any> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/grupos/get/allGroups/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get groups');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getGroupById: async (id: string): Promise<GroupResponse> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/groups/${id}/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to get group');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  exportGroupById: async (id: string): Promise<string> => {
    try {
      const userId = await AsyncStorage.getItem('idUser');
      const response = await fetch(`${API_URL}/notes/export/${userId}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to get group');
      }

      const file64 = await utils.convertBlobToBase64(await response.blob())

      return noteService.downloadNoteFile(file64, `group-${id}.pdf`)
    } catch (error) {
      throw error;
    }
  },

};
