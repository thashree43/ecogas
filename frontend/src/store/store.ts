import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from '../store/slice/Authslice';
import { userApislice } from './slice/Userapislice';
import { agentApi } from './slice/Brokerslice'; 
import { adminApi } from './slice/Adminslice';

const rootReducer = combineReducers({
  user: userReducer,
  [userApislice.reducerPath]: userApislice.reducer,
  [agentApi.reducerPath]: agentApi.reducer,
  [adminApi.reducerPath]:adminApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApislice.middleware, agentApi.middleware,adminApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;