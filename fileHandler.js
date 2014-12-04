/**
Jonas Nordstrom; Ermenildo V. Castro, Jr.
fileHandler.js
-----------------------------------------------------------------
Known Bugs:
updateDirectory function appends EMPTY CHARACTERS into the list.

-----------------------------------------------------------------
Description:
- removed the array.length -1 appends FOR ALL; if errors occur, re-append
<<<<<<<<<<<<<<<<<<< MAINTAIN CONSISTENCY >>>>>>>>>>>>>>>>>>>>>>>>
Version: 0.0.4
Last Update: 12/04/14
<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Available Program Functions:
- existsFile
- listFiles
- updateDirectory
- isBeingEdited
- trackClient

- openFile TODO
-----------------------------------------------------------------
References:
SmashingJsNode;
StackOverflow;
-----------------------------------------------------------------
*/
var fs = require('fs');
var localFiles;
var rooms;
/**
MODIFIED 11/16/14
- Determines if File exists in server local directory AND if File exists within the localFiles array
- DEPENDENCY: listFiles(path) MUST BE CALLED PRIOR TO existsFile(path)
 */
function existsFile(path) {
	process.stdout.write('fileHandler:\tChecking if file "' + path + '" exists...');
	
	// Try to request the file
	try {
		//MODIFIED 11/16/14
		//COMMENTED OUT:
		//var stat = fs.statSync('./files/' + path);
		
		if (contains(path)) {
			process.stdout.write('file exists.\n');
			return true;
		} else {
			process.stdout.write("contains val: " + contains(path) + "\n");
			process.stdout.write('file does not exists.\n');
			return false;
		}
	} catch (ex) {
		// Something went wrong, request of file failed
		process.stdout.write('EXCEPTION: file does not exists.\n');
		return false;
	}
}
/**
listFiles:
- Will create an dictionary of all available files on the local server
- Uses a master file, MASTERLOG, as a record of all available files available to the localhost server
- localHost server may update MASTERLOG using additional functions such as "AddFiles" [TODO] which will write to MASTERLOG
- @param path: the local directory to MASTERLOG.txt
*/
function listFiles(path){
	if(path){
		process.stdout.write("listFiles called \n");
		var str = fs.readFileSync(path + "MASTERLOG.txt", "utf8"); //BLOCKING PROCESS
		//MASTERLOG IS CSV
		localFiles = str.split(',');
		//CLEAN THE STRINGS
		for (i = 0; i < localFiles.length; i++){
			localFiles[i] = localFiles[i].trim();
		}
		// MODIFIED 12/03/14, Ermenildo V. Castro, Jr.
		// replaced INTEGRITY TEST.
		// Populate ROOMS datastructure
		process.stdout.write("POPULATE ROOMS: \n");
		rooms = new Array(localFiles.length);
		for (i = 0; i < localFiles.length; i++){
			rooms.push(localFiles[i]);
			rooms[localFiles[i]] = new Array(20); //20 max listeners/editors
			for(j = 0; j < 20; j ++){
				rooms[localFiles[i]][j] = "*";//NULL VALUE
			}
			// TEST CODE--------------------------------
			//rooms[localFiles[i]].push("SUCCESS TEST!");
			//rooms[localFiles[i]][0] = "SUCESS TEST";
			//process.stdout.write("Room Key: " + rooms[localFiles[i]][0] + "\n");
			// END TEST CODE----------------------------
		}
<<<<<<< HEAD
=======
		
>>>>>>> d65a3f173301b929a31f457f4e7ad0d4b09164fe

		return localFiles;
	}
	else{
		process.stdout.write("Enter the directory of MASTERLOG.txt");
		process.stdout.write("./files/ <--- local directory of server");
		return;
	}
}
/**
contains
- Determines if localDirectory contains specified file
- @param fname: name of file
- @return TRUE for file in localDirectory; else FALSE
*/
function contains(fname){
	process.stdout.write("CONTAINS() called for fname: " + fname+"\n");
	if(fname){
		for (i = 0; i < localFiles.length; i++){
			if(localFiles[i] == fname){
				process.stdout.write("RETURNED TRUE \n");
				return true;
			}
			else{process.stdout.write("Searched " +i+": " + localFiles[i] + "\n");}
		}
		process.stdout.write("RETURNED FALSE \n");
		return false;
	}
	else{
		process.stdout.write("Invalid fname, " + fname);
		process.stdout.write("RETURNED FALSE");
		return false;
	}
}
/**
updateLocalDirectory
- @param cmd: 
		- "ADD" : adds the file to the localFiles array
		- "DELETE" : removes the file from the localFiles array
		- "REFRESH" : update the file contained in the localFiles array
- @param fname: the filename of file to be modified by CMD
- @param data: string or buffer; used only for CMD REFRESH
- @param path: location of file 
- @return TRUE for successful update; else FALSE
*/
function updateDirectory(cmd, fname, path, data){
	var str;
	fname = fname.trim();
	cmd = cmd.trim();
	path = path.trim();
	//set default path
	if(!path){
		path = "./files/"
	}
	if (cmd.toUpperCase() == "ADD"){
		if(fname){
			process.stdout.write("updateDirectory ADD fname: " + fname + "\n");
			localFiles[localFiles.length] = fname;
			//recursive call update MASTERLOG
			process.stdout.write("localFiles ADD: " + localFiles.toString() + "\n");
			//create instance of file on local server file directory
			fs.writeFile(path + fname, data, function(err){
				if(err){
					process.stdout.write("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! \n");
					process.stdout.write("Writing to local directory FAILED \n");
					process.stdout.write("!!!!!!!!!!!!!!!!!!!!!!!!!!!!! \n");
				}
				else{
					process.stdout.write("Successful write to local directory. \n");
				}
			});
			return updateDirectory("REFRESH", "MASTERLOG.txt", path, localFiles.toString());
		}
		else{
			process.stdout.write("Invalid filename, fname" + fname);
			return false;
		}
	}
	else if (cmd.toUpperCase() == "DELETE"){
		if(fname){
			process.stdout.write("updateDirectory DELETE fname: " + fname);
			//TODO TEST:
			contains(fname);
			for(i = 0; i < localFiles.length; i++){
				//length conditions are to remove EMPTY CHARACTERS, see KNOWN BUGS in header
				if(localFiles[i] == fname || localFiles[i].length == 0 || localFiles[i].length == 1){
					localFiles.splice(i, 1);
					process.stdout.write("\n-----------------------------\n");
					process.stdout.write("Deleted all " + fname + "\n");
					process.stdout.write("\n-----------------------------\n");
				}
			}
			//recursive call update MASTERLOG
			return updateDirectory("REFRESH", "MASTERLOG.txt", path, localFiles.toString());
		}else{
			process.stdout.write("Invalid filename, fname" + fname);
			return false;
		}
	}
	else if (cmd.toUpperCase() == "REFRESH"){
		process.stdout.write("updateDirectory REFRESH: " + fname +" : " + path +" : " + data + "\n");
		if(fname && data && contains(fname) && path){
			fs.writeFile(path + fname, data, function(error){
				process.stdout.write("REFRESH OCCURRED\n");
			});
			return true;
		}
		else{
			process.stdout.write("Invalid fname, path, or data: " + fname +" : " + path +" : " + data);
			return false;
		}
	}
	else{process.stdout.write("Invalid CMD argument, must be {ADD, DELETE, REFRESH}"); return false;}

}

// TO IMPLEMENT 12/03/14-----------------------------------------------------------------------------------------
// SATISFY SERVER SPECIFIED EVENT CALLS:
/**
	 * Event *
	newChar:
	 	Parameters:
			- keyVal, the value of the key (ASCII) that was pressed
			- index, index of the cursor when the key was pressed
			- callback, the callback function that will confirm if the 
				operation was successful
				function(keyVal, index, callback)
	Last modified: 12/3/14
	 */
/**
	 * Event *
	isEditable:
		-Parameters:
			-fileName
			-callback, the callback function which returns if file is editable
	/TODO: Implement in fileHandler which checks if file is being edited
	//callback(fileHandler.isBeingEdited('/files/', fileName));
	Last modified: 11/30/14, J.Nordstrom
	 */
// END SERVER SPECIFIED EVENT CALLS ----------------------------------
/*
FILEHANDLER OBJECTIVES 12/03/14 - 12/04/14:
1. Implement specified EVENT CALLS from SERVER (12/03/14 specifications)
2. HTML page FILE SELECT buttons
		calls to HTML Generation w/ fileText upload
3. Multicast function in FH; 2d array, SocketRoom(FileName)*Nickname
		Handle disconnect/con close cases
4. FH File watch; call Multicast for ON UPDATE
5. FILE ROOM PAGE, multiple cursors
*/
//END DOCUMENTATION----------------------------------------------------------------------------------------------
/*
isBeingEdited
- Function determines if the specified file is being edited by a client
@param path - a string to the file directory of the server
	**NOTE** 
	DEPRECATE @param path
	********
@param fileName - a string containing the specified fileName
@return - TRUE if file is being edited; FALSE if file is available to be edited
*/
function isBeingEdited(path, fileName){
	for(i = 0; i < 20; i++){
		if(rooms[fileName][i] != "*" && rooms[fileName][i].type == "EDITOR"){
			process.stdout.write(fileName + " is being edited by " + rooms[fileName][i].sckt.id + "\n");
			return true;
		}
	}
	process.stdout.write(fileName + " available for edit.");
	return false;
}
//END isBeingEdited--------------------------------------

/*
trackClient
- Function will add Clients to datastructure to manage editors;
- Modifies global structure, ROOMS: connections associated with each fileName, 2D array
- 
@param fileName - the file name of the file to be edited
@param socket - socket object of client; unique client identity
@param cmd: a string
	- "ADDE" - will add the socket as an EDITOR for the file
	- "ADDL" - will add the socket as a LISTENER for the file
	- "REMOVE" - will remove the socket from the file
@return - TRUE for successful addition, FALSE otherwise
*/
function trackClient(fileName, socket, cmd){
	process.stdout.write("\nTrackClient Called: \n");
	if((!existsFile(fileName) && cmd != "REMOVE") || !socket || !cmd ){
		process.stdout.write("Invalid Arguments, trackClient: \n" + fileName + "\n" + socket + "\n" + cmd + "\n");
		//return false;
	}
	// nClient object to retain client information
	var nClient = {
		sckt: socket,
		type: 'UNASSIGNED',
	};
	// call helper function
	var rStatus = getAvailableRoom(fileName);
	process.stdout.write("\n Room Status:" + rStatus +"\n");
	if(cmd.toUpperCase() == "ADDE"){
		process.stdout.write("\n ADDE EXECUTE: \n");
		nClient.type = "EDITOR";
		if (rStatus != -1){
			rooms[fileName][rStatus] = nClient;
			process.stdout.write("Added Client: \nID:" + nClient.sckt.id + "\n fileName: " + fileName + "\n RoomIndex: " + rStatus + "\n Type: " + nClient.type + "\n");
			return true;
		}
	}
	else if(cmd.toUpperCase() == "ADDL"){
		process.stdout.write("\n ADDL EXECUTE: \n");
		nClient.type = "LISTENER";
		if (rStatus != -1){
			rooms[fileName][rStatus] = nClient;
			process.stdout.write("Added Client: \nID:" + nClient.sckt.id + "\n fileName: " + fileName + "\n RoomIndex: " + rStatus + "\n Type: " + nClient.type + "\n");
			return true;
		}
	}
	else if(cmd.toUpperCase() == "REMOVE"){
		process.stdout.write("\n REMOVE EXECUTE: \n");
		var cPos = findClient(socket);
		if (cPos == -1){return false;} // error condition
		process.stdout.write("\n CPos: "+ cPos +" \n");
		rooms[cPos[0]].splice(cPos[1], 1);
		process.stdout.write("Removed Client: \nID:" + nClient.sckt.id + "\n fileName: " + fileName + "\n RoomIndex: " + cPos + "\n");
		return true;
	}
	//process.stdout.write("\n INVALID COMMAND ARGUMENT: "+ cmd +" \n");
	return false;
}
//END trackClient----------------------------------------
// getAvailableRoom(room)
// acquires the index of an available space within the specified room;
// private helper;
// @param room - the room namespace
// @return - an integer indicating the index of an available space; -1 for error
function getAvailableRoom(room){
	if(!room || !rooms[room]){return -1;} // error condition checking
	for (i = 0; i < 20; i++){
		if(rooms[room][i] == "*"){
			return i;
		}
	}
	return -1;
}
// END getAvailableRoom-----------------------------------

/*
findClient
Searches the rooms for the designated socket
@param room - room namespace
@param sckt - socket of the client
@return - an array containing location info
	argR[0] = namespace
	argR[1] = roomNumber
	-1 = error occurred
// presuming valid sckt
// private function
*/
function findClient(sckt){
	var room;
	var argR = new Array(2);
	for(j = 0; j < localFiles.length; j++){
		room = localFiles[j];
		for(i=0; i < 20; i++){
			if(rooms[room][i].sckt == sckt){
				argR[0] = room;
				argR[1] = i;
				return argR;
			}
		}
	}
	return -1;
}
// END findClient ------------------------------------------









exports.existsFile = existsFile;
exports.listFiles = listFiles;
exports.updateDirectory = updateDirectory;
<<<<<<< HEAD
=======
exports.trackClient = trackClient;
exports.isBeingEdited = isBeingEdited
>>>>>>> d65a3f173301b929a31f457f4e7ad0d4b09164fe
