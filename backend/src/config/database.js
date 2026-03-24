const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/proyecto-cursos');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;


