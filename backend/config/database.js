const mysql = require('mysql');

let db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'tfa'
});

db.connect((err) => {
	if (err) throw err;
});

module.exports = db;
