// TODO: create actual object for variables?
// - otherwise it will be messy to customize with various properties
// - transitions between can be handled with functions passed in


function GPUComputeVar(variableName, computeFragmentShader, sizeX, sizeY, initialValueTexture, options) {
  // set size, value type (int/float), etc
  // attach callbacks with constructor?

}

function GPUCompute(sizeX, sizeY, renderer) {
  this.sizeX = sizeX;
  this.sizeY = sizeY;
  this.variables = [];
  this.currentTextureIndex = 0;

  var scene = new THREE.Scene();
  var camera = new THREE.Camera();
  camera.position.z = 1.0;

  var passThruUniforms = { texture: { value: null } };
  //var passThruShader =

  this.addVariable = function(variableName, computeFragmentShader, initialValueTexture, sizeX, sizeY) {

  };

  this.setVariableDependencies = function(variable, deps) {
    variable.dependencies = deps;
  };

  function checkFloatSupport(renderer) {
    if (!renderer.extensions.get("OES_texture_float")) {
      return "No OES_texture_float support for float textures.";
    }
  }

  function checkVertexShaderTextures(renderer) {
    if (!renderer.capabilities.maxVertexTextures == 0) {
      return "No support for vertex shader textures.";
    }
  }

  this.init = function() {
    checkFloatSupport(renderer);
    checkVertexShaderTextures(renderer);

    // for each variable
    // - init render targets
    // - run an initail renderTexture()

    // if there are variable deps
    // - for each dep:
    // - ensure variable exists.......
    // - init variable uniforms object
    // - add header code to shader for uniforms

  };

  this.compute() = function {

  };

  this.getCurrentRenderTarget = function(v) {
    return v.renderTargets[this.currentTextureIndex];
  };

  this.getAlternateRenderTarget = function(v) {
    return v.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
  };

  function addResolutionDefine(materialShader) {
    // TODO: update to retrieve the size from the variable
    materialShader.defines.resolution = 'vec2(' + sizeX.toFixed(1) + ',' + sizeY.toFixed(1) + ')';
  }

  function createShaderMaterial(fragShader, uniforms) {

  }

  this.createTexture = function (sizeXTexture, sizeYTexture) {

  };

  this.renderTexture = function(input, output) {

  };

  this.doRenderTarget = function(material, output) {

  }

  function getPassThroughVertexShader() {
    return "foo";
  }

  function getPassThroughFragmentShader() {
    return "bar";
  }

}
