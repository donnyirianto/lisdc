require('dotenv').config();

const config = {
  db: { /* don't expose password or any sensitive info, done only for demo */
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'n3wbi328m3d',
    database: process.env.DB_NAME || 'iris',
    port: process.env.DB_PORT || '3306',
    waitForConnections: true,
    connectionLimit: 5 ,
    queueLimit: 0,
    dateStrings:true,
    multipleStatements: true
  }, 
};

module.exports = config;