# RNGH 3.0.2 — gestures under an `expo-blur` `BlurTargetView` are cancelled on Android

Reproduction for a **regression introduced by [PR #4177](https://github.com/software-mansion/react-native-gesture-handler/pull/4177)**.

## TL;DR

Any gesture (`LongPress`, etc.) rendered **inside an `expo-blur` `<BlurTargetView>`** is recorded then immediately cancelled (`BEGAN → CANCELLED`) on Android, so it never activates. iOS is unaffected.

On Android, `BlurTargetView` renders `ExpoBlurTargetView` and keeps its inner `UIManagerCompatibleBlurTarget` **parented-but-detached** (it reparents the target out of its child list to snapshot it for the blur). #4177 made RNGH's `isViewAttachedUnderWrapper` treat any ancestor that is missing from its parent's child list as "detached" and cancel the gesture — so every gesture under the blur target dies.

In our app the **entire navigation tree** is wrapped in a `BlurTargetView`, so long-press-to-react on every list (circle feed, chat) broke the moment we moved RNGH `2.x → 3.0.x`.

## The trigger is `BlurTargetView` — nothing else

Confirmed by reverting it: with the `<BlurTargetView>` in `App.tsx`, long-press inside the FlashList is dead on Android. **Remove that one wrapper and it works.** A flat FlashList — even nested in `react-native-screens` navigators — does **not** reproduce it. The minimal recipe is:

```
GestureHandlerRootView → expo-blur BlurTargetView → FlashList (rows with a LongPress gesture)
```

The bottom-tabs / native-stack nesting in this repo mirrors our real app but is **not** required.

## Structure

| File | What it is |
|-|-|
| `App.tsx` | `GestureHandlerRootView → BlurTargetView → BottomTabs → native Stack → list screens`. The `BlurTargetView` is the trigger. |
| `src/screens/MinimalScreen.tsx` | **Bare-minimum**: FlashList rows = a single `useLongPressGesture` in a `GestureDetector`. |
| `src/screens/TreeScreen.tsx` | **Production tree**: the exact `MessageInteractionZone` wrapper we ship (`useCompetingGestures(longPress, tap)`, `runOnJS`) inside a FlashList. |

Each screen also renders the gesture on a **control row outside the FlashList** — it works regardless, isolating "under the blur target + in a list" as the broken case.

## Environment

| | |
|-|-|
| react-native-gesture-handler | **3.0.2** |
| expo-blur | 14.x (Expo SDK 56) |
| react-native | 0.85.3 (new architecture) |
| @shopify/flash-list | 2.3.2 |
| @react-navigation/* | 7.x |
| react-native-screens | 4.25.2 |
| Platform | **Android** (broken) · iOS (works) |

## Run it

`expo-blur` is native, so a clean dev build is required (Expo Go won't have RNGH 3.0.2 either):

```bash
npm install
npx expo prebuild --clean
npx expo run:android      # broken: long-press a FlashList row does nothing
npx expo run:ios          # works
```

## Steps

1. On the **Minimal** (or **Tree**) tab:
2. **Long-press the control row** at the top → counter increments. ✅
3. **Long-press any row inside the FlashList** → nothing happens on Android. ❌ (works on iOS)
4. **Tap** a list row → the tap counter increments, proving the detector receives touches. ✅
5. To prove the cause: delete the `<BlurTargetView>` wrapper in `App.tsx`, rebuild → the list long-press works. ✅

## Root cause

`GestureHandlerOrchestrator.deliverEventToGestureHandler` calls `isViewAttachedUnderWrapper(...)` before delivering each event. PR #4177 ([fixing #3921](https://github.com/software-mansion/react-native-gesture-handler/issues/3921)) changed it to treat a view as **detached** when any ancestor is missing from its parent's child list:

`android/src/main/java/com/swmansion/gesturehandler/core/GestureHandlerOrchestrator.kt`

```kotlin
// After #4177 — strict "disappearing child" check
var current: View = view
while (true) {
  val parent = current.parent as? ViewGroup ?: return false
  when {
    // "disappearing child … e.g. RNScreens during a navigation transition"
    parent.indexOfChild(current) < 0 -> return false
    parent === wrapperView -> return true
    else -> current = parent
  }
}
```

`expo-blur`'s `UIManagerCompatibleBlurTarget` is exactly such a node — `parent` is set to `ExpoBlurTargetView`, but `ExpoBlurTargetView.indexOfChild(it) < 0` because the target was reparented out for snapshotting. The actual failing walk, captured on a circle-feed long-press:

```
attach=FALSE detached='UIManagerCompatibleBlurTarget' in='ExpoBlurTargetView'
chain: RNGestureHandlerDetectorView -> ReactViewGroup -> ReactViewGroup -> ReactScrollView
  -> ReactSwipeRefreshLayout -> ClippingScrollViewDecoratorView -> ScreenContentWrapper
  -> Screen -> ScreensCoordinatorLayout -> ScreenStack -> ReactViewGroup -> ReactViewGroup
  -> RNGestureHandlerRootView -> ReactViewGroup -> ReactViewGroup
  -> UIManagerCompatibleBlurTarget -> [ExpoBlurTargetView]
```

`Tap` survives (it resolves on its first event differently); `LongPress` — which must stay alive across `minDuration` and is re-checked on delivered events — is cancelled before it can activate.

The pre-#4177 walk was lenient and did not have this problem:

```kotlin
// Before #4177 — lenient parent walk
var parent = view.parent
while (parent != null && parent !== wrapperView) {
  parent = parent.parent
}
return parent === wrapperView
```

## Workaround

Reverting `isViewAttachedUnderWrapper` to the lenient walk fixes it but re-introduces the niche RNScreens-navigation crash #4177 was addressing. A proper fix needs to distinguish a genuinely-disappearing child from a deliberately-reparented-but-attached one (like expo-blur's target) without the blanket `indexOfChild` test. See `fix.patch`.

## Notes

- iOS uses a different orchestrator path and is unaffected.
- Both `useLongPressGesture` alone (minimal) and `useCompetingGestures(longPress, tap)` (tree) reproduce it.
- `runOnJS: true` is irrelevant — the cancellation happens natively before any callback runs.
- FlashList recycling and react-native-screens nesting are **not** the cause — only the `expo-blur` blur target is.
