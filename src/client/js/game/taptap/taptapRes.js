import { otherLeavesComn } from '../../functions/common/webRTC/webRTC.js';

export default function taptapRes(onDataChannel) {
  if (onDataChannel && onDataChannel.readyState === 'open') {
    //
  } else {
    otherLeavesComn();
  }
}
