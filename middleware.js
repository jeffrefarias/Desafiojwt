import jwt from "jsonwebtoken"

const reporteRuta = async (req, res, next) => {
    const parametros = req.params
    const querys = req.query
    const url = req.url

    console.log(`Consulta en la ruta ${url} con parámetros y querys: `, parametros, querys)

    next()
}

const validaToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'Falta el token...'})
    }

    try {
        const payload = jwt.verify(token, "az_AZ")
        req.user = payload
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({ error: 'Token inválido...'})
    }
}


export {reporteRuta, validaToken}