<p align="center"> <a href="https://nestjs.com/" target="_blank"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo"/> </a> </p> <h1 align="center"> API de Productos - NestJS</h1> <p align="center">Una API RESTful para la gestión de productos, desarrollada con <strong>NestJS</strong> y <strong>TypeORM</strong>, con soporte para paginación, manejo de imágenes y control de errores.</p>

# Características
- CRUD completo para productos
- Soporte para imágenes asociadas
- Búsqueda por UUID, título o slug
- Paginación con DTOs personalizados
- Manejo de errores con excepciones personalizadas
- Integración con base de datos PostgreSQL
- Preparada para Docker con docker-compose

# Características
- NestJS
- TypeORM
- PostgreSQL
- Docker / Docker Compose

# Ejecutar en desarrollo
 1. Clonar el repositorio

 2. Ejecutar el comando 
 ```
  npm i
 ```

 3. Instalar Nest CLI
 ```
  npm i -g @nestjs/cli
 ```

 4. Levantar la BD
 ```
  docker-compose up -d
 ```

 5. Ejecutar el entorno de desarrollo
 ```
  npm run start:dev
 ```

 6. Cargar la base de datos
 ```
  http://localhost:3000/api/seed
 ```



