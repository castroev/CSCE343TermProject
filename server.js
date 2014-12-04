/**
Jonas Nordstrom; Ermenildo V. Castro, Jr.
server.js
-----------------------------------------------------------------
Known Bugs:


-----------------------------------------------------------------
Description:
- added fileHandler calls where fileHandler EVENT CALL stubs located
<<<<<<<<<<<<<<<<<<< MAINTAIN CONSISTENCY >>>>>>>>>>>>>>>>>>>>>>>>
Version: 0.0.4
Last Update: 12/04/14
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
Last modified: 11/30/14, J.Nordstrom
 */
io.on('connection', function(socket) {
	var interval; // Will hold the timer function
	console.log('\nNew connection:\n\tID: ' + socket.id + '\n');
	socket.emit('successfulConnection', socket.id);

	/**
	 * Event *
	 getAvailableFiles:
	 	Parameter:
			- A callback function which takes a list of file names
	 Last modified: 11/29/14, J.Nordstrom
	 */
	socket.on('getAvailableFiles', function(callback) {
		console.log('Request for files received');
		var names = fileHandler.listFiles('./files/');

		callback(names);
	});
	/**
	 * Event *
	isEditable:
		-Parameters:
			-fileName
			-callback, the callback function which returns if file is editable
	Last modified: 11/30/14, J.Nordstrom
	 */
	socket.on('isEditable', function(fileName, callback) {
		//TODO: Implement in fileHandler which checks if file is being edited
		//callback(fileHandler.isBeingEdited('/files/', fileName));
		callback(true);
	});
	/**
	 * Event *
	getFile:
		Parameters:
			- fileName
			- editMode, if it is in editing mode
			- callback, the callback function
<<<<<<< HEAD
	Last modified: 11/30/14, J.Nordstrom
	 */
	socket.on('getFile', function(fileName, editMode, callback) {
		console.log('Request for ' + fileName + ' received');

		if (editMode) {
			// User wants to edit this file
			//TODO: Should the editor join the file room?
			console.log('ID, ' + socket.id + ', edits the file "' + fileName + '"');
=======
	Last modified: 12/03/14, J.Nordstrom; Ermenildo V. Castro, Jr.
	 */
	socket.on('getFile', function(fileName, editMode, callback) {
		console.log('Request for ' + fileName + ' received');
		
		// MODIFIED 12/03/14, Ermenildo V. Castro, Jr.
		// appended AND logical operator to check if fileName is
		//		available for edit.
		// && fileHandler.isBeingEdited('/files/', fileName)
		// **NOTE**
		// PATH parameter is deprecated
		// ********
		if (editMode && fileHandler.isBeingEdited('/files/', fileName)) {
			// User wants to edit this file
			//TODO: Should the editor join the file room?
			// Response to J.Nordstrom: Ermenildo V. Castro, Jr.
			// 		YES, use trackClient in fileHandler
			console.log('ID, ' + socket.id + ', edits the file "' + fileName + '"');
			// MODIFIED 12/04/14, Ermenildo V. Castro, Jr.
			fileHandler.trackClient(fileName, socket, "ADDE");
>>>>>>> d65a3f173301b929a31f457f4e7ad0d4b09164fe
			callback("Hello world! This is just a sample text from server");
			
		} else {
			// User wants to listen to this file, add the user to the listener room of this file
			socket.join(fileName);
<<<<<<< HEAD
=======
			// MODIFIED 12/04/14, Ermenildo V. Castro, Jr.
			if(!fileHandler.trackClient(fileName, socket, "ADDL")){
				console.log("\n!!!!!!!!!!!!FALSE TRACKCLIENT!!!!!!!!\n");
			}
>>>>>>> d65a3f173301b929a31f457f4e7ad0d4b09164fe
			console.log('ID, ' + socket.id + ', joined the room "' + fileName + '"');
		}

		// Set the interval of the timer to execute every 60 seconds
		interval = setInterval(function() {
			console.log('Update is being sent to the listeners...');
			//TODO: Finish up the timer
			// Get the update from the fileHandler for the specified file
//			socket.emit('newChar', fileHandler.getFile('./files/', fileName));
			socket.emit('newChar', "Timer data");

		}, 3000);


		// Return the whole text file to user
//TODO: Implement this line		callback(fileHandler.getFile('./files/', fileName));
		callback('File test data'); // Remove this line when above line is implemented
	});
	/**
	 * Event *
	newChar:
	 	Parameters:
			- keyVal, the value of the key (ASCII) that was pressed
			- index, index of the cursor when the key was pressed
			- callback, the callback function that will confirm if the 
				operation was successful
	Last modified: 12/3/14, J.Nordstrom
	 */
	socket.on('newChar', function(keyVal, index, callback) {
		//TODO: Call appropriate function at the fileHandler
		callback(true);
	});
	/**
	 * Event *
	disconnect:
		Parameters:
		Description:
			Fires when a user disconnects
	Last modified: 12/3/14, J.Nordstrom
	 */
	socket.on('disconnect', function() {
<<<<<<< HEAD
=======
		//MODIFIED 12/04/14, Ermenildo V. Castro, Jr.
		// clear the client from current room
		fileHandler.trackClient(null, socket, "REMOVE");
		
>>>>>>> d65a3f173301b929a31f457f4e7ad0d4b09164fe
		// Clear the interval if it is set
		clearInterval(interval);
	});
});

/**
start:
	- Starts up the server with configured settings
Last modified: 11/29/14, J.Nordstrom
 */
function start() {
	console.log("##### Server started #####");
	// Start listen on port
	server.listen(PORT, function() {
		console.log('Server is listening on port ' + PORT);	

	});
}

exports.start = start;
