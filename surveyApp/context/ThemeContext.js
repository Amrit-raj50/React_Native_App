import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('appTheme');
        if (storedTheme !== null) {
          setIsDarkMode(storedTheme === 'dark');
        } else {
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (e) {
        console.error('Failed to load theme preference', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('appTheme', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? darkColors : lightColors,
  };

  if (!isLoaded) return null; // Avoid rendering until theme is loaded

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const lightColors = {
  background: '#F5F6FA',
  card: '#FFFFFF',
  text: '#2F3640',
  subText: '#718093',
  primary: '#6C5CE7', // Deep Violet
  secondary: '#00B894', // Mint
  danger: '#D63031',
  border: '#DFE6E9',
  inputBg: '#FFFFFF',
  shadow: '#000000',
  placeholder: '#B2BEC3',
};

export const darkColors = {
  background: '#1E272E', // Very dark slate
  card: '#2F3640', // Elevated dark
  text: '#F5F6FA', // Light text
  subText: '#B2BEC3',
  primary: '#8C7AE6', // Lighter violet for dark mode
  secondary: '#55EFC4', // Lighter mint for dark mode
  danger: '#FF7675',
  border: '#353B48',
  inputBg: '#353B48',
  shadow: '#000000',
  placeholder: '#636E72',
};
