# NgagiAPP

A cross-platform native mobile app built with [NativeScript](https://nativescript.org/) and [Angular](https://angular.dev/).

Generated from the official NativeScript Angular template (`ns create NgagiAPP --ng`), so it ships with the
modern defaults: standalone Angular components, signals, zoneless change detection, Tailwind CSS, and TypeScript.

## Stack

| | |
|---|---|
| Runtime | NativeScript `~9.1` |
| Framework | Angular `~22.0` (standalone APIs, `provideZonelessChangeDetection`) |
| Language | TypeScript `~6.0` |
| Bundler | `@nativescript/webpack` `~5.0` |
| Styling | Tailwind CSS `~3.4` via `@nativescript/tailwind` |
| Platforms | iOS + Android from one codebase |
| App ID | `org.nativescript.ngagiapp` |

## Prerequisites

1. **NativeScript CLI** (global): `npm install -g nativescript`
2. **For Android:** JDK 17+, Android Studio (SDK + build-tools), `ANDROID_HOME` set.
3. **For iOS:** macOS with Xcode 15+.
4. Verify everything with `ns doctor android` / `ns doctor ios`.

## Getting started

```bash
npm install          # install dependencies
ns run android       # build + deploy to a connected device or emulator
ns run ios           # (macOS only) build + deploy to a simulator or device
```

npm shortcuts are also available: `npm run start.android`, `npm run start.ios`,
`npm run build.android`, `npm run build.ios`.

## Project structure

```
.
├── App_Resources/          # native iOS/Android config, icons, launch screens
│   ├── Android/            # AndroidManifest.xml, app.gradle, res/
│   └── iOS/                # Info.plist, Assets.xcassets, LaunchScreen.storyboard
├── nativescript.config.ts  # app id, appPath, appResourcesPath, Android V8 flags
├── src/
│   ├── app.css             # global styles + Tailwind entry points
│   ├── main.ts             # app bootstrap (http + router + zoneless providers)
│   ├── polyfills.ts        # NativeScript globals / Angular polyfills
│   └── app/
│       ├── app.component.ts|html   # root component hosting <page-router-outlet>
│       ├── app.routes.ts           # route definitions
│       └── people/                 # starter feature: list + detail screens
├── tailwind.config.js
├── tsconfig.json
└── webpack.config.js
```

## Notes

- `src/app/people/` is the sample feature that comes with the template (a "Computer Scientists" list/detail
  flow). Use it as a reference, then replace it with your own screens.
- Styles: Tailwind utilities work directly on NativeScript UI elements (`class="text-lg p-4"`), and
  `@nativescript/tailwind` translates them into platform styling. Dark mode follows the `.ns-dark` class.
- `platforms/`, `node_modules/`, and generated `hooks/` are gitignored — never commit them.
- Useful commands: `ns platform add|remove android|ios`, `ns plugin add <pkg>`, `ns debug android`,
  `ns generate` (schematics for components/services).
