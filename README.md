# Descripcion

## Correr en Dev

1. Clonar el directorio
2. Crear una copia del ```.env``` y renombrarlo a ```.env.template``` 
    y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migracines de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. Correr el proyecto ```npm run dev```
8. Limpiar el localStorage del navegador


## Correr en Prod