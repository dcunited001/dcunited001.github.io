var container = document.getElementById('main-canvas-container');
var paused = false, stepThrough = false;
var gpuCompute, renderer, scene, cam, origCamZ = 1800;
var quad, quadSize = 512, quadGeo, quadMaterial;

var mouseX, mouseY;

var randomStepSeed = Math.random();
var texPos, texVel, texSeed;
var varPos, varVel;
var gameVariable, gameColorVariable;

var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;
var uiColorUniforms = new Array(16), gameColorUniforms = new Array(16);
var startTime = new Date().getTime(), currentTime = startTime, elapsedTime = startTime - currentTime;

var numParticles = 1024, particleWidth = 5;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2;

function init() {
  cam = new THREE.PerspectiveCamera(20, window.innerWidth / (window.innerHeight / 2), 1, 10000);
  cam.position.z = origCamZ;

  scene = new THREE.Scene();
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xFFFFFF);
  renderer.setPixelRatio(window.devicePixelRatio);

  //TODO: change to canvas size?
  renderer.setSize(window.innerWidth, window.innerHeight / 2);
}

function createCompute() {
  var shaderPosition = document.getElementById('shaderPosition').textContent;
  var shaderVelocity = document.getElementById('shaderVelocity').textContent; // random components

  gpuCompute = new GPUComputationRenderer(quadSize, quadSize, renderer);
  texPos = gpuCompute.createTexture(numParticles, 1);
  texVel = gpuCompute.createTexture(numParticles, 1);

  varVel = gpuCompute.addVariable('posVar', shaderPosition, texPos);
  varPos = gpuCompute.addVariable('posPos', shaderPosition, texPos);

  gpuCompute.setVariableDependencies(varVel, [varVel]);
  gpuCompute.setVariableDependencies(varPos, [varVel, varPos]);

  var error = gpuCompute.init();
  if (error !== null) {
    console.error(error);
  }
}

function createQuad() {
  quadGeo = new THREE.PlaneBufferGeometry(2,2);
  quadMaterial = new THREE.MeshBasicMaterial({
    //map: tex
  });

  quad = new THREE.Mesh(quadGeo, quadMaterial);
}

function createParticles() {
  // generate random particle velocities
  var dataVel = texVel.image.data;
  for (i=0; i < dataVel.length; i+= 4) {
    dataVel[i] = Math.random();
    dataVel[i+1] = Math.random();
    dataVel[i+2] = Math.random();
    dataVel[i+3] = 1.0;
  }

  // generate random particle positions
  var dataPos = texPos.image.data;
  for (i=0; i < dataPos.length; i+= 4) {
    dataPos[i] = Math.random() * quadSize;
    dataPos[i+1] = Math.random() * quadSize;
    dataPos[i+2] = Math.random();
    dataPos[i+3] = 1.0;
  }
}

function configureCanvas () {
  var canvas = document.getElementById('main-canvas');
  container.replaceChild(renderer.domElement, canvas);
  document.addEventListener('click', doStepThrough, false);
  document.addEventListener('mousemove', onDocMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  cam.aspect = window.innerWidth / (window.innerHeight / 2);
  cam.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, (window.innerHeight / 2));
}

function onClickRestart() {

}

function onDocMouseMove() {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
}

function togglePause() {
  paused = !paused;
  document.getElementById('btn-pause').textContent = (paused ? "Play" : "Pause");
}

function doStepThrough() {
  stepThrough = true;
}

function animate() {
  requestAnimationFrame(animate);
  update();
  render();
}

function update() {
  currentTime = new Date().getTime();
  elapsedTime = currentTime - startTime;
}

function render() {
  cam.position.x += (mouseX - cam.position.x);
  cam.position.y += (mouseY - cam.position.y);
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);

  if (!paused || stepThrough) {
    // set uniforms

    varPos.material.uniforms.deltaT = elapsedTime / 1000.0;
    quadMaterial.map = gpuCompute.getCurrentRenderTarget(varPos).texture;
    gpuCompute.compute();
    quadMaterial.needsUpdate = true;

    if (stepThrough) { stepThrough = false; }
  }

  renderer.render(scene, cam);
}

init();
createRenderer();
createCompute();
createQuad();
configureCanvas();
animate();

