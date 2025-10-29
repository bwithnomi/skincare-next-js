import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CustomerState {
  email: string | null;
  name: string | null;
  phone: string | null;
  whatsapp: string | null
}

interface PlanState {
  name: string | null,
}

const initialState: CustomerState = {
  name: null,
  email: null,
  whatsapp: null,
  phone: null,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<CustomerState>) {
      return action.payload;
    },
    resetCustomer() {
      return initialState;
    },
  },
});

export const { setCustomer, resetCustomer } = customerSlice.actions;
export default customerSlice.reducer;
