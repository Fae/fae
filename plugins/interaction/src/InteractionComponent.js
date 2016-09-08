import Signal from 'mini-signals';
import { BoundsComponent } from '@fae/shapes';

export default function InteractionComponent(Base)
{
    /**
     * @class InteractionComponent
     * @mixes BoundsComponent
     * @memberof interaction
     */
    return class extends BoundsComponent(Base)
    {
        /**
         *
         */
        constructor()
        {
            super(...arguments); // eslint-disable-line prefer-rest-params

            /**
             * Dispatched when a pointer starts an interaction (mousedown, pointerdown, touchstart).
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onDown = new Signal();

            /**
             * Dispatched when a pointer ends an interaction (mouseup, pointerup, touchend).
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onUp = new Signal();

            /**
             * Dispatched when a pointer ends an interaction (mouseup, pointerup, touchend)
             * but is outside of the current target.
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onUpOutside = new Signal();

            /**
             * Dispatched when a pointer moves (mousemove, pointermove, touchmove).
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onMove = new Signal();

            /**
             * Dispatched when a pointer cancels interaction (mouseout, pointerout, touchcancel).
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onCancel = new Signal();

            /**
             * Dispatched when a pointer has a scroll interaction (wheel).
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onScroll = new Signal();

            /**
             * Dispatched when a click occurs on an object.
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onClick = new Signal();

            /**
             * Dispatched when a hover begins on an object.
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onHoverStart = new Signal();

            /**
             * Dispatched when a hover begins on an object.
             *
             * The callback looks like {@link InteractionComponent.OnInteractionCallback}
             *
             * @member {Signal}
             */
            this.onHoverEnd = new Signal();

            /**
             * When an interaction occurs the interaction object is passed to the callback.
             *
             * @memberof InteractionComponent
             * @callback OnInteractionCallback
             * @param {Pointer} pointer - The pointer the interaction happened on.
             * @param {InteractableObject} target - The target of the interaction.
             */
        }
        /**
         * Called to test if this object contains the passed in point.
         *
         * @param {number} x - The x coord to check.
         * @param {number} y - The y coord to check.
         * @return {SceneObject} The SceneObject that was hit, or null if nothing was.
         */
        hitTest(x, y)
        {
            if (this.getBounds().contains(x, y))
            {
                return this;
            }

            return null;
        }
    };
}
