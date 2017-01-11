// TODO: use perlin noise as seed?
// - with randomStartSeed, everything should transition towards more random
var container;
var cam, origCamZ;
var scene, renderer, paused = false, stepThrough = false, displayStats = true;

// stats:
// - visual distribution: need algorithm to sum a count over a discretized space
//   - assuming that there is enough "space" in the target texture,
//     a simpler algorithm than a parallel prefix sum can be designed, but
//     some error must be tolerated

// - tensor average distribution of values in neighborhood:
//   - for each pixel, calculate an nxn average of the surrounding pixels
//   - this can be done in series in each thread, so it doesn't present as many
//     performance constraints

var quadStats, geoStats, varStats, matStats, texStats, optStatsDisplayVars = 0;
var quadDistro, geoDistro, varDistro, texDistro, matDistro;

var cube, cubeSize, cubeGeo, cubeTexture, cubeMaterial;
var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;

var texRng, gpuCompute, randomVariable;
var startTime = new Date().getTime(),
  currentTime = startTime,
  elapsedTime = startTime - currentTime;

cubeSize = 500;
var WIDTH = 64, HEIGHT = 64;
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
  cube.position.set(0,0,1);
  scn.add(cube);
}

function createStatsQuad(scn) {
  geoStats = new THREE.PlaneBufferGeometry(cubeSize, cubeSize, 4,4);

  matStats = new THREE.MeshBasicMaterial({
    map: texStats
  });

  quadStats = new THREE.Mesh(geoStats, matStats);
  quadStats.position.set(cubeSize * 1.25,0,1);
  scn.add(quadStats);
}

function createDistroQuad(scn) {
  geoDistro = new THREE.PlaneBufferGeometry(cubeSize, cubeSize, 4, 4);

  matDistro = new THREE.MeshBasicMaterial({
    map: texDistro
  });

  quadDistro = new THREE.Mesh(geoDistro, matDistro);
  quadDistro.position.set(0,0,1);
  scn.add(quadDistro);
}

// TODO: update to allow for an array of callbacks, one for each variable
function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);
  texRng = gpuCompute.createTexture();
  texStats = gpuCompute.createTexture();

  fillTextureWithRandoms(texRng);
  fillStatsTexture(texStats);

  var shaderRandoms = document.getElementById('computeShaderRandoms').textContent;
  var shaderStats = document.getElementById('shaderStats').textContent;

  randomVariable = gpuCompute.addVariable("varRandom", shaderRandoms, texRng);
  randomVariable.material.uniforms.randomStepSeed = { value: Math.random() };
  gpuCompute.setVariableDependencies(randomVariable, [randomVariable]);

  var entropyNeighborhoodSize = 5;
  varStats = gpuCompute.addVariable("varStats", shaderStats, texRng);
  varStats.material.uniforms.showVariables = { value: 0 };
  varStats.material.uniforms.neighborhoodSize = { value: 10 };
  varStats.material.defines.ballSize = "int(" + entropyNeighborhoodSize + ")";
  varStats.material.defines.ballArea = "int(" + Math.pow(entropyNeighborhoodSize, 2) + ")";
  gpuCompute.setVariableDependencies(varStats, [randomVariable, varStats]);

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error(error);
  }
}

function fillStatsTexture(tex) {
  var texData = tex.image.data;

  for (var i=0; i < texData.length; i += 4) {
    texData[i] = 0;
    texData[i+1] = 0;
    texData[i+2] = 0;
    texData[i+3] = 1;
  }
}

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

function onChangeDisplayVars() {
  // set value to a product of primes from checkbox values

  // bitmask (additive) is a group parallel to n-coprimes (multiplicative)
  // - something i explored as a kid, encoding values with a kind of prime-binary
  // - i explored this because i didn't understand how Assembler could process/encode
  //   values *and* instructions in total binary. this was before i had ever
  //   programmed.
  var primes = [2,3,5];
  var checkboxes = [];
  var values = [];
  var val = 1;
  for (var i=0; i < 3; i++) {
    var checkbox = document.getElementById('chk-random-variable-x');
    checkboxes.push(checkbox);
    console.log(checkbox);
    values.push(checkbox.value);
    val *= primes[i];
  }

  optStatsDisplayVars = val;
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
    // prepare to generate randoms
    randomVariable.material.uniforms.randomStepSeed.value = Math.random();
    cubeMaterial.map = gpuCompute.getCurrentRenderTarget(randomVariable).texture;

    // prepare to generate stats
    varStats.material.uniforms.showVariables.value = optStatsDisplayVars;
    matStats.map = gpuCompute.getCurrentRenderTarget(varStats).texture;
    gpuCompute.compute();
    cubeMaterial.needsUpdate = true;

    if (stepThrough) { stepThrough = false }
  }

  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute(scene);
createCube(scene);
//createDistroQuad(scene);
createStatsQuad(scene);
configureCanvas();
animate();
