export interface User {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface UserResponse {
  message: string,
  user: {
    name: string,
    email: string,
    password: string,
  },
}
    
  