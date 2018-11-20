const { Pool, Client } = require('pg'); // Modulo requerido para definir


exports.conecta = function() {


    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'GIS',
        password: 'alvarado',
        port: 5432,
    })
    client.connect()

    client.query('SELECT * from persona', (err, res) => {
        console.log("ResultadoS: \n", err, res.rows);
        client.end()
    })

}