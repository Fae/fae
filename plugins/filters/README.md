# Filters

The filters plugin adds post-processing support for individual entities.

## Writing Custom Filters

When writting custom filters, you need to know about a few assumptions this plugin makes
as well as a couple things it gives you for free.

### Fragment Shader

When writing a custom fragment shader, there are a few assumptions the plugin makes.

First, it expects a sampler uniform with name `uSampler`:

```glsl
uniform sampler2D uSampler;
```

This sampler2D is set to the input texture. Additionally, there are couple other uniforms
that *can* be set if they exist in the shader, though not including them is not an error.

1) `uniform vec4 filterClamp;`
2) `uniform vec4 filterArea`

### Vertex Shader

If you write a custom vertex shader, you need to be aware that the plugin will be looking
for these attributes and uniforms to exist:

```glsl
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 uProjectionMatrix;
```

The plugin expects these to exist and tries to set their values. If they are not in the
shader, you will get an error. You can use the [default vertex shader](src/default.vert)
as a guide.
