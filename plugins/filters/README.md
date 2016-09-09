# Filters

The filters plugin adds post-processing support for individual entities.

## Usage

Filters are high-level constructs that represent shaders. A Filter is usually a post-processing
effect that runs in the local space of an entity.

To use them, you simply need to add the `FilterComponent` to your entity, then add a filter to
the `.filters` array the component adds.

For example:

```js
// create an assemblage of a sprite that is filterable
class FilteredSprite extends Fae.sprites.Sprite.with(
    Fae.filters.FilterComponent,
    Fae.shapes.SpriteBoundsComponent // so I don't need to set .filterArea manually
) {}

// create a filtered sprite
const img = new Image(); img.src = 'spade_A.png';
const sprite = new FilteredSprite(new Fae.textures.Texture(img));

// add a new filter, pretend there is a fragment source and renderer :P
sprite.filters.push(new Fae.filters.Filter(renderer, fragmentSource));

// render like normal.
renderer.addEntity(sprite);
renderer.render();
```

## Writing Custom Filters

When writting custom filters, there are a few ways you can go about applying your custom effect.
The `Filter` class is ready to go and generates properties based off your shader source. So,
if you only want one instance of a filter with a particular source, you can just create it with
the built-in filter:

```js
const filter = new Fae.filters.Filter(renderer, fragmentSource, optionalVertexSource);
```

However, if you want to make a reusable filter where you don't need to pass the source in every
time, you can subclass `Filter` to make your own:

```js
class MyFilter extends Fae.filters.Filter
{
    constructor(renderer)
    {
        super(renderer, fragmentSource, optionalVertexSource);
    }
}
```

### Automatic Properties

The base filter class automatically reads your shader source and generates properties for each
of the uniforms in your filter on a properties called `.values` (excluding a few reserved names,
talked about in sections below).

For example, this shader:

```glsl
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uMultiplier;

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);

    color *= uMultiplier;

    gl_FragColor = color;
}
```

Will create a `.values` object that looks like this:

```json
{
    "uMultiplier": 0
}
```

This is the property you should use to change your uniform values. **Do not use the `.uniforms`
object, you will get unexpected results**.

Here is an example of correct usage:

```js
// where `multiplierFragSource` is the GLSL code above in a string:
const multiplyFilter = new Fae.filters.Filter(renderer, multiplierFragSource);

// `uMultiplier` property exists because it was auto detected from the source.
multiplyFilter.values.uMultiplier = 0.5;
```

### Fragment Shader

When writing a custom fragment shader, there are a few assumptions the plugin makes.

First, it expects a sampler uniform with name `uSampler`:

```glsl
uniform sampler2D uSampler;
```

This sampler2D is set to the input texture. Additionally, there are couple other uniforms
that *can* be set if they exist in the shader, though not including them is not an error.

1) `uniform vec4 uFilterArea;`
 - The first two components (`xy`) represent the width/height of the render target
 - The second two components (`zw`) represent the x/y coords of the bounds of the entity
2) `uniform vec4 uFilterClamp;`
 - The first two components (`xy`) represent the min texture coord for the filter
 - The second two components (`zw`) represent the max texture coord for the filter

These uniforms, if they exist, will be set automatically for you. Setting their values
manually will be ignored or may result in an error if you set the wrong type. Best to
let the engine set these values if you use them.

### Vertex Shader

Many filters will not require a custom vertex shader, but if you do  write a custom vertex
shader, you need to be aware that the plugin will be looking for these attributes and
uniforms to exist:

```glsl
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 uProjectionMatrix;
```

The plugin expects these to exist and tries to set their values. If they are not in the
shader, you will get an error. You can use the [default vertex shader](src/default.vert)
as a guide.
