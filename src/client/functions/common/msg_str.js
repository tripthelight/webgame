import {countryCode} from "./country_code.js";

const countryMsg = {
  US: {
    left_user: "The other person has left the room.",
    reconnect: "Reconnecting",
  },
  KR: {
    left_user: "상대방이 방을 나갔습니다.",
    reconnect: "상대방과 재연결 중입니다.",
  },
};

export default function msg_str(str) {
  if (countryCode) return countryMsg[countryCode][str];
  return countryMsg[US][str];
}
