---
title: "Gradient Descent and 2D Particle Physics"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---

####  Requires ES6 & WebGL 2.0 &#x2605; Runs Best In Firefox (and Chrome) &#x2605; Does Not Run On Mobile

<div class="row">
  <div class="col-sm-3">
    <label for="particle-count">Particle Count:</label>
    <input id="particle-count" type="range" min="128" max="20480" step="32" value="1024"/>
  </div>
  <div class="col-sm-3">
    <label for="particle-speed">Particle Speed:</label>
    <input id="particle-speed" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="particle-speed">Particle Mass:</label>
    <input id="particle-mass" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="field-size">Field Size:</label>
    <input id="field-size" type="range" min="1.0" max="50.0" step="1.0" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.0125" max="2.0" step="0.0125" value="1.0"/>
  </div>
</div>

### TODO:

- replace particle-speed slider with particle-mass
- add UI options for rendering the field & its gradients in various ways
  - automatically scale values from rForce texture based on particle density and expected range of values
  - the rForce texture values (correctly) are not 0.0 to 1.0. they are the sum of components from particles.
- eventually remove brownian motion component from particle behavior
  - in the social physics simulation, i want to scale between brownian & gradient motion
  - but that will throw off the thermal velocity calculation
  - and brownian motion should emerge in the system anyways.
- option to display texture representing particle paths
  - write lines to another texture. use vertex transformation.
  - each particle has a color and leaves a trail representing it's path
  - when its motion is dependent on the gradient of the field

### Overview

### Challenges

- using mipmap for aggregate calculations
  - refer to paper that demonstrates algorithm for flock behavior
- calculating the thermal velocity from partilce velocities

- resolving discontinuity problem in gradients
  - resulted in discontinuities bc of the field size
  - blurred field image to remove discontinuities before gradients
  - this sacrifices accuracy of result, but improves accuracy of physics calculations
- ... nevermind, the blur won't help very much and will reduce accuracy too much
- the other algorithm results in less discontinuities,
  - especially where it matters for calculating forces: in high-density regions

<pre class="highlight">Fragment Shader: fsUpdateParticles<code id="codeFsUpdateParticles"></code></pre>
<pre class="highlight">Vertex Shader: vsFields<code id="codeVsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsFields<code id="codeFsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsGradients<code id="codeFsGradients"></code></pre>
<pre class="highlight">Fragment Shader: fsRenderFields<code id="codeFsRenderFields"></code></pre>

<script type="x-shader/x-vertex" id="vsPass">
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_texcoord;

out vec2 v_st;
out vec3 v_position;

void main() {
  v_st = a_texcoord;
  v_position = a_position;
  gl_Position = vec4(a_position, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsUpdateParticles">
uniform vec2 u_resolution;
uniform ivec4 u_randomSeed;
uniform float u_particleSpeed;
uniform vec4 u_deltaTime;

uniform isampler2D s_particleRandoms;
uniform sampler2D s_particles;

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;

// TODO: temperature: update another texture with particle velocities
// layout(location = 2) out vec4 particleVelocities

const float maxInt = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // =======================================
  // Update Randoms
  // =======================================

  ivec4 randomTexel = texture(s_particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -2.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), u_resolution.xy) / u_resolution.xy;

  ivec4 texels[4];
  texels[0] = texture(s_particleRandoms, texelCoords[0]);
  texels[1] = texture(s_particleRandoms, texelCoords[1]);
  texels[2] = texture(s_particleRandoms, texelCoords[2]);
  texels[3] = texture(s_particleRandoms, texelCoords[3]);

  ivec4 newRandom = u_randomSeed ^ randomTexel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3];
  random = newRandom;

  // =======================================
  // Calculate Brownian Component
  // =======================================

  vec4 newRandomFloat = fract(vec4(newRandom) / maxInt + 0.5) - 0.5 ;
  vec2 brownian = vec2(
    (u_particleSpeed * newRandomFloat.x * u_deltaTime.x / 1000.0),
    (u_particleSpeed * newRandomFloat.y * u_deltaTime.x / 1000.0));

  // =======================================
  // Calculate Gradient Component
  // =======================================



  // =======================================
  // Update Particles
  // =======================================

  particle = texture(s_particles, uv);
  particle.x = mod(particle.x + brownian.x + 1.0, 2.0) - 1.0;
  particle.y = mod(particle.y + brownian.y + 1.0, 2.0) - 1.0;
}
</script>

<script type="x-shader/x-vertex" id="vsFields">
uniform float u_fieldSize;
uniform float u_rCoefficient;
uniform sampler2D s_particles;

layout(location = 0) in int a_index;

flat out int v_particleId;
out float v_pointSize;
//out vec4 v_position; // not linkable to fsFields ?

const float maxInt = 2147483647.0;

void main()
{
  // textureSize must return ivec & texelFetch must accept ivec
  ivec2 texSize = textureSize(s_particles, 0);

  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  vec4 particle = texelFetch(s_particles, texel, 0);

  v_particleId = a_index;
  v_pointSize = u_fieldSize;

  gl_Position = vec4(particle.x, particle.y, 0.0, 1.0);;
  gl_PointSize = v_pointSize;
}
</script>

<script type="x-shader/x-fragment" id="fsFields">
uniform vec2 u_resolution;
uniform float u_rCoefficient;
uniform sampler2D s_particleAttributes;

//in vec4 v_position; // not linkable to fsFields ?
in float v_pointSize;
flat in int v_particleId;

layout(location = 0) out vec4 repelForce;
layout(location = 1) out vec4 repelComp;

vec2 calculateRForce(vec2 point, vec2 center) {
  vec2 pointOffset = point.xy - center;
  float d = distance(point.xy, center);
  float rad = atan(pointOffset.y, pointOffset.x);
  return vec2(cos(rad), sin(rad)) / d;
}

void main()
{
  //ivec2 texSize = textureSize(s_particleAttributes, 0);
  //ivec2 texel = ivec2(v_particleId % texSize.x, v_particleId / texSize.x);
  //vec4 pAttr = texelFetch(s_particleAttributes, texel, 0);
  //vec4 particleColor = vec4(pAttr.r, pAttr.g, pAttr.b, 1.0);

  vec2 rForce = u_rCoefficient * calculateRForce(gl_PointCoord.xy, vec2(0.5, 0.5));
  repelForce = vec4(rForce.xy, 0.0, 1.0);
  repelComp = vec4(distance(rForce, vec2(0.0,0.0)), 0.0, 0.0, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsGradients">
uniform vec2 u_resolution;
uniform sampler2D s_repelField;
uniform sampler2D s_repelComp;

// R: (df1/dx)
// G: (df1/dy)
// B: (df2/dx)
// A: (df2/dy)
layout(location = 0) out vec4 repelFieldGradient;

// R: (ds/dx)
// G: (ds/dy)
layout(location = 1) out vec4 repelCompGradient;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 delta = vec2(1.0, 1.0);
  vec2 uv2 = mod(gl_FragCoord.xy + delta, u_resolution.xy) / u_resolution.xy;

  vec4 df = texture(s_repelField, uv2) - texture(s_repelField, uv);
  vec4 ds = texture(s_repelComp, uv2) - texture(s_repelComp, uv);

  // gradient of a vector field
  repelFieldGradient = vec4(
    df.x / delta.x,
    df.x / delta.y,
    df.y / delta.x,
    df.y / delta.y);

  // gradient of a scalar field
  repelCompGradient = vec4(
    ds.x / delta.x,
    ds.x / delta.y,
    0.0,
    0.0);
}
</script>

<script type="x-shader/x-fragment" id="fsRenderFields">
uniform vec2 u_resolution;
uniform float u_rCoefficient;

uniform sampler2D s_repelField;
uniform sampler2D s_repelComp;

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec4 rForce = texture(s_repelField, uv);
  vec4 rComp = texture(s_repelComp, uv);

  //color = vec4(
  //  distance(vec2(0.0,0.0), rForce.xy),
  //  0.0,
  //  rComp.x,
  //  1.0);

  color = vec4(
    rForce.x,
    rForce.y,
    rForce.z, //0.0, //rComp.x,
    1.0);
}
</script>

<script type="text/javascript" src="/js/3d/2017-05-17-gradient-descent-and-2d-particle-physics-es6.js"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var codeBlock = document.getElementById(codeBlockId);
    codeBlock.innerHTML = shaderCode;
    hljs.highlightBlock(codeBlock);
  }

  pasteShaderToCodeBlock('fsUpdateParticles', 'codeFsUpdateParticles');
  pasteShaderToCodeBlock('vsFields', 'codeVsFields');
  pasteShaderToCodeBlock('fsFields', 'codeFsFields');
  pasteShaderToCodeBlock('fsGradients', 'codeFsGradients');
  pasteShaderToCodeBlock('fsRenderFields', 'codeFsRenderFields');
</script>
