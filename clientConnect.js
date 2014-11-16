/**
clientConnect
Will make the necessary requests to establish client-server connection.

References:
nodejs.org
*/
var http = require('http');
var net = require('net');
var url = require('url');
/** TODO
//Create an HTTP tunneling proxy
var proxy = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('okay');
});

proxy.on('connect', function(req, cltSocket, head){
	//connect to an origin server
	var srvUrl = url.parse('http://' + req.url);
	var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function(){
		cltSocket.write('Connection Established');
		srvSocket.write(head);
		srvSocket.pipe(cltSocket);
		cltSocket.pipe(srvSocket);
	});
});
*/
// Make CONNECTION REQUEST to SERVER
// Options declared for LOCAL HOST SERVER
// TODO set options to foreign server
var options = {
	port: 8888,
	hostname: '127.0.0.1',
	method: 'CONNECT',
};
var req = http.request(options, function(res) {
	console.log('STATUS: ' + res.statusCode );
	console.log('HEADERS: ' + JSON.stringify(res.headers))
	res.setEncoding('utf8');
	res.on('data', function(chunk){
		console.log('BODY: ' + chunk);
	});
});
req.on('error', function(e){
	console.log('problem with request: ' + e.message);
});










