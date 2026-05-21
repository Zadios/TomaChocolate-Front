# Toma Chocolate - Frontend

> "Toma chocolate, paga lo que debes."

¡Bienvenido al repositorio del frontend de **Toma Chocolate**! Esta es la interfaz web de una aplicación diseñada para simplificar y optimizar la división de gastos grupales en juntadas, asados o eventos. El objetivo principal es ofrecer una experiencia de usuario sumamente sencilla, rápida y sólida pero sin dejar de lado funcionalidades en el proceso.

Este proyecto se conecta directamente con el backend desarrollado en Java: [TomaChocolate-API](https://github.com/Zadios/TomaChocolate-API).

* * *

## Características Principales

- **Creación Rápida de Juntadas:** Permite inicializar un evento definiendo el nombre y la cantidad de participantes en segundos.
- **Gestión de Participantes y Gastos:** Añadí, editá o eliminá miembros del grupo y asigná los gastos correspondientes de manera dinámica.
- **Cálculo Inteligente de Saldos:** Automatiza la división de cuentas mostrando de forma clara quién le debe a quién, minimizando las transferencias necesarias.
- **Exportación de Resultados:** Permite copiar el resumen en formato de texto optimizado para WhatsApp o descargar un ticket visual en formato PNG.
- **Sincronización en Tiempo Real:** Cuenta con un sistema de actualización automática (*polling*) para reflejar los cambios realizados por otros usuarios en la misma juntada.

* * *

## Tecnologías Utilizadas

La interfaz de usuario fue desarrollada utilizando el ecosistema moderno de desarrollo web:

- **React** (con TypeScript para un tipado seguro y robusto).
- **Vite** (como empaquetador y entorno de desarrollo ultra rápido).
- **Tailwind CSS** (para el diseño de estilos modular, moderno y adaptativo).
- **React Router DOM** (para la navegación entre pantallas).
- **Lucide React** (para la iconografía del sitio).
- **html-to-image** (para la generación y descarga de la imagen del ticket final).

* * *

## Configuración local (clonar proyecto en otra computadora)

#### 1\. Clonar el repositorio

```bash
git clone https://github.com/Zadios/TomaChocolate-Front.git
cd TomaChocolate-Front
```

#### 2\. Instalar las dependencias:

```bash
npm install
```

#### 3\. Configurar las variables de entorno:

Creá un archivo .env.local en la raíz del proyecto y configurá la URL de tu API local (o de producción):

```bash
VITE_API_URL=http://localhost:8080/api
```

#### 4\. Correr el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173 (o el puerto que indique la consola).

* * *

## Estructura del Proyecto

**src/**  
├── **assets/** Logos, imágenes y vectores  
├── **components/** Componentes reutilizables (Modales, Toast, etc.)  
│ └── **layout/** Componentes estructurales (Header, Footer)  
├── **pages/** Vistas principales de la aplicación (Home, MeetingDetail)  
├── **services/** Configuración de Axios y llamadas a las rutas de la API  
└── **utils/** Funciones de ayuda y manejador de errores global

## Desarrollador
***
- Ariel Viscovich - [LinkedIn](https://www.linkedin.com/in/arielviscovich)