const vsPass = require('../glsl/vspass.glsl')

// NOTE: can't use shadergraph bc it's parser is WebGL1 only
// - there are breaking differences in how it handle's varyings/attributes
// - there's no support for VAO objects
// - there's no simple way to get it to work without constant parse issues

const commonSnippets = {
  vsPass: vsPass
};

export { commonSnippets as Common };
