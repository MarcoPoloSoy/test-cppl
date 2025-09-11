# Proyecto de Prueba Coppel

## 1. Justificación Técnica

### 1.1. Arquitectura de Referencia: Monolítica

Para este proyecto, se decidió implementar una arquitectura monolítica debido a su simplicidad y naturaleza. En este enfoque, todas las funcionalidades de la aplicación —como la autenticación de usuarios, la gestión de catálogos y la agenda de citas— residen en una única base de código.

**Ventajas de esta elección:**

*   **Simplicidad:** La arquitectura monolítica es más sencilla de desarrollar, probar y desplegar en proyectos de esta escala. Permite al equipo de desarrollo enfocarse en la lógica de negocio en lugar de gestionar la comunicación entre múltiples servicios.
*   **Cohesión:** Al tener todo el código centralizado, la comunicación interna entre componentes es más rápida y el mantenimiento se simplifica. Las actualizaciones y la depuración se realizan en un solo repositorio, agilizando el ciclo de desarrollo.

### 1.2. Modelo de Datos

Se optó por un modelo de base de datos relacional para gestionar la información del sistema. A continuación, se describen las tablas principales:

#### `users`
Almacena los datos de acceso de los usuarios.
```sql
id
email
password
role
created_at
```

#### `doctors`
Contiene la información de los médicos.
```sql
id
name
last_name
specialty
phone
user_id -> users.id
```

#### `patients`
Guarda los datos de los pacientes.
```sql
id
names
last_name
birth_date
phone
user_id -> users.id
```

#### `appointments`
Registra la información de las citas médicas.
```sql
id
patient_id -> patients.id
doctor_id -> doctors.id
start_at
end_at
reason
status
created_at
```

> El modelo de datos completo se encuentra en el archivo [01_db.sql](../DB/01_db.sql).

### 1.3. Tecnologías Utilizadas

Las tecnologías fueron seleccionadas con base en su flexibilidad y capacidad para cumplir con los requisitos del proyecto.

*   **Frontend:** `Angular`. Se eligió Angular por ser un framework robusto e ideal para construir interfaces de usuario dinámicas, facilitando el desarrollo de los diferentes módulos requeridos.
*   **Backend:** `Node.js` con `Express`. Proporciona un entorno de ejecución ideal para el desarrollo rápido de la API y los módulos de servidor necesarios.
*   **Base de Datos:** `MySQL`. Es un sistema de gestión de bases de datos relacional, confiable y con un rendimiento óptimo para el manejo de los datos del proyecto.

### 1.4. Estructura General del Proyecto

```plaintext
root/
├── frontend/  (Angular 18 con Material Design)
├── server/    (Node.js con Express)
└── RESOURCES/ (Documentación, scripts de base de datos, etc.)
```

### 1.5. Documentación Adicional

*   **Frontend:** [Detalles en FRONT.md](./FRONT.md)
*   **Backend:** [Detalles en SERVER.md](./SERVER.md)
*   **Instalació:** [Detalles en INSTALL.md](./INSTALL.md)