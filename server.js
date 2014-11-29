/**
Jonas Nordstrom; Ermenildo V. Castro, Jr.
server.js
-----------------------------------------------------------------
Known Bugs:


-----------------------------------------------------------------
Description:
<<<<<<<<<<<<<<<<<<< MAINTAIN CONSISTENCY >>>>>>>>>>>>>>>>>>>>>>>>
Version: 0.0.2
Last Update: 11/16/14
<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Available Program Functions:
- start
-----------------------------------------------------------------
References:
SmashingJsNode;
StackOverflow;
-----------------------------------------------------------------
*/
var express = require('express');
var app = express();
var http = require('http');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var server = http.Server(app);
var io = require('socket.io')(server);
var fileHandler = require('./fileHandler.js');

const PORT = 8888;

/*
* Routing
*/

// Routes the entry point of the website
app.get('/', function(req, res) {
	console.log('About to route "/" to\n\tIP: ' + req.ip);
	var options = {
		root: __dirname,
		dotfiles: 'deny',
		header: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};

	res.sendFile('index.html', options, function(err) {
		if (err) {
			// We have an error with the sending the file
			console.log(err);
			res.status(err.status).end();
		} else {
			//MODIFICATION 11/16/14
			//POPULATE LOCALFILES from MASTERLOG
			// "./files/" - local files directory of server
			fileHandler.listFiles('./files/');
			//---------------------
			console.log('Sent: index.html');
		}
	});
});

// Route when a file is tried to get retrieved
app.get('/files/:name', function(req, res) {
	console.log('\nIP: ' + req.ip);
	var fileName = req.params.name;
	console.log('\tFile "' + fileName + '" is being requested');

	// Validate if the file name is valid
	//MODIFIED 11/16/14
	//removed 'files/' append
	if (fileHandler.existsFile(fileName)) {
		// File name is valid
		//TODO: Implement logic what happens when client tries to reach file
		console.log('\tAbout to route "/file/' + fileName + '"');
		res.send('Your are trying to get "' + fileName + '"');
	} else {
		// File name is not valid, inform client
		console.log('\tFile "' + 
			fileName + '", does not exists.');
		res.status(404).sendFile(__dirname + '/html/error.html');
	}
});
/**
updateDirectory call
updateDirectory(cmd, fname, path, data)
*/
app.get('/files/:name/:cmd', function(req, res) {
	console.log('\nIP: ' + req.ip);
	var fileName = req.params.name.replace('\r\n','').trim(); //remove return characters
	var cmd = req.params.cmd;
	console.log("Directory Update Requested\n");
	//Local path set to default ./files/
	if (fileHandler.updateDirectory(cmd, fileName, "./files/")) {
		// File name is valid
		res.send('You updated: "' + fileName + '"');
	} else {
		// File name is not valid, inform client
		console.log('\tFile "' + 
			fileName + '", update error.');
		res.status(404).sendFile(__dirname + '/html/error.html');
	}
	
});

/*
connection:
	- Will be emitted when a host connects a socket to the server
	- Display information about the client to the log
 */
io.on('connection', function(socket) {
	console.log('\nNew connection:\n\tID: ' + socket.id + '\n');
	var answer = "You are succeful connected to the server";
	socket.emit('successfulConnection', answer);
});

/**
start:
	- Starts up the server with configured settings
 	- Adds event handlers when a specific function is being requested
		o connection
		o getAvailableFiles //TODO: create event handler
		o charUpdate

Last modified: 11/26/14
 */
function start() {
	console.log("##### Server started #####");
//	var server = http.createServer(app);

	// Will be executed when a user is being connected
/*	server.on('connection', function(socket) {
		console.log('\nNew connection:\n\tIP: ' + socket.address().address + '\n\tPort: ' +
			socket.address().port + '\n');
	});
*/
	// Will be fired when a client requests available files on server
/*	server.on('getAvailableFiles', function(val) {
//			var names = fileHandler.listFiles('./files/');
		console.log('Been here\n');
		console.log(val + '\n');
	});*/
	// Will be fired when a client sends an character update
/*	server.on('charUpdate', function(character, index) {
		console.log('charUpdate has been called\n\tValue of character: ' +
			character + '\n\tValue of index: ' + index);
	});
*/
	//TODO: Write logic for what is happening when a client is connecting

	//TODO: Write logic for what is happening when we recieve an event

	server.listen(PORT, function() {
		console.log('Server is listening on port ' + PORT);	
	});

}

exports.start = start;
