import pageAccessedByReload from '../../client/common/pageAccessedByReload.js';
import refreshEvent from '../../../../refresh/taptap/taptap.js';
import LOADING from '../../client/common/loading.js';
import taptapRes from '../../../../game/taptap/taptapRes.js';
import screenClickEvent from '../../../../game/taptap/screenClickEvent.js';
import storageMethod from '../../../common/storage/storageMethod.js';
import gameState from '../../../../gameState/taptap.js';

export default () => {
  taptapRes.gameStateRe();
};
