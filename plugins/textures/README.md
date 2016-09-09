# Textures

The `textures` plugin adds utilities that make it easy to manage WebGL textures. This plugin
exports two main classes; the `Texture` class and the `TextureSource` class.

A `TextureSource` manages a drawing source. It supports any [CanvasImageSource][cis]
(images, video, canvas, etc) or a `RenderTarget`. The job of the `TextureSource` is to manage
the loaded state of the source and the underlying `GLTexture` that gets uploaded to the GPU.

A `Texture` represents a rectangular frame of a given `TextureSource`. Its job is to
manage the UVs of the texture so after a texture is uploaded, we know what portion of it to draw.

Additionally this plugin contains a `TextureComponent` which adds a texture property to
an entity along with anchor properties that describe the attachment of the texture to the entity.
This plugin **does not** provide any methods to directly render textures. To render a
texture object you will need to either use the `sprites` plugin or build your own rendering
mechanism for `Texture`s.

## Usage

If you pass a [CanvasImageSource][cis] or `RenderTarget` to the constructor of a `Texture` it
will automatically create an underlying `TextureSource` for you.

For example:

```js
const img = new Image();
const texture = new Fae.textures.Texture(img);
```

This is nice for ease-of-use, but sometimes you need many textures for a single source. This is
often the case with spritesheets. You have one source (an image) but many frames (textures).
For these cases you can create the `TextureSource` yourself and reuse it for each `Texture` frame.

For example:

```js
const spritesheet = new Image();

const source = new Fae.textures.TextureSource(spritesheet);

const frame1 = new Fae.textures.Texture(source, new Fae.shapes.Rectangle(0, 0, 10, 10));
const frame2 = new Fae.textures.Texture(source, new Fae.shapes.Rectangle(10, 0, 10, 10));
const frame3 = new Fae.textures.Texture(source, new Fae.shapes.Rectangle(20, 0, 10, 10));
```

<!-- Links -->
[cis]: (https://developer.mozilla.org/en-US/docs/Web/API/CanvasImageSource)
