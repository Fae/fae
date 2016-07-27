describe('util/BlendMode.js', function ()
{
    describe('#ctor', function ()
    {
        it('is properly constructed', function ()
        {
            var b = new Fae.util.BlendMode(1, 2, 3);

            expect(b.sfactor).to.equal(1);
            expect(b.dfactor).to.equal(2);
            expect(b.equation).to.equal(3);
        });
    });

    describe('#enable', function ()
    {
        it('enables the blendFunc and equation', function ()
        {
            var gl = { blendFunc: sinon.spy(), blendEquation: sinon.spy() };
            var b = new Fae.util.BlendMode(1, 2, 3);

            b.enable(gl);

            expect(gl.blendFunc).to.have.been.calledOnce.and.calledWith(1, 2);
            expect(gl.blendEquation).to.have.been.calledOnce.and.calledWith(3);
        });
    });

    describe('#equals', function ()
    {
        it('returns true if equal', function ()
        {
            var b1 = new Fae.util.BlendMode(1, 2, 3);
            var b2 = new Fae.util.BlendMode(1, 2, 3);

            expect(b1.equals(b2)).to.equal(true);
            expect(b2.equals(b1)).to.equal(true);
        });

        it('returns false if not equal', function ()
        {
            var b1 = new Fae.util.BlendMode(1, 2, 3);
            var b2 = new Fae.util.BlendMode(1, 2, 4);

            expect(b1.equals(b2)).to.equal(false);
            expect(b2.equals(b1)).to.equal(false);

            expect(b1.equals()).to.equal(false);
            expect(b2.equals()).to.equal(false);
        });
    });
});
