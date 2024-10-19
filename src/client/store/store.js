import {configureStore, combineReducers, createSlice} from "@reduxjs/toolkit";

// 슬라이스(slice) 생성: age와 location 상태 관리
const storageEventSlice = createSlice({
  name: "storageEvent",
  initialState: {
    preventSetItemExecution: true, // storage.setItem 실행 | 미실행
    preventRemoveItemExecution: true, // storage.removeItem 실행 | 미실행
    preventClearExecution: true, // storage.clear 실행 | 미실행
  },
  reducers: {
    updateStorageEvent: (state, action) => {
      state.preventSetItemExecution = action.payload.value;
      state.preventRemoveItemExecution = action.payload.value;
      state.preventClearExecution = action.payload.value;
    },
  },
});

// 액션과 리듀서 추출
export const {updateStorageEvent} = storageEventSlice.actions;

// 스토어 생성
const store = configureStore({
  reducer: {
    storageEvent: storageEventSlice.reducer,
  },
});

export default store;

// // 초기 상태
// const initialStorageVariables = {
//   preventSetItemExecution: true, // localStorage.setItem 실행 | 미실행
//   preventRemoveItemExecution: true, // localStorage.removeItem 실행 | 미실행
//   preventClearExecution: true, // localStorage.clear 실행 | 미실행
// };

// // 닉네임 리듀서
// function storageVarReducer(state = initialStorageVariables, action) {
//   switch (action.type) {
//     case "UPDATE_STORAGE":
//       return {
//         ...state,
//         preventSetItemExecution: action.payload.preventSetItemExecution,
//         preventRemoveItemExecution: action.payload.preventRemoveItemExecution,
//         preventClearExecution: action.payload.preventClearExecution,
//       };
//     default:
//       return state;
//   }
// }

// // 여러 리듀서를 결합
// const rootReducer = combineReducers({
//   storageVar: storageVarReducer,
//   // profile: profileReducer,
// });

// // 스토어 생성
// const store = configureStore({
//   reducer: rootReducer,
// });

// export default store;
