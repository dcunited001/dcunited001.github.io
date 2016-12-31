var container;
var cam, origCamZ;
var scene, renderer;
var mesh, cube, cubeMaterial, cubeGroup;
var texRng, gpuCompute, randomVariable, randomUniforms;

var WIDTH = 256, HEIGHT = 256;
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
  var size = 100;
  cube = new THREE.BoxGeometry(size, size, size, 10, 10, 10);
  cubeMaterial = new THREE.ShaderMaterial(texRng);
  //cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors, shininess: 0 });
  //var cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true });

  cubeGroup = THREE.SceneUtils.createMultiMaterialObject(cube, [cubeMaterial]);
  //cubeGroup = THREE.SceneUtils.createMultiMaterialObject(cube, [cubeMaterial, cubeMaterial2]);
  cubeGroup.position.set(0,0,1);
  scene.add(cubeGroup);

  console.log(texRng);
  console.log(cubeMaterial);
  console.log("txtRng.needsUpdate", texRng.needsUpdate);
}

function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);
  texRng = gpuCompute.createTexture();

  fillTextureWithRandoms(texRng);
  randomVariable = gpuCompute.addVariable("textureRandom", document.getElementById('computeShaderRandoms').textContent, texRng);
  gpuCompute.setVariableDependencies(randomVariable, [randomVariable]);
  randomUniforms = randomVariable.material.uniforms;

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
    texData[i+3] = Math.random();
    //texData[i] = i / 4;
    //texData[i+1] = i / 4;
    //texData[i+2] = i / 4;
    //texData[i+3] = 127;
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
  render();
}

function distanceToCenter() {
  return Math.sqrt(Math.pow(mouseX,2) + Math.pow(mouseY,2));
}

function render() {
  cam.position.x += (mouseX - cam.position.x) * 0.25;
  cam.position.y += (mouseX - cam.position.y) * 0.25;
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);
  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute();

gpuCompute.compute();
createCube();
configureCanvas();
animate();
