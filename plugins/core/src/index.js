// export some core modules
import * as ecs from './ecs';
import * as glutil from './gl';
import * as math from './math';
import * as render from './render';
import * as util from './util';

export { ecs, glutil, math, render, util };

// @ifdef DEBUG
import * as debug from './debug';
export { debug };
// @endif
