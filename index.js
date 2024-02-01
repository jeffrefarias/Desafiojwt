// const jwt = require("jsonwebtoken")
import jwt from 'jsonwebtoken'
import express from "express";
import cors from 'cors'
import {reporteRuta, validaToken} from './middleware.js'
import {verificarCredenciales,Add,Get} from './database/consultas.js'


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000
app.listen(PORT, () => {
    console.log(`SERVER ON PORT: http://localhost:${PORT}`);
})
// Login 
app.post("/login", async (req,res)  => {
    try {
        const {email,password} = req.body
        console.log("Contraseña antes del verificar credenciales " + password);
        if(!email || !password) {
            throw { message: "email y la contraseña requeridos"}
        }
        const UserPassword = await verificarCredenciales(email,password)
        console.log("Contraseña despues del verificar credenciales " + UserPassword);
        // const validarPassword = await bcrypt.compare(password,UserPassword);
        const token = jwt.sign({email}, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log("Hay error de credenciales");
        res.status(error.code || 500).send(error)
    }
});

// Obtener datos de usuario autenticado
app.get('/usuarios', validaToken, async (req, res) => {
    try {
        const { email } = req.user; 
        const usuario = await Get(email);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});   


// Add Usuario
app.post("/usuarios",reporteRuta, async (req, res) => {
    try {
        const { email, password ,rol,lenguage} = req.body
        const result = await Add(email, password,rol,lenguage)
        //respuesta del servidor
        return res.status(200).json({ ok: true, message: "Usuario Registrado", result }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, result: "Error al registrar un usuario" }); //respuesta del servidor
    }
});

