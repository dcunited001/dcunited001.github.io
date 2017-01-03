// TODO: use perlin noise as seed?

var container;
var cam, origCamZ;
var scene, renderer, texLoader;
var mesh, cube, cubeGeo, cubeTexture, cubeMaterial;
var texRng, gpuCompute, computeTexture, computeMaterial, randomVariable, randomUniforms;

var texPoolRandom = [];

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

  texLoader = new THREE.TextureLoader();
}

function createCube() {
  var size = 500;
  cubeGeo = new THREE.BoxBufferGeometry(size, size, size, 10, 10, 10);

  cubeMaterial = new THREE.MeshBasicMaterial({
    map: texRng,
    overdraw: true
  });

  console.log(texRng);

  //cubeMaterial = new THREE.ShaderMaterial({
  //  uniforms: {
  //    //texture: { value: cubeTexture }
  //    texture: { value: texRng }
  //  },
  //  vertexShader: document.getElementById('vertCube').textContent,
  //  fragmentShader: document.getElementById('fragCube').textContent
  //});

  console.log(cubeMaterial);

  cube = new THREE.Mesh(cubeGeo, cubeMaterial);
  cube.position.set(0,0,1);
  scene.add(cube);

  console.log(cubeTexture);

  //cubeGroup = THREE.SceneUtils.createMultiMaterialObject(cube, [computeMaterial]);
  //cubeGroup = THREE.SceneUtils.createMultiMaterialObject(cube, [computeMaterial, computeMaterial2]);
  //cubeGroup.position.set(0,0,1);
  //scene.add(cubeGroup);
}

function createGPUCompute() {
  gpuCompute = new GPUComputationRenderer(WIDTH, HEIGHT, renderer);

  texRng = gpuCompute.createTexture();
  texRng.wrapS = THREE.RepeatWrapping;
  texRng.wrapT = THREE.RepeatWrapping;

  console.log(texRng);

  fillTextureWithRandoms(texRng);
  randomVariable = gpuCompute.addVariable("texRandom", document.getElementById('computeShaderRandoms').textContent, texRng);
  gpuCompute.setVariableDependencies(randomVariable, [randomVariable]);
  randomUniforms = randomVariable.material.uniforms;

  var error = gpuCompute.init();
  if ( error !== null ) {
    console.error( error );
  }

  //var alternateTexture = gpuCompute.getAlternateRenderTarget(randomVariable).texture;
  //alternateTexture.wrapS = THREE.RepeatWrapping;
  //alternateTexture.wrapT = THREE.RepeatWrapping;
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
    texData[i+3] = Math.abs(Math.random() - 0.5);
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
  cam.position.x += (mouseX - cam.position.x);
  cam.position.y += (mouseY - cam.position.y);
  var dist = distanceToCenter();
  cam.position.z = origCamZ + dist;
  cam.lookAt(scene.position);

  //cubeMaterial.uniforms.texture.value = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
  cubeMaterial.map = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
  gpuCompute.compute();
  cubeMaterial.needsUpdate = true;

  //texRng = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
  //gpuCompute.renderTexture(texRng, randomVariable.renderTargets[0]);
  //cubeMaterial.needsUpdate = true;
  //texRng.image.data = gpuCompute.getCurrentRenderTarget(randomVariable).texture;

  renderer.render(scene, cam);
}

init();
createRenderer();
createGPUCompute();

createCube();
configureCanvas();

console.log("before compute");
console.log(texRng);

gpuCompute.compute();
cubeMaterial.needsUpdate = true;
var tempTexture = gpuCompute.getCurrentRenderTarget(randomVariable).texture;
console.log("before render");
console.log(tempTexture);
//texRng = gpuCompute.getCurrentRenderTarget(randomVariable).texture;

cubeMaterial.needsUpdate = true;
console.log("after render");
//console.log(tempTexture);
console.log(texRng);

//computeMaterial.needsUpdate = true;
animate();
