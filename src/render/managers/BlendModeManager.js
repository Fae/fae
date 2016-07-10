import Manager from './Manager';

/**
 * @class
 */
export default class BlendModeManager extends Manager
{
    /**
     * @param {Renderer} renderer - The renderer this manager works for.
     */
    constructor(renderer)
    {
        super(renderer);

        /**
         * The currently active blend mode.
         *
         * @member {BlendMode}
         */
        this.currentMode = null;
    }

    /**
     * Sets-up the given blendMode from WebGL's point of view.
     *
     * @param {BlendMode} mode - A BlendMode instance to enable.
     * @return {boolean} True if the blend mode changed, false otherwise.
     */
    enableBlendMode(mode)
    {
        const equal = this.currentMode ? this.currentMode.equals(mode) : this.currentMode === mode;

        if (equal) return false;

        this.currentMode = mode;

        if (mode)
        {
            mode.enable(this.renderer.gl);
        }

        return true;
    }
}
