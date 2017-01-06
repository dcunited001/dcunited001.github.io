var container;
var cam, origCamZ;
var scene, renderer;
var cube, cubeSize, cubeGeo, cubeTexture, cubeMaterial;
var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;
var texGame, gpuCompute, gameVariable, gameUniforms, uiColorUniforms = new Array(16), gameColorUniforms = new Array(16);
var startTime = new Date().getTime(), currentTime = startTime, elapsedTime = startTime - currentTime;

var WIDTH = 64, HEIGHT = 64;
var gameSize = new THREE.Vector2(WIDTH, HEIGHT);
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// TODO: uniforms for color palette
// TODO: uniforms for rules
// TODO: colors for "age"
// TODO: rules for age?

// For a space that is 'populated':
// - Each cell with one or no neighbors dies, as if by solitude.
// - Each cell with four or more neighbors dies, as if by overpopulation.
// - Each cell with two or three neighbors survives.
//
// For a space that is 'empty' or 'unpopulated':
// - Each cell with three neighbors becomes populated.

/*
 * initialze color uniform data structure from values on inputs
 */
function initColorUniforms() {
  for (var i=0; i<16; i++) {
    uiColorUniforms[i] = document.getElementById('conway-color-' + (i+1)).value
  }
  gameColorUniforms = transformColorUniforms(uiColorUniforms);
}

initColorUniforms();
console.log(gameColorUniforms);

/*
 * called when color inputs change
 */
function changeColorUniforms(id, newColor) {
  uiColorUniforms[id] = '#' + newColor;
}

/*
 * transform color uniforms to floats for the shader
 */
function transformColorUniforms(rgbColors) {
  var colorMat = new Array();

  for (var i=0; i<16; i++) {
    var newColor = new THREE.Color(rgbColors[i]);
    colorMat.push(new THREE.Vector4(newColor.r, newColor.g, newColor.b));
  }

  return colorMat;
}

function init() {
  container = document.getElementById('main-canvas-container');
  origCamZ = 1800;

  cam = new THREE.PerspectiveCamera(20, window.innerWidth / (window.innerHeight/2), 1, 10000);
  cam.position.z = origCamZ;

  scene = new THREE.Scene();
}

function createCube() {
  var cubeSize = 500;
  cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 10, 10, 10);

  //cubeMaterial = new THREE.MeshBasicMaterial({
  //  map: texGame,
  //  overdraw: true,
  //  transparent: true
  //});

  cubeMaterial = new THREE.ShaderMaterial({
    defines: {
      resolution: 'vec2(' + gameSize.x.toFixed(1) + ', ' + gameSize.y.toFixed(1) + ')'
    },
    uniforms: {
      texture: { value: texGame },
      colorMap: { value: gameColorUniforms }
    },
    overdraw: true,
    //minFilter:
    //vertexShader: document.getElementById('vertCube').textContent,
    fragmentShader: document.getElementById('fragCube').textContent
  });

  cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(0,0,1);
  scene.add(cube);
}

function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);

  texGame = gpuCompute.createTexture();
  texGame.wrapS = THREE.RepeatWrapping;
  texGame.wrapT = THREE.RepeatWrapping;

  fillTextureWithRandomState(texGame);
  gameVariable = gpuCompute.addVariable("texConway", document.getElementById('shaderConway1').textContent, texGame);
  gpuCompute.setVariableDependencies(gameVariable, [gameVariable]);
  gameUniforms = gameVariable.material.uniforms;

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }
}

/*
 * seeds texture with initial random data
 */
function fillTextureWithRandomState(texGame) {
  var texData = texGame.image.data;

  for (var i=0; i < texData.length; i += 4) {
    texData[i] = Math.floor(Math.floor(Math.random() * 5) / 4) * 1.0; // 20% chance for 1.0
    texData[i + 1] = 0;
    texData[i + 2] = 0;
    texData[i + 3] = 1;
  }

  console.log(texData);
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

  //cube.quaternion.setFromAxisAngle(cubeRotationAxis, cubeRotationRate * (elapsedTime / 1000.0));
}

function render() {
  cam.position.x += (mouseX - cam.position.x);
  cam.position.y += (mouseY - cam.position.y);
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);

  gameColorUniforms = transformColorUniforms(uiColorUniforms);
  cubeMaterial.uniforms.colorMap.value = gameColorUniforms;
  cubeMaterial.uniforms.texture.value = gpuCompute.getCurrentRenderTarget(gameVariable).texture;
  //cubeMaterial.map = gpuCompute.getCurrentRenderTarget(gameVariable).texture;
  gpuCompute.compute();
  cubeMaterial.needsUpdate = true;

  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute();
createCube();
configureCanvas();
animate();
