// TODO: use perlin noise as seed?
// - with randomStartSeed, everything should transition towards more random
var container;
var cam, origCamZ;
var scene, renderer, paused = false, stepThrough = false;
var cube, cubeSize, cubeGeo, cubeTexture, cubeMaterial;
var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;
var texRng, gpuCompute, randomVariable;
var startTime = new Date().getTime(), currentTime = startTime, elapsedTime = startTime - currentTime;

cubeSize = 500;
var WIDTH = 64, HEIGHT = 64;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

function init() {
  container = document.getElementById('main-canvas-container');
  origCamZ = 1800;

  cam = new THREE.PerspectiveCamera(20, window.innerWidth / (window.innerHeight/2), 1, 10000);
  cam.position.z = origCamZ;

  scene = new THREE.Scene();
}

function createCube() {
  cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 10, 10, 10);

  cubeMaterial = new THREE.MeshBasicMaterial({
    map: texRng
  });

  cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(0,0,1);
  scene.add(cube);
}

function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);
  texRng = gpuCompute.createTexture();

  fillTextureWithRandoms(texRng);
  randomVariable = gpuCompute.addVariable("texRandom", document.getElementById('computeShaderRandoms').textContent, texRng);
  randomVariable.material.uniforms.randomStepSeed = { value: Math.random() };
  gpuCompute.setVariableDependencies(randomVariable, [randomVariable]);

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }
}

/*
 * seeds texture with initial random data
 */
function fillTextureWithRandoms(texRng) {
  var texData = texRng.image.data;

  for (var i=0; i < texData.length; i += 4) {
    texData[i] = Math.random();
    texData[i+1] = Math.random();
    texData[i+2] = Math.random();
    //texData[i+3] = Math.abs(Math.random() - 0.75);
    texData[i+3] = 1;
  }
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

function randomStepThrough() {
  stepThrough = true;
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

function distanceToCenter() {
  return Math.sqrt(Math.pow(mouseX,2) + Math.pow(mouseY,2));
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
    cubeMaterial.map = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
    gpuCompute.compute();
    cubeMaterial.needsUpdate = true;

    if (stepThrough) { stepThrough = false }
  }

  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute();
createCube();
configureCanvas();
animate();
