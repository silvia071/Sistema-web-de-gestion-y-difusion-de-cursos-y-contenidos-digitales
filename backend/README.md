# Backend - Proyecto Final

## Configuración Inicial

### Crear archivo `.env`

Para que la aplicación funcione correctamente, debes crear un archivo `.env` en la raíz de la carpeta `backend/` con las siguientes variables de entorno:

```bash
# Archivo: .env (ubicado en: backend/.env)

# Base de datos MongoDB
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/proyectoFinal

# Puerto del servidor
PORT=3000

# JWT (JSON Web Token)
JWT_SECRET=tu_clave_secreta_muy_segura

# URL del frontend
FRONTEND_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

### Pasos para configurar:

1. **Duplica el archivo de ejemplo** (si existe `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. **O crea el archivo manualmente**:
   - En la raíz de la carpeta `backend/`
   - Nombre del archivo: `.env`
   - Llena las variables con tus valores

3. **Variables requeridas**:
   - **MONGO_URI**: Conexión a MongoDB (local o Atlas)
     - Formato: `mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombreBD`
     - O local: `mongodb://localhost:27017/proyectoFinal`
   - **PORT**: Puerto del servidor (3000 en tu caso)
   - **JWT_SECRET**: Clave segura para firmar tokens


4. **Para obtener credenciales**:
   - **MongoDB Atlas**: Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - **Mercado Pago**: Obtén tus credenciales para vender tus cursos en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)

5. **Instala dependencias**:
   ```bash
   npm install
   ```

6. **Inicia el servidor**:
   ```bash
   npm start
   ```
   O con nodemon (desarrollo):
   ```bash
   npm run dev
   ```

### Importante:

⚠️ **Nunca commits el archivo `.env` al repositorio**. Debe estar en `.gitignore`:

```gitignore
.env
.env.local
node_modules/
```

---

## Estructura del Proyecto

```
backend/
├── src/
│   ├── app.js              # Configuración de Express
│   ├── server.js           # Servidor principal
│   ├── config/             # Configuraciones (DB, Mercado Pago)
│   ├── controllers/        # Lógica de controladores
│   ├── models/             # Modelos de datos
│   ├── routes/             # Rutas de la API
│   ├── services/           # Servicios
│   ├── middlewares/        # Middlewares personalizados
│   └── enums/              # Enums
├── package.json
├── nodemon.json
└── README.md
```

---

## Troubleshooting

### "Error: connect ECONNREFUSED"
- Verifica que MongoDB está corriendo (local o tiene acceso a Atlas)
- Confirma la URI de conexión en `.env`

### "Error: Invalid connection string"
- Verifica el formato de MONGO_URI
- Comprueba usuario y contraseña si usas MongoDB Atlas
- Revisa que el cluster esté activo en MongoDB Atlas

### "Error: JWT_SECRET is not defined"
- Asegúrate de que el archivo `.env` existe en la carpeta `backend/`
- Verifica que la variable `JWT_SECRET` está configurada

### "Error: MERCADO_PAGO_ACCESS_TOKEN not found"
- Obtén tu token en Mercado Pago Developers
- Configúralo en el archivo `.env`
