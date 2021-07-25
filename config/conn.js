var mysql = require('mysql2');
var conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'auct_bid_prod_new'
});

conn.connect(function(err){
    if(err)
    throw err;
});

module.exports = conn;