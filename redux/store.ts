import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga';
import newsReducer from './features/news/newsSlice';
import queryReducer from './features/news/querySlice';
import usernameReducer from './features/news/usernameSlice';
import totalSearchReducer from './features/news/totalSearchSlice';
import currentSearchReducer from './features/news/currentSearchSlice';
import currentLanguageReducer from './features/news/currentLanguageSlice';

import rootSaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

export const makeStore = () => {
  console.log("makeStore");
  const store = configureStore({
    reducer: {
      query: queryReducer,
      username: usernameReducer,
      search: totalSearchReducer,
      currentSearch: currentSearchReducer,
      currentLanguage: currentLanguageReducer,
      news: newsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
  });
  // Run the saga middleware with the root saga
  sagaMiddleware.run(rootSaga);
  return store;
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']