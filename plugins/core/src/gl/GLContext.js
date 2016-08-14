export default {
    /**
     * Helper function to create a webGL Context.
     *
     * @param {!HTMLCanvasElement} canvas - The canvas element that we will get the context from.
     * @param {object} options - An options object that gets passed in to the canvas element containing
     *  the context attributes, see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
     *  for the options available
     * @return {WebGLRenderingContext} the WebGL context
     */
    create(canvas, options)
    {
        const gl = canvas.getContext('webgl2', options)
            || canvas.getContext('experimental-webgl2', options)
            || canvas.getContext('webgl', options)
            || canvas.getContext('experimental-webgl', options);

        if (!gl)
        {
            // fail, not able to get a context
            throw new Error('This browser does not support WebGL.');
        }

        return gl;
    },
};
