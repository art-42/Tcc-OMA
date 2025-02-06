# 📘 Projeto de TCC: OMA - organizador multimídia acadêmico

Este repositório contém o código-fonte do projeto desenvolvido como Trabalho de Conclusão de Curso (TCC). O sistema tem como objetivo auxiliar estudantes na organização de suas anotações acadêmicas, permitindo o armazenamento de notas em diferentes formatos, como texto, foto e desenho.

## 🚀 Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias:

- **Frontend:** React Native (com Expo)
- **Backend:** Node.js com Express
- **Banco de Dados:** MongoDB (MongoDB Atlas)

## 🏛️ Arquitetura do Projeto

O sistema segue uma arquitetura baseada em **MVC**, composta pelos seguintes componentes:

- **Frontend :** Interface desenvolvida com React Native para acesso ao sistema.
- **Backend :** Servidor em Node.js que gerencia usuários, arquivos e anotações e faz comunicação com o banco de dados.
- **Banco de Dados:** MongoDB para armazenar as informações estruturadas.

## 🛠️ Como Rodar o Projeto

### 🔧 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
- Docker e Docker Compose
- Node.js 
- NPM ou Yarn
- Expo CLI
- Doc
- MongoDB Atlas

### 📌 Passos para Configuração

1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/seu-repositorio.git](https://github.com/art-42/Tcc-OMA.git)
   cd seu-repositorio
   ```
2. Instale as dependências do backend:
   ```sh
   cd backend
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do backend e adicione as credenciais:
     ```env
     MONGO_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/
     ```
4. Inicie o backend com Docker Compose:
   ```sh
   cd backend
    docker-compose up --build
   ```
5. Instale as dependências do frontend:
   ```sh
   cd ../frontend
   npm install
   ```
6. Inicie o Expo para rodar o aplicativo mobile:
   ```sh
   npx expo start
   ```


## 📜 Licença

Este projeto é de uso acadêmico e foi desenvolvido como parte do Trabalho de Conclusão de Curso. Caso tenha interesse em contribuir ou adaptar o código, entre em contato.

---

✉️ **Contato**: 
- Luíza Esteves: luizaesteves987@gmail.com
- Artur de Sousa: 
