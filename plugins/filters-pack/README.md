# Filters Pack

A pack of pre-made filters that might be useful in a variety of situations!

## Usage

You can use any filter in the pack by accessing it under the `filter_pack` namespace.

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

// add a filter from the filter pack
sprite.filters.push(new Fae.filters_pack.NoiseFilter(renderer));

// render like normal.
renderer.addEntity(sprite);
renderer.render();
```
