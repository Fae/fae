# Fay

## A 2D JavaScript Renderer

Based on [pixi.js](https://github.com/pixijs/pixi.js) but with a heavier focus on WebGL
and a few core design differences that result in a familiar but slightly different API.

## Cool features

- Very generic and highly extensible core.
- Uses [mini-signals][mini-signals] for extremely fast events.
- Extra asserts and checks in debug builds, all of which are stripped out in prod builds.

## Todo:

- Tinting
- Bounds
- Masks
- Filters
- Blend mode
- Custom shaders
- DevicePixelRatio
- Interactions (https://github.com/pixijs/pixi.js/issues/241)
- Texture rotation

[mini-signals]: https://github.com/Hypercubed/mini-signals
[ee3]: https://github.com/primus/eventemitter3
[event-tests]: https://github.com/Hypercubed/EventsSpeedTests
