import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export function clearQuizProgress() {
  try {
    window.localStorage.removeItem('quiz-answers');
    window.localStorage.removeItem('quiz-current-index');
    window.localStorage.removeItem('quiz-show-answers');
    window.localStorage.removeItem('quiz-study-time');
    window.localStorage.removeItem('quiz-streak');
  } catch (error) {
    console.error('Error clearing quiz progress:', error);
  }
}
