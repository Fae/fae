/* eslint global-require: 0 */
export { default as Sprite } from './Sprite';
export { default as SpriteRenderer } from './SpriteRenderer';

export const shaders = {
    texture: {
        vert: require('./shader/multi-texture.vert'),
        frag: require('./shader/multi-texture.frag'),
    },
};
