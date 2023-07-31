import { configureStore } from '@reduxjs/toolkit';
import { spaceXApi } from './spaceXApi';

export const store = configureStore({
  reducer: {
    [spaceXApi.reducerPath]: spaceXApi.reducer,
  },
  middleware: (getDefaultMiddlware) =>
    getDefaultMiddlware().concat(spaceXApi.middleware),
});
