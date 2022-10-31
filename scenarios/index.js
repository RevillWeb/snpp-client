// Include our local copy of the SNPP client
const client = require("../lib/snpp");
const cla = require("command-line-args");

const options = cla([
    { name: "verbose", type: Boolean, defaultValue: false },
    { name: "host", type: String },
    { name: "port", type: Number, defaultValue: 444 },
    { name: "username", type: String, defaultValue: null },
    { name: "password", type: String, defaultValue: null },
    { name: "pagerId", type: Number },
    { name: "text", type: String }
]);
// "35.179.63.2"
if (!options.host) {
    console.error(`A host (e.g. 127.0.0.1) must be specified`);
    process.exit();
}
if (!options.pagerId) {
    console.error(`A pager ID (e.g. 1234) must be specified`);
    process.exit();
}

// now we'll send a "page"
client.page({
    host: options.host,
    port: options.port,
    username: options.username,
    password: options.password,
    message: {
        pagerId: options.pagerId,
        text: options.text
    },
    verbose: options.verbose
}, function (result) {
    if (result.status === "success") {
        console.log("✅ Page sent successfully!");
    } else {
        console.log('Error: ' + result.message);
    }
});



