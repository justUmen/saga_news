import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type QueryState = {
  value: string;
};
const initialState = {
  value: "query",
} as QueryState;
export const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    resetQuery: () => initialState,
    setValueQuery: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
export const {
  setValueQuery,
  resetQuery,
} = querySlice.actions;
export default querySlice.reducer;