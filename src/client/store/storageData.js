import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit';

// 슬라이스(slice) 생성: age와 location 상태 관리
const storageDataSlice = createSlice({
  name: 'storageData',
  initialState: {
    localStorageData: {},
    sessionStorageData: {},
  },

  reducers: {
    updateLocalStorageData: (state, action) => {
      state.localStorageData = action.payload.localStorageData;
      // console.log('state.localStorageData :: ', state.localStorageData);
    },
    updateSessionStorageData: (state, action) => {
      state.sessionStorageData = action.payload.sessionStorageData;
      // console.log('state.sessionStorageData :: ', state.sessionStorageData);
    },
  },
});

// 액션과 리듀서 추출
export const { updateLocalStorageData, updateSessionStorageData } = storageDataSlice.actions;

// 스토어 생성
const storageDataStore = configureStore({
  reducer: {
    storageDataState: storageDataSlice.reducer,
  },
});

export default storageDataStore;
