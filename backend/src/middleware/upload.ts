import multer from "multer";

const storage = multer.memoryStorage(); // Configuração do armazenamento em memória
const upload = multer({ storage }); // Criação do middleware

export default upload;
