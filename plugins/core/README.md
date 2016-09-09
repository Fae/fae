# Core

The core plugin contains a multitude of utilities useful throughout the entire Fae ecosystem.
It exports the core `ecs` utilities, WebGL wrappers, Matrix/Vector math classes, the `Renderer`
and a few other useful items.

## Usage

Mostly the `core` plugin is just a set of utilities useful when building your own plugins.
The few classes you may interact with directly as an end-user will likely be:

- `render.Renderer` - The main renderer and system/entity manager for Fae
- `ecs.Entity` - The base Entity class all entities in the Renderer extend
- `ecs.System` - The base System class that all systems in the Renderer extend

For example:

```js
class MyEntity extends Fae.ecs.Entity.with(Fae.ecs.SelfRenderComponent)
{
    render()
    {
        // draw!
    }
}

const renderer = new Fae.render.Renderer(document.getElementById('my-canvas'));

renderer.addEntity(new MyEntity());

(function animate() {
    requestAnimationFrame(animate);
    renderer.render();
})();
```

If you have specific options you want to pass into the context creation, you could pass a
WebGLRenderingContext directly instead of a canvas. The core plugin exports a utility to
help with context creation, you can use it like this:

```js
const ctx = Fae.glutil.GLContext.create(document.getElementById('my-canvas'), { antialias: false });
const renderer = new Fae.render.Renderer(ctx);
```
