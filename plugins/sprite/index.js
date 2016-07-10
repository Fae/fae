/* eslint global-require: 0 */
import * as config from './config';

export { config };

export { default as Sprite } from './Sprite';
export { default as SpriteRenderer } from './SpriteRenderer';

export const shaders = {
    texture: {
        vert: require('./shader/texture.vert'),
        frag: require('./shader/texture.frag'),
    },
};
