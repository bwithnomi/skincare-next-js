"use client";

import { Provider } from "react-redux";
import { persistor, store } from ".";
import { PersistGate } from "redux-persist/integration/react";

export function ReduxProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
