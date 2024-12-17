import storageMethod from '../../../common/storage/storageMethod.js';

/**
 * 게임 결과 저장
 * @param {string} _gameName    : 지금 방금 한 게임 이름
 * @param {boolean} _result     : 지금 방금 한 게임 결과 -> drew가 없는 게임 => true: win || false: lose, drew가 있는 게임 => "win": win || "drew": drew || "lose": lose
 */
export default (_gameName, _result) => {
  const GAME_RESULTS = window.localStorage.gameResults;
  let firstData = new Object();
  let data = new Object();

  // 완전 처음 data
  if (_gameName === 'blackandwhite1') {
    // drew 가 있는 게임일 경우
    let drewCaseResultW = 0;
    let drewCaseResultD = 0;
    let drewCaseResultL = 0;
    if (_result === 'win') {
      drewCaseResultW = 1;
    }
    if (_result === 'drew') {
      drewCaseResultD = 1;
    }
    if (_result === 'lose') {
      drewCaseResultL = 1;
    }
    firstData = {
      win: drewCaseResultW,
      drew: drewCaseResultD,
      lose: drewCaseResultL,
    };
  } else {
    firstData = {
      win: _result ? 1 : 0,
      lose: _result ? 0 : 1,
    };
  }

  if (!GAME_RESULTS) {
    // 완전 처음
    // 내가 지금 한 게임이 taptap 일 때
    if (_gameName === 'taptap') {
      data = { taptap: firstData };
    }
    // 내가 지금 한 게임이 blackandwhite1 일 때
    if (_gameName === 'blackandwhite1') {
      data = { blackandwhite1: firstData };
    }
    // 내가 지금 한 게임이 indianpoker 일 때
    if (_gameName === 'indianpoker') {
      data = { indianpoker: firstData };
    }
    // 내가 지금 한 게임이 findsamepicture 일 때
    if (_gameName === 'findsamepicture') {
      data = { findsamepicture: firstData };
    }
    // window.localStorage.setItem("gameResults", JSON.stringify(data));
    storageMethod('l', 'SET_ITEM', 'gameResults', JSON.stringify(data));
  } else {
    // 다른 게임은 있음
    let gameResultArr = JSON.parse(GAME_RESULTS);
    let w = 0; // win data
    let d = 0; // drew data
    let l = 0; // lose data

    // 내가 지금 한 게임이 taptap 일 때
    if (_gameName === 'taptap') {
      if (gameResultArr.taptap) {
        // taptap도 있음
        w = gameResultArr.taptap.win;
        l = gameResultArr.taptap.lose;
        data = {
          win: _result ? w + 1 : w,
          lose: _result ? l : l + 1,
        };
        gameResultArr.taptap = data;
      } else {
        // taptap은 없음
        gameResultArr = {
          taptap: firstData,
          ...gameResultArr,
        };
      }
    }

    // 내가 지금 한 게임이 blackandwhite1 일 때
    if (_gameName === 'blackandwhite1') {
      if (gameResultArr.blackandwhite1) {
        // blackandwhite1도 있음
        w = gameResultArr.blackandwhite1.win;
        d = gameResultArr.blackandwhite1.drew;
        l = gameResultArr.blackandwhite1.lose;
        if (_result === 'win') {
          w += 1;
        }
        if (_result === 'drew') {
          d += 1;
        }
        if (_result === 'lose') {
          l += 1;
        }
        data = {
          win: w,
          drew: d,
          lose: l,
        };
        gameResultArr.blackandwhite1 = data;
      } else {
        // blackandwhite1은 없음
        gameResultArr = {
          blackandwhite1: firstData,
          ...gameResultArr,
        };
      }
    }

    // 내가 지금 한 게임이 indianpoker 일 때
    if (_gameName === 'indianpoker') {
      if (gameResultArr.indianpoker) {
        // indianpoker도 있음
        w = gameResultArr.indianpoker.win;
        l = gameResultArr.indianpoker.lose;
        data = {
          win: _result ? w + 1 : w,
          lose: _result ? l : l + 1,
        };
        gameResultArr.indianpoker = data;
      } else {
        // indianpoker은 없음
        gameResultArr = {
          indianpoker: firstData,
          ...gameResultArr,
        };
      }
    }

    // 내가 지금 한 게임이 findsamepicture 일 때
    if (_gameName === 'findsamepicture') {
      if (gameResultArr.findsamepicture) {
        // findsamepicture도 있음
        w = gameResultArr.findsamepicture.win;
        l = gameResultArr.findsamepicture.lose;
        data = {
          win: _result ? w + 1 : w,
          lose: _result ? l : l + 1,
        };
        gameResultArr.findsamepicture = data;
      } else {
        // findsamepicture은 없음
        gameResultArr = {
          findsamepicture: firstData,
          ...gameResultArr,
        };
      }
    }

    // 게임 결과를 localStorage에 저장
    // window.localStorage.setItem("gameResults", JSON.stringify(gameResultArr));
    storageMethod('l', 'SET_ITEM', 'gameResults', JSON.stringify(gameResultArr));
  }
};
