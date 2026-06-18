# Frontend - Mundo Dev

Frontend de **Mundo Dev**, una plataforma web para la gestión, difusión y comercialización de cursos digitales.

La aplicación fue desarrollada con **React** y **Vite**, y consume una API REST desarrollada con Node.js, Express y MongoDB.

## Descripción del sistema

Mundo Dev permite que los usuarios exploren cursos digitales, se registren, inicien sesión, agreguen cursos al carrito, completen el checkout, realicen compras y accedan a los cursos adquiridos.

Además, cuenta con un panel administrativo desde el cual se pueden gestionar cursos, usuarios, compras, pagos y mensajes de contacto.

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- Axios
- Context API
- LocalStorage
- CSS modular por páginas y componentes

## Funcionalidades principales

### Funcionalidades públicas

- Página de inicio.
- Catálogo de cursos.
- Detalle de curso.
- Blog o publicaciones.
- Página “Sobre nosotros”.
- Formulario de contacto.
- Registro de usuario.
- Inicio de sesión.
- Recuperación de contraseña.
- Restablecimiento de contraseña mediante token.

### Funcionalidades del cliente

- Persistencia de sesión.
- Protección de rutas privadas.
- Perfil de usuario.
- Carrito de compras.
- Agregar cursos al carrito.
- Eliminar cursos del carrito.
- Vaciar carrito.
- Visualización del total.
- Checkout.
- Carga de datos de facturación.
- Selección de método de pago.
- Compra mediante transferencia bancaria.
- Visualización de pago pendiente.
- Consulta de compras realizadas.
- Visualización del detalle de cada compra.
- Acceso a cursos adquiridos.
- Visualización del progreso del curso.

### Funcionalidades del administrador

- Dashboard administrador.
- Gestión de cursos.
- Creación de cursos.
- Edición de cursos.
- Publicación de cursos.
- Ocultamiento de cursos como baja lógica.
- Recuperación de cursos ocultos.
- Gestión de usuarios.
- Bloqueo y reactivación de usuarios.
- Cambio de roles.
- Gestión de compras.
- Cambio de estado de compras.
- Notificación del estado de compra por email.
- Gestión de pagos.
- Gestión de mensajes de contacto.
- Respuesta a mensajes de contacto con envío de email al usuario.

## Adaptación a cursos digitales

El sistema está adaptado a la venta de cursos digitales.

Por este motivo, el producto comercializado dentro de la plataforma es el **curso digital**. A diferencia de una tienda de productos físicos, no se manejan cantidades en el carrito ni stock físico tradicional.

Cada curso puede ser adquirido una sola vez por usuario. El control equivalente al stock se realiza mediante la habilitación del acceso digital al curso. Una vez confirmada la compra, el usuario puede acceder al contenido desde la sección **Mis cursos**.

La baja lógica de productos se implementa mediante el estado del curso:

- **PUBLICADO:** visible para los usuarios.
- **BORRADOR:** cargado en el sistema, pero aún no publicado.
- **OCULTO:** dado de baja lógicamente, no visible al público, pero recuperable desde el panel administrador.

La baja lógica de usuarios se implementa mediante el estado de la cuenta:

- **ACTIVO:** usuario habilitado.
- **BLOQUEADO:** usuario dado de baja o deshabilitado temporalmente, con posibilidad de reactivación.

## Estructura del proyecto

```bash
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Instalación

Ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

## Ejecución en desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación se ejecuta por defecto en:

```text
http://localhost:5173
```

## Build de producción

Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos generados se ubican en la carpeta:

```bash
dist/
```

## Vista previa de producción

Para previsualizar la versión generada:

```bash
npm run preview
```

## Configuración de conexión con backend

El frontend consume la API del backend mediante Axios.

El backend debe estar ejecutándose en:

```text
http://localhost:3000
```

En caso de utilizar una variable de entorno para configurar la URL de la API, se puede definir un archivo `.env` en el frontend con una variable similar a:

```env
VITE_API_URL=http://localhost:3000
```

## Rutas principales

### Rutas públicas

/
/cursos
/cursos/:id
/blog
/nosotros
/contactos
/login
/registro
/recuperar-contrasenia
/restablecer-contrasenia/:token

````

### Rutas privadas de cliente

```text
/carrito
/checkout
/mis-compras
/mis-cursos
/perfil
/pago-pendiente
/pago-exitoso
/pago-fallido
````

### Rutas administrativas

```text
/admin
/admin/cursos
/admin/usuarios
/admin/compras
/admin/pagos
/admin/mensajes
```

## Manejo de estado

El frontend utiliza **Context API** para manejar estado global, principalmente relacionado con el carrito de compras.

También utiliza **localStorage** para persistir datos básicos de sesión, como el token JWT, el rol y la información del usuario autenticado.

## Protección de rutas

El sistema diferencia rutas públicas, rutas privadas de cliente y rutas administrativas.

- Las rutas privadas requieren que el usuario esté autenticado.
- Las rutas administrativas requieren autenticación y rol de administrador.
- Si un usuario no autorizado intenta acceder a una ruta protegida, es redirigido según corresponda.

## Pruebas realizadas

Se verificaron los siguientes flujos principales:

- Registro de usuario.
- Inicio de sesión.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Visualización del catálogo de cursos.
- Visualización del detalle de curso.
- Agregado de cursos al carrito.
- Eliminación de cursos del carrito.
- Vaciado de carrito.
- Checkout con datos de facturación.
- Generación de compra por transferencia bancaria.
- Visualización de pago pendiente.
- Consulta de compras realizadas.
- Visualización del detalle de compra.
- Acceso a cursos adquiridos.
- Gestión de cursos desde el panel administrador.
- Baja lógica y recuperación de cursos.
- Gestión de usuarios desde el panel administrador.
- Bloqueo y reactivación de usuarios.
- Administración de compras.
- Cambio de estado de compras.
- Envío y respuesta de mensajes de contacto.
- Build de producción con Vite.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
```

## Repositorio

```text
https://github.com/silvia071/Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales.git
```
