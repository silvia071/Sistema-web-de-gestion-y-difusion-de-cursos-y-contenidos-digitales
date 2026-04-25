# Frontend - Proyecto Final (React + Vite)

## Descripción

Este es el frontend de la aplicación web del proyecto final, desarrollado con **React** y **Vite**. Proporciona la interfaz de usuario para la plataforma de cursos en línea, incluyendo autenticación, gestión de cursos, carrito de compras y pagos con Mercado Pago.

Esta plantilla proporciona una configuración mínima para hacer funcionar React en Vite con HMR (Hot Module Replacement) y algunas reglas de ESLint.

## Tecnologías Utilizadas

- **React 19** - Framework de JavaScript para interfaces de usuario
- **Vite** - Herramienta de desarrollo rápida y moderna
- **React Router DOM** - Enrutamiento para aplicaciones React
- **ESLint** - Linting y formateo de código

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/)

## Instalación

### Prerrequisitos

- **Node.js** versión 18 o superior
- **npm** o **yarn** instalado

### Pasos de Instalación

1. **Navega a la carpeta frontend**:
   ```bash
   cd frontend
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno** (opcional):
   - Crea un archivo `.env` en la raíz de `frontend/` si necesitas variables específicas
   - Ejemplo: `VITE_API_URL=http://localhost:3000`

## Configuración

### Conexión con el Backend

El frontend se conecta con el backend a través de la API. Asegúrate de que:

1. El backend esté corriendo en `http://localhost:3000` (o la URL configurada)
2. Las rutas de la API estén correctamente configuradas en `src/config/api.js`

### Variables de Entorno

Si necesitas configurar variables de entorno, crea un archivo `.env` en la raíz del frontend:

```bash
# Archivo: .env (ubicado en: frontend/.env)

# URL de la API del backend
VITE_API_URL=http://localhost:3000

# Otras variables específicas del frontend
VITE_APP_NAME=Proyecto Final
```

## Ejecución

### Modo Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5173` por defecto.

### Build de Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

### Vista Previa de Producción

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```

## Estructura del Proyecto

```
frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Imágenes, estilos, etc.
│   ├── components/        # Componentes reutilizables
│   │   ├── common/        # Componentes comunes
│   │   ├── layout/        # Componentes de layout
│   │   └── Blog.jsx       # Componente específico
│   ├── config/            # Configuraciones (API, etc.)
│   ├── context/           # Contextos de React (Auth, etc.)
│   ├── layouts/           # Layouts de la aplicación
│   ├── pages/             # Páginas/componentes de rutas
│   ├── routes/            # Configuración de rutas
│   ├── services/          # Servicios (llamadas a API)
│   ├── styles/            # Estilos globales
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
├── vite.config.js         # Configuración de Vite
├── eslint.config.js       # Configuración de ESLint
└── README.md              # Este archivo
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run lint` - Ejecuta ESLint para verificar el código
- `npm run preview` - Previsualiza la versión de producción

## Desarrollo

### Linting

Para mantener la calidad del código, ejecuta ESLint regularmente:

```bash
npm run lint
```

### Convenciones de Código

- Usa componentes funcionales con hooks
- Mantén la estructura de carpetas organizada
- Usa nombres descriptivos para componentes y archivos
- Sigue las mejores prácticas de React

## React Compiler

El React Compiler no está habilitado en esta plantilla debido a su impacto en el rendimiento de desarrollo y construcción. Para agregarlo, consulta [esta documentación](https://react.dev/learn/react-compiler/installation).

## Expandiendo la Configuración de ESLint

Si estás desarrollando una aplicación de producción, recomendamos usar TypeScript con reglas de linting conscientes de tipos habilitadas. Consulta la [plantilla TS](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) para información sobre cómo integrar TypeScript y [`typescript-eslint`](https://typescript-eslint.io) en tu proyecto.

## Troubleshooting

### "Error: Cannot resolve module"
- Asegúrate de que todas las dependencias estén instaladas: `npm install`
- Verifica que no haya errores de sintaxis en los imports

### "Error: Port 5173 is already in use"
- Cambia el puerto en `vite.config.js` o mata el proceso que usa el puerto
- En Windows: `netstat -ano | findstr :5173` y luego `taskkill /PID <PID> /F`

### "Error: Failed to fetch" (API)
- Verifica que el backend esté corriendo
- Confirma la URL de la API en `src/config/api.js`
- Revisa la consola del navegador para errores de CORS

### Problemas con React Router
- Asegúrate de que las rutas estén correctamente configuradas en `src/routes/`
- Verifica que los componentes de página existan

### ESLint Errors
- Ejecuta `npm run lint` para ver los errores específicos
- Corrige los problemas de linting antes de hacer commit

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios
3. Ejecuta los tests y linting: `npm run lint`
4. Crea un commit descriptivo
5. Push a tu rama y crea un Pull Request

## Licencia

Este proyecto es privado y confidencial.
