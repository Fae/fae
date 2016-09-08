import CanvasTextStyle from './CanvasTextStyle';

// TODO: Add append methods

const rgxNewline = /\r\n|\r|\n/;

/**
 * @class
 * @memberof text-canvas
 */
export default class CanvasTextWriter
{
    /**
     * @param {HTMLCanvasElement} canvas - optional canvas to write to.
     * @param {boolean} autoResize - When set the writer will automatically resize the
     *  canvas as needed. It defaults to `true` if you do not pass in a canvas element
     *  and `false` if you do pass in a canvas element.
     */
    constructor(canvas = null, autoSize = !canvas)
    {
        /**
         * The canvas element that everything is drawn to.
         *
         * @member {HTMLCanvasElement}
         */
        this.canvas = canvas || document.createElement('canvas');

        /**
         * Should we resize the canvas when drawing to it?
         *
         * @member {boolean}
         */
        this.autoSize = autoSize;

        /**
         * The canvas 2d context that everything is drawn with.
         *
         * @private
         * @member {CanvasRenderingContext2D}
         */
        this._textCtx = this.canvas.getContext('2d');
    }

    /**
     * Draws the text to the canvas.
     *
     * @param {string} text - The text to write.
     */
    write(text, style = CanvasTextWriter.defaultStyle)
    {
        const ctx = this._textCtx;
        const outputText = style.wordWrap ? this._wordWrap(text) : text;
        const lines = outputText.split(rgxNewline);

        // setup context
        ctx.font = style.getFontString();
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeThickness;
        ctx.textBaseline = style.textBaseline;
        ctx.lineJoin = style.lineJoin;
        ctx.miterLimit = style.miterLimit;
        ctx.fillStyle = style.getFillStyle(lines.length);
        ctx.shadowBlur = style.shadowBlur;
        ctx.shadowColor = style.shadowColor;
        ctx.shadowOffsetX = style.shadowOffsetX;
        ctx.shadowOffsetY = style.shadowOffsetY;

        // calculate text width
        const lineWidths = new Array(lines.length);
        const fontProperties = this._determineFontProperties(ctx.font);
        let maxLineWidth = 0;

        // calculate line widths
        for (let i = 0; i < lines.length; ++i)
        {
            const lineWidth = ctx.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing);

            lineWidths[i] = lineWidth;
            maxLineWidth = Math.max(maxLineWidth, lineWidth);
        }

        const dsSize = style.dropShadow ? style.dropShadowDistance : 0;
        const padd = (style.strokeThickness + style.padding) * 2;

        // calculate width necessary for canvas
        if (this.autoSize)
        {
            const width = maxLineWidth + dsSize + padd;

            this.canvas.width = Math.ceil(width /* * this.resolution */);
        }

        // calculate height necessary for canvas
        const fntLineHeight = dsSize + fontProperties.fontSize + padd;
        const lineHeight = style.lineHeight ? style.lineHeight + padd : fntLineHeight;

        if (this.autoSize)
        {
            const height = Math.max(lineHeight, fntLineHeight) + ((lines.length - 1) * lineHeight);

            this.canvas.height = Math.ceil(height /* * this.resolution*/);
        }

        // clear and prepare for new text
        // ctx.scale(this.resolution, this.resolution);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let linePositionX = 0;
        let linePositionY = 0;

        // draw lines line by line
        for (let i = 0; i < lines.length; ++i)
        {
            linePositionX = style.strokeThickness / 2;
            linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;

            if (style.align === 'right')
            {
                linePositionX += maxLineWidth - lineWidths[i];
            }
            else if (style.align === 'center')
            {
                linePositionX += (maxLineWidth - lineWidths[i]) / 2;
            }

            if (style.stroke && style.strokeThickness)
            {
                this._drawText(lines[i], linePositionX + style.padding, linePositionY + style.padding, true);
            }

            if (style.fillStyle)
            {
                this._drawText(lines[i], linePositionX + style.padding, linePositionY + style.padding);
            }
        }
    }

    /**
     * Destroys this text object.
     */
    destroy()
    {
        this._textCtx = null;
        this.canvas = null;

        this.style = null;
    }

    /**
     * Calculates the ascent, descent and fontSize of a given fontStyle
     *
     * @private
     * @param {string} fontStyle - String representing the style of the font
     * @return {Object} Font properties object
     */
    _determineFontProperties(fontStyle)
    {
        if (CanvasTextWriter.fontPropertiesCache[fontStyle])
        {
            return CanvasTextWriter.fontPropertiesCache[fontStyle];
        }

        const properties = CanvasTextWriter.fontPropertiesCache[fontStyle];

        // initialize if necessary
        if (!CanvasTextWriter.fontPropertiesCanvas)
        {
            CanvasTextWriter.fontPropertiesCanvas = document.createElement('canvas');
            CanvasTextWriter.fontPropertiesContext = CanvasTextWriter.fontPropertiesCanvas.getContext('2d');
        }

        const canvas = CanvasTextWriter.fontPropertiesCanvas;
        const context = CanvasTextWriter.fontPropertiesContext;
        const testText = '|MÉqg';

        context.textBaseline = 'alphabetic';
        context.fillStyle = '#000';
        context.font = fontStyle;

        const width = Math.ceil(context.measureText(testText).width);
        const mwidth = Math.ceil(context.measureText('M').width);
        const baseline = Math.ceil(mwidth * 1.5);
        const height = 2 * mwidth;

        canvas.width = width;
        canvas.height = height;

        context.fillStyle = '#f00';
        context.fillRect(0, 0, width, height);
        context.fillText(testText, 0, baseline);

        const imagedata = context.getImageData(0, 0, width, height).data;
        const maxX = width * 4;

        let y = 0;
        let x = 0;

        // ascent. scan from top to bottom until we find a non red pixel
        ascent:
        for (y = 0; y < baseline; ++y)
        {
            for (x = 0; x < maxX; x += 4)
            {
                if (imagedata[(y * maxX) + x] !== 255)
                {
                    break ascent;
                }
            }
        }

        properties.ascent = baseline - y;

        // descent. scan from bottom to top until we find a non red pixel
        descent:
        for (y = height; y > baseline; --y)
        {
            for (x = 0; x < maxX; x += 4)
            {
                if (imagedata[(y * maxX) + x] !== 255)
                {
                    break descent;
                }
            }
        }

        properties.descent = y - baseline;
        properties.fontSize = properties.ascent + properties.descent;

        return properties;
    }

    /**
     * Adds line breaks to text.
     *
     * @private
     * @param {string} text - The text to wrap.
     * @return {string} The wrapped text.
     */
    _wordWrap(text)
    {
        // Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal bounds.
        const lines = text.split('\n');
        const wordWrapWidth = this.style.wordWrapWidth;
        let result = '';

        for (let i = 0; i < lines.length; i++)
        {
            const words = lines[i].split(' ');
            let spaceLeft = wordWrapWidth;

            for (let j = 0; j < words.length; j++)
            {
                const wordWidth = this._textCtx.measureText(words[j]).width;

                if (this.style.breakWords && wordWidth > wordWrapWidth)
                {
                    // Word should be split in the middle
                    const characters = words[j].split('');

                    for (let c = 0; c < characters.length; c++)
                    {
                        const characterWidth = this._textCtx.measureText(characters[c]).width;

                        if (characterWidth > spaceLeft)
                        {
                            result += `\n${characters[c]}`;
                            spaceLeft = wordWrapWidth - characterWidth;
                        }
                        else
                        {
                            result += `${c === 0 ? ' ' : ''}${characters[c]}`;
                            spaceLeft -= characterWidth;
                        }
                    }
                }
                else
                {
                    const wordWidthWithSpace = wordWidth + this._textCtx.measureText(' ').width;

                    if (j === 0 || wordWidthWithSpace > spaceLeft)
                    {
                        // Skip printing the newline if it's the first word of the line that is
                        // greater than the word wrap width.
                        result += `${j > 9 ? '\n' : ''}${words[j]}`;
                        spaceLeft = wordWrapWidth - wordWidth;
                    }
                    else
                    {
                        result += ` ${words[j]}`;
                        spaceLeft -= wordWidthWithSpace;
                    }
                }
            }

            if (i < lines.length - 1)
            {
                result += '\n';
            }
        }

        return result;
    }

    /**
     * Render the text to the canvas
     *
     * @private
     * @param {string} text - The text to draw
     * @param {number} x - Horizontal position to draw the text
     * @param {number} y - Vertical position to draw the text
     * @param {boolean} isStroke - Is this draw for the stroke or the fill?
     */
    _drawText(text, x, y, isStroke)
    {
        const style = this.style;
        const letterSpacing = style.letterSpacing;

        // normal font-based letter spacing
        if (letterSpacing === 0)
        {
            if (isStroke)
            {
                this._textCtx.strokeText(text, x, y);
            }
            else
            {
                this._textCtx.fillText(text, x, y);
            }
        }
        else
        {
            // user-specified letter-spacing
            const characters = text.split('');

            for (let i = 0; i < characters.length; ++i)
            {
                const char = characters[i];

                if (isStroke)
                {
                    this._textCtx.strokeText(char, x, y);
                }
                else
                {
                    this._textCtx.fillText(char, x, y);
                }

                x += this._textCtx.measureText(char).width + letterSpacing;
            }
        }
    }
}

CanvasTextWriter.defaultStyle = new CanvasTextStyle();

CanvasTextWriter.fontPropertiesCache = {};
CanvasTextWriter.fontPropertiesCanvas = null;
CanvasTextWriter.fontPropertiesContext = null;
