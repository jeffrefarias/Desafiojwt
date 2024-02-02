// const jwt = require("jsonwebtoken")
import jwt from 'jsonwebtoken'
import express from "express";
import cors from 'cors'
import { reporteRuta, validaToken } from './middleware.js'
import { verificarCredenciales, Add, Get } from './database/consultas.js'
import bcrypt from 'bcryptjs'


const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000
app.listen(PORT, () => {
    console.log(`SERVER ON PORT: http://localhost:${PORT}`);
})
// Login 
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw { code: 400, message: "Email y contraseña son requeridos." };
        }
        const UserPassword = await verificarCredenciales(email)
        const validarPassword = await bcrypt.compare(password.trim(), UserPassword.trim());
        
        // validacion contraseña
        if (validarPassword == false) {
            throw { code: 401, message: "Contraseña incorrecta." };
        }
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        const statusCode = error.code || 500;
        res.status(statusCode).send({ error: error.message })
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
app.post("/usuarios", reporteRuta, async (req, res) => {
    const { email, password, rol, lenguage } = req.body

    try {
        if (!email || !password || !rol || !lenguage) {
            throw { message: "Todos los campos son requeridos" };
        }
        // console.log("Objeto creado" + email, password ,rol,lenguage);
        const bcryptPassword = bcrypt.hashSync(password)
        console.log(password);
        const result = await Add(email, bcryptPassword, rol, lenguage)
        //respuesta del servidor
        return res.status(200).json({ ok: true, message: "Usuario Registrado", result });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, result: "Error al registrar un usuario" }); //respuesta del servidor
    }
});

