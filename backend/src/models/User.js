const mongoose = require('mongoose');

// Schema do Usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Para criar automaticamente os campos createdAt e updatedAt
});

// Exportando o modelo
module.exports = mongoose.model('User', UserSchema);
