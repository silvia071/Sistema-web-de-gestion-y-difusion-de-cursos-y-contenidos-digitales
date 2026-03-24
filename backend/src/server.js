const app = require('./app');
const conectarDB = require('./config/database');

conectarDB();

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

