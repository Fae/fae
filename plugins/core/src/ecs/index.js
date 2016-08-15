import ECS from '@fae/ecs';
const Entity = ECS.Entity;

export { ECS, Entity };

export { default as SelfRenderComponent } from './SelfRenderComponent';
export { default as SelfRenderSystem } from './SelfRenderSystem';
export { default as VisibilityComponent } from './VisibilityComponent';
export { default as System } from './System';
export { default as RenderSystem } from './RenderSystem';

