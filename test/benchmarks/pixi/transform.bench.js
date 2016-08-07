(function ()
{
    'use strict';

    Bleacher.add({
        name: 'Transform',
        tests: [
            {
                name: 'fae',
                fn()
                {
                    lt.update(pt);
                },
                setup()
                {
                    const pt = new Fae.math.Transform();
                    const lt = new Fae.math.Transform();
                },
            },
            {
                name: 'pixi',
                fn()
                {
                    lt.updateTransform(pt);
                },
                setup()
                {
                    const pt = new PIXI.TransformStatic();
                    const lt = new PIXI.TransformStatic();
                },
            },
        ],
    });
})();
