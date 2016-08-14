describe('core', function ()
{
    describe('util', function ()
    {
        describe('index', function ()
        {
            describe('#removeElements', function ()
            {
                it('Removes the specified elements', function ()
                {
                    var a = [1, 2, 3, 4, 5];

                    Fae.util.removeElements(a, 1, 2);

                    expect(a).to.eql([1, 4, 5]);
                });

                it('Uses the length when count is too large', function ()
                {
                    var a = [1, 2, 3, 4, 5];

                    Fae.util.removeElements(a, 1, 10);

                    expect(a).to.eql([1]);
                });
            });

            describe('#createIndicesForQuads', function ()
            {
                it('creates the proper indicies for 1 quad', function ()
                {
                    var indicies = Fae.util.createIndicesForQuads(1);

                    expect(indicies).to.eql(new Uint16Array([0, 1, 2, 0, 2, 3]));
                });

                it('creates the proper indicies for 2 quads', function ()
                {
                    var indicies = Fae.util.createIndicesForQuads(2);

                    expect(indicies).to.eql(new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7]));
                });
            });

            describe('#getMaxIfStatmentsInShader', function ()
            {
                it('works properly');
            });
        });
    });
});
