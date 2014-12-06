/**
Jonas Nordstrom; Ermenildo V. Castro, Jr.
fileHandler.js
-----------------------------------------------------------------
Known Bugs:
- updateDirectory function appends EMPTY CHARACTERS into the list.
- if "pulling" from castroev MASTER repository, clean your MASTERLOG
	("non-existent" files on your local directory will cause errors)
-----------------------------------------------------------------
Description:
- removed the array.length -1 appends FOR ALL; if errors occur, re-append

<<<<<<<<<<<<<<<<<<< MAINTAIN CONSISTENCY >>>>>>>>>>>>>>>>>>>>>>>>
Version: 0.0.5
Last Update: 12/06/14
<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Available Program Functions:
- existsFile
- listFiles
- updateDirectory
- isBeingEdited
- trackClient
- getBuffer
- newChar
-----------------------------------------------------------------
References:
SmashingJsNode;
StackOverflow;
-----------------------------------------------------------------
*/

/*
FILEHANDLER OBJECTIVES 12/03/14 - 12/06/14:
^1. Implement specified EVENT CALLS from SERVER (12/03/14 specifications)
^2. HTML page FILE SELECT buttons
		calls to HTML Generation w/ fileText upload
^3. Multicast function in FH; 2d array, SocketRoom(FileName)*Nickname
		Handle disconnect/con close cases
4. FH File watch; call Multicast for ON UPDATE
5. FILE ROOM PAGE, multiple cursors
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
		rooms = new Array();
		for (i = 0; i < localFiles.length; i++){
			rooms.push(localFiles[i]);
			rooms[localFiles[i]] = new Array(21); //20 max listeners/editors; last index will store the file buffer
			for(j = 0; j < 20; j ++){
				rooms[localFiles[i]][j] = "*";//NULL VALUE
			}
			// TEST CODE--------------------------------
			//rooms[localFiles[i]].push("SUCCESS TEST!");
			//rooms[localFiles[i]][0] = "SUCESS TEST";
			//process.stdout.write("Room Key: " + rooms[localFiles[i]][0] + "\n");
			// END TEST CODE----------------------------
		}
		
		// MODIFIED 12/04/14, Ermenildo V. Castro, Jr.
		// Construct file buffer
		for(k = 0; k < localFiles.length; k++){
			if(!openFile(path, localFiles[k])){
				process.stdout.write("\n!!!!!!! ERROR OPENING FILE!!!!!!!\n");
			}
			else{process.stdout.write("\n Created Buffer: " + localFiles[k]+"\n")
				/*
				// TEST CODE
				process.stdout.write("char contents: " + localFiles[k] + "\n" );
				for(j = 0; j < rooms[localFiles[k]][20].length; j++){
					process.stdout.write("CHAR: " + rooms[localFiles[k]][20][j] + "\n");
				}
				*/
			}
		}
		
		

		return localFiles;
	}
	else{
		process.stdout.write("Enter the directory of MASTERLOG.txt");
		process.stdout.write("./files/ <--- local directory of server");
		return;
	}
}
/*
openFile
- reads the file, then creates a buffer datastructure
@param path - location of file
@param fileName - name of the file
@return TRUE for success; FALSE for fail
*/
function openFile(path, fileName){
	//process.stdout.write("openFile called.");
	var content = fs.readFileSync(path + fileName, "utf8");//blocking process
	if(!content){ // error condition
		return false;
	}
	//process.stdout.write("\n FILE CONTENT: " + fileName + "\n" + content);
	rooms[fileName][20] = content;
	return true;
}

/*
getBuffer
- get ACCESSOR
@param fileName - name of the file to retrieve buffer from
@return - the buffer for the specified file; else FALSE
*/
function getBuffer(fileName){
	if(!existsFile(fileName)){
		process.stdout.write("\n!!!!!!!NO SUCH fileName, getBuffer!!!!!!!\n");
		return false;
	}
	return rooms[fileName][20];
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
/*
newChar
- update the buffer with new data
@param keyVal - the ASCII code of the new character
@param index - cursor location corresponding to index in buffer
@param fileName - name of the file to update with new character
@return - TRUE if successful insertion; FALSE otherwise
*/
function newChar(keyVal, index, fileName){
	// parameter actual error
	if (!keyVal || !index || !existsFile(fileName)){
		process.stdout.write("Invalid Parameters, newChar: \n keyVal -" + keyVal + "\n index - " + index + "\n fileName - " + fileName + "\n"  );
		return false;
	}
	// index parameter failure
	if (index < 0 || index > rooms[fileName][20].length){
		process.stdout.write("\nInvalid Index, newChar: " + index + "\n");
		return false
	}
	var chr = String.fromCharCode(keyVal);
	if( index == rooms[fileName][20].length){
		rooms[fileName][20].push(chr);
	}
	else{
		rooms[fileName][20][index] = chr;
	}
	process.stdout.write("\n Wrote '" + chr + "' to buffer. \n");
	return true;
}
//END newChar------------------------------------------------






exports.existsFile = existsFile;
exports.listFiles = listFiles;
exports.updateDirectory = updateDirectory;
exports.trackClient = trackClient;
exports.isBeingEdited = isBeingEdited;
exports.getBuffer = getBuffer;
exports.newChar = newChar;