import { localStorageKeys } from '@tab-master/common';
import { useEffect } from 'react';

const useStorageSync = () => {
  useEffect(() => {
    browser.storage.local.set({
      [localStorageKeys.CURRENT_DOMAIN]: window.location.hostname,
    });
  }, []);

  useEffect(() => {
    const visibilityChangeHandler = async () => {
      if (document.visibilityState === 'hidden') return;
      browser.storage.local.set({
        [localStorageKeys.CURRENT_DOMAIN]: window.location.hostname,
      });
    };
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    return () => {
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
    };
  }, []);
};

export default useStorageSync;
