import pkg from 'pg';

// import format from 'pg-format';

const { Pool } = pkg;
const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'admin',
    database: 'softjobs',
    allowExitOnIdle: true
});


const verificarCredenciales = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1"
  const values = [email]
  // destructuring para obtener rowCount y userDB desde propiedad rows el objeto que contiene info BD
  const { rowCount, rows: [userDB]  } = await pool.query(consulta, values)
  // respuesta de funcion para caso de no existir credenciales en BD o sea no existe el email
  if (!rowCount) throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
  return userDB.password // objeto sacado del array rows
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