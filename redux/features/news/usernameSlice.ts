import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type UsernameState = {
  value: string;
};
const initialState = {
  value: "username",
} as UsernameState;
export const username = createSlice({
  name: "username",
  initialState,
  reducers: {
    resetUsername: () => initialState,
    setValueUsername: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
export const {
  setValueUsername,
  resetUsername,
} = username.actions;
export default username.reducer;