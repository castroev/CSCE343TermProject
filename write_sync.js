var fs = require("fs");
console.log("Starting");
fs.writeFile("./write_sync.txt", "Hello world! Synchronous!");
console.log("Finished!");
