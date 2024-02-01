import pkg from 'pg';
import bcrypt from 'bcryptjs'

// import format from 'pg-format';

const { Pool } = pkg;
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'softjobs',
    allowExitOnIdle: true
});

const verificarCredenciales = async(email,password) => {
    const consulta = "select * from usuarios where email = $1 and password = $2"
    const values = [email,password]
    const result = await pool.query(consulta,values)
    console.log(result)
}


const Add = async (email, password,rol,lenguage) => {
    try {
        let passwordEncriptada = bcrypt.hashSync(password) 
      const consulta = "INSERT INTO usuarios (email,password,rol,lenguage) VALUES ($1, $2, $3,$4)";
      const values = [email, passwordEncriptada,rol,lenguage];
      const result = await pool.query(consulta, values);
      console.log("Usuario agregado");
      return result.rows[0];
    } catch (error) {
      console.error("Error al agregar el Usuario:", error.message);
      throw error;
    }
  };

  const Get = async (email) => {
    try {
        const consulta = 'SELECT email, rol, lenguage FROM usuarios WHERE email = $1';
        const values = [email];
        const result = await pool.query(consulta, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        throw error;
    }
};


export {verificarCredenciales, Add,Get}