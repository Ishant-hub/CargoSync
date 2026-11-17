import React, { createContext, useContext } from 'react';
import { Theme, Colors } from './tokens';

export interface ThemeContextValue {
  theme: typeof Theme;
  colors: typeof Colors;
  isDark: boolean;
  setScheme?: (scheme: string) => void;
  // Expose Theme properties directly
  typography: typeof Theme.typography;
  fontFamily: typeof Theme.fontFamily;
  spacing: typeof Theme.spacing;
  radius: typeof Theme.radius;
  shadows: typeof Theme.shadows;
  touchTargets: typeof Theme.touchTargets;
  animation: typeof Theme.animation;
  iconSize: typeof Theme.iconSize;
}

const themeValue: ThemeContextValue = {
  theme: Theme,
  colors: Colors,
  isDark: false,
  typography: Theme.typography,
  fontFamily: Theme.fontFamily,
  spacing: Theme.spacing,
  radius: Theme.radius,
  shadows: Theme.shadows,
  touchTargets: Theme.touchTargets,
  animation: Theme.animation,
  iconSize: Theme.iconSize,
};

const ThemeContext = createContext<ThemeContextValue>(themeValue);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
