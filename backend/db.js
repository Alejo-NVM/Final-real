const sql = require("mssql");

const config = {
 server: "localhost",
port: 1435,
user: "sa",
password: "12345678Alee",
database: "tienda_demo",
options: { encrypt: false, trustServerCertificate: true }

};

module.exports = { sql, config };
