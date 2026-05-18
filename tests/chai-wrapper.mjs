import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('chai');

export const assert = pkg.assert;
export const expect = pkg.expect;
export const should = pkg.should;
export const config = pkg.config;
export const util = pkg.util;
export default pkg;
