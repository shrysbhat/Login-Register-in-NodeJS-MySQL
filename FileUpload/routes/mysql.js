var mysql = require('mysql');

var p_stack = [];
var queueforwaiting = [];
var poolMaxsize = 1000; 
var starts = 0;

function getConnection(){
	var connection = mysql.createConnection({
		host     : '127.0.0.1',
	    user     : 'root',
	    password : 'root',
	    schema 	 : 'DataSecurityService'	    	
	});
	return connection;
}



function getConnectionFromPool(){
	
	for(var i = 0; i < poolMaxsize; i++){
		var conn = getConnection();
		p_stack.push(conn);
	}
	//console.log("in getConnectionFromPool");
	var conn1 = p_stack.pop();
	return conn1;
}

function releaseConnection(conn){
	p_stack.push(conn);
}

exports.fetchData = function(myquery, callback){	
	var connection = getConnectionFromPool();	
		connection.connect();
		connection.query(myquery, function(error, Results){
			if(error){
				console.log("We are in fetchData error!!");
				return;
			}
			else{
					releaseConnection(connection);
					callback(error, Results);
			}	
	});
	connection.end();
};