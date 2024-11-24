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
let currentAction = '';

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
    document.getElementById('popupTitle').innerText = 'Create Room';
    document.getElementById('popupButton').setAttribute('onclick', 'handlePopupAction()');
    document.getElementById('popupRoomId').style.display = 'none';
    document.getElementById('popup').style.display = 'block';
    currentAction = 'create';
}

function showJoinRoomPopup() {
    document.getElementById('popupTitle').innerText = 'Join Room';
    document.getElementById('popupButton').setAttribute('onclick', 'handlePopupAction()');
    document.getElementById('popupRoomId').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
    currentAction = 'join';
}

function showRandomRoomPopup() {
    document.getElementById('popupTitle').innerText = 'Join Random Room';
    document.getElementById('popupButton').setAttribute('onclick', 'handlePopupAction()');
    document.getElementById('popupRoomId').style.display = 'none';
    document.getElementById('popup').style.display = 'block';
    currentAction = 'random';
}

function hidePopup() {
    document.getElementById('popup').style.display = 'none';
}

function handlePopupAction() {
    const username = document.getElementById('popupInput').value;
    if (currentAction === 'create') {
        createRoom(username);
    } else if (currentAction === 'join') {
        const roomId = document.getElementById('popupRoomId').value;
        joinRoom(username, roomId);
    } else if (currentAction === 'random') {
        joinRandomRoom(username);
    }
    hidePopup();
}

function createRoom(username) {
    const roomId = Math.random().toString(36).substring(2, 15);
    const userId = Math.random().toString(36).substring(2, 15);
    document.getElementById('uniqueId').innerText = `Room ID: ${roomId}, Your Unique ID: ${userId}`;
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

    startCamera();
}

function joinRoom(username, roomId) {
    const userId = Math.random().toString(36).substring(2, 15);
    document.getElementById('uniqueId').innerText = `Your Unique ID: ${userId}`;
    const roomRef = db.ref('rooms/' + roomId);

    roomRef.child('users').child(userId).set(username);

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

    startCamera();
}

function joinRandomRoom(username) {
    db.ref('rooms').once('value', snapshot => {
        const rooms = snapshot.val();
        const roomIds = Object.keys(rooms);
        const randomRoomId = roomIds[Math.floor(Math.random() * roomIds.length)];
        joinRoom(username, randomRoomId);
    });
}

function createPeerConnection(roomId, userId) {
    const peerConnection = new RTCPeerConnection();
    peerConnections[userId] = peerConnection;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = event => {
        const [stream] = event.streams;
        const existingVideo = document.getElementById(userId);
        if (existingVideo) {
            existingVideo.srcObject = stream;
        } else {
            const remoteVideo = document.createElement('video');
            remoteVideo.id = userId;
            remoteVideo.autoplay = true;
            remoteVideo.srcObject = stream;
            remoteVideosContainer.appendChild(remoteVideo);
        }
    };

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            db.ref(`rooms/${roomId}/candidates/${userId}`).push({
                candidate: event.candidate
            });
        }
    };

    return peerConnection;
}

function handleSignaling(roomId, userId, peerConnection) {
    db.ref(`rooms/${roomId}/offers`).on('child_added', snapshot => {
        const data = snapshot.val();
        if (data.userId !== userId) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            peerConnection.createAnswer().then(answer => {
                peerConnection.setLocalDescription(answer);
                db.ref(`rooms/${roomId}/answers`).push({
                    userId: userId,
                    answer: answer
                });
            });
        }
    });

    db.ref(`rooms/${roomId}/answers`).on('child_added', snapshot => {
        const data = snapshot.val();
        if (data.userId !== userId) {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    });

    db.ref(`rooms/${roomId}/candidates`).on('child_added', snapshot => {
        const data = snapshot.val();
        if (data.userId !== userId && data.candidate) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });
}

window.onload = startCamera;
