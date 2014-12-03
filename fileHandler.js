/**
Jonas Nordstrom; Ermenildo V. Castro, Jr.
fileHandler.js
-----------------------------------------------------------------
Known Bugs:
updateDirectory function appends EMPTY CHARACTERS into the list.

-----------------------------------------------------------------
Description:
<<<<<<<<<<<<<<<<<<< MAINTAIN CONSISTENCY >>>>>>>>>>>>>>>>>>>>>>>>
Version: 0.0.3
Last Update: 11/25/14
<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
Available Program Functions:
- existsFile
- listFiles
- updateDirectory
- openFile TODO
-----------------------------------------------------------------
References:
SmashingJsNode;
StackOverflow;
-----------------------------------------------------------------
*/
var fs = require('fs');
var localFiles;
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
- Will create a dictionary of all available files on the local server
- Uses a master file, MASTERLOG, as a record of all available files available to the localhost server
- localHost server may update MASTERLOG using additional functions such as "AddFiles" which will write to MASTERLOG
- @param path: the local directory to MASTERLOG.txt
- @return localFiles - the array containing all files in the current directory
*/
function listFiles(path){
	if(path){
		process.stdout.write("listFiles called \n");
		var str = fs.readFileSync(path + "MASTERLOG.txt", "utf8"); //BLOCKING PROCESS
		//MASTERLOG IS CSV
		localFiles = str.split(',');
		//CLEAN THE STRINGS
		for (i = 0; i < localFiles.length -1; i++){
			localFiles[i] = localFiles[i].trim();
		}
		//UPDATE 11/25/14
		return localFiles;
		// Test localFiles integrity
		/*
		process.stdout.write("localFiles INTEGRITY TEST: TODO \n");
		for (i = 0; i < localFiles.length - 1; i++){
			process.stdout.write("Key " + i + ": " + localFiles[i] + "\n");
		}
		*/
	}
	else{
		process.stdout.write("Enter the directory of MASTERLOG.txt");
		process.stdout.write("./files/ <--- local directory of server");
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
		for (i = 0; i < localFiles.length - 1; i++){
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
			for(i = 0; i < localFiles.length -1; i++){
				//length conditions are to remove EMPTY CHARACTERS, see KNOWN BUGS in header
				if(localFiles[i] == fname || localFiles[i].length == 0 || localFiles[i].length == 1){
					localFiles.splice(i, 1);
					process.stdout.write("-----------------------------\n");
					process.stdout.write("Deleted all " + fname + "\n");
					process.stdout.write("-----------------------------\n");
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

exports.existsFile = existsFile;
exports.listFiles = listFiles;
exports.updateDirectory = updateDirectory;