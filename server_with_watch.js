var http = require("http");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync("config.json"));
var host = config.host;
var port = config.port;
console.log("Starting web server");
var server = http.createServer(function(request, response){
	console.log("Received a request: " + request.url);
	
	fs.readFile("./public" + request.url, function(error, data) {
		if (error) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.end("Page not found");
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(data);
		}
	});
});
server.listen(port, host, function() {
	console.log("Server is listening " + host + ":" + port);
});


fs.watchFile("config.json", function() {
	fs.readFile("config.json", function(error, data) {
		config = JSON.parse(data);
		server.close();
		port = config.port;
		host = config.host;
		server.listen(port, host, function() {
			console.log("Server is now listening " + host + ":" + port);
		});
	});

});
