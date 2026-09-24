/**
 * PWA Manager
 * 
 * Implements the beforeinstallprompt event listener to capture the deferredPrompt,
 * and exports the `triggerInstallPrompt()` function for the UI to trigger the
 * browser's native PWA installation dialog.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type PWAListener = (state: {
  isInstallable: boolean;
  isInstalled: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}) => void;

// Stored deferred prompt reference captured from beforeinstallprompt event
let deferredPrompt: BeforeInstallPromptEvent | null = null;
let isInstalled = false;
const listeners = new Set<PWAListener>();

function notifyListeners() {
  const state = {
    isInstallable: isInstallable(),
    isInstalled: isAppInstalled(),
    deferredPrompt,
  };
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (err) {
      console.error('[PWAManager] Listener error:', err);
    }
  });
}

function initPWAEventListeners() {
  if (typeof window === 'undefined') return;

  // 1. Detect if the app is already installed and running standalone
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  isInstalled = isStandalone;

  // 2. Capture the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Intercept default mini-infobar / browser banner
    e.preventDefault();

    // Store deferredPrompt for triggering later by UI
    deferredPrompt = e as BeforeInstallPromptEvent;

    // Expose on window for direct access / debugging
    (window as unknown as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = deferredPrompt;

    notifyListeners();
  });

  // 3. Capture appinstalled event
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    isInstalled = true;
    (window as unknown as { deferredPrompt?: null }).deferredPrompt = null;
    notifyListeners();
  });
}

// Auto-initialize when file is imported in the browser
if (typeof window !== 'undefined') {
  initPWAEventListeners();
}

/**
 * Triggers the browser's native PWA installation dialog using the captured deferredPrompt.
 * The UI calls this function when the user clicks the install button.
 */
export async function triggerInstallPrompt(): Promise<{
  outcome: 'accepted' | 'dismissed' | 'unavailable';
  platform?: string;
}> {
  if (!deferredPrompt) {
    console.warn('[PWAManager] No deferredPrompt event available to trigger.');
    return { outcome: 'unavailable' };
  }

  try {
    // Display the browser's native installation prompt dialog
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      isInstalled = true;
      deferredPrompt = null;
      (window as unknown as { deferredPrompt?: null }).deferredPrompt = null;
    }

    notifyListeners();
    return choiceResult;
  } catch (err) {
    console.error('[PWAManager] Failed to trigger install prompt:', err);
    return { outcome: 'unavailable' };
  }
}

/**
 * Returns the currently stored deferredPrompt event, or null if none.
 */
export function getDeferredPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

/**
 * Checks if the app is currently installable (prompt captured and not yet installed).
 */
export function isInstallable(): boolean {
  return !!deferredPrompt && !isInstalled;
}

/**
 * Checks if the app is currently running in standalone mode (already installed).
 */
export function isAppInstalled(): boolean {
  return isInstalled;
}

/**
 * Subscribes a listener callback to PWA installation state changes.
 */
export function subscribePWAState(listener: PWAListener): () => void {
  listeners.add(listener);
  listener({
    isInstallable: isInstallable(),
    isInstalled: isAppInstalled(),
    deferredPrompt,
  });
  return () => {
    listeners.delete(listener);
  };
}

/**
 * PWAManager class instance maintaining backward compatibility for object-oriented calls.
 */
export const pwaManager = {
  triggerPrompt: triggerInstallPrompt,
  promptInstall: triggerInstallPrompt,
  triggerInstallPrompt,
  getDeferredPrompt,
  isInstallable,
  isAppInstalled,
  subscribe: subscribePWAState,
};

// Also expose on window for direct access
if (typeof window !== 'undefined') {
  (window as unknown as { pwaManager?: typeof pwaManager; triggerInstallPrompt?: typeof triggerInstallPrompt }).pwaManager = pwaManager;
  (window as unknown as { triggerInstallPrompt?: typeof triggerInstallPrompt }).triggerInstallPrompt = triggerInstallPrompt;
}

export default pwaManager;
