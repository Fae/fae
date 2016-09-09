# Transform

The `transform` plugin provides utilities for dealing with matrix transforms. This includes
a component that adds a transform property to an entity and a system that updates the transform
matrix of each entity each frame.

## Usage

You can simply add the transform component to an entity and you will have access to familiar
positional APIs like position, scale, rotation, and skew.

For example:

```js
class TransformableEntity extends Fae.ecs.Entity.with(
    Fae.transform.TransformComponent
) { }

const ent = new TransformableEntity();

ent.transform.x = 0; // x position
ent.transform.y = 0; // y position

ent.transform.scaleX = 1; // x scale
ent.transform.scaleY = 1; // y scale

ent.transform.skewX = 0; // x skew
ent.transform.skewY = 0; // y skew

ent.transform.rotation = 0; // rotation angle (radians)

// updates the underlying transform matrix based on the above properties.
// normally you would just let the TransformUpdateSystem do this for you.
ent.transform.update();
```
