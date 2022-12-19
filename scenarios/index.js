// Include our local copy of the SNPP client
const SnppClient = require("../lib/SnppClient.js");
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

if (!options.host) {
    console.error(`A host (e.g. 127.0.0.1) must be specified`);
    process.exit();
}
if (!options.pagerId) {
    console.error(`A pager ID (e.g. 1234) must be specified`);
    process.exit();
}

const client = new SnppClient(options.port, options.host);

// Connect to the SNPP server
console.log(`--> Open Connection`);
client.connect().then(res => {
    // Login if username and password has been provided
    client.login(options.username, options.password).then(res => {
        // Set the pager ID
        client.page(options.pagerId).then(res => {
            // Set the message text
            client.message(options.text).then(res => {
                // Send the message
                client.send().then(res => {
                    // Quit
                    client.quit().then(res => {
                        console.log("✅ Page sent successfully!");
                        process.exit();
                    }).catch(error => {
                        console.error("Could not quit:", error);
                        process.exit();
                    });
                }).catch(error => {
                    console.error("Message not sent:", error);
                    process.exit();
                });
            }).catch(error => {
                console.error("Message not accepted:", error);
                process.exit();
            });
        }).catch(error => {
            console.error("Pager ID not accepted:", error);
            process.exit();
        });
    }).catch(error => {
        console.error("Unable to login:", error);
        process.exit();
    });
    
});