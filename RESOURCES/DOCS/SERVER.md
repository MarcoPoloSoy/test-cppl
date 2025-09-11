# Servidor con Node.js y Express

### Estructura de Directorios

La estructura propuesta para el backend es la siguiente:

```plaintext
root/
└── server/
    ├── server.js       # Archivo principal del servidor
    ├── config/         # Archivos de configuración (ej. conexión a BD)
    ├── controllers/    # Lógica de negocio de las rutas
    ├── data/           # Datos estáticos o mocks
    ├── middleware/     # Middlewares de Express (ej. autenticación)
    └── routes/         # Definición de las rutas de la API

```

### Inicialización del proyecto

Desde la raíz del proyecto, acceder al directorio `server`:

```bash
cd server
```

### Instalación de dependencias

A continuación se listan las dependencias principales del proyecto:

*   **`express`**: Framework para la creación del servidor y la administración de rutas.
*   **`mysql2`**: Driver para la conexión con la base de datos MySQL.
*   **`jsonwebtoken`**: Manejo de JSON Web Tokens (JWT) para la autenticación.
*   **`bcrypt`**: Librería para el hasheo de contraseñas.
*   **`cors`**: Middleware para habilitar el Cross-Origin Resource Sharing (CORS).
*   **`dotenv`**: Módulo para la gestión de variables de entorno desde un archivo `.env`.

Para instalar todas las dependencias, ejecutar el siguiente comando:

```bash
npm install express mysql2 jsonwebtoken bcrypt cors dotenv
```

### Configuración de variables de entorno
Configurar la base de datos y la llave JWT en el archivo `.env`.


### Ejecución del servidor

Para iniciar el servidor:
```bash
node server.js
```