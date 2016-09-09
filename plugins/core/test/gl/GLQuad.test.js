describe('core', function ()
{
    describe('gl', function ()
    {
        describe('GLQuad', function ()
        {
            describe('.createIndices', function ()
            {
                it('creates the proper indicies for 1 quad', function ()
                {
                    var indicies = Fae.glutil.GLQuad.createIndicesForQuads(1);

                    expect(indicies).to.eql(new Uint16Array([
                        0, 1, 2, 0, 2, 3,
                    ]));
                });

                it('creates the proper indicies for 2 quads', function ()
                {
                    var indicies = Fae.glutil.GLQuad.createIndicesForQuads(2);

                    expect(indicies).to.eql(new Uint16Array([
                        0, 1, 2, 0, 2, 3,
                        4, 5, 6, 4, 6, 7,
                    ]));
                });
            });
        });
    });
});
