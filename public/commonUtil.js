var mysql = require("mysql");
var db_config = require('../config/db_config.json');
var connection;

handleDisconnect();

function handleDisconnect() {
	connection = mysql.createConnection(db_config);
	connection.connect(function(err) {
		if(err) {
			console.log('[Error When Connecting To Master DB] ', err);
			setTimeout(handleDisconnect, 2000);
		}else{
			console.log('[Master DB Connected]');
		}
	});

	connection.on('error', function(err) {
		console.log('[DB Error] ', err.code);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
};

// DB 연결상태 확인
exports.getConnection = function() {
	return mysql.createConnection(db_config);
}

// MASTER_DB 쿼리 실행 함수
exports.exeQuery = function(qry, callback) {
	connection.query(qry, function(err, results){
		if(db_config.db_query === "Y")
			console.log(qry);
		if (err)
			callback(err, null);
		else
			callback(null, results);
	});
};

exports.checkNullUndefined = function(param) {
	if(param == '' || param == null || param == undefined || param == 0 || param == NaN){
		return true
	} else {
		return false
	}
}
