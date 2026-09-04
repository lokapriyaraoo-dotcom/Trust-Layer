# Trust Layer – Android APK Project

Customer-first Android application based on:

**Open App → Search Service → Location → Filter Verified/Top Rated → View Profile → Call/WhatsApp**

## Included
- Customer-focused Trust Layer interface
- Service search
- Category selection
- Location/area search
- Verified filter
- Top Rated filter
- Professional profile
- Call button
- WhatsApp button
- Dark/light mode
- Sample professional data
- Android WebView wrapper
- GitHub Actions workflow that builds a debug APK
- No backend required for this demo

## GitHub build
1. Upload all files/folders to a GitHub repository.
2. Commit/push to `main`.
3. Open **Actions**.
4. Select **Build Trust Layer APK**.
5. Open the successful run.
6. Under **Artifacts**, download `trust-layer-debug-apk`.
7. Extract the ZIP to get `app-debug.apk`.

## Important
The sample professionals are stored locally in the app. For a real public marketplace where users share the same profiles, ratings and verification records, connect the app to a backend database/API and add authentication.

## Local Android build
If Android/Gradle is installed:
`gradle assembleDebug`

APK:
`app/build/outputs/apk/debug/app-debug.apk`
