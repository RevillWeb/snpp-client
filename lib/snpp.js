const net = require("net");

const defaults = {
    port: 444,
    host: "localhost"
};

module.exports.page = (options, callback) => {

    // validate parameters
    if (options === undefined || options === null) {
        callback({
            status: "error",
            message: "message not defined"
        });

        return;
    }

    // create the network client
    const client = new net.Socket();
    const port = options.port || defaults.port;
    const host = options.host || defaults.host;

    // connect to the server
    client.connect(port, host, () => {});

    client.on("data", data => {

        const dataString = data.toString();
        const lines = dataString.split("\r\n").filter(l => l); // Filter out empty lines

        lines.forEach(line => {
            const code = line.toString().substring(0, 3);
            const response = line.toString().substring(4);

            if (options.verbose) console.log(`➡ ${code}: ${response}`);
            
            if (code == 220) {
                if (options.username && options.password) {
                    client.write('LOGI ' + options.username + " " + options.password + "\r\n");    
                }
                client.write('PAGE ' + options.message.pagerId + "\r\n");
                client.write('MESS ' + options.message.text + "\r\n");
                client.write('SEND' + "\r\n");
                client.write('QUIT' + "\r\n");
            }
    
            if (code == 221) {
                client.destroy();
                callback({
                    status: "success",
                    message: "message sent"
                });
            }
        });
    });
};
