export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface UserResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    password?: string;
  };
}

    
  