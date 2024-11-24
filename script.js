const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
let localStream;
let remoteStream;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        localVideo.srcObject = stream;
        localStream = stream;
    })
    .catch(error => {
        console.error('Error accessing media devices.', error);
    });

function joinRoom() {
    const roomId = document.getElementById('roomId').value;
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            // Handle incoming signaling data
        }
    });

    // Logic to send signaling data
}

function joinRandomRoom() {
    const roomId = Math.random().toString(36).substring(2, 15);
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            // Handle incoming signaling data
        }
    });

    console.log('Joining random room:', roomId);
}
