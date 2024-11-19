const User = require('../models/User');
const bcrypt = require('bcrypt');

// Criar Usuário
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'E-mail já registrado.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao registrar o usuário.', error });
  }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar os usuários.', error });
  }
};

// Buscar um usuário pelo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar o usuário.', error });
  }
};

// Atualizar Usuário
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

    // Atualizar os campos
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o usuário.', error });
  }
};

// Deletar Usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.status(200).json({ message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o usuário.', error });
  }
};
