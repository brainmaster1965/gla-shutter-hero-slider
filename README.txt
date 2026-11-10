================================================================================
GLA SHUTTER HERO SLIDER
================================================================================
Version: 2.3.0
Author: WebDevGLa
License: Envato Standard / Commercial License

DESCRIPTION:
--------------------------------------------------------------------------------
Gla Shutter Hero Slider is a modern, ultra-responsive fullscreen hero slider 
component for web projects. It features a unique shutter transition effect 
(CSS clip-path), dynamic parallax background scrolling, configurable hover 
autoplay-pause, global touch/mouse drag-to-swipe gestures, and full 
JSON-driven content & alignment management.

FEATURES:
--------------------------------------------------------------------------------
- 100% Vanilla JavaScript & Pure CSS: Zero third-party dependencies (No jQuery,
  No Swiper.js, No external libraries required).
- Ultra Lightweight & Fast: Lightning-fast load times and zero risk of script
  conflicts with other plugins or frameworks.
- Fullscreen Hero Layout with responsive mobile image scaling.
- Modular Content Visibility: Toggle individual slide elements (author, title,
  topic, description, buttons) on/off per slide via JSON.
- Dynamic 9-Grid Content Placement: Freely position slide content (Top-Left, 
  Center-Right, Bottom-Center, etc.) with precise alignment overrides.
- Multi-Platform Gesture Support: Global touch-swipe (mobile) and desktop mouse 
  drag-to-swipe interaction.
- Text Selection Protection: CSS user-select protections prevent accidental text 
  highlighting while dragging or clicking.
- Configurable Pause-on-Hover: Control autoplay pause via HTML data attribute 
  (data-stop-on-hover="true|false").
- Accessible by default: labeled controls, inert hidden slides and support for
  the OS setting "reduce motion" (prefers-reduced-motion).
- Single source for timing: shutter duration is one CSS variable
  (--shutter-duration in style.css), read by the script.
- Dynamic JSON-driven slide rendering & button styling.
- Shutter reveal animation (CSS clip-path) & Smooth Parallax scroll effect.
- Maintained Clean Code Structure: Fully unminified source CSS and JS files for 
  seamless customization and maintenance.

DIRECTORY STRUCTURE:
--------------------------------------------------------------------------------
- Main-Files/           -> Ready-to-use HTML, CSS, JS, and JSON assets
- Documentation/        -> Step-by-step HTML documentation (index.html)
- README.txt            -> Product overview and release notes

CHANGELOG:
--------------------------------------------------------------------------------
### v2.3.0 (2026-11-10)

- **Fixed - Swipe during animation:** A swipe performed while a shutter transition was
  still running bypassed the animation lock and desynchronized the DOM queue and the
  pagination (e.g. slide 2 visible, dot 3 active). Swipes now go through the arrow
  buttons and are ignored while animating.
- **Fixed - Hover pause after mouse drag:** After a desktop drag-to-swipe, autoplay
  resumed although the pointer was still over the slider. data-stop-on-hover is now
  respected after a drag.
- **Fixed - Aborted touch gestures:** A touchcancel event (e.g. when the browser takes
  over for vertical scrolling) left autoplay paused permanently. Autoplay now resumes.
- **Fixed - Horizontal scrollbar:** The slider used width: 100vw, which includes the
  scrollbar width and could cause horizontal scrolling on systems with classic
  scrollbars. It now uses width: 100%.
- **Fixed - Mobile viewport height:** Height uses 100svh (with 100vh fallback), so the
  hero no longer jumps when the mobile address bar collapses.
- **Fixed - Broken markup with special characters:** alt, src and href values from
  slides.json are now escaped, so quotes in titles or URLs can no longer break the
  generated HTML. Text fields remain HTML-capable (e.g. <br>).
- **Improved - Single source for timing:** The shutter duration is defined once as CSS
  custom property --shutter-duration and read by the script (previously hardcoded in
  JS and CSS).
- **Improved - Visible error message:** If slides.json cannot be loaded, the slider
  shows a message (incl. a hint for file:// usage) instead of a blank black screen.
- **Improved - Accessibility:** aria-label on arrows and pagination dots, aria-current
  on the active dot, hidden slides are inert (no stray keyboard focus), and
  prefers-reduced-motion disables shutter, parallax and text animation.
- **Improved - Touch handling:** Added touch-action: pan-y so vertical page scrolling
  stays smooth while horizontal swipes are handled by the slider.
- **Cleanup:** Removed duplicate display declarations in style.css, numbered the demo
  texts in slides.json. All files re-versioned to 2.3.0.

### v2.2.0 (2026-11-10)

- **Engine & DOM Integrity:** Fixed a critical bug where slide jumps via pagination
  (especially across slides > 2 or larger distances) could desynchronize the internal
  DOM queue and the carousel's Z-index hierarchy.
- **Pagination Optimization:** Non-adjacent pagination buttons are now intelligently
  managed and restricted during active animations to completely prevent visual glitches
  (such as overlapping shutter transitions on distant jumps) and subsequent navigation desyncs.
- **Enhanced Stability:** Ensures permanent, robust synchronization between `globalCurrentIndex`,
  the `.slide-list` child nodes, and all navigation controls (arrows, swipe gestures, and pagination).

v2.1.0 (2026-11-09)
- Minor bugfixes & improvements.
- Missing FontFamily added to author, title & topic.
- Added configurable HTML attribute control for hiding progress bar on top (`data-hide-progress`).
- Added configurable HTML attribute control for hiding nav-buttons (`data-hide-navigation`).
- Added configurable HTML attribute control for hiding pagination (`data-hide-pagination`).
- Updated comprehensive HTML documentation to cover all v2.1.0 enhancements.

v2.0.0 (2026-11-08)
- Added dynamic 9-grid vertical and horizontal content positioning via JSON alignment.
- Added strict vertical CSS positioning overrides (top, bottom, center) in style.css.
- Added global touch-swipe (mobile/tablet) and desktop mouse drag-to-swipe interaction.
- Added configurable HTML attribute control for hover pause (data-stop-on-hover).
- Added user-select protection in CSS to prevent unwanted text selection during drag.
- Enhanced responsive mobile background image scaling.
- Updated comprehensive HTML documentation to cover all v2.0.0 enhancements.

v1.0.0 (2026-11-07)
- Initial commercial release
- Standalone HTML/CSS/JS engine with dynamic JSON loading
- Added full parallax effect support and responsive shutter clip-path transitions

SUPPORT & CONTACT:
--------------------------------------------------------------------------------
If you have any questions or need support, please contact WebDevGLa via 
our profile page or website.

DOCUMENTATION:
--------------------------------------------------------------------------------
To view the full step-by-step documentation, please open Documentation/index.html in your web browser.

(c) 2026 WebDevGLa. All rights reserved.