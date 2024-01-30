import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type TotalSearchState = {
  value: number;
};
const initialState = {
  value: 0,
} as TotalSearchState;
export const totalSearch = createSlice({
  name: "totalSearch",
  initialState,
  reducers: {
    resetTotalSearch: () => initialState,
    setValueTotalSearch: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});
export const {
  setValueTotalSearch,
  resetTotalSearch,
} = totalSearch.actions;
export default totalSearch.reducer;