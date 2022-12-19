const net = require("net");

module.exports = class SnppClient {

    static _connection;
    static _port;
    static _host;
    static _callbacks;

    constructor(port, host) {
        this._port = port || 444;
        this._host = host || "localhost";
        this._connection = new net.Socket();
        this._callbacks = {};        
    }

    _onData = (data) => {
        const dataString = data.toString();
        const lines = dataString.split("\r\n").filter(l => l); // Filter out empty lines

        lines.forEach(line => {
            const code = line.toString().substring(0, 3);
            const response = line.toString().substring(4);
            if (this._callbacks[code] && typeof this._callbacks[code] === "function") {
                console.log(`<-- ${code}, ${response}`);
                this._callbacks[code](response);
            }
        });
    }

    _write(data) {
        console.log(`--> ${data.replace("\r\n", "")}`);
        this._connection.write(data);
    }

    on(code, callback) {
        this._callbacks[code] = callback;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this._connection.connect(this._port, this._host);
            this.on(220, response => {
                resolve(response);
            });
            this._connection.on("data", this._onData);
        });
        
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            if (username && password) {
                this.on(250, resolve);
                this.on(550, reject);
                this._write(`LOGI ${username} ${password} \r\n`);
            } else {
                resolve();
            }
        });
    }

    page(pagerId) {
        return new Promise((resolve, reject) => {
            this.on(250, resolve);
            this.on(550, reject);
            this._write(`PAGE ${pagerId}\r\n`);
        });
    }

    message(text) {
        return new Promise((resolve, reject) => {
            this.on(250, resolve);
            this.on(550, reject);
            this._write(`MESS ${text}\r\n`);
        });
    }
    
    send() {
        return new Promise((resolve, reject) => {
            this.on(250, resolve);
            this.on(550, reject);
            this._write(`SEND \r\n`);
        });
    }

    quit() {
        return new Promise((resolve, reject) => {
            this.on(221, resolve);
            this.on(550, reject);
            this._write(`QUIT \r\n`);
        });
    }

}