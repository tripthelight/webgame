import {io} from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";

const divSelectRoom = document.getElementById("selectRoom");
const divConsultingRoom = document.getElementById("consultingRoom");
const inputRoomNumber = document.getElementById("roomNumber");
const btnGoRoom = document.getElementById("goRoom");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let roomNumber, localStream, removeStream, rtcPeerConncetion, isCaller;

const iceServer = {
  iceServer: [{urls: "stun:stun.services.mozilla.com"}, {urls: "stun:stun.l.google.com:19302"}],
};

const streamConstraints = {
  audio: true,
  // video: true, // TODO: PC방 작업 중, video 없음
};

const socket = io();

btnGoRoom.onclick = () => {
  if (inputRoomNumber.value === "") {
    alert("Please type a room name");
  } else {
    roomNumber = inputRoomNumber.value;
    socket.emit("create or join", roomNumber);
    divSelectRoom.style = "display: none";
    divConsultingRoom.style = "display: block";
  }
};

socket.on("created", room => {
  navigator.mediaDevices
    .getUserMedia(streamConstraints)
    .then(stream => {
      localStream = stream;
      // localVideo.srcObject = stream; // TODO: PC방 작업 중, video 없음
      isCaller = true;
    })
    .catch(err => {
      console.log("An error ocurred", err);
    });
});
