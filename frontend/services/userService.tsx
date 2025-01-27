import { User, UserResponse } from "@/interfaces/User";
import { Alert } from "react-native";

const API_URL = 'http://192.168.0.14:5001';

export const userService = {

  loginUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      return await response.json();
    } catch (error) {
      console.log('Error on login', error)
    }
  },

  // Create a new user (POST)
  createUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Create a new user (POST)
  getUser: async (id: string): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/user/${id}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },


};
