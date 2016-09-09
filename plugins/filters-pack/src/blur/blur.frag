#define BLUR_KERNEL_SIZE {{size}}

varying vec2 vBlurTexCoords[BLUR_KERNEL_SIZE];

uniform sampler2D uSampler;
uniform float uBlurValues[BLUR_KERNEL_SIZE];

void main(void)
{
    gl_FragColor = vec4(0.0);

    // this loop will get unrolled
    for (int i = 0; i < BLUR_KERNEL_SIZE; ++i)
    {
        gl_FragColor += texture2D(uSampler, vBlurTexCoords[i]) * uBlurValues[i];
    }
}
