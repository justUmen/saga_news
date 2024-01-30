import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type CurrentLanguageState = {
  value: string;
};
const initialState = {
  value: "language",
} as CurrentLanguageState;
export const currentLanguage = createSlice({
  name: "currentLanguage",
  initialState,
  reducers: {
    resetCurrentLanguage: () => initialState,
    setValueCurrentLanguage: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
export const {
  setValueCurrentLanguage,
  resetCurrentLanguage,
} = currentLanguage.actions;
export default currentLanguage.reducer;