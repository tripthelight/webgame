import "./scss/common.scss";
import "./common.js";

console.log("Webpack and SCSS setup with HMR complete!! ");

// TODO: webRTC 진행중 ##########################################
let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const myScoreElement = document.getElementById("myScore");
const opponentScoreElement = document.getElementById("opponentScore");
let myScore = 0;

function initWebRTC() {
  localConnection = new RTCPeerConnection(configuration);
  sendChannel = localConnection.createDataChannel("sendDataChannel");

  sendChannel.onopen = () => {
    console.log("Data channel opened");
  };

  sendChannel.onclose = () => console.log("Data channel closed");

  localConnection.onicecandidate = e => {
    if (e.candidate) {
      console.log("Local ICE candidate:", e.candidate);
      document.getElementById("localICE").value = JSON.stringify(e.candidate);
    }
  };

  remoteConnection = new RTCPeerConnection(configuration);

  remoteConnection.ondatachannel = e => {
    receiveChannel = e.channel;
    receiveChannel.onmessage = e => {
      opponentScoreElement.textContent = e.data;
    };
    console.log("Data channel received:", e.channel);
  };

  remoteConnection.onicecandidate = e => {
    if (e.candidate) {
      console.log("Remote ICE candidate:", e.candidate);
      document.getElementById("localICE").value = JSON.stringify(e.candidate);
    }
  };

  remoteConnection.onconnectionstatechange = () => {
    console.log("Remote connection state change:", remoteConnection.connectionState);
  };

  localConnection.onconnectionstatechange = () => {
    console.log("Local connection state change:", localConnection.connectionState);
  };
}

document.getElementById("createOfferBtn").addEventListener("click", () => {
  localConnection
    .createOffer()
    .then(offer => {
      localConnection.setLocalDescription(offer);
      document.getElementById("localOffer").value = JSON.stringify(offer);
      console.log("Created offer:", offer);
    })
    .catch(error => console.error("Error creating offer:", error));
});

document.getElementById("remoteAnswerBtn").addEventListener("click", () => {
  const answer = JSON.parse(document.getElementById("remoteAnswer").value);
  localConnection
    .setRemoteDescription(answer)
    .then(() => console.log("Remote description set:", answer))
    .catch(error => console.error("Error setting remote description:", error));
});

document.getElementById("scoreBtn").addEventListener("click", () => {
  if (sendChannel && sendChannel.readyState === "open") {
    myScore = document.getElementById("scoreInput").value;
    myScoreElement.textContent = myScore;
    sendChannel.send(myScore);
  } else {
    console.log("Data channel is not open. Current state:", sendChannel.readyState);
  }
});

document.getElementById("addLocalIceBtn").addEventListener("click", () => {
  const iceCandidate = new RTCIceCandidate(JSON.parse(document.getElementById("localICE").value));
  remoteConnection
    .addIceCandidate(iceCandidate)
    .then(() => console.log("Added local ICE candidate:", iceCandidate))
    .catch(error => console.error("Error adding local ICE candidate:", error));
});

document.getElementById("remoteICEBtn").addEventListener("click", () => {
  const iceCandidate = new RTCIceCandidate(JSON.parse(document.getElementById("remoteICE").value));
  localConnection
    .addIceCandidate(iceCandidate)
    .then(() => console.log("Added remote ICE candidate:", iceCandidate))
    .catch(error => console.error("Error adding remote ICE candidate:", error));
});

document.onreadystatechange = () => {
  let state = document.readyState;
  if (state === "interactive") {
  } else if (state === "complete") {
    console.log("complete");
    initWebRTC();
  }
};
