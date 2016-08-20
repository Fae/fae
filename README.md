# Fae - 2D WebGL Renderer

## Warning: In heavy development, API subject to break before v1.0.0 is released.

<!-- [![API Doc](https://doclets.io/Fae/fae/master.svg)](https://doclets.io/Fae/fae/master) -->
[![Build Status](https://travis-ci.org/Fae/fae.svg?branch=master)](https://travis-ci.org/Fae/fae)
[![Dependency Status](https://gemnasium.com/badges/github.com/Fae/fae.svg)](https://gemnasium.com/github.com/Fae/fae)
<br/>
[![Sauce Test Status](https://saucelabs.com/browser-matrix/faejs.svg)](https://saucelabs.com/u/faejs)
<br/>
<!-- [![Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)][patreon-donate] -->
[![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)][paypal-donate]

Fae is meant to be a highly modular rendering framework. The primary target use-case for Fae is
to be easily intregrable into larger application frameworks. However, the plugin library for Fae
enables it to be useful to end users as well when used as a standalone framework.

Get Involved:

**Website**: Coming Soon<br />
**Discord**: https://discord.gg/qghcMmr<br />
**Docs/Guides**: Coming Soon<br />

Fae contains some code that is originally based on [pixi.js](https://github.com/pixijs/pixi.js).
However, Fae takes a different approach to rendering and object than pixi. Some notable differences
in philosophy are:

- More focus on WebGL
- Flat structures (no scene tree)
    * z-index ordering instead
- Entity-Component-System (ECS) based
    * Using our custom [@fae/ecs][ecs] lib.

and a few other core design differences that result in a familiar but slightly different API.

## API Issues

- Currently update iterates systems, which each update all their entities.
 * Unfortunately, for 2 competing render systems it means whichever runs last will *always* be on top, reguardless of z-index
 * Maybe I can iterate entities and call update for each system??
 * If I do it that way, may have to bring back `ObjectRenderer`...

## Contents

- [Download Fae](#download)
- [Getting Started](#get-started)
- [Support Fae](#support)
- [Road Map](#roadmap)
- [Contributing](#contributing)

<a name="download"></a>
## Download

Pre-built versions of the library are hosted on Amazon S3. These are "full builds" meaning they
include all the official, open-source, plugins.

Each build of Fae includes these files:

- `fae.js` - Development build. Unminified and includes debug asserts and other checks that
    negatively affect performance.
- `fae.js.map` - Development source-map file that maps compiled `fae.js` file back into source
    code.
- `fae.min.js` - Production build. Minified and all debugging code is stripped out for maximum
    performance.

Below is information on how to download each build type.

### Stable Release

You can download the builds for any particular release at:

```
http://fae-builds.s3-website-us-west-2.amazonaws.com/release/<version>/fae.js
http://fae-builds.s3-website-us-west-2.amazonaws.com/release/<version>/fae.js.map
http://fae-builds.s3-website-us-west-2.amazonaws.com/release/<version>/fae.min.js
```

Replace `<version>` with the version of the library you want. For example, to get `v1.0.0`:

- http://fae-builds.s3-website-us-west-2.amazonaws.com/release/v1.0.0/fae.js
- http://fae-builds.s3-website-us-west-2.amazonaws.com/release/v1.0.0/fae.js.map
- http://fae-builds.s3-website-us-west-2.amazonaws.com/release/v1.0.0/fae.min.js

### Unstable Builds

You can download the builds for any particular branch or git-sha at:

```
http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/<branch-or-git-sha>/fae.js
http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/<branch-or-git-sha>/fae.js.map
http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/<branch-or-git-sha>/fae.min.js
```

Replace `<branch-or-git-sha>` with a branch name (like `master`) to get the latest successful
build of that branch or with the git-sha of a particular commit (like `1e532f70822f262452fb85b3669102bb05b443eb`).

For example:

- http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/master/fae.js
- http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/master/fae.js.map
- http://fae-builds.s3-website-us-west-2.amazonaws.com/unstable/master/fae.min.js

Note that only builds that succeed will have files on S3. If the build fails there will
be no built files, so not every git-sha in the history may work.

<a name="get-started"></a>
## Getting Started

Coming Soon.

<a name="support"></a>
## Support

Developing Fae takes a lot of time and effort. The multiple services and servers that run for
the Fae project cost a non-trivial amount of money. If you want to help support the continued
development of Fae, please consider making a donation.

There are a couple ways you can have an impact:

- A monthly contribution via Patreon (Coming Soon).
- A donation via PayPal: [![PayPal](https://img.shields.io/badge/paypal-donate-yellow.svg)][paypal-donate]

All donations go right back into the Fae community in the form of server hosting, and development
time.

<a name="roadmap"></a>
## Roadmap

### Todo:

- Filters (FilteredQuadRenderer?)
- DevicePixelRatio
- Move `Color` to a plugin
- Compressed texture support in GLTexture and textures plugin

### Plugins to Make

- Debug
- Mesh
- Animated sprites
- Text/BitmapText
- Tiled Editor/Tile maps
- Loader
- Particle System
- Interactions
- Spine, Dragon Bones, etc
- Lights
- Flash animation import
- Tiling sprites
- UI Library
- Tweening

### Guides/Tutorials to write:

- Intro to the ECS architecture Fae uses
- General Performance Guidelines
 * How batching happens and how you can take advantage of it.
 * How to write efficient systems
- Rendering looks weird on my old XYZ Mobile Device
 * Description of the options that may fix issues on old mobile
 * Shader precision, batch sizes, multi-texture sizes, VAO usage, etc.

<a name="contributing"></a>
## Contributing

The [Contributing Guide]() contains the full details on how to contribute
changes to the project.

Main points:

- Report bugs on [GitHub Issues][github-issues] and include a code sample.
- Pull Requests should be made against `master`.
- Before contributing read the [Code of Conduct][code-of-conduct].

[mini-signals]: https://github.com/Hypercubed/mini-signals
[ee3]: https://github.com/primus/eventemitter3
[event-tests]: https://github.com/Hypercubed/EventsSpeedTests
[github-issues]: https://github.com/Fae/fae/issues
[code-of-conduct]: https://github.com/Fae/fae/blob/master/CODE_OF_CONDUCT.md
[paypal-donate]: https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=CAP4H5ZVLHMMW&lc=US&item_name=Fae&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
[patreon-donate]: https://www.patreon.com/user?u=2430663
[ecs]: https://github.com/Fae/ecs

[![Analytics](https://ga-beacon.appspot.com/UA-27838577-5/Fae/fae)](https://github.com/igrigorik/ga-beacon)
