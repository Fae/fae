import Device from 'ismobilejs';

/**
 * Default batch size for the sprite renderer.
 *
 * @static
 * @constant
 */
export const DEFAULT_SPRITE_BATCH_SIZE = 4096;

/**
 * Default batch size for the sprite renderer.
 *
 * @static
 * @constant
 */
export const MAX_TEXTURE_COUNT = Device.tablet || Device.phone ? 2 : 32;
