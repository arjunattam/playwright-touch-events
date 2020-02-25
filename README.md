# playwright-touch-events

This repo explores emulating touch events (multi-finger taps, swipe, pinch) with Playwright v0.11.

The code uses the `Input.dispatchTouchEvent` CDP method ([docs](https://chromedevtools.github.io/devtools-protocol/tot/Input#method-dispatchTouchEvent)), which makes this experiment run on Chromium only.

The code is written as Jest tests, testing the [MDN multi-touch example](https://mdn.github.io/dom-examples/touchevents/Multi-touch_interaction.html).

## Usage

Clone and install NPM dependencies. Then run:

```
npm test
```
