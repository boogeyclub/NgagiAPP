import { Application, isAndroid, isIOS } from '@nativescript/core';

/**
 * Build identity of the app as reported by the native package (Android `versionName`/`versionCode`,
 * iOS `CFBundleShortVersionString`/`CFBundleVersion`). Those live in `App_Resources/Android/app.gradle`
 * and `App_Resources/iOS/Info.plist`, so the value shown in the UI can never drift from the installed build.
 */
export interface AppVersion {
  version: string;
  build: string;
}

/** Used if the native lookup is unavailable (e.g. in a tooling context with no host package). */
const FALLBACK: AppVersion = { version: '1.0.0', build: '1' };

export function getAppVersion(): AppVersion {
  try {
    if (isAndroid) {
      const app = Application.android.nativeApp;
      const info = app.getPackageManager().getPackageInfo(app.getPackageName(), 0);
      return { version: `${info.versionName}`, build: `${info.versionCode}` };
    }

    if (isIOS) {
      const bundle = NSBundle.mainBundle;
      const version = bundle.objectForInfoDictionaryKey('CFBundleShortVersionString');
      const build = bundle.objectForInfoDictionaryKey('CFBundleVersion');
      return { version: `${version}`, build: `${build}` };
    }
  } catch {
    // never let a cosmetic lookup break the launch path
  }

  return FALLBACK;
}

export function formatAppVersion(): string {
  const { version, build } = getAppVersion();
  return build && build !== version ? `v${version} (${build})` : `v${version}`;
}

/**
 * Two-letter device language. `@nativescript/localization` is not installed, so this reads the
 * platform locale directly; it is only used to pick splash wording.
 */
export function deviceLanguage(): string {
  try {
    if (isAndroid) {
      return `${java.util.Locale.getDefault().getLanguage()}`.toLowerCase();
    }
    if (isIOS) {
      return `${NSLocale.currentLocale.languageCode}`.toLowerCase();
    }
  } catch {
    // fall through
  }

  return 'en';
}
