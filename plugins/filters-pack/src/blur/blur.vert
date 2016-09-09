#define BLUR_KERNEL_SIZE {{size}}
#define BLUR_KERNAL_HALF_LENGTH {{halfLength}}.0
#define BLUR_HORIZONTAL {{horizontal}}

#define SAMPLE_INDEX(i) (float(i) - (BLUR_KERNAL_HALF_LENGTH - 1.0))

attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 uProjectionMatrix;
uniform float uStrength;

varying vec2 vBlurTexCoords[BLUR_KERNEL_SIZE];

void main(void)
{
    gl_Position = vec4((uProjectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);

    // this loop will get unrolled
    for (int i = 0; i < BLUR_KERNEL_SIZE; ++i)
    {
        #if BLUR_HORIZONTAL == 1
        vBlurTexCoords[i] = aTextureCoord + vec2(SAMPLE_INDEX(i) * uStrength, 0.0);
        #else
        vBlurTexCoords[i] = aTextureCoord + vec2(0.0, SAMPLE_INDEX(i) * uStrength);
        #endif
    }
}
