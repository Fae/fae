export default class RenderState
{
    constructor()
    {
        this.blendMode = null;
        this.texture = null;
        this.transform = mat4.create();
    }

    reset()
    {
        this.texture = null;
        this.blendMode = null;
        mat4.identity(this.transform);
    }
}

RenderState.default = new RenderState();
