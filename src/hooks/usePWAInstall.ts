import { useEffect, useState } from 'react';
import { pwaManager, BeforeInstallPromptEvent } from '../lib/pwaManager';

export type { BeforeInstallPromptEvent };

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    pwaManager.getDeferredPrompt()
  );
  const [isInstalled, setIsInstalled] = useState(pwaManager.isAppInstalled());
  const [isInstallable, setIsInstallable] = useState(pwaManager.isInstallable());
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroidDevice = /android/.test(userAgent);

    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check dismissal memory (stored for 7 days)
    const dismissedTimestamp = localStorage.getItem('lotus_pwa_dismissed_at');
    if (dismissedTimestamp) {
      const dismissedTime = parseInt(dismissedTimestamp, 10);
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDaysMs) {
        setIsDismissed(true);
      } else {
        localStorage.removeItem('lotus_pwa_dismissed_at');
      }
    }

    // Subscribe to PWAManager updates
    const unsubscribe = pwaManager.subscribe((state) => {
      setDeferredPrompt(state.deferredPrompt);
      setIsInstalled(state.isInstalled);
      setIsInstallable(state.isInstallable);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const install = async (): Promise<boolean> => {
    const result = await pwaManager.triggerPrompt();
    return result.outcome === 'accepted';
  };

  const dismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('lotus_pwa_dismissed_at', Date.now().toString());
  };

  const resetDismiss = () => {
    setIsDismissed(false);
    localStorage.removeItem('lotus_pwa_dismissed_at');
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    isDismissed,
    deferredPrompt,
    install,
    dismiss,
    resetDismiss,
  };
}
