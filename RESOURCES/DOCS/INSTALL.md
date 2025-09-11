# Instalación y Configuración del Proyecto

Este documento detalla los pasos necesarios para instalar y configurar el proyecto de prueba de Coppel.

## Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu sistema:

*   **Node.js**: Versión 20.x. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
*   **npm**: Se instala automáticamente con Node.js.
*   **MySQL**: Versión 8.x o superior. Puedes descargarlo desde [mysql.com](https://www.mysql.com/downloads/).
*   **Git**: Para clonar el repositorio.


## Pasos de Instalación

1.  **Clonar el Repositorio**

    Abre tu terminal y ejecuta el siguiente comando para clonar el repositorio del proyecto:

    ```bash
    git clone https://github.com/MarcoPoloSoy/test-cppl.git
    cd coppel-project
    ```
    

2.  **Configuración de la Base de Datos**

    *   Crea una base de datos MySQL. Puedes usar un cliente como MySQL Workbench o la línea de comandos. Por ejemplo:

        ```sql
        CREATE DATABASE coppel_db;
        ```

    *   Importa el esquema y los datos iniciales. Los scripts SQL se encuentra en `RESOURCES/DB/`.

        ```bash
        mysql -u tu_usuario -p coppel_db < RESOURCES/DB/01_db.sql
        
        ```
        Se te pedirá la contraseña de tu usuario de MySQL.

    *   Si se quiere agregar información dummy
        
        ```sql
        mysql -u tu_usuario -p coppel_db < RESOURCES/DB/02_seed_doctors_patients.sql

        mysql -u tu_usuario -p coppel_db < RESOURCES/DB/
        03_seed_appointments.sql

        ``` 

3.  **Configuración del Frontend**

    *   Navega al directorio `frontend`:

        ```bash
        cd frontend
        ```

    *   Instala las dependencias de Node.js:

        ```bash
        npm install
        ```

    *   Para compilar la aplicación para producción, ejecuta:

        ```bash
        npm run build
        ```
    
    *   Si se necesita cambiar la url de la api, el cambio se hace en el archivo `src/environments/environment.ts`, cualquier cambio en el front requiere que se compile de nuevo la app.


4.  **Configuración del Backend (Server)**

    *   Navega al directorio `server`:

        ```bash
        cd server
        ```

    *   Instala las dependencias de Node.js:

        ```bash
        npm install
        ```

    *   Crea un archivo `.env` en el directorio `server` y configura las variables de entorno necesarias. Un ejemplo de `.env` podría ser:

        ```
        # Variables de entorno para la Base de Datos
        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=secret
        DB_NAME=coppel_test

        # Secreto para firmar los JSON Web Tokens
        JWT_SECRET=06d20f7cdbf72df8a22aa55a04df93e8

        # Puerto para el servidor
        PORT=3000
        ```
    *   Para ejecutar el servidor con el front ejecute:

        ```bash
        node server.js
        ```
        Si no da error, el desarrollo se podrá ver en la url http://localhost:3000/

    



