import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define type for the context
type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

// Create context with undefined to ensure it's used within provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with light mode as default
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      // Check if there's a saved preference in localStorage
      const savedTheme = localStorage.getItem('darkMode');
      if (savedTheme !== null) {
        return savedTheme === 'true';
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
    
    // Default to light mode
    return false;
  });

  // Update localStorage when dark mode changes
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode.toString());
      
      // Apply dark mode class to document
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [darkMode]);

  // Watch for system preference changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        try {
          if (localStorage.getItem('darkMode') === null) {
            setDarkMode(e.matches);
          }
        } catch (error) {
          console.error('Error in media query handler:', error);
        }
      };
      
      // Add listener for changes in system preference
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Older browsers support
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error('Error setting up media query listener:', error);
      return () => {};
    }
  }, []);

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevDarkMode => !prevDarkMode);
  };

  const contextValue: ThemeContextType = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};