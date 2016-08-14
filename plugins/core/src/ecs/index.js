import ECS from '@fae/ecs';
const System = ECS.System;
const Entity = ECS.Entity;

export { ECS, System, Entity };

export { default as SelfRenderComponent } from './SelfRenderComponent';
export { default as SelfRenderSystem } from './SelfRenderSystem';
export { default as VisibilityComponent } from './VisibilityComponent';

