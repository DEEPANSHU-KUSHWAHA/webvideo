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
const remoteVideosContainer = document.getElementById('remoteVideos');
let localStream;
let peerConnections = {};

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localVideo.srcObject = stream;
            localStream = stream;
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

function showCreateRoomPopup() {
    document.getElementById('popup').style.display = 'block';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

function createRoom() {
    const roomId = Math.random().toString(36).substring(2, 15);
    const username = document.getElementById('popupUsername').value;
    const userId = Math.random().toString(36).substring(2, 15);
    document.getElementById('roomId').value = roomId;
    document.getElementById('uniqueId').innerText = `Your Unique ID: ${userId}`;
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.set({
        users: { [userId]: username }
    });

    const peerConnection = createPeerConnection(roomId, userId);
    handleSignaling(roomId, userId, peerConnection);

    db.ref(`rooms/${roomId}/users`).on('child_added', snapshot => {
        if (snapshot.key !== userId) {
            const newUser = snapshot.key;
            const newPeerConnection = createPeerConnection(roomId, newUser);
            handleSignaling(roomId, newUser, newPeerConnection);

            peerConnection.createOffer().then(offer => {
                peerConnection.setLocalDescription(offer);
                db.ref(`rooms/${roomId}/offers`).push({
                    userId: userId,
                    offer: offer
                });
            });
        }
    });

    hidePopup();
    startCamera();
    document.getElementById('uniqueId').innerHTML = `<a href="https://${location[_{{{CITATION{{{_1{](https://github.com/edsyang/blog/tree/2ce48a2788db8d4f4b5f5f5dc8c388799ea5c0c2/docs%2Fcourse%2Fvue%2F13-Vue.js-D.part%20four.md)
