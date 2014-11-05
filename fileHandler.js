var fs = require('fs');

function existsFile(path) {
	process.stdout.write('fileHandler:\tChecking if file "' + path + '" exists...');
	valid = false;
	// Try to request the file
	try {
		var stat = fs.statSync(path);
		if (stat.isFile()) {
			process.stdout.write('file exists.\n');
			return true;
		} else {
			process.stdout.write('file does not exists.\n');
			return false;
		}
	} catch (ex) {
		// Something went wrong, request of file failed
		process.stdout.write('file does not exists.\n');
		return false;
	}
}

exports.existsFile = existsFile;
