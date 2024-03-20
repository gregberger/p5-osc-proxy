let socket;

function setup() {
  createCanvas(640, 480);
  // Replace with your server's address and port
  socket = new WebSocket('ws://localhost:3000');
  console.log('socket', socket);

  socket.onopen = function() {
    console.log("WebSocket connection established");
  }
  // listen for messages from the server
  socket.onmessage = function(event) {
        console.log('Message from server ', event.data.type);
        const message = JSON.parse(event.data);
      if (message.type === 'reload') {
        // reload page if the server sends a reload message
          window.location.reload();
      }
  }
}


function draw() {
    background(255);
    fill(255,0, 0);
    rect(mouseX, mouseY, 20, 20);

}
function mousePressed() {
  const message = {
    address: "/mouse/pressed",
    args: [
      { type: "f", value: mouseX / width },
      { type: "f", value: mouseY / height }
    ]
  };
  socket.send(JSON.stringify(message));
}