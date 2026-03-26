const app  = require('./app');
const pool = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await pool.getConnection();
    console.log('✅ Conectado a MariaDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar la BD:', error.message);
    process.exit(1);
  }
}

main();