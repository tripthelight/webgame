import pageAccessedByReload from '../../functions/module/client/common/pageAccessedByReload.js';
import LOADING from '../../functions/module/client/common/loading.js';
import refreshEvent from './taptap.js';
import screenClickEvent from '../../game/taptap/screenClickEvent.js';
import storageMethod from '../../functions/common/storage/storageMethod.js';

export default function taptapRe(_state) {
  if (!pageAccessedByReload) return;
  if (_state) {
    if (_state.includes('same')) {
      if (_state.includes('Count')) {
        LOADING.show();
      } else if (_state.includes('Playing')) {
        storageMethod('s', 'REMOVE_ITEM', 'count');
        refreshEvent.tapGraph();
        screenClickEvent.tap();
      } else if (_state.includes('GameOver')) {
        refreshEvent.tapGraph();
      }
    } else {
      if (_state.includes('Playing')) {
        //
        if (_state.includes('Other')) {
          //
        }
      } else if (_state.includes('GameOver')) {
        //
        if (_state.includes('Other')) {
          //
        }
      }
    }
  } else {
    //
  }
}
