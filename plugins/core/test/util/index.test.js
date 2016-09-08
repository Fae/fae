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

            describe('#getMaxIfStatmentsInShader', function ()
            {
                it('works properly');
            });
        });
    });
});
