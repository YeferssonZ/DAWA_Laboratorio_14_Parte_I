const express = require('express');
const multer = require('multer');
const app = express();

app.use(express.static(__dirname));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Validar el tipo de archivo permitido (ejemplo: solo imágenes)
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes.'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: fileFilter
}).array('files', 5);

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.message === 'File too large') {
                return res.status(400).send('Peso máximo aceptado: 5MB');
            } else if (err.message === 'Tipo de archivo no permitido. Solo se permiten imágenes.') {
                return res.status(400).send(err.message);
            } else {
                return res.status(400).send('Error al cargar el archivo.');
            }
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).send('Ningún archivo fue cargado.');
        }

        const fileDetails = req.files.map((file) => ({
            filename: file.filename,
            originalname: file.originalname,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.send(fileDetails);
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
