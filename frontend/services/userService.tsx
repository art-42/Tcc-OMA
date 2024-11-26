import { User } from "@/interfaces/User";

// The base URL of your API
const API_URL = 'https://jsonplaceholder.typicode.com/users';

export const userService = {
//   // Fetch all users (GET)
//   getUsers: async (): Promise<User[]> => {
//     try {
//       const response = await fetch(API_URL);
//       if (!response.ok) {
//         throw new Error('Failed to fetch users');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       throw error;
//     }
//   },

//   // Get a user by ID (GET)
//   getUserById: async (id: number): Promise<User> => {
//     try {
//       const response = await fetch(`${API_URL}/${id}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch user with id ${id}`);
//       }
//       return await response.json();
//     } catch (error) {
//       console.error(`Error fetching user with id ${id}:`, error);
//       throw error;
//     }
//   },

  // Create a new user (POST)
  createUser: async (user: Omit<User, 'id'>): Promise<User> => {
    try {
      const response = await fetch(API_URL, {
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
      console.error('Error creating user:', error);
      throw error;
    }
  },

//   // Update an existing user (PUT)
//   updateUser: async (user: User): Promise<User> => {
//     try {
//       const response = await fetch(`${API_URL}/${user.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to update user');
//       }
//       return await response.json();
//     } catch (error) {
//       console.error('Error updating user:', error);
//       throw error;
//     }
//   },

//   // Delete a user (DELETE)
//   deleteUser: async (id: number): Promise<void> => {
//     try {
//       const response = await fetch(`${API_URL}/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error(`Failed to delete user with id ${id}`);
//       }
//     } catch (error) {
//       console.error(`Error deleting user with id ${id}:`, error);
//       throw error;
//     }
//   },
};
