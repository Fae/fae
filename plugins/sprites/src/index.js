/* eslint global-require: 0 */
/** @namespace sprites */

export { default as Sprite } from './Sprite';
export { default as SpriteRenderer } from './SpriteRenderer';
export { default as SpriteComponent } from './SpriteComponent';
export { default as SpriteRenderSystem } from './SpriteRenderSystem';

export const shaders = {
    texture: {
        vert: require('./shader/multi-texture.vert'),
        frag: require('./shader/multi-texture.frag'),
    },
};
