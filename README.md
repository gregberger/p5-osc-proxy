# p5osc

A simple packaged app to serve p5.js sketches locally and allow them to communicate over OSC.

## Description

The app provides an easy way to serve your p5 sketches locally, coupled with the power and flexibility of OSC communication tools.

## Dependencies

* [node.js](https://nodejs.org/)
* The app relies on the following node packages:
    * [chokidar](https://www.npmjs.com/package/chokidar) - for file system watching
    * [express](https://www.npmjs.com/package/express) - web server framework
    * [osc](https://www.npmjs.com/package/osc) - for OSC communication
    * [ws](https://www.npmjs.com/package/ws) - for WebSocket communication

## Installation

Clone the repository and install dependencies with npm:

```bash
git clone <repository_url> 
cd p5osc 
npm install
```

## Running the application

To start the application, use:

```bash
npm start
```

## Packaging the application

Compile your code using 'pkg' tool:

```bash
npm install -g pkg 
pkg .
```

## Usage

The app will serve your p5 sketches on `http://localhost:3000/` by default

The web server is configured to serve the contents of the `public` directory. If dir doesnt exist, app will create it with the necessary files.
You can also place your p5 sketch page directly in the directory.
If you want to serve your sketches from a different directory, you can pass the path as an argument to the app:

```bash
npm start /path/to/your/sketches
```

The app will watch for changes in the sketch directory and reload the page when a change is detected.

It will also create a WebSocket server on `ws://localhost:8080/` and an OSC server on `udp://localhost:57121/`

To send OSC messages to your sketch, use the following format:

```javascript
osc.send({
    address: '/address',
    args: [
        {
            type: 'f',
            value: 0.5
        },
        {
            type: 's',
            value: 'hello'
        }
    ]
});
``` 




## Author

G. Berger, for more information, please contact through [github](https://github.com/gregberger).