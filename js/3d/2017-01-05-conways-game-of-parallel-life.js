var container;
var cam, origCamZ;
var gpuCompute, scene, renderer, paused = false, stepThrough = false;
var cube, cubeSize, cubeGeo, cubeTexture;
var cubeRotationAxis = new THREE.Vector3(0.3,0.4,0.5), cubeRotationRate = Math.PI / 5;
var texGame, texGameColor;
var gameVariable, gameColorVariable;

var uiColorUniforms = new Array(16), gameColorUniforms = new Array(16);
var startTime = new Date().getTime(), currentTime = startTime, elapsedTime = startTime - currentTime;

var WIDTH = 128, HEIGHT = 128;
var gameSize = new THREE.Vector2(WIDTH, HEIGHT);
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

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
  cubeSize = 500;
  cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize, 10, 10, 10);

  cubeMaterial = new THREE.MeshBasicMaterial({
    map: texGameColor
  });

  cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(0,0,1);
  scene.add(cube);
}

function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);

  texGame = gpuCompute.createTexture();
  fillTextureWithRandomState(texGame);

  texGameColor = gpuCompute.createTexture();

  var shaderConway = document.getElementById('shaderConway1').textContent;
  var shaderConwayColor = document.getElementById('shaderConwayColor').textContent;

  gameVariable = gpuCompute.addVariable("game", shaderConway, texGame);
  gameColorVariable = gpuCompute.addVariable("gameColor", shaderConwayColor, texGameColor);

  gpuCompute.setVariableDependencies(gameVariable, [gameVariable]);
  gpuCompute.setVariableDependencies(gameColorVariable, [gameVariable, gameColorVariable]);

  gameColorVariable.material.uniforms.colorMap = { value: gameColorUniforms };

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }
}

/*
 * seeds texture with initial random data
 */
function fillTextureWithRandomState(tex) {
  var data = tex.image.data;
  for (var i=0; i < data.length; i += 4) {
    data[i] = Math.floor(Math.floor(Math.random() * 5) / 4) * 1.0; // 20% chance for 1.0
    data[i+1] = 0;
    data[i+2] = 0;
    data[i+3] = 1;
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
  container.addEventListener('click', gameStepThrough, false);
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

function onClickRestart() {
  fillTextureWithRandomState(texGame);

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }
}

function togglePause() {
  paused = !paused;
  document.getElementById('btn-pause').textContent = (paused ? "Play" : "Pause");
}

function gameStepThrough() {
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
}

function render() {
  cam.position.x += (mouseX - cam.position.x);
  cam.position.y += (mouseY - cam.position.y);
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);

  if (!paused || stepThrough) {
    gameColorUniforms = transformColorUniforms(uiColorUniforms);
    gameColorVariable.material.uniforms.colorMap.value = gameColorUniforms;
    cubeMaterial.map = gpuCompute.getCurrentRenderTarget(gameColorVariable).texture;
    gpuCompute.compute();
    cubeMaterial.needsUpdate = true;

    if (stepThrough) { stepThrough = false; }
  }

  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute();
createCube();
configureCanvas();
animate();

function onClickColorProfile(profileName) {
  applyColorProfile(profileName);
}

function applyColorProfile(profileName) {
  // TODO: set up random profiles
  // TODO: set up 'wink' profile to swap between random profiles

  var colorProfile = colorProfiles[profileName];
  for (var i=0; i<16; i++) {
    var color = colorProfile[i] || colorProfile[0] || "#FFFFFF";
    document.getElementById('conway-color-' + (i+1)).jscolor.fromString(color);
    uiColorUniforms[i] = color;
  }
}

var colorProfiles = {
  'game': ['#000000', '#44891A', '#A3CE27', '#2F484E', '#005784', '#31A2F2', '#B2DCEF', '#E06F8B', '#BE2633', '#EB8931', '#F7E26B', '#A46422', '#493C2B', '#1B2632', '#9D9D9D', '#FFFFFF'],
  'dos': ["#000000", "#800000", "#008000", "#808000", "#000080", "#800080", "#008080", "#C0C0C0", "#808080", "#FF0000", "#00FF00", "#FFFF00", "#0000FF", "#FF00FF", "#00FFFF", "#FFFFFF"],
  'apple': ["#FFFFFF", "#FBF305", "#FF6403", "#DD0907", "#F20884", "#4700A5", "#0000D3", "#02ABEA", "#1FB714", "#562C05", "#006412", "#90713A", "#C0C0C0", "#808080", "#404040", "#000000"],
  'zenburn': [],
  'sanity-inc': [],
  'monokai': [],
  'moe': [],
  'solarized': [],
  'cyberpunk': [
    "#000000", // cyberpunk-bg,
    "#FB1493", // cyberpunk-pink
    "#DCA3A3", // cyberpunk-red+1
    "#8B0000", // cyberpunk-red-2,
    "#9C6363", // cyberpunk-red-3
    "#00FF00", // cyberpunk-green,
    "#FFA500", // cyberpunk-orange,
    "#7B68EE", // cyberpunk-blue-1,
    "#6A5ACD", // cyberpunk-blue-2,
    "#ADD8E6", // cyberpunk-blue-3,
    "#DC8CC3", // cyberpunk-magenta,
    "#94BFF3", // cyberpunk-cyan,
    "#DCDCCC"],// cyberpunk-fg,
  'sublime-text': [],
  'vibrant-ink': []
};

// (custom-theme-set-variables)
// https://github.com/bbatsov/zenburn-emacs/blob/master/zenburn-theme.el
// [,zenburn-bg ,zenburn-red ,zenburn-green ,zenburn-yellow,zenburn-blue ,zenburn-magenta ,zenburn-cyan ,zenburn-fg]

// from https://bitstorm.org/gameoflife/

var glider = [
  [0,1,0],
  [0,0,1],
  [1,1,1]
];

var smallExploder = [
  [0,1,0],
  [1,1,1],
  [1,0,1],
  [0,1,0]
];

var exploder = [
  [1,0,1,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,0,0,1],
  [1,0,1,0,1]
];

var tenCellRow = [
  [1,1,1,1,1,1,1,1,1,1]
];

var lightweightSpaceship = [
  [0,1,1,1,1],
  [1,0,0,0,1],
  [0,0,0,0,1],
  [1,0,0,1,0]
];

var tumbler = [
  [0,1,1,0,1,1,0],
  [0,1,1,0,1,1,0],
  [0,0,1,0,1,0,0]
];

// 38x14
var gosperGliderGun = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0],
  [1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0]
];

var startingSets = {
  'glider': glider,
  'small-exxploder': smallExploder,
  'exploder': exploder,
  'ten-cell-row': tenCellRow,
  'lightweightSpaceship': lightweightSpaceship,
  'tumbler': tumbler,
  'gosper-glider-gun': gosperGliderGun
};

function initializeWithStartingSet(setName) {
  var startingSet = startingSets[setName];


}

function initializeStartingSetTextures() {
  // initialize starting sets while animation is being initially rendered
  // - so the user doesn't notice the delay
  // - so they're ready by the time the user is able to click the button
}
