// TODO: use perlin noise as seed?
// - with randomStartSeed, everything should transition towards more random
var container;
var cam, origCamZ;
var scene, renderer, paused = false, stepThrough = false, displayStats = true;

// paused = true;

// stats:
// - visual distribution: need algorithm to sum a count over a discretized space
//   - assuming that there is enough "space" in the target texture,
//     a simpler algorithm than a parallel prefix sum can be designed, but
//     some error must be tolerated

// - tensor average distribution of values in neighborhood:
//   - for each pixel, calculate an nxn average of the surrounding pixels
//   - this can be done in series in each thread, so it doesn't present as many
//     performance constraints

var optStatsDisplayVars = 30;
var quadStats, geoStats, varStats, matStats, texStats;

var entropyDistEventOutcomes = 16.0;
var texEntropyBool, texEntropyDist, texEntropy;
var varEntropyBool, varEntropyDist;
var quadEntropy, geoEntropy, varEntropy, matEntropy;

var matEntropyBool;

var cube, cubeSize, cubeGeo, cubeTexture, cubeMaterial;
var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;

var texRng, gpuCompute, randomVariable;
var startTime = new Date().getTime(),
  currentTime = startTime,
  elapsedTime = startTime - currentTime;

cubeSize = 500;
//var WIDTH = 128, HEIGHT = 128;
var WIDTH = 32, HEIGHT = 32;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

function init() {
  container = document.getElementById('main-canvas-container');
  origCamZ = 1800;

  cam = new THREE.PerspectiveCamera(20, window.innerWidth / (window.innerHeight/2), 1, 10000);
  cam.position.z = origCamZ;

  scene = new THREE.Scene();
}

function createCube(scn) {
  cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 10, 10, 10);

  cubeMaterial = new THREE.MeshBasicMaterial({
    map: texRng
  });

  cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(-0.25 * cubeSize,0,1);
  scn.add(cube);
}

function createStatsQuad(scn) {
  geoStats = new THREE.PlaneBufferGeometry(0.5 * cubeSize, 0.5 * cubeSize, 4, 4);

  matStats = new THREE.MeshBasicMaterial({
    map: texStats
  });

  quadStats = new THREE.Mesh(geoStats, matStats);
  quadStats.position.set(0.75 * cubeSize, 0.25 * cubeSize, 1);
  scn.add(quadStats);
}

function createEntropyQuad(scn) {
  geoEntropy = new THREE.PlaneBufferGeometry(0.5 * cubeSize, 0.5 * cubeSize, 4, 4);

  matEntropy = new THREE.MeshBasicMaterial({
    //map: texEntropy
    map: texEntropyBool
  });

  matEntropyBool = new THREE.MeshBasicMaterial({
    map: texEntropyBool
  });

  quadEntropy = new THREE.Mesh(geoEntropy, matEntropy);
  quadEntropy.position.set(0.75 * cubeSize, -0.25 * cubeSize, 1);
  scn.add(quadEntropy);
}

// TODO: update to allow for an array of callbacks, one for each variable
function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);
  texRng = gpuCompute.createTexture();
  texStats = gpuCompute.createTexture();
  texEntropyBool = gpuCompute.createTexture(WIDTH * entropyDistEventOutcomes, HEIGHT);
  texEntropyDist = gpuCompute.createTexture(WIDTH * entropyDistEventOutcomes, HEIGHT);
  texEntropy = gpuCompute.createTexture();

  fillTextureWithRandoms(texRng);
  //fillStatsTexture(texStats);

  var shaderRandoms = document.getElementById('computeShaderRandoms').textContent;
  var shaderStats = document.getElementById('shaderStats').textContent;
  var shaderEntropyBool = document.getElementById('shaderEntropyBool').textContent;
  var shaderEntropyDist = document.getElementById('shaderEntropyDist').textContent;
  var shaderEntropy = document.getElementById('shaderEntropy').textContent;

  randomVariable = gpuCompute.addVariable("varRandom", shaderRandoms, texRng);
  randomVariable.material.uniforms.randomStepSeed = { value: Math.random() };
  gpuCompute.setVariableDependencies(randomVariable, [randomVariable]);

  // TODO: add another texture to display the random variables on the texture?
  // - this way, i don't need to include the bitmask code in all of the stats shaders
  // - however, i can't just zero out the X, Y or Z values because the texture is
  //   used as input to the next step. at least, it can't be done while retaining
  //   independence between random variables X, Y, and Z

  var statsBallSize = 5;
  varStats = gpuCompute.addVariable("varStats", shaderStats, texRng);
  varStats.material.uniforms.showVariables = { value: 0 };
  varStats.material.uniforms.neighborhoodSize = { value: 10 };
  varStats.material.defines.ballSize = "int(" + statsBallSize + ")";
  varStats.material.defines.ballArea = "int(" + Math.pow(statsBallSize, 2) + ")";
  gpuCompute.setVariableDependencies(varStats, [randomVariable, varStats]);

  varEntropyBool = gpuCompute.addVariable("varEntropyBool", shaderEntropyBool);
  varEntropyBool.material.defines.entropyDistEventOutcomes = "float(" + entropyDistEventOutcomes + ")";
  gpuCompute.setVariableDependencies(varEntropyBool, [randomVariable]);

  varEntropyDist = gpuCompute.addVariable("varEntropyDist", shaderEntropyDist);
  varEntropyDist.material.defines.entropyDistEventOutcomes = "float(" + entropyDistEventOutcomes + ")";
  varEntropyDist.material.defines.ballSize = "int(" + statsBallSize + ")";
  varEntropyDist.material.defines.ballArea = "int(" + Math.pow(statsBallSize, 2) + ")";
  gpuCompute.setVariableDependencies(varEntropyDist, [randomVariable, varEntropyBool]);

  varEntropy = gpuCompute.addVariable("varEntropy", shaderEntropy);
  varEntropy.material.defines.entropyDistEventOutcomes = "float(" + entropyDistEventOutcomes + ")";
  varEntropy.material.uniforms.showVariables = { value: 0 };
  gpuCompute.setVariableDependencies(varEntropy, [randomVariable, varEntropyBool, varEntropyDist]);

  //var entropyBallSize = 5;
  //varEntropy = gpuCompute.addVariable("varEntropy", shaderEntropy)

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error(error);
  }
}

//function fillStatsTexture(tex) {
//  var texData = tex.image.data;
//
//  for (var i=0; i < texData.length; i += 4) {
//    texData[i] = 0;
//    texData[i+1] = 0;
//    texData[i+2] = 0;
//    texData[i+3] = 1;
//  }
//}

/*
 * seeds texture with initial random data
 */
function fillTextureWithRandoms(texRng) {
  var texData = texRng.image.data;

  for (var i=0; i < texData.length; i += 4) {
    texData[i  ] = Math.random();
    texData[i+1] = Math.random();
    texData[i+2] = Math.random();
    //texData[i+3] = Math.abs(Math.random() - 0.75);
    texData[i+3] = 1;

    // this method can take ANY non-unity distribution
    // - and quickly converge to random!!
    //texData[i] = i*4 / texData.length;
    //texData[i+1] = (i*4)+1 / texData.length;
    //texData[i+2] = (i*4)+2 / texData.length;

    // cannot converge to random
    //texData[i] = 0.5;
    //texData[i+1] = 0.5;
    //texData[i+2] = 0.5;
    //texData[i+3] = 1;
  }

  // unless:
  //texData[0] = 0.47;
  //texData[1] = 0.48;
  //texData[2] = 0.49;
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xFFFFFF);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, (window.innerHeight/2));
}

function configureCanvas() {
  var canvas = document.getElementById('main-canvas');
  container.replaceChild(renderer.domElement, canvas);
  container.addEventListener('click', randomStepThrough, false);
  document.addEventListener('mousemove', onDocMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  cam.aspect = window.innerWidth / (window.innerHeight / 2);
  cam.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, (window.innerHeight / 2));
}

function onDocMouseMove() {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
}

function togglePause() {
  paused = !paused;
  document.getElementById('btn-pause').textContent = (paused ? "Play" : "Pause");
}

function toggleStats() {
  displayStats = !displayStats;
  // move the cube a little to the left
}

function changeStatsDisplayVars() {
  // set value to a product of primes from checkbox values
  var primes = [2,3,5], val = 1, max = 1;
  for (var i=0; i < 3; i++) {
    var checkbox = document.getElementById('chk-random-variable-' + (i+1));
    max *= primes[i];
    if (checkbox.checked) { val *= primes[i] }
  }

  optStatsDisplayVars = (val == 1 ? max : val);
}

function randomStepThrough() {
  stepThrough = true;
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

function distanceToCenter() {
  return Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2));
}

function update() {
  currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;

  cube.quaternion.setFromAxisAngle(cubeRotationAxis, cubeRotationRate * (elapsedTime / 1000.0));
}

function render() {
  cam.position.x += (mouseX - cam.position.x);
  cam.position.y += (mouseY - cam.position.y);
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);

  if (!paused || stepThrough) {
    randomVariable.material.uniforms.randomStepSeed.value = Math.random();
    varStats.material.uniforms.showVariables.value = optStatsDisplayVars;
    varEntropy.material.uniforms.showVariables.value = optStatsDisplayVars;

    gpuCompute.compute();

    cubeMaterial.map = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
    matStats.map = gpuCompute.getCurrentRenderTarget(varStats).texture;
    matEntropy.map = gpuCompute.getCurrentRenderTarget(varEntropyBool).texture;


    // (for testing) prepare to update matEntropyBool/Dist material
    matEntropyBool.map = gpuCompute.getCurrentRenderTarget(varEntropyBool).texture;

    cubeMaterial.needsUpdate = true;

    if (stepThrough) { stepThrough = false }
  } else {
    // TODO: when paused, change display textures to alternate render target
    // - to fix the problem where you have to step through twice to get the UI
    //   changes to display
  }

  renderer.render(scene, cam);
}

init();
changeStatsDisplayVars();
createRenderer();
createGPUCompute(scene);
createCube(scene);
createStatsQuad(scene);
createEntropyQuad(scene);
configureCanvas();
animate();

// TODO: learn to measure entropy of "randomly" distributed floating point numbers
// - https://stackoverflow.com/questions/34667932/minimum-floating-point-number-closest-to-zero
//   - look into the disparity b/w 2^(-64) and the minimum distance b/w 2 floats
// -