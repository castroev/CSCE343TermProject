/*
* Jonas Nordstrom; Ermenildo Castro Jr.
* Server - CSCE343 Fall Project
*/
var express = require('express');
var app = express();
var http = require('http');
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

// Route when a file is tried to get retreived
app.get('/file/:name', function(req, res) {
	console.log('\nIP: ' + req.ip);
	var fileName = req.params.name;
	console.log('\tFile "' + fileName + '" is being requested');

	// Validate if the file name is valid
	if (fileHandler.existsFile('files/' + fileName)) {
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

/*
* Routing ends
*/

function start() {
	console.log("##### Server started #####");
	var server = http.createServer(app);

	// Will be executed when a user is being connected
	server.on('connection', function(socket) {
		console.log('\nNew connection:\n\tIP: ' + socket.address().address + '\n\tPort: ' +
			socket.address().port + '\n');
	});

	// Will be fired when a client sends an character update
	server.on('charUpdate', function(character, index) {
		console.log('charUpdate has been called\n\tValue of character: ' +
			character + '\n\tValue of index: ' + index);
	});

	//TODO: Write logic for what is happening when a client is connecting

	//TODO: Write logic for what is happening when we recieve an event

	console.log('Server starts listening on port ' + PORT);
	server.listen(PORT);

}

exports.start = start;
