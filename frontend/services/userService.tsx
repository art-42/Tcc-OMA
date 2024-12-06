import { User, UserResponse } from "@/interfaces/User";

// The base URL of your API
const API_URL = 'http://10.0.0.16:5001';

export const userService = {

  loginUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
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
      throw error;
    }
  },

  // Create a new user (POST)
  createUser: async (user: User): Promise<UserResponse> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
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
      const response = await fetch(`${API_URL}/${user.id}`, {
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
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error('Failed to get user');
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },


};
