require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {getUsers, addUser, getPost, addPost,getProduct,addProduct,verifyUser} = require('./consultas');
const { vrfData, vrfCredencial, vrfToken } = require('./middleware');

app.listen(3001, console.log("SERVIDOR ENCENDIDO EN EL PUERTO 3001"));

app.use(express.json()) 
app.use(cors());


app.get("/usuarios",vrfToken, async (req, res) => {
    try {
    const { correo } = req.data;
    const usuarios = await getUsers(correo);
    res.json(usuarios);
} catch (error) {
    res.status(500).json('error!! no fue posible conectarse a la base de datos')
    }
});

app.post('/usuarios', vrfData, async (req, res) => {
    try {
        const {nombre,apellido,direccion,correo,contraseña,img,Rol } = req.body;
        await addUser(nombre,apellido,direccion,correo,contraseña,img,Rol);
        res.status(201).send('Usuario creado exitosamente');
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});

app.get('/comentarios', async (req, res) => {
    try {
    const posts = await getPost();
    res.json(posts);
} catch (error) {
    res.status(500).json('error!! no fue posible conectarse a la base de datos')
    }
});

app.post('/comentarios', async (req, res) => {
    try {
    const {nombre, comentario} = req.body

    if (!nombre ||!comentario) {
        res.status(400).json('debe ingresar todos los campos');
     }  
    const resp = await addPost(nombre, comentario)
    res.json({nombre, comentario});
    res.send('Comentario agregado')
} catch (error) {
    res.status(500);
    }
});

app.get('/productos', async (req, res) => {
    try {
    const product = await getProduct();
    res.json(product);
} catch (error) {
    res.status(500).json('error!! no fue posible conectarse a la base de datos')
    }
});

app.post('/productos', async (req, res) => {
    try {
    const {nombre, descripcion,precio,imagen} = req.body

    if (!nombre ||!descripcion||!precio||!imagen) {
        res.status(400).json('debe ingresar todos los campos');
     }  
    const resp = await addProduct(nombre, descripcion,precio,imagen)
    res.json({nombre, descripcion,precio,imagen});
    res.send('Producto agregado')
} catch (error) {
    res.status(500);
    }
});

app.post('/login', vrfCredencial, async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const token = jwt.sign({ correo }, "AA_XX");
        console.log('Token creado exitosamente')
        res.send(token);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).send(error);
    }
});