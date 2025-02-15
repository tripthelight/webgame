import { html, css, LitElement } from 'lit';
import '../../scss/main/common.scss';
import '../functions/common/common.js';
import { LOADING_EVENT } from '../functions/common/loading.js';
import initNickName from './modal/initNickName.js';

// vanilla js로 작성한 vue의 reactive
function reactive(obj) {
  const handlers = {};

  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    handlers[key] = [];

    Object.defineProperty(obj, key, {
      get() {
        console.log(`Getting ${key}:`, value);
        return value;
      },
      set(newValue) {
        console.log(`Setting ${key} to ${newValue}`);
        value = newValue;
        // 값 변경 시 등록된 핸들러 실행
        handlers[key].forEach((handler) => handler(newValue));
      },
    });
  });

  obj.watch = function (key, handler) {
    if (handlers[key]) handlers[key].push(handler);
  };

  return obj;
}
// vanilla js로 작성한 vue의 computed
function computed(getter) {
  let cachedValue;
  let isDirty = true;

  const obj = reactive({
    trigger: 0, // 종속성 추적용
  });

  const wrapper = {
    get value() {
      if (isDirty) {
        cachedValue = getter();
        isDirty = false;
      }
      return cachedValue;
    },
  };

  // 종속성을 강제로 업데이트
  obj.watch('trigger', () => {
    isDirty = true;
  });

  return wrapper;
}

/**
 * vanilla js로 작성한 html component
 * lit 의존 module 사용
 */
export class SimpleGreeting extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  static properties = {
    name: { type: String },
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

document.onreadystatechange = () => {
  const state = document.readyState;
  if (state === 'interactive') {
  } else if (state === 'complete') {
    console.log('main ...');

    // 접속한 유저의 닉네임이 없으면 생성
    initNickName();

    // common.js에서 생성한 로딩 제거
    LOADING_EVENT.hide();

    // vanilla js로 작성한 html component 테스트
    customElements.define('simple-greeting', SimpleGreeting);

    // vanilla js로 작성한 vue의 reactive 와 computed 테스트
    const state = reactive({ count: 1 });
    const double = computed(() => state.count * 2);
    console.log(double.value); // 2
    state.count = 2;
    state.trigger = 1; // 종속성 업데이트
    console.log(double.value); // 4
  }
};
