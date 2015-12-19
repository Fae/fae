'use strict';

class RenderStates {

    constructor()
    {
        this.blendMode = null;
        this.transform = mat4.create();
    }

}

RenderStates.default = new RenderStates();
