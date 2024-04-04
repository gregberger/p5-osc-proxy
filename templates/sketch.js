let socket;

let video;
let poseNet;
let poses = [];


function setup() {
    createCanvas(640, 480);

    intiServerCommunication();
    // On crée l'élément video dans la page
    video = createCapture(VIDEO);
    video.size(width, height);
    // On crée un nouveau modèle PoseNet avec une seule détection
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function (results) {
        poses = results;
    });
    // On cache l'élément video, et on affiche seulement le canvas
    video.hide();
}


function modelReady() {
    // la fonction est appelée lorsque le modèle est prêt
    // pour l'instant on ne fait rien

}

function draw() {
    background(255);
    // On affiche la vidéo dans le canvas
    // cela permet de voir ce que la caméra voit mais ce n'est pas obligatoire
    image(video, 0, 0, width, height);
    // si il y a des poses détectées
    if(poses.length > 0){
        // on récupère la première pose et on envoit un message au serveur
        sendFirstPoseCoordinates();
    }

}

function sendFirstPoseCoordinates() {
    // récupère la première pose
    const pose = poses[0].pose;
    // on boucle sur les keypoints de la pose
    for (let i = 0; i < pose.keypoints.length; i++) {
        const keypoint = pose.keypoints[i];
        // on affiche un point rouge pour chaque keypoint
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        // on envoit un message pour chaque keypoint
        sendMessage(keypoint);
    }
}

function sendMessage(keypoint) {
    // on crée un message OSC
    const message = {
        address: `/posenet/${keypoint.part}`, // l'adresse est composée de /posenet/ et du nom de la partie du corps
        args: [
            {type: "f", value: keypoint.position.x / width},
            {type: "f", value: keypoint.position.y / height}
        ]
    };
    // on envoit le message au serveur
    socket.send(JSON.stringify(message));

}

function mousePressed() { // utilisé pour le test
    const message = {
        address: "/mouse/pressed",
        args: [
            {type: "f", value: mouseX / width},
            {type: "f", value: mouseY / height}
        ]
    };
    socket.send(JSON.stringify(message));
}

// Cette méthode initialise la communication avec le serveur via WebSockets
// elle est fournie pour vous éviter de répéter le code
function intiServerCommunication() {
    // Remplacez par l'adresse et le port de votre serveur (voir le fichier server.js)
    socket = new WebSocket('wss://localhost:3000');
    socket.onopen = function () {
        console.log("WebSocket connection established");
    }
    // écoute les messages du serveur
    socket.onmessage = function (event) {
        console.log('Message from server ', event.data.type);
        const message = JSON.parse(event.data);
        if (message.type === 'reload') {
            // recharge la page si le serveur envoie un message de rechargement
            // cela permet de recharger le code de la page si vous modifiez ce fichier
            window.location.reload();
        }
    }
}
