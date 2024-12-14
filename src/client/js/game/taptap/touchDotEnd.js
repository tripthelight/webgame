import { timeInterval_300 } from '../../functions/common/variable.js';

export default (dotEl) => {
  setTimeout(() => {
    dotEl.remove();
  }, timeInterval_300);
};
