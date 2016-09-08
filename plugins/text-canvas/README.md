# text-canvas

The canvas text plugin contains helpers to draw text to a canvas element. It handles spacing, word
wrapping, text shadowing, and other useful functions.

## Usage

In the most basic of usage you just create a writer and write some text:

```js
const writer = new Fae.text_canvas.CanvasTextWriter();

// draws "Hello World!" to the canvas at `writer.canvas`
writer.write('Hello World!');

```

You can also pass your own canvas in if you want to draw to a specific canvas element.

```js
const writer = new Fae.text_canvas.CanvasTextWriter(document.getElementById('my-canvas'));

// draws "Hello World!" to the canvas at `writer.canvas`, which is also the canvas
// element that was passed as the constructor argument.
writer.write('Hello World!');
```

You can also create custom styles with the `CanvasTextStyle` class:

```js
const style = new Fae.text_canvas.CanvasTextStyle();
const writer = new Fae.text_canvas.CanvasTextWriter();

style.fillStyle = 'red';

// draws "Hello World!" to the canvas at `writer.canvas`, in red this time.
writer.write('Hello World!', style);
```

## Rendering in the Scene

Rendering the text you draw to a canvas in the Fae renderer is trivial when using the `sprites` and
`textures` plugins, since a `Texture` can take a canvas as the source:

```js
const writer = new Fae.text_canvas.CanvasTextWriter();
const texture = new Fae.textures.Texture(writer.canvas);
const sprite = new Fae.sprites.Sprite(texture);

// draws "Hello World!" to the canvas at `writer.canvas`
writer.write('Hello World!');
texture.update(); // updates the texture on the gpu

// render the scene
renderer.addEntity(sprite);
renderer.render();
```
