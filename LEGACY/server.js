/*
SERVER for CSCE 343, Term Project - Professor Reyes
Ermenildo V. Castro, Jr.; Jonas Nordstrom
*/
/*
FILE DESCRIPTION:
The SERVER will handle incoming connections.

Upon connecting to the server will satisfy specified design requirements:
1) The user will be assigned a CLOSED-ID.
2) Server will query mongoDB for all available files
3) Filenames will be keys, and be presented to user for selection
4) User selects a filename key and is directed to another the ROOM
	associated with the filename key
*/
var http = require('http');
http.createServer(function(request, respond){
	respond.writeHead(200,{'Content-Type': 'text/plain'});
	respond.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server runing at http:/127.0.0.1:1337/');