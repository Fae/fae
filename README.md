# Fay

## A JavaScript multi-threaded renderer

## Cool features

- Stores transform data in a large data array easily shared between WebWorkers
- Uses [mini-signals][[mini-signals] for extremely fast events*.
- Debug builds have lots of checks, all of them are stripped out in prod builds for max perf.

## Todo:

- Bounds
- Masks
- Filters
- Batching / Automatic Batching / Automatic spritesheeting
- Blend mode
- Custom shaders
- DevicePixelRatio

\* [mini-signals][[mini-signals] is even faster than [EventEmitter3][ee3] ([tests][event-tests]).


[mini-signals]: https://github.com/Hypercubed/mini-signals
[ee3]: https://github.com/primus/eventemitter3
[event-tests]: https://github.com/Hypercubed/EventsSpeedTests
