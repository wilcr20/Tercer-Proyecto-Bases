var client; // guarda el cliente actual;
const { Pool, Client } = require('pg'); // Modulo requerido para definir



exports.conectarServer = function conectarServer(data, callback) {
    // console.log("data.body recibido : ", data.body);
    client = new Client({
        user: data.body.username,
        host: data.body.server,
        database: data.body.database,
        password: data.body.pasw,
        port: 5432,
    })

    client.connect((err) => {
        if (err) {
            console.log("Error de Conexion!!");
            callback(false);
        } else {
            console.log("Conectado a base de dato");
            creaDbLink();
            callback(true);
        }
    })
}


creaDbLink = function() {
    client.query("create extension dblink;", (err, res) => {
        if (err) {
            console.log("Error de dblink.");
            // callback(false);

        } else {
            console.log("\n\nResultadoS: \n", res);
            // callback(true);
        }

    }); // crea extension dblink
}



exports.obtenerTablas = function obtenerTablas(callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
    console.log("obtenerTablas");
    client.query("select table_schema,table_name,privilege_type from information_schema.role_table_grants", (err, res) => {

        if (err) {
            console.log("Error de obtencion tablas.");
            callback(false);

        } else {
            //console.log("\n\nResultados de tablas: \n", res.rows);
            callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
        }
    })
}







// exports.conectarNodo = function conectarNodo(data, callback) { // realiza conexion dblink
//     console.log("select dblink_connect( '" + data.body.conn + "', 'host=" + data.body.server + " user=" + data.body.username + " password=" + data.body.pasw + " dbname=" + data.body.database + "')");
//     client.query("select dblink_connect( '" + data.body.conn + "', 'host=" + data.body.server + " user=" + data.body.username + " password=" + data.body.pasw + " dbname=" + data.body.database + "')", (err, res) => {
//         if (err) {
//             console.log("Error de conexion a nodo.");
//             callback(false);

//         } else {
//             console.log("\n\nConectado OK!: \n");
//             callback(true);
//         }

//     })

// }


// exports.obtenerSchema = function obtenerSchema(data, callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
//     client.query("select * from dblink('host=" + data.body.server + " user=" + data.body.username + " password=" + data.body.pasw + " dbname=" + data.body.database + "', 'select DISTINCT  table_schema from information_schema.role_table_grants') as esquemas ( nombre  character varying );	", (err, res) => {
//         if (err) {
//             console.log("Error de obtencion esquema a datos.");
//             callback(false);

//         } else {
//             console.log("\n\nResultados de esquemas: \n", res.rows);
//             callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
//         }

//     })
// }





// exports.obtenerPrivilegiosTablas = function obtenerPrivilegiosTablas(data, callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
//     client.query("select * from dblink('host=" + data.body.server + " user=" + data.body.username + " password=" + data.body.pasw + " dbname=" + data.body.database + "','select privilege_type from information_schema.role_table_grants where table_schema = ''" + data.body.esquema + "'' and table_name=''" + data.body.table + "'' ') as  tablas (nombre character varying);", (err, res) => {
//         if (err) {
//             console.log("Error de obtencion tablas de esquema.");
//             callback(false);

//         } else {
//             console.log("\n\nResultados de prvil: \n", res.rows);
//             callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
//         }
//     })

// }


// exports.obtenerPrivilegiosColumnas = function obtenerPrivilegiosColumnas(data, callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
//     client.query("select * from dblink('host=" + data.body.server + " user=" + data.body.username + " password=" + data.body.pasw + " dbname=" + data.body.database + "','select column_name,privilege_type from information_schema.column_privileges where table_schema = ''" + data.body.esquema + "'' and table_name=''" + data.body.table + "'' ') as tabla (columna character varying,rol character varying );", (err, res) => {
//         if (err) {
//             console.log("Error de obtencion tablas de esquema.");
//             callback(false);

//         } else {
//             console.log("\n\nResultados de tablas: \n", res.rows);
//             callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
//         }
//     })

// }


// exports.enviarQuery = function enviarQuery(data, callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
//     console.log("query envia: ", data.body.queryF);
//     client.query(data.body.queryF, (err, res) => {
//         console.log(res);
//         if (err) {
//             console.log("Error de ejecucion query.");
//             callback(false);

//         } else {
//             console.log("\n\nResultados de query: \n", res.rows);
//             callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
//         }
//     })

// }


// exports.enviarQueryDistrib = function enviarQueryDistrib(data, callback) { // realiza conexion dblink recibiendo una tabla con varios atributos
//     console.log("..");
//     console.log("query envia: ", data.body.query);
//     client.query(data.body.query, (err, res) => {
//         console.log("RESPOONSE:: ", res);
//         if (err) {
//             console.log("Error de ejecucion query.");
//             callback(false);

//         } else {
//             console.log("\n\nResultados de query: \n", res.rows);
//             callback(res.rows); // res.row obtiene la tabla de los resultados obtenidos del query
//         }
//     })

// }