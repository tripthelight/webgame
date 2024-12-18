import { otherLeavesComn, onDataChannel } from '../../../functions/common/webRTC/webRTC.js';

const gameResponse = {
  errorCommon: () => {
    if (onDataChannel && onDataChannel.readyState === 'open') {
      onDataChannel.send(
        JSON.stringify({
          type: 'errorCommon',
          err: true,
        }),
      );
    } else {
      otherLeavesComn();
    }
  },
};

export default gameResponse;
