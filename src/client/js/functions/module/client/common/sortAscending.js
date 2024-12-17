/**
 * 오름차순 정렬: 작은수 -> 큰수
 * _array 배열을 받아서
 * return 작은수 -> 큰수  정렬
 */
export default (_array) => {
  return _array.sort((a, b) => {
    if (a > b) return 1;
    if (a === b) return 0;
    if (a < b) return -1;
  });
};
