var fs = require("fs");
console.log("Starting to write file");
fs.writeFile("./async.txt", "Hello world again!", function(error) {
	console.log("File has been written");
});
console.log("Carry on executing");
