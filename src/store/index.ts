// store.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import customerReducer from "./features/customerSlice";
import adminReducer from "./features/adminSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  customer: customerReducer,
  admin: adminReducer
});
export type RootState = ReturnType<typeof rootReducer>;
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist uses non-serializable values
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
