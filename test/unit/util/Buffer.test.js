describe('util/Buffer.js', function ()
{
    describe('#ctor', function ()
    {
        it('Can construct from an ArrayBuffer', function ()
        {
            var _b = new ArrayBuffer(0);
            var b = new Fae.util.Buffer(_b);

            confirmBuffer(b, _b);
        });

        it('Can construct from a Uint8Array', function ()
        {
            var _b = new Uint8Array(0);
            var b = new Fae.util.Buffer(_b);

            confirmBuffer(b, _b.buffer);
        });

        it('Can construct from a Float32Array', function ()
        {
            var _b = new Float32Array(0);
            var b = new Fae.util.Buffer(_b);

            confirmBuffer(b, _b.buffer);
        });

        it('Can construct from a number', function ()
        {
            var b = new Fae.util.Buffer(2);

            expect(b.buffer).to.be.an.instanceOf(ArrayBuffer);
            confirmBuffer(b, b.buffer);
        });

        it('Can take an offset into an ArrayBuffer', function ()
        {
            var _b = new Float32Array(2);
            var b = new Fae.util.Buffer(_b, 4);

            _b[1] = 5.0;

            expect(b.bytes.length).to.equal(4);
            expect(b.bytes[0]).to.equal(0);
            expect(b.bytes[1]).to.equal(0);
            expect(b.bytes[2]).to.equal(160);
            expect(b.bytes[3]).to.equal(64);

            expect(b.float32View.length).to.equal(1);
            expect(b.float32View[0]).to.equal(5.0);

            expect(b.uint32View.length).to.equal(1);
            expect(b.uint32View[0]).to.equal(1084227584);
        });

        it('Can take an offset and length into an ArrayBuffer', function ()
        {
            var _b = new Float32Array(6);
            var b = new Fae.util.Buffer(_b, 12, 8);

            _b[3] = 5.0;
            _b[4] = 6.5;

            expect(b.bytes.length).to.equal(8);
            expect(b.bytes[0]).to.equal(0);
            expect(b.bytes[1]).to.equal(0);
            expect(b.bytes[2]).to.equal(160);
            expect(b.bytes[3]).to.equal(64);
            expect(b.bytes[4]).to.equal(0);
            expect(b.bytes[5]).to.equal(0);
            expect(b.bytes[6]).to.equal(208);
            expect(b.bytes[7]).to.equal(64);

            expect(b.float32View.length).to.equal(2);
            expect(b.float32View[0]).to.equal(5.0);
            expect(b.float32View[1]).to.equal(6.5);

            expect(b.uint32View.length).to.equal(2);
            expect(b.uint32View[0]).to.equal(1084227584);
            expect(b.uint32View[1]).to.equal(1087373312);
        });
    });

    function confirmBuffer(b, _buff)
    {
        expect(b).to.have.property('__isBuffer', true);

        expect(b).to.have.property('buffer', _buff);
        expect(b).to.have.deep.property('bytes.buffer', _buff);
        expect(b).to.have.deep.property('float32View.buffer', _buff);
        expect(b).to.have.deep.property('uint32View.buffer', _buff);

    }
});

