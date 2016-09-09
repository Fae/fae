# Interaction

The interaction plugin adds support for managing mouse, touch, and pointer input and relates
those events to entities in the scene. Specifically, any object with the `InteractionComponent`
(which includes the `BoundsComponent`).

## Usage

Using the interaction plugin is fairly simple. Just add an entity that has the `InteractionComponent`
to the renderer.

For example:

```js
// create an assemblage of a sprite that is interactable
class InteractableSprite extends Fae.sprites.Sprite.with(
    Fae.interaction.InteractionComponent,
    Fae.sprites.SpriteBoundsComponent // for proper bounds calculation of this sprite
) {}

const sprite = new InteractableSprite();

sprite.onClick.add((pointer) => {
    console.log(pointer);
});

renderer.addEntity(sprite);
renderer.render();
```

Since by default the `InteractionSystem` is automatically added to the renderer (if the plugin
exists) the above sample just works as is.
