export default function getUnicodePoints(_str) {
  // 문자열을 유니코드 포인트 배열로 변환하는 함수
  const unicodePoints = [];
  for (const char of _str) {
    unicodePoints.push(char.codePointAt(0).toString(16));
  }
  return unicodePoints;
}
