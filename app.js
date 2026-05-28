const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());


// CARPETA PUBLIC
app.use(express.static('public'));


require('dotenv').config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// CONEXIÓN DYNAMODB
const dynamodb = new AWS.DynamoDB.DocumentClient();


// ==========================
// CREAR PRODUCTO
// ==========================
app.post('/productos', async (req, res) => {

    const { id, nombre, precio } = req.body;

    // VALIDACIÓN
    if (!id || !nombre || !precio) {

        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    const params = {
        TableName: 'Productos',
        Item: {
            id,
            nombre,
            precio
        }
    };

    try {

        await dynamodb.put(params).promise();

        res.json({
            mensaje: 'Producto creado correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al crear producto',
            error
        });
    }
});


// ==========================
// LEER PRODUCTOS
// ==========================
app.get('/productos', async (req, res) => {

    const params = {
        TableName: 'Productos'
    };

    try {

        const data = await dynamodb.scan(params).promise();

        res.json(data.Items);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al obtener productos',
            error
        });
    }
});


// ==========================
// ACTUALIZAR PRODUCTO
// ==========================
app.put('/productos/:id', async (req, res) => {

    const { nombre, precio } = req.body;

    const params = {

        TableName: 'Productos',

        Key: {
            id: req.params.id
        },

        UpdateExpression: 'set nombre = :n, precio = :p',

        ExpressionAttributeValues: {
            ':n': nombre,
            ':p': precio
        }

    };

    try {

        await dynamodb.update(params).promise();

        res.json({
            mensaje: 'Producto actualizado correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al actualizar producto',
            error
        });
    }
});


// ==========================
// ELIMINAR PRODUCTO
// ==========================
app.delete('/productos/:id', async (req, res) => {

    const params = {

        TableName: 'Productos',

        Key: {
            id: req.params.id
        }

    };

    try {

        await dynamodb.delete(params).promise();

        res.json({
            mensaje: 'Producto eliminado correctamente'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: 'Error al eliminar producto',
            error
        });
    }
});


// ==========================
// SERVIDOR
// ==========================
app.listen(3000, () => {

    console.log('Servidor funcionando en puerto 3000');

});