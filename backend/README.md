# Backend - Mundo Dev

Backend de **Mundo Dev**, una plataforma web para la gestión, difusión y comercialización de cursos digitales.

La API REST fue desarrollada con **Node.js**, **Express.js** y **MongoDB** mediante **Mongoose**. El sistema permite administrar usuarios, cursos, carritos, compras, pagos, accesos a cursos, datos de facturación y mensajes de contacto.

## Descripción del sistema

Mundo Dev es una aplicación web orientada a la gestión, difusión y comercialización de cursos digitales. El backend centraliza la lógica de negocio y expone una API REST consumida por el frontend desarrollado en React.

El sistema incluye autenticación con JWT, autorización por roles, recuperación de contraseña por correo electrónico, gestión de cursos, carrito de compras, checkout, pagos por transferencia bancaria, generación de compras, administración de pagos, habilitación de accesos a cursos y panel administrativo.

Al tratarse de una plataforma de cursos digitales, el producto comercializado es el curso. Por este motivo, no se maneja stock físico ni cantidades en el carrito. El control equivalente al stock se realiza mediante la habilitación del acceso digital al curso una vez confirmada la compra o aprobado el pago.

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- Bcrypt
- Nodemailer
- Mercado Pago SDK
- Dotenv
- CORS
- Nodemon

## Funcionalidades principales

### Autenticación y autorización

- Registro de usuarios.
- Inicio de sesión.
- Encriptación de contraseñas.
- Autenticación mediante JWT.
- Middleware de autenticación.
- Middleware de autorización por rol.
- Roles CLIENTE y ADMINISTRADOR.
- Recuperación de contraseña mediante correo electrónico.
- Restablecimiento de contraseña con token temporal.

### Gestión de usuarios

- Consulta de perfil.
- Edición de datos personales.
- Listado de usuarios para administradores.
- Edición de usuarios.
- Cambio de rol.
- Bloqueo de usuarios como baja lógica.
- Reactivación de usuarios bloqueados.

### Gestión de cursos

- Listado público de cursos publicados.
- Listado administrativo de todos los cursos.
- Creación de cursos.
- Edición de cursos.
- Publicación de cursos.
- Ocultamiento de cursos como baja lógica.
- Recuperación de cursos ocultos.
- Gestión de categorías y lecciones.

### Carrito y compras

- Creación u obtención del carrito activo.
- Agregado de cursos al carrito.
- Eliminación de cursos del carrito.
- Vaciado del carrito.
- Cálculo de total.
- Aplicación de cupones.
- Generación de compra desde carrito.
- Consulta de compras propias.
- Administración de compras.

### Pagos

- Creación de pagos.
- Procesamiento de pagos.
- Pago por transferencia bancaria.
- Mercado Pago o modo simulado.
- Aprobación manual de pagos.
- Rechazo de pagos.
- Sincronización entre pago aprobado, compra pagada y acceso al curso.

### Datos de facturación

- Creación de datos de facturación.
- Consulta de datos propios.
- Actualización de datos propios.
- Administración de datos de facturación.

### Mensajes de contacto

- Recepción de mensajes desde el formulario público.
- Guardado de mensajes en base de datos.
- Envío de email al administrador.
- Listado de mensajes para administradores.
- Marcado de mensajes como leídos.
- Respuesta desde el panel administrador.
- Envío de email al usuario con la respuesta.
- Eliminación lógica de mensajes.

### Correos electrónicos

El sistema utiliza Nodemailer para enviar correos en los siguientes casos:

- Recuperación de contraseña.
- Confirmación de orden de compra.
- Actualización del estado de una compra.
- Notificación al administrador por nuevo mensaje de contacto.
- Respuesta al usuario desde el panel de mensajes.

## Requisitos

- Node.js 18 o superior.
- npm.
- MongoDB local o MongoDB Atlas.
- Cuenta SMTP para envío de correos.
- Credenciales de Mercado Pago, o uso de modo simulado con `MP_MOCK=true`.

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/silvia071/Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales.git
```

Ingresar a la carpeta del backend:

```bash
cd Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales/backend
```

Instalar dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` dentro de la carpeta `backend`.

Se puede tomar como base el archivo `.env.example`.

Ejemplo de configuración:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/mundo-dev

# JWT
JWT_SECRET=tu_clave_secreta_jwt

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# Mercado Pago
MP_ACCESS_TOKEN=TU_ACCESS_TOKEN
MP_MOCK=true
MP_WEBHOOK_SECRET=tu_webhook_secret

# SMTP / Mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_o_app_password
MAIL_FROM=tu_email@gmail.com
ADMIN_EMAIL=tu_email_admin@gmail.com
```

El archivo `.env` real no debe subirse al repositorio.

## Ejecución

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

El backend se ejecuta por defecto en:

```text
http://localhost:3000
```

## Estructura del proyecto

```bash
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── enums/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

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
POST /api/usuarios
GET /api/usuarios
GET /api/usuarios/me
PUT /api/usuarios/me
PUT /api/usuarios/me/password
GET /api/usuarios/:id
PUT /api/usuarios/perfil/:id
PUT /api/usuarios/bloquear/:id
PUT /api/usuarios/activar/:id
PUT /api/usuarios/rol/:id
DELETE /api/usuarios/:id
```

Aclaración: el endpoint `DELETE /api/usuarios/:id` realiza baja lógica del usuario, cambiando su estado a `BLOQUEADO`. El usuario no se elimina físicamente de la base de datos.

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

Aclaración: la baja lógica de cursos se realiza mediante el estado `OCULTO`. El curso no se elimina físicamente y puede recuperarse publicándolo nuevamente.

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
POST /api/pagos/crear-preferencia
POST /api/pagos/webhook
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
GET /api/accesos/mis-cursos
GET /api/accesos/usuario/:usuarioId
PATCH /api/accesos/progreso
```

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

````

### Usuarios

```http
GET /api/usuarios
GET /api/usuarios/perfil
PUT /api/usuarios/perfil/:id
PUT /api/usuarios/bloquear/:id
PUT /api/usuarios/activar/:id
PUT /api/usuarios/rol/:id
````

### Cursos

```http
GET /api/cursos
GET /api/cursos/:id
GET /api/cursos/admin/todos
POST /api/cursos
PUT /api/cursos/:id
PATCH /api/cursos/:id/publicar
PATCH /api/cursos/:id/ocultar
```

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
POST /api/carrito/:id/cupon
DELETE /api/carrito/:id/cupon
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
POST /api/pagos/crear-preferencia
POST /api/pagos/webhook
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
GET /api/accesos/mis-cursos
GET /api/accesos/usuario/:usuarioId
PATCH /api/accesos/progreso
```

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

## Adaptación a cursos digitales

El proyecto fue adaptado al dominio de cursos digitales.

Por este motivo:

- El producto del sistema es el curso.
- No se utiliza stock físico.
- No se manejan cantidades en el carrito.
- Cada curso se puede adquirir una sola vez por usuario.
- El control equivalente al stock se realiza mediante acceso digital.
- La entrega se realiza habilitando el curso en “Mis cursos”.
- La baja lógica de productos se implementa ocultando cursos.

## Scripts disponibles

```bash
npm run dev
```

## Repositorio

```text
https://github.com/silvia071/Sistema-web-de-gestion-y-difusion-de-cursos-y-contenidos-digitales.git
```
