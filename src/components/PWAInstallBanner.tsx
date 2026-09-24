import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone, Sparkles, Share2, PlusSquare, CheckCircle } from 'lucide-react';
import { triggerInstallPrompt, pwaManager, BeforeInstallPromptEvent } from '../lib/pwaManager';

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    pwaManager.getDeferredPrompt()
  );
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(pwaManager.isAppInstalled());
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // 1. Detect if the app is already installed and running in standalone mode
    if (pwaManager.isAppInstalled()) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS devices (iPhone, iPad, iPod)
    const userAgent = (window.navigator.userAgent || '').toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Check if user dismissed the banner recently
    const dismissedTimestamp = localStorage.getItem('lotus_pwa_banner_dismissed_at');
    let isDismissed = false;
    if (dismissedTimestamp) {
      const elapsed = Date.now() - parseInt(dismissedTimestamp, 10);
      if (elapsed < 7 * 24 * 60 * 60 * 1000) {
        isDismissed = true;
      } else {
        localStorage.removeItem('lotus_pwa_banner_dismissed_at');
      }
    }

    // 4. Subscribe to pwaManager updates (triggered on beforeinstallprompt & appinstalled)
    const unsubscribe = pwaManager.subscribe((state) => {
      setDeferredPrompt(state.deferredPrompt);
      setIsInstalled(state.isInstalled);
      if (state.deferredPrompt && !isDismissed && !state.isInstalled) {
        setIsVisible(true);
      }
    });

    // 5. For iOS Safari (which doesn't fire beforeinstallprompt), show banner if not installed and not dismissed
    if (isIOSDevice && !isDismissed && !pwaManager.isAppInstalled()) {
      setIsVisible(true);
    }

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
      localStorage.removeItem('lotus_pwa_banner_dismissed_at');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      unsubscribe();
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // If native prompt event is available (Android, Chrome, Edge, etc.)
    if (deferredPrompt) {
      // Trigger the browser's native PWA installation dialog
      const result = await triggerInstallPrompt();
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setIsVisible(false);
      } else {
        setIsVisible(false);
      }
    } else if (isIOS) {
      // For iOS, open the step-by-step Home Screen guide
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('lotus_pwa_banner_dismissed_at', Date.now().toString());
  };

  // Do not render banner if already installed or hidden
  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.aside
          id="pwa-install-banner"
          data-testid="pwa-install-banner"
          role="region"
          aria-label="Install App Banner"
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]/95 text-white p-4 shadow-2xl backdrop-blur-md border border-white/10 dark:border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
            {/* Ambient Brand Accent Glow */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#A31D1D]/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#A31D1D]/30 rounded-full blur-2xl pointer-events-none" />

            {/* App Branding & Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#A31D1D] to-[#6E0F0F] flex items-center justify-center flex-shrink-0 shadow-md border border-white/20 overflow-hidden">
                <img
                  src="/pwa-192x192.png"
                  alt="Lotus Tribe"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <Smartphone className="w-5 h-5 text-white/90" />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-white tracking-tight truncate">
                    Install Lotus Tribe
                  </h4>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A31D1D] text-white uppercase tracking-wider">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" /> App
                  </span>
                </div>
                <p className="text-xs text-white/75 line-clamp-1 mt-0.5">
                  {isIOS
                    ? 'Add to Home Screen for the full native experience'
                    : 'Install for offline access, instant notifications & faster loading'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Not now
              </button>
              
              <button
                type="button"
                id="pwa-install-button"
                data-testid="pwa-install-button"
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A31D1D] hover:bg-[#881515] active:scale-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss banner"
                className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors sm:hidden cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Guided Modal for iOS Safari */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="w-full max-w-md bg-white dark:bg-[#121212] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#A31D1D] flex items-center justify-center text-white shadow-md">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">Install on iPhone / iPad</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Safari Web Browser Guide
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3.5 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Tap the <Share2 className="w-4 h-4 text-blue-500 inline" /> Share button
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Located in the bottom Safari toolbar (or top right on iPad).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Tap <PlusSquare className="w-4 h-4 text-emerald-500 inline" /> Add to Home Screen
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Scroll down the list of options to select it.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Confirm by tapping "Add"
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Lotus Tribe will be placed on your home screen with its app icon.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-semibold text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Notification */}
      <AnimatePresence>
        {installSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Lotus Tribe installed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PWAInstallBanner;
