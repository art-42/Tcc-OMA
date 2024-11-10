# Adicionando npx no Dockerfile do frontend para rodar expo
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install

# Adiciona os arquivos do frontend
COPY . .

# Comando de inicialização com npx
CMD ["npx", "expo", "start", "--lan"]

