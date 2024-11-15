export default function fromUnicodePoints(_unicodeArray) {
  // 유니코드 포인트 배열을 다시 문자열로 변환하는 함수
  return _unicodeArray.map(point => String.fromCodePoint(parseInt(point, 16))).join("");
}
