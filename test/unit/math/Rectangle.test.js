describe('math/Rectangle.js', function ()
{
    describe('#ctor', function ()
    {
        it('Constructs a default rectangle', function ()
        {
            var r = new Fae.math.Rectangle();

            expect(r).to.have.property('x', 0);
            expect(r).to.have.property('y', 0);
            expect(r).to.have.property('width', 0);
            expect(r).to.have.property('height', 0);

            expect(r).to.have.property('left', 0);
            expect(r).to.have.property('right', 0);
            expect(r).to.have.property('top', 0);
            expect(r).to.have.property('bottom', 0);
        });

        it('Constructs a rectangle based on params', function ()
        {
            var r = new Fae.math.Rectangle(1, 2, 3, 4);

            expect(r).to.have.property('x', 1);
            expect(r).to.have.property('y', 2);
            expect(r).to.have.property('width', 3);
            expect(r).to.have.property('height', 4);

            expect(r).to.have.property('left', 1);
            expect(r).to.have.property('right', 4);
            expect(r).to.have.property('top', 2);
            expect(r).to.have.property('bottom', 6);
        });
    });

    describe('#isEmpty', function ()
    {
        it('Returns true when empty', function ()
        {
            var r = new Fae.math.Rectangle();

            expect(r.isEmpty()).to.equal(true);
        });

        it('Returns true when empty but offset', function ()
        {
            var r = new Fae.math.Rectangle(5, 5);

            expect(r.isEmpty()).to.equal(true);
        });

        it('Returns false when not empty', function ()
        {
            var r = new Fae.math.Rectangle(5, 5, 1, 0);

            expect(r.isEmpty()).to.equal(false);
        });

        it('Returns false when not empty', function ()
        {
            var r = new Fae.math.Rectangle(5, 5, 1, 1);

            expect(r.isEmpty()).to.equal(false);
        });
    });

    describe('#clone', function ()
    {
    });

    describe('#copy', function ()
    {
    });

    describe('#contains', function ()
    {
    });

    describe('#union', function ()
    {
    });

    describe('#intersection', function ()
    {
    });

    describe('#inflate', function ()
    {
    });

    describe('#fit', function ()
    {
    });

    describe('#equals', function ()
    {
    });
});
