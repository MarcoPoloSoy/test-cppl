# Frontend con Angular

### Estructura de Directorios

La estructura propuesta para el frontend es la siguiente:

```plaintext
frontend/
└── src/
    ├── @mpgr/
    ├── app/
    │   ├── core/
    │   │   ├── auth/
    │   │   ├── icons/
    │   │   ├── navigation/
    │   │   ├── transloco/
    │   │   └── user/
    │   ├── layout/
    │   │   ├── common/
    │   │   └── layouts/
    │   └── modules/
    │       ├── admin/
    │       │   ├── dashboards/
    │       │   │   └── appointments/
    │       │   └── catalogs/
    │       │       ├── doctors/
    │       │       └── patients/
    │       ├── auth/
    │       └── landing/
    │
    └── styles/
```

### Compilación Local

Sigue estos pasos para compilar el proyecto en tu entorno local.

#### 1. Requisitos Previos

Asegúrate de tener instaladas las siguientes versiones:

```
Node: 20.19.5
Package Manager: npm 10.8.2
```

#### 2. Instalación de Dependencias

Desde la raíz del proyecto, navega al directorio `frontend` e instala las dependencias.

```bash
cd frontend
npm install
```

#### 3. Compilación

Compila la aplicación para el entorno de producción.

```bash
npm run build
```

La aplicación compilada se generará en el directorio `frontend/dist/mpgr/browser`.

> **Nota Importante:**
> Si necesitas cambiar la URL de la API, debes modificar el archivo `src/environments/environment.ts`. Recuerda que cualquier cambio en el código fuente del frontend requiere una nueva compilación.
