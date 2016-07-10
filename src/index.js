// export some core modules
import * as glut from './gl';
import * as math from './math';
import * as render from './render';
import * as shaders from './shaders';
import * as util from './util';

import * as config from './config';

export { glut, math, render, shaders, util, config };

// @ifdef DEBUG
import * as debug from './debug';
export { debug };
// @endif
