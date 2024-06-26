const express = require('express');
const WebSocket = require('ws');
const osc = require('osc');
const https = require('https');
const chokidar = require('chokidar');
const fs = require("fs");
const app = express();
const server = https.createServer({
    key: fs.readFileSync('certificates/server.key'),
    cert: fs.readFileSync('certificates/server.cert')
},app);
const wss = new WebSocket.Server({ server });

// use the public directory to serve static files
// get it from arguments
const publicDir = process.argv[2] || `${process.cwd()   }/public`;
console.log('publicDir', publicDir);
if (!publicDir || ! fs.existsSync(publicDir)) {
    console.log('No public directory found. Creating one...');
    const publicDirCreator = require('./lib/publicDirCreator');
    publicDirCreator();
}

// use the public directory to serve static files
app.use(express.static(publicDir));
// use chokidar to watch for changes in the public directory
// and reload the server when a change is detected
const watcher = chokidar.watch(`${publicDir}/sketch.js`);
watcher.on('change', () => {
    console.log('File changed. Reloading server...');
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({type: 'reload'}));
        }
    });
});

let oscOutPort = process.env.OSC_OUT_PORT || 57120;
const udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    remoteAddress: "127.0.0.1",
    remotePort: oscOutPort,
});

udpPort.open();

wss.on('connection', function connection(ws) {
    console.log('ze web socket server is listening ');
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
         const msg = JSON.parse(message);
        udpPort.send({
            address: msg.address,
            args: msg.args
        });
    });
});

console.log(`sending osc messages on port ${oscOutPort}`)
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server started on http://localhost:${port}`));
