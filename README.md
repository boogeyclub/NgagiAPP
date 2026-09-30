# NgagiAPP

This repository is a **mobile app for managing a cotisation** — a group contribution / rotating savings club
(tontine). It is built for the organiser and the members of a contribution group: it tracks who belongs to the
group, over what period the contributions run, how much each participant owes, and according to what plan the
cycle is held.

Under the hood, it is a cross-platform native mobile app built with [NativeScript](https://nativescript.org/) and
[Angular](https://angular.dev/), generated from the official NativeScript Angular template
(`ns create NgagiAPP --ng`), so it ships with standalone Angular components, signals, zoneless change detection,
Tailwind CSS, and TypeScript.

## What the app has to be able to do

| # | Capability | Description |
|---|---|---|
| 1 | **Register members** | Create and maintain the participants of the group: identity, contact details, and their standing in the cycle. |
| 2 | **Define the cotisation period** | Set the **start date** and **end date** of the cotisation, so the cycle has a clear opening and closing. |
| 3 | **Prepare the plan** | Define how the cotisation will be held — the schedule/cadence of the meetings, the order in which members are served, and what happens at each session. |
| 4 | **Define the amount per participant** | Set the contribution amount each member pays (a uniform amount, or a per-member amount where it differs), and the frequency it applies to. |

## Domain model (planned)

The four capabilities above map onto a small set of entities. These are **documentation of intent only** — the
classes are not implemented yet.

```
Cotisation ──┬── period: { startDate: Date, endDate: Date }
             ├── plan: how the cycle is held (cadence, order, session steps)
             ├── amountPerParticipant: number | per-member override
             └── members: Member[]  ← registration lives here
```

| Entity | Holds |
|---|---|
| `Member` | A registered participant of the group. |
| `Cotisation` | A single cycle: its period, its amount, and its enrolled members. |
| `Plan` | The arrangement for holding the cycle — meeting schedule, rotation order, session rules. |
| `Contribution` | A payment recorded against a member for a given period (needed to report who has paid). |

## Roadmap

- [x] Project scaffold (NativeScript + Angular + Tailwind)
- [x] Splash screen as the first screen (native launch art + in-app splash route)
- [ ] Domain model for `Member`, `Cotisation`, `Plan`, `Contribution`
- [ ] Member registration screens (list / add / edit)
- [ ] Cotisation setup: period start → end, amount per participant
- [ ] Plan builder: cadence and order in which the cycle is held
- [ ] Contribution tracking per member per period
- [ ] Persistence (local first, sync later — decision open)

> **Awaiting input:** the screen/UI templates for the flows above will be supplied by the project owner in a
> later prompt, and will drive the layout and field list of the screens. Until they arrive, no domain code is
> written and the app still boots the starter template's sample screens.

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
│   ├── assets/             # images bundled into the app (logo mark)
│   └── app/
│       ├── app.component.ts|html   # root component hosting <page-router-outlet>
│       ├── app.routes.ts           # route definitions (splash is the entry route)
│       ├── core/app-info.ts        # app version + build number from the native package
│       ├── splash/                 # splash screen shown on launch
│       └── people/                 # template sample — to be replaced by the cotisation screens
├── tailwind.config.js
├── tsconfig.json
└── webpack.config.js
```

## Splash screen & branding

Launching the app shows one continuous branded splash: the **native** launch screen first (before the JS
runtime is up), then the **in-app** splash route, which fades out into the first real screen.

| Layer | Where |
|---|---|
| Native launch (Android) | `App_Resources/Android/src/main/res/drawable-<dpi>/background.png` + `logo.png`, composed by `drawable-nodpi/splash_screen.xml` |
| Native launch (iOS) | `App_Resources/iOS/Assets.xcassets/LaunchScreen.AspectFill.imageset` + `LaunchScreen.Center.imageset`, laid out by `LaunchScreen.storyboard` |
| In-app splash | `src/app/splash/splash-screen.component.*`, routed first via `src/app/app.routes.ts` |

Brand palette — keep these in sync across the three layers above:

| Token | Value | Used by |
|---|---|---|
| Deep green | `#0C3B2E` | splash background (native launch art + `.splash` in the component CSS) |
| Gold | `#F0B429` | monogram tile, `ActivityIndicator` |
| Mint (on dark) | `#A8CFC1` | tagline text |

Behaviour: the splash holds for a minimum of `SPLASH_MIN_MS` (1.8s), tapping it skips ahead, and it navigates
with `clearHistory` so the back button can never return to it. The version stamp in its footer
(`v1.0.0 (1)`) is read from the installed package, so it cannot drift: bump `versionName`/`versionCode` in
`App_Resources/Android/app.gradle` and `CFBundleShortVersionString`/`CFBundleVersion` in
`App_Resources/iOS/Info.plist`.

The launch art and `src/assets/logo-mark.png` are generated placeholders for the "Ngagi" monogram. The
**launcher icons are still the NativeScript defaults** (`App_Resources/.../mipmap-*`, `AppIcon.appiconset`,
`ic_launcher_foreground.xml`) — swap those before shipping.

## Notes

- `src/app/people/` is **not** part of the cotisation app — it is the throwaway sample that ships with the
  NativeScript template (a "Computer Scientists" list/detail flow). It stays only as a reference for how routing,
  signals, and services are wired in this project, and will be deleted when the cotisation screens land.
- Styles: Tailwind utilities work directly on NativeScript UI elements (`class="text-lg p-4"`), and
  `@nativescript/tailwind` translates them into platform styling. Dark mode follows the `.ns-dark` class.
- `platforms/`, `node_modules/`, and generated `hooks/` are gitignored — never commit them.
- Useful commands: `ns platform add|remove android|ios`, `ns plugin add <pkg>`, `ns debug android`,
  `ns generate` (schematics for components/services).
