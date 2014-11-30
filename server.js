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
//			fileHandler.listFiles('./files/'); //TODO: This call will be made in a successful connection
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
		console.log('\tAbout to route "/file/' + fileName + '"');
		var options = {
			root: __dirname,
			dotfiles: 'deny',
			header: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		res.sendFile('editor.html', options, function(err) {
			if (err) {
				// Error occurred when sending file
				console.log(err);
				res.status(err.status).end();
			} else {
				console.log('Sent: editor.html');
			}
		});
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
		var options = {
			root: __dirname,
			dotfiles: 'deny',
			header: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
		res.sendFile('editor.html', options, function(err) {
			if (err) {
				// Error occurred when sending file
				console.log(err);
				res.status(err.status).end();
			} else {
				console.log('Sent: editor.html');
			}
		});
	} else {
		// File name is not valid, inform client
		console.log('\tFile "' + 
			fileName + '", update error.');
		res.status(404).sendFile(__dirname + '/html/error.html');
	}
	
});

/*
 * Event *
connection:
	- Will be fired when a host connects a socket to the server
	- Display information about the client to the log
	- Emits the event successfulConnection
	- Inner Events:
		- getAvailableFiles
 */
io.on('connection', function(socket) {
	console.log('\nNew connection:\n\tID: ' + socket.id + '\n');
	socket.emit('successfulConnection', socket.id);

	/**
	 * Event *
	 getAvailableFiles:
	 	Parameter:
			- A callback function which takes a list of file names
	 Last modified: 11/29/14
	 */
	socket.on('getAvailableFiles', function(callback) {
		console.log('Request for files received');
		var names = fileHandler.listFiles('./files/');

		callback(names);
	});
	socket.on('getFile', fileName, editMode, function(callback) {
		console.log('Request for ' + fileName + ' received');

		if (editMode) {
			// User wants to edit this file
			//TODO: Should the editor join the file room?
		} else {
			// User wants to listen to this file, add the user to the listener room of this file
			socket.join(fileName);
			// Return the text of the file to the client
			callback(fileHandler.getFile('./files/', fileName));
			//TODO: 11/29/14 Continue here!!!
		}
		fileHandler.getFile('./files/', fileName);
	});
});

/**
start:
	- Starts up the server with configured settings
Last modified: 11/29/14
 */
function start() {
	console.log("##### Server started #####");

	//TODO: Write logic for what is happening when a client is connecting

	//TODO: Write logic for what is happening when we recieve an event

	server.listen(PORT, function() {
		console.log('Server is listening on port ' + PORT);	
	});

}

exports.start = start;
