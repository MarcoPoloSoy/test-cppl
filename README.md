# Proyecto de Prueba Coppel: Sistema de Gestión de Citas Médicas

Esta aplicación es un gestor de citas médicas, desarrollado con base en los requerimientos solicitados.

El sistema se centra en un dashboard principal desde donde se tiene acceso a toda la información relevante, organizada de manera intuitiva en un sistema de pestañas.

## Características Principales

### Dashboard Central

La pestaña principal (**Home**) ofrece un resumen de las citas pendientes, clasificadas en:
*   Citas para **hoy**
*   Citas para **mañana**
*   Citas **futuras**

Al hacer clic sobre cualquier cita, se despliega su información detallada, incluyendo datos básicos del doctor y paciente asociados. Desde aquí también se pueden agendar nuevas citas.

Las pestañas adicionales muestran los catálogos de doctores y pacientes en un formato de tarjetas sencillas, sirviendo como un acceso rápido y visual a esta información.

### Gestión de Catálogos (Doctores y Pacientes)

El sistema incluye módulos dedicados para la gestión de doctores y pacientes. La página principal de cada catálogo presenta un listado alfabético y cuenta con un buscador para facilitar la localización de registros.

Funcionalidades disponibles para ambos catálogos:
*   **Crear** nuevos registros.
*   **Ver** el detalle de cada registro.
*   **Editar** la información existente.
*   **Eliminar** registros.

### Diseño y Experiencia de Usuario

El diseño busca un equilibrio entre un estilo clásico y moderno. La interfaz se organiza con:
*   Una **barra lateral principal (sidebar)** a la izquierda para la navegación.
*   Una **barra superior (top bar)** que contiene accesos directos y herramientas.
*   El **contenido principal** que se despliega en el área restante.

### Funcionalidades Adicionales (Extras)

*   **Aplicación Multilenguaje:** Soporte para inglés y español.
*   **Buscador Global:** Permite encontrar información rápidamente desde cualquier parte de la aplicación.
*   **Modo Pantalla Completa (Fullscreen):** Para una experiencia de usuario inmersiva.

## Documentación del Proyecto

Para más detalles sobre la implementación y estructura del proyecto, consulta los siguientes documentos:

*   **[Justificación Técnica (INFO.md)](./RESOURCES/DOCS/INFO.md):** Explica las decisiones de arquitectura y las tecnologías seleccionadas.
*   **[Guía de Instalación (INSTALL.md)](./RESOURCES/DOCS/INSTALL.md):** Instrucciones resumidas para desplegar el frontend y el backend.
*   **[Documentación del Frontend (FRONT.md)](./RESOURCES/DOCS/FRONT.md):** Detalles técnicos sobre la aplicación de Angular.
*   **[Documentación del Backend (SERVER.md)](./RESOURCES/DOCS/SERVER.md):** Detalles técnicos sobre la API de Node.js.