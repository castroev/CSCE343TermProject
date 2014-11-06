var fs = require("fs");
console.log("Starting to read the file");
var content = fs.readFileSync("./files/sample.txt", "utf8");
console.log("File contents: " + content);
console.log("Carry on executing");
