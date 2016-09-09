/* eslint-disable max-len */
export const GAUSSIAN_VALUES = {
    5:  [0.153388, 0.221461, 0.250301, 0.221461, 0.153388],
    7:  [0.071303, 0.131514, 0.189879, 0.214607, 0.189879, 0.131514, 0.071303],
    9:  [0.028532, 0.067234, 0.124009, 0.179044, 0.202360, 0.179044, 0.124009, 0.067234, 0.028532],
    11: [0.009300, 0.028002, 0.065984, 0.121703, 0.175713, 0.198596, 0.175713, 0.121703, 0.065984, 0.028002, 0.0093],
    13: [0.002406, 0.009255, 0.027867, 0.065666, 0.121117, 0.174868, 0.197641, 0.174868, 0.121117, 0.065666, 0.027867, 0.009255, 0.002406],
    15: [0.000489, 0.002403, 0.009246, 0.027840, 0.065602, 0.120999, 0.174697, 0.197448, 0.174697, 0.120999, 0.065602, 0.027840, 0.009246, 0.002403, 0.000489],
};
/* eslint-enable max-len */

const vertTemplate = require('./blur.vert');
const fragTemplate = require('./blur.frag');

export function getFragSource(kernelSize)
{
    return fragTemplate
        .replace('{{size}}', kernelSize);
}

export function getVertSource(kernelSize, isHorizontal)
{
    return vertTemplate
        .replace('{{size}}', kernelSize)
        .replace('{{halfLength}}', Math.ceil(kernelSize / 2))
        .replace('{{horizontal}}', isHorizontal ? 1 : 0);
}

export function getMaxKernelSize(gl)
{
    const maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
    let kernelSize = 15;

    while (kernelSize > maxVaryings)
    {
        kernelSize -= 2;
    }

    return kernelSize;
}
