/**
 * @class
 */
export default class RenderState
{
    /**
     *
     */
    constructor()
    {
        this.blendMode = null;
        this.texture = null;
    }

    /**
     *
     */
    reset()
    {
        this.texture = null;
        this.blendMode = null;
    }
}

RenderState.default = new RenderState();
