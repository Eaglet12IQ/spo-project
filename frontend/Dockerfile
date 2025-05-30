# Сборка Vue + Vite (и финальный контейнер тоже)
FROM node:20

WORKDIR /app

# Копируем package*.json из подкаталога frontend/
COPY frontend/package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем весь frontend-код
COPY frontend/ ./

# Открываем порт, на котором работает vite preview
EXPOSE 3000

# Запускаем preview-сервер Vite
CMD ["npm", "run", "dev"]
