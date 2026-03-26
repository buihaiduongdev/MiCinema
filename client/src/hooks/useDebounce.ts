/**
 * useDebounce — Debounce value
 *
 * Params: (value: T, delay: number = 300)
 * Return: debouncedValue: T
 * Dùng: cho search input, filter — tránh gọi API liên tục
 */

import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
