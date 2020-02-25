import { Dispatch, useCallback, useEffect, useState } from 'react';

export interface LocalStorageLikeMini extends Pick<WindowLocalStorage["localStorage"], 'getItem' | 'setItem'> {}

export function createLocalStorageHook(localStorage: WindowLocalStorage["localStorage"])
{
  if (typeof localStorage.setItem !== 'function' || typeof localStorage.getItem !== 'function') {
    throw new TypeError(`${localStorage} not a localStorage like object`)
  }

  function getItem<T>(key: string): T
  {
    let value = localStorage.getItem(key);
    if (typeof value !== 'undefined' && value !== null)
    {
      value = JSON.parse(value);
    }
    return value as any
  }

  return function useLocalStorage<T>(
    key: string,
    initialValue?: T
  ): [T, Dispatch<T>] {

    const [value, setValue] = useState<T>(
      () => {
        let value = getItem<T>(key);
        if (typeof value !== 'undefined' || value === null) {
          value = initialValue
        }
        return value
      }
    );

    const setItem = (newValue: T) => {
      let value = JSON.stringify(newValue);
      setValue(newValue);
      localStorage.setItem(key, value);
    };

    useEffect(() => {
      const newValue = getItem<T>(key);
      if (value !== newValue)
      {
        if (typeof newValue === 'undefined' || newValue === null)
        {
          setValue(initialValue);
        }
        else if (JSON.stringify(newValue) !== JSON.stringify(value))
        {
          setValue(newValue);
        }
      }
    }, []);

    if (typeof window !== "undefined") {
      const handleStorage = useCallback(
        (event: StorageEvent) => {
          let { newValue } = event;
          // @ts-ignore
          if (event.key === key && newValue !== value) {
            if (typeof newValue === 'undefined' || newValue === null) {
              setValue(initialValue);
            } else if (newValue !== JSON.stringify(value)) {
              setValue(JSON.parse(newValue) as any);
            }
          }
        },
        [value]
      );

      useEffect(() => {

        if (typeof window !== "undefined") {
          window.addEventListener('storage', handleStorage);
          return () => window.removeEventListener('storage', handleStorage);
        }

        return void 0
      }, [handleStorage]);
    }

    return [value, setItem];
  }
}

export default createLocalStorageHook
