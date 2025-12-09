import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeState } from '../../types/types';

const THEME_STORAGE_KEY = 'theme-preference';

const getThemeFromStorage = (): 'light' | 'dark' | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored === 'light' || stored === 'dark' ? stored : null;
    } catch {
      return null;
    }
  }
  return null;
};

const setThemeInStorage = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Silently fail if localStorage is not available
    }
  }
};

const getInitialMode = (): 'light' | 'dark' => {
  const storedTheme = getThemeFromStorage();
  if (storedTheme) {
    return storedTheme;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialMode(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      setThemeInStorage(action.payload);
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      setThemeInStorage(state.mode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
