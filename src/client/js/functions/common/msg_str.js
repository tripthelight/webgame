import { countryCode } from './country_code.js';

const countryMsg = {
  US: {
    gameName: {
      taptap: 'TAP! TAP!',
      indianPocker: 'INDIAN POKER',
      blackAndWhite: 'BLACK AND WHITE',
      findTheSamePicture: 'FIND THE SAME PICTURE',
    },
    ok: 'OK',
    cancle: 'CANCLE',
    left_user: 'The other person has left the room.',
    reconnect: 'Reconnecting',
    init_name_title: 'Enter your name',
    init_name_placeholder: 'Please enter your name.',
    change_name_title: 'Change Name',
    change_name_placeholder: 'Enter the name to change.',
    change_name_error_null: 'Please enter your name.',
    change_name_error_full: 'Please enter within 20 characters.',
    error_title: 'Error',
    error_text: 'An unknown error occurred.',
  },
  KR: {
    gameName: {
      taptap: '탭! 탭!',
      indianPocker: '인디언 포커',
      blackAndWhite: '흑과 백',
      findTheSamePicture: '같은 그림 찾기',
    },
    ok: '확인',
    cancle: '취소',
    left_user: '상대방이 방을 나갔습니다.',
    reconnect: '상대방과 재연결 중입니다.',
    init_name_title: '이름 입력',
    init_name_placeholder: '이름을 입력하세요.',
    change_name_title: '이름 바꾸기',
    change_name_placeholder: '바꾸고 싶은 이름을 입력하세요.',
    change_name_error_null: '이름을 입력해 주세요.',
    change_name_error_full: '20글자 이내로 입력해주세요.',
    error_title: '에러',
    error_text: '알 수 없는 오류가 발생했습니다.',
  },
};

export default function msg_str(str) {
  if (countryCode) return countryMsg[countryCode][str];
  return countryMsg['US'][str];
}
