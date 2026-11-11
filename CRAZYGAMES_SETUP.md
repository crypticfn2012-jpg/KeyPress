# KeyPress — CrazyGames integration

The CrazyGames build is served directly from `index.html`. No bundler or build step is required.

## Included

- CrazyGames HTML5 SDK v3, initialized before using platform modules.
- Gameplay start/stop and loading start/stop lifecycle events.
- CrazyGames Data module saves, with a one-time migration from the existing `keypress_save_v6` browser save.
- Optional CrazyGames account sign-in and platform username display. Guest play remains available and no Google/email login is required.
- Arcade modes: 30-second Sprint, 60-second Endurance and Precision Run.
- XP, levels, personal bests, run rewards and a 2× rewarded-video boost integration.
- Iframe-aware board scaling, anchored top controls, overflow prevention and reduced-motion support.
- A photosensitivity setting enabled by default that disables flashing, pulsing, animated keycaps and reveal shake; calmer cosmetic animation defaults.
- Colour-vision presets (protanopia, deuteranopia, tritanopia and high contrast) with clearer outlines and pattern cues.
- In-game Terms of Service, privacy and accessibility information.
- PixelForge Studios branded startup loader, styled to match PixelRoyale's navy-and-amber loading screen.

## CrazyGames Developer Portal settings

1. Enable **Progress Save** for the game. The Data module is disabled if this toggle is not selected.
2. Upload the contents of this repository and test through the CrazyGames Preview tool.
3. Check the game at 800×450 and resize the preview smaller/larger. The keyboard scales to fit while the top controls stay anchored.
4. Test both guest play and a signed-in CrazyGames account. The Data module automatically syncs saved progress for signed-in players.

## Ads

Ads are intentionally disabled for the Basic Launch:

- In `crazygames.js`, `ADS_ENABLED` is `false`.
- Do not enable it until the game is approved for Full Launch and monetization is enabled in the Developer Portal.
- After Full Launch, changing it to `true` exposes an optional rewarded 2× boost on the results screen and requests a midgame ad at a run-results break every fourth completed run, with a minimum three-minute interval.
- All ad requests use the CrazyGames SDK. No third-party ad network is included.

## Local testing

Serve the repository from `http://localhost` or `http://127.0.0.1` rather than opening `index.html` as a file. From the repository folder, run `python -m http.server 8000` and open `http://localhost:8000/`. The SDK runs in its local demo environment there. Check the browser console for SDK events and verify that the game still works if the SDK is unavailable.

## Notes

The old Gamplo resize hook was removed because it could override the iframe dimensions. The old Google sign-in dependency and forced account modal were also removed; the CrazyGames platform account is optional and guest play starts immediately.
