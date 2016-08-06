# Fae - 2D WebGL Renderer

[![Build Status](https://travis-ci.org/Fae/fae.svg?branch=master)](https://travis-ci.org/Fae/fae)
[![Dependency Status](https://gemnasium.com/badges/github.com/Fae/fae.svg)](https://gemnasium.com/github.com/Fae/fae)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/faejs.svg)](https://saucelabs.com/u/faejs)

Fae is originally based on [pixi.js](https://github.com/pixijs/pixi.js) but with a focus on WebGL
and a few core design differences that result in a familiar but slightly different API.

Fae is meant to be a highly modular rendering framework. The primary target use-case for Fae is
to be easily intregrable into larger application frameworks. However, the plugin library for Fae
enables it to be useful to end users as well as a standalone framework.

**Website**: Coming Soon
**Discord**: https://discord.gg/qghcMmr
**Docs/Guides**: Coming Soon

## Contents

- [Download Fae](#download)
- [Getting Started](#get-started)
- [Support Fae](#support)
- [Road Map](#roadmap)
- [Contributing](#contributing)

<a name="download"></a>
## Download

<a name="get-started"></a>
## Getting Started

<a name="support"></a>
## Support

Developing Fae takes a lot of time and effort. The multiple services and servers that run for
the Fae project cost a non-trivial amount of money. If you want to help support the continued
development of Fae, please consider making a donation.

There are a couple ways you can have an impact:

- A monthly contribution via Patreon (Coming Soon).
- A one-time donation via PayPal:

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
    <input type="hidden" name="cmd" value="_s-xclick">
    <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
    ">
    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
    <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

All donations go right back into the Fae community in the form of server hosting, and development
time.

<a name="roadmap"></a>
## Roadmap

<a name="contributing"></a>
## Contributing

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
- DevicePixelRatio
- Move math shapes to plugin (Rectangle, BoundingBox, Polygon)
- Move `Color` to a plugin
- Compressed textures

## Plugins to Make

- Mesh
- Animated sprites
- Text/BitmapText
- Tiled Editor/Tile maps
- Loader
- Particle System
- Interactions
- Spine, Dragon Bones, etc
- Lights

[mini-signals]: https://github.com/Hypercubed/mini-signals
[ee3]: https://github.com/primus/eventemitter3
[event-tests]: https://github.com/Hypercubed/EventsSpeedTests

[![Analytics](https://ga-beacon.appspot.com/UA-27838577-5/Fae/fae)](https://github.com/igrigorik/ga-beacon)
