import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  email: string | null;
}

const initialState: AdminState = {
  email: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin(state, action: PayloadAction<AdminState>) {
      return action.payload;
    },
    resetAdmin() {
      return initialState;
    },
  },
});

export const { setAdmin, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
