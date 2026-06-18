# Mundo Dev

**Mundo Dev** es una plataforma web para la gestión, difusión y comercialización de cursos digitales.

El proyecto fue desarrollado como una aplicación full stack con arquitectura cliente-servidor. El frontend fue implementado con **React + Vite**, mientras que el backend fue desarrollado con **Node.js**, **Express.js** y **MongoDB** mediante **Mongoose**.

La plataforma permite que los usuarios exploren cursos, se registren, inicien sesión, agreguen cursos al carrito, realicen una compra y accedan a los contenidos adquiridos. Además, cuenta con un panel administrador para gestionar cursos, usuarios, compras, pagos, mensajes y contenidos asociados.

---

## Descripción general

Mundo Dev simula una tienda online adaptada al dominio de cursos digitales.

Desde el lado del cliente, el sistema permite:

- Registrarse e iniciar sesión.
- Recuperar y restablecer contraseña.
- Explorar el catálogo de cursos.
- Ver el detalle de cada curso.
- Agregar cursos al carrito.
- Confirmar una compra.
- Cargar datos de facturación.
- Realizar una compra mediante transferencia bancaria.
- Consultar compras realizadas.
- Acceder a los cursos adquiridos.
- Visualizar el progreso de aprendizaje.

Desde el lado administrador, el sistema permite:

- Gestionar cursos.
- Crear, editar, publicar y ocultar cursos.
- Recuperar cursos ocultos.
- Gestionar usuarios.
- Bloquear y reactivar usuarios.
- Cambiar roles.
- Gestionar compras.
- Modificar estados de compra.
- Gestionar pagos.
- Administrar mensajes de contacto.
- Responder mensajes mediante correo electrónico.
- Gestionar publicaciones o contenidos informativos.

---

## Tecnologías utilizadas

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Context API
- LocalStorage
- CSS modular por páginas y componentes

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- Bcrypt
- Nodemailer
- Dotenv
- CORS
- Nodemon

### Base de datos

- MongoDB local o MongoDB Atlas

---

## Arquitectura del proyecto

El proyecto se organiza en dos aplicaciones principales: una aplicación frontend desarrollada con React y una API REST desarrollada con Node.js y Express.

```bash
Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── enums/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── README.md
```

---

## Adaptación a cursos digitales

La consigna del trabajo práctico plantea una tienda online. En este proyecto, esa tienda fue adaptada al dominio de cursos digitales.

Por este motivo, el producto comercializado dentro del sistema es el **curso**.

A diferencia de una tienda de productos físicos:

- No se maneja stock físico tradicional.
- No se manejan cantidades en el carrito.
- Cada curso puede ser adquirido una sola vez por usuario.
- El control equivalente al stock se realiza mediante la habilitación del acceso digital.
- Una vez confirmada la compra o aprobado el pago, el usuario obtiene acceso al curso adquirido.
- La entrega del producto se realiza desde la sección **Mis cursos**.

Esta adaptación permite representar el flujo de compra completo manteniendo la lógica propia de una plataforma de contenidos digitales.

---

## Baja lógica

El sistema implementa baja lógica para evitar la eliminación definitiva de información importante.

### Cursos

Los cursos se gestionan mediante estados:

- **BORRADOR:** curso cargado, pero no visible para los usuarios.
- **PUBLICADO:** curso visible en el catálogo.
- **OCULTO:** curso dado de baja lógicamente, no visible para el público.

Un curso oculto puede recuperarse publicándolo nuevamente desde el panel administrador.

### Usuarios

Los usuarios se gestionan mediante estados de cuenta:

- **ACTIVO:** usuario habilitado para utilizar el sistema.
- **BLOQUEADO:** usuario dado de baja o deshabilitado temporalmente.

Un usuario bloqueado puede ser reactivado desde el panel administrador.

---

## Roles del sistema

El sistema contempla dos roles principales.

### Cliente

Puede registrarse, iniciar sesión, explorar cursos, utilizar el carrito, realizar compras, consultar sus órdenes y acceder a sus cursos adquiridos.

### Administrador

Puede acceder al panel administrativo y gestionar cursos, usuarios, compras, pagos, mensajes y publicaciones.

---

## Funcionalidades principales

### Autenticación y autorización

- Registro de usuarios.
- Inicio de sesión.
- Encriptación de contraseñas.
- Autenticación mediante JWT.
- Persistencia de sesión.
- Protección de rutas privadas.
- Protección de rutas administrativas por rol.
- Recuperación de contraseña por correo electrónico.
- Restablecimiento de contraseña mediante token temporal.

### Cursos

- Listado público de cursos publicados.
- Detalle de curso.
- Filtros y búsqueda.
- Gestión administrativa de cursos.
- Creación de cursos.
- Edición de cursos.
- Publicación de cursos.
- Ocultamiento de cursos como baja lógica.
- Recuperación de cursos ocultos.

### Carrito y compras

- Creación u obtención de carrito activo.
- Agregado de cursos al carrito.
- Eliminación de cursos del carrito.
- Vaciado de carrito.
- Visualización del total.
- Aplicación de descuentos mediante cupones.
- Generación de compra desde carrito.
- Consulta de compras propias.
- Consulta de detalle de compra.
- Gestión administrativa de compras.

### Pagos

- Registro de pagos.
- Pago por transferencia bancaria como flujo principal.
- Aprobación o rechazo de pagos desde administración.
- Sincronización entre pago aprobado, compra pagada y acceso al curso.
- Visualización de estados de pago.

### Acceso a cursos

- Generación de acceso al curso adquirido.
- Consulta de cursos comprados.
- Visualización del contenido del curso.
- Registro de progreso de aprendizaje.

### Mensajes de contacto

- Envío de mensajes desde formulario público.
- Guardado de mensajes en base de datos.
- Notificación al administrador por correo electrónico.
- Listado de mensajes en panel administrador.
- Marcado de mensajes como leídos.
- Respuesta al usuario desde el panel.
- Envío de respuesta por correo electrónico.

---

## Modelos principales

El backend trabaja con los siguientes modelos principales:

- Usuario
- Curso
- Categoría
- Lección
- Carrito
- Compra
- DetalleCompra
- Pago
- AccesoCurso
- Cupón
- DatosFacturacion
- MensajeContacto
- Publicación

Estos modelos permiten representar usuarios, cursos digitales, compras, pagos, accesos a contenidos y administración general de la plataforma.

---

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone https://github.com/silvia071/Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales.git
```

Ingresar al proyecto:

```bash
cd Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales
```

---

## Configuración del backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` dentro de la carpeta `backend`.

Ejemplo de variables de entorno:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/mundo-dev

JWT_SECRET=tu_clave_secreta_jwt

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

MP_ACCESS_TOKEN=TU_ACCESS_TOKEN
MP_MOCK=true
MP_WEBHOOK_SECRET=tu_webhook_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_o_app_password
MAIL_FROM=tu_email@gmail.com
ADMIN_EMAIL=tu_email_admin@gmail.com
```

Iniciar el backend:

```bash
npm run dev
```

El backend se ejecuta por defecto en:

```text
http://localhost:3000
```

---

## Configuración del frontend

Desde la raíz del proyecto, ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

En caso de utilizar variable de entorno para la URL del backend, crear un archivo `.env` dentro de `frontend`:

```env
VITE_API_URL=http://localhost:3000
```

Iniciar el frontend:

```bash
npm run dev
```

El frontend se ejecuta por defecto en:

```text
http://localhost:5173
```

---

## Scripts principales

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

## Endpoints principales

### Autenticación

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/recuperar-contrasenia
POST /api/auth/restablecer-contrasenia/:token
```

### Usuarios

```http
GET /api/usuarios
GET /api/usuarios/me
PUT /api/usuarios/me
PUT /api/usuarios/me/password
PUT /api/usuarios/perfil/:id
PUT /api/usuarios/bloquear/:id
PUT /api/usuarios/activar/:id
PUT /api/usuarios/rol/:id
DELETE /api/usuarios/:id
```

Aclaración: `DELETE /api/usuarios/:id` realiza baja lógica, cambiando el estado del usuario a **BLOQUEADO**.

### Cursos

```http
GET /api/cursos
GET /api/cursos/:id
GET /api/cursos/admin/todos
POST /api/cursos
PUT /api/cursos/:id
PATCH /api/cursos/:id/publicar
PATCH /api/cursos/:id/ocultar
DELETE /api/cursos/:id
```

Aclaración: la baja lógica de cursos se realiza mediante el estado **OCULTO**.

### Categorías

```http
GET /api/categorias
GET /api/categorias/:id
POST /api/categorias
PUT /api/categorias/:id
DELETE /api/categorias/:id
```

### Carrito

```http
POST /api/carrito
GET /api/carrito/:id
POST /api/carrito/:id/item
DELETE /api/carrito/:id/item/:itemId
DELETE /api/carrito/:id/vaciar
GET /api/carrito/:id/total
```

### Cupones

```http
GET /api/cupones
GET /api/cupones/:id
POST /api/cupones
PUT /api/cupones/:id
DELETE /api/cupones/:id
POST /api/cupones/aplicar
DELETE /api/cupones/carrito/:carritoId
```

### Compras

```http
POST /api/compra/desde-carrito/:id
GET /api/compra/mis-compras
GET /api/compra/mis-compras/:id
GET /api/compra/admin/todas
GET /api/compra/admin/:id
PATCH /api/compra/admin/:id/estado
POST /api/compra/admin/:id/notificar
DELETE /api/compra/:id
```

### Pagos

```http
POST /api/pagos
POST /api/pagos/procesar
GET /api/pagos
GET /api/pagos/:id
PATCH /api/pagos/:id/aprobar
PATCH /api/pagos/:id/rechazar
```

### Datos de facturación

```http
POST /api/datos-facturacion
GET /api/datos-facturacion/mis-datos
PUT /api/datos-facturacion/mis-datos
GET /api/datos-facturacion
GET /api/datos-facturacion/:id
PUT /api/datos-facturacion/:id
DELETE /api/datos-facturacion/:id
```


### Accesos a cursos

```http
POST /api/accesos
GET /api/accesos/usuario/:id
PATCH /api/accesos/:id/progreso
```

Aclaración: GET /api/accesos/usuario/:id permite consultar los cursos adquiridos por un usuario.

Aclaración: PATCH /api/accesos/:id/progreso permite actualizar el progreso de aprendizaje de un acceso existente.

### Mensajes de contacto

```http
POST /api/mensajes
GET /api/mensajes
GET /api/mensajes/:id
PATCH /api/mensajes/:id/leido
PATCH /api/mensajes/:id/responder
PATCH /api/mensajes/:id/eliminar
```

### Publicaciones

```http
GET /api/publicaciones
GET /api/publicaciones/:id
POST /api/publicaciones
PUT /api/publicaciones/:id
DELETE /api/publicaciones/:id
PATCH /api/publicaciones/:id/publicar
PATCH /api/publicaciones/:id/ocultar
```

---

## Respuestas JSON

Ejemplo de respuesta exitosa:

```json
{
  "mensaje": "Operación realizada correctamente",
  "datos": {}
}
```

Ejemplo de respuesta con error:

```json
{
  "mensaje": "Descripción del error",
  "error": "Detalle técnico"
}
```

---

## Pruebas realizadas

Se verificaron los siguientes flujos principales:

- Registro de usuario.
- Inicio de sesión.
- Recuperación de contraseña.
- Restablecimiento de contraseña.
- Protección de rutas privadas.
- Protección de rutas administrativas.
- Visualización del catálogo de cursos.
- Visualización del detalle de curso.
- Agregado de cursos al carrito.
- Eliminación de cursos del carrito.
- Vaciado de carrito.
- Checkout con datos de facturación.
- Generación de compra.
- Pago por transferencia bancaria.
- Administración de compras.
- Cambio de estado de compras.
- Aprobación y rechazo de pagos.
- Generación de acceso a cursos adquiridos.
- Visualización de cursos comprados.
- Gestión de cursos desde administración.
- Baja lógica y recuperación de cursos.
- Gestión de usuarios desde administración.
- Bloqueo y reactivación de usuarios.
- Gestión de mensajes de contacto.
- Respuesta de mensajes por correo electrónico.
- Build de producción del frontend.

---

## Documentación adicional

El proyecto incluye documentación específica en cada carpeta:

- `backend/README.md`
- `frontend/README.md`

Además, la entrega final incluye documentación en PDF con la descripción funcional, endpoints, capturas y evidencia de funcionamiento.

---

## Repositorio

```text
https://github.com/silvia071/Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales.git
```
