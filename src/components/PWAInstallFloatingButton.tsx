import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallFloatingButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDismissed, install, dismiss } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and running standalone, do not show prompt
  if (isInstalled) {
    return null;
  }

  // If user dismissed it recently, hide the floating pill
  if (isDismissed) {
    return null;
  }

  const handleActionClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      // If iOS or browser without direct prompt API (e.g. Safari, Firefox), show the helpful step-by-step installation guide
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {/* Floating Notification Button in Bottom Centre */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0A0A0A]/95 text-white p-3.5 sm:p-4 shadow-2xl backdrop-blur-md border border-white/10 dark:border-white/20">
            {/* Subtle brand glow accent */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-[#A31D1D]/40 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#A31D1D]/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center justify-between gap-3">
              {/* Icon & Details */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#A31D1D] to-[#6E0F0F] flex items-center justify-center shadow-md border border-white/20 overflow-hidden">
                  <img
                    src="/pwa-192x192.png"
                    alt="Lotus Tribe"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback icon if image not yet loaded
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <Sparkles className="w-5 h-5 text-amber-300 absolute" />
                </div>
                
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-white tracking-tight truncate">
                      Install Lotus Tribe
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#A31D1D] text-white/95 uppercase tracking-wider">
                      App
                    </span>
                  </div>
                  <p className="text-xs text-white/70 truncate">
                    {isIOS
                      ? 'Add to Home Screen for best experience'
                      : isAndroid
                      ? 'Fast 1-click mobile install'
                      : 'Install on your device for instant access'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A31D1D] hover:bg-[#881515] active:scale-95 text-white text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap"
                  title="Install Lotus Tribe PWA"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isInstallable ? 'Install' : 'Get App'}</span>
                </button>

                <button
                  type="button"
                  onClick={dismiss}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss notification"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Guided Installation Modal (especially for iOS Safari & unsupported prompt browsers) */}
      <AnimatePresence>
        {showGuideModal && (
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
                    <h3 className="font-bold text-base">Install Lotus Tribe</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isIOS ? 'Safari on iPhone / iPad' : 'Browser Installation Guide'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Steps for iOS Safari */}
              {isIOS ? (
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        Tap the <Share2 className="w-4 h-4 text-blue-500 inline" /> Share button
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Located in the Safari bottom toolbar (or top right on iPad).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        Select <PlusSquare className="w-4 h-4 text-emerald-500 inline" /> Add to Home Screen
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Scroll down the share sheet menu to find this option.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Tap "Add" in top-right
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Lotus Tribe will be installed to your home screen like a native app.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-[#A31D1D]/10 text-[#A31D1D] flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Open Browser Menu
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Tap the three dots (⋮) in your browser toolbar or address bar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                    <div className="w-7 h-7 rounded-lg bg-[#A31D1D]/10 text-[#A31D1D] flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                        Click <Download className="w-4 h-4 text-[#A31D1D] inline" /> "Install App" or "Add to Home Screen"
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Confirm the prompt to install Lotus Tribe on your device.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 font-semibold text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {installSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-xl"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Lotus Tribe installed successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
