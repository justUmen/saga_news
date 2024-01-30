import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type CurrentSearchState = {
  value: string;
};
const initialState = {
  value: "search",
} as CurrentSearchState;
export const currentSearch = createSlice({
  name: "currentSearch",
  initialState,
  reducers: {
    resetCurrentSearch: () => initialState,
    setValueCurrentSearch: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
export const {
  setValueCurrentSearch,
  resetCurrentSearch,
} = currentSearch.actions;
export default currentSearch.reducer;