# Fae

## A 2D JavaScript Renderer

Based on [pixi.js](https://github.com/pixijs/pixi.js) but with a heavier focus on WebGL
and a few core design differences that result in a familiar but slightly different API.

Join the discussion in Discord: https://discord.gg/qghcMmr

The major goals of Fae are:

1. High amounts of modularity.
2. A slim and useful core.

Fae is not meant to be a drop-in game framework, but instead a collection of useful utilities
for rendering. I expect it will mainly be used inside other frameworks that use it for rendering,
though you could collect many plugins together to create a game only using Fae.

## Todo:

- Custom Shaders
- Filters
- Masks
- Mesh
- DevicePixelRatio
- Animated sprites
- Text/BitmapText
- Tiled Editor/Tile maps
- Loader
- Particle System
- Input handling
- Interactions (https://github.com/pixijs/pixi.js/issues/241)
- Move math shapes to plugin (Rectangle, BoundingBox, Polygon)
- Move `Color` to a plugin

[mini-signals]: https://github.com/Hypercubed/mini-signals
[ee3]: https://github.com/primus/eventemitter3
[event-tests]: https://github.com/Hypercubed/EventsSpeedTests
