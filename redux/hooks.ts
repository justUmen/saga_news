//You'll also want to create and export pre-typed versions of the React-Redux hooks as well, to simplify usage later:

import { useDispatch, useSelector, useStore } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => AppStore = useStore;

// CUSTOM HOOKS, to simplify usage
import { setValueUsername } from "./features/news/usernameSlice";
import { setValueTotalSearch } from "./features/news/totalSearchSlice";
import { setValueCurrentSearch } from "./features/news/currentSearchSlice";
import { setValueCurrentLanguage } from "./features/news/currentLanguageSlice";

// Username GET/SET
export const useSetUsernameValue = () => {
  const dispatch = useAppDispatch();
  const setUsernameValue = (value: string) => {
    dispatch(setValueUsername(value));
  };
  return setUsernameValue;
};

export const useGetUsernameValue = () => {
  const usernameValue = useAppSelector((state) => state.username.value); // Accessing 'username' key
  return usernameValue;
};

// TotalSearch GET/SET
export const useSetTotalSearchValue = () => {
  const dispatch = useAppDispatch();
  const setTotalSearchValue = (value: number) => {
    dispatch(setValueTotalSearch(value));
  };
  return setTotalSearchValue;
};
export const useGetTotalSearchValue = () => {
  const totalSearchValue = useAppSelector(
    (state) => state.search.value // Accessing 'search' key
  );
  return totalSearchValue;
};

// CurrentSearch GET/SET
export const useSetCurrentSearchValue = () => {
  const dispatch = useAppDispatch();
  const setCurrentSearchValue = (value: string) => {
    dispatch(setValueCurrentSearch(value));
  };
  return setCurrentSearchValue;
};

export const useGetCurrentSearchValue = () => {
  const currentSearchValue = useAppSelector((state) => state.username.value); // Accessing 'username' key
  return currentSearchValue;
};


// CurrentLanguage GET/SET
export const useSetCurrentLanguageValue = () => {
  const dispatch = useAppDispatch();
  const setCurrentLanguageValue = (value: string) => {
    dispatch(setValueCurrentLanguage(value));
  };
  return setCurrentLanguageValue;
};

export const useGetCurrentLanguageValue = () => {
  const currentLanguageValue = useAppSelector((state) => state.username.value); // Accessing 'username' key
  return currentLanguageValue;
};
