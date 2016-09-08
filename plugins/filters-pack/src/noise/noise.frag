precision highp float;

// 1 "Standard" fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
// 2 One-Dimension fract( mod( 12345678., 256. * p.x) );
#define RANDOM_TYPE 1

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float uNoise;

// http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
// http://stackoverflow.com/questions/12964279/whats-the-origin-of-this-glsl-rand-one-liner
float rand(vec2 co)
{
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main()
{
    vec4 color = texture2D(uSampler, vTextureCoord);

    color *= rand(gl_FragCoord.xy * uNoise);

    gl_FragColor = color;
}
