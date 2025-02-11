import { registerUser,loginUser, updateUser } from '../controllers/userController';
import User from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

jest.mock('../models/User');
jest.mock('bcryptjs');

describe('User Controller - Register User', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockReq = {
      body: { name: 'Test User', email: 'test@example.com', password: 'password123' }
    };
    mockRes = {
      status: statusMock,
      json: jsonMock
    };
  });

  it('Deve retornar erro ao tentar registrar um e-mail já existente', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(true);
    await registerUser(mockReq as Request, mockRes as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Email is already in use' });
  });

  it('Deve retornar erro se ocorrer uma falha no servidor', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
    await registerUser(mockReq as Request, mockRes as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Error registering user', error: new Error('Database error') });
  });

  it('Deve retornar erro ao tentar logar com um usuário não encontrado', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);

    await loginUser(mockReq as Request, mockRes as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('Deve retornar erro ao tentar logar com credenciais inválidas', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({
      _id: '12345',
      name: 'Test User',
      email: 'test@example.com',
      password: '$2a$10$5qLkX0dSK8xKqMlU3/YjC.AZ0Y4u1Zt/DwZZRI9B9OL9vJ9Lh7YXO' // senha criptografada
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await loginUser(mockReq as Request, mockRes as Response);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', expect.any(String));
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('Deve retornar erro ao tentar atualizar um usuário não encontrado', async () => {
    mockReq = {
      params: { id: 'invalidUserId' },
      body: { name: 'Updated User', email: 'updated@example.com', password: 'newpassword123' }
    };
  
    (User.findById as jest.Mock).mockResolvedValue(null);
  
    await updateUser(mockReq as Request, mockRes as Response);
  
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('Deve atualizar o usuário com sucesso', async () => {
    mockReq = {
      params: { id: '12345' }, 
      body: { name: 'Updated User', email: 'updated@example.com', password: 'newpassword123' },
    };
  
    (User.findById as jest.Mock).mockResolvedValue({
      _id: '12345',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      save: jest.fn().mockResolvedValue({
        _id: '12345',
        name: 'Updated User',
        email: 'updated@example.com',
      }),
    });
  
    await updateUser(mockReq as Request, mockRes as Response);
  
    expect(User.findById).toHaveBeenCalledWith('12345');
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'User updated successfully',
      user: {
        id: '12345',
        name: 'Updated User',
        email: 'updated@example.com',
      },
    });
  });
  
  
});
