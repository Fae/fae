attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vRgbNW;
varying vec2 vRgbNE;
varying vec2 vRgbSW;
varying vec2 vRgbSE;
varying vec2 vRgbM;

varying vec2 vTextureCoord;

uniform mat3 uProjectionMatrix;
uniform vec4 uFilterArea;

vec2 mapCoord(vec2 coord)
{
    coord *= uFilterArea.xy;
    coord += uFilterArea.zw;

    return coord;
}

vec2 unmapCoord(vec2 coord)
{
    coord -= uFilterArea.zw;
    coord /= uFilterArea.xy;

    return coord;
}

void texcoords(vec2 fragCoord, vec2 resolution,
               out vec2 vRgbNW, out vec2 vRgbNE,
               out vec2 vRgbSW, out vec2 vRgbSE,
               out vec2 vRgbM) {
    vec2 inverseVP = 1.0 / resolution.xy;
    vRgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
    vRgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
    vRgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
    vRgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
    vRgbM = vec2(fragCoord * inverseVP);
}

void main(void) {

   gl_Position = vec4((uProjectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

   vTextureCoord = aTextureCoord;

   vec2 fragCoord = vTextureCoord * uFilterArea.xy;

   texcoords(fragCoord, uFilterArea.xy, vRgbNW, vRgbNE, vRgbSW, vRgbSE, vRgbM);
}
