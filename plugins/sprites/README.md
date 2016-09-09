# Sprites

The `sprites` plugin exposes an object that renders a `Texture` object from the `textures`
plugin. The `SpriteRenderSystem` renders sprites in batches when it can by combining sprites
that share a texture/blendMode into a single batch.

## Usage

The sprite plugin provides a pre-made entity for rendering. It is a combonation of the
following components:

- `Fae.ecs.VisiblityComponent` - Defines whether or not to render
- `Fae.transform.TransformComponent` - Defines where to render
- `Fae.textures.TextureComponent` - Defines what to render
- `Fae.sprites.SpriteComponent` - Defines how to render

Here is an example usage of the pre-made sprite assemblage:

```js
const img = new Image();
const texture = new Fae.textures.Texture(img);
const sprite = new Fae.sprites.Sprite(texture);

renderer.addEntity(sprite);
renderer.render();
```

It's that easy!
