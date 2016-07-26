(function ()
{
    'use strict';

    Bleacher.add({
        name: 'Update',
        tests: [
            {
                name: 'fae',
                fn()
                {
                    stage.update();
                },
                setup()
                {
                    const stage = new Fae.scene.Container();
                    const falseParent = new Fae.scene.Container();

                    falseParent.addChild(stage);

                    for (let i = 0; i < 100; ++i)
                    {
                        stage.addChild(new Fae.scene.Container());
                    }
                },
            },
            {
                name: 'pixi',
                fn()
                {
                    stage.updateTransform();
                },
                setup()
                {
                    const stage = new PIXI.Container();
                    const falseParent = new PIXI.Container();

                    falseParent.addChild(stage);

                    for (let i = 0; i < 100; ++i)
                    {
                        stage.addChild(new PIXI.Container());
                    }
                },
            },
        ],
    });
}());
