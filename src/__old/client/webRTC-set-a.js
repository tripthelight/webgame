// the adapter makes webrtc play better across browsers
import adapter from "webrtc-adapter";
// get the io object from socket.io
import io from "socket.io-client";

io.connect("https://localhost:9000", {
  rejectUnauthorized: false, // ONLY OK FOR LOCAL
});

// try GUM (Get User Media)
const stream = navigator.mediaDevices.getUserMedia({
  // video: true,
  audio: true,
});
