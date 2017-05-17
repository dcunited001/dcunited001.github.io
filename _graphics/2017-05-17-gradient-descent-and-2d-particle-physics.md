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
    <label for="field-size">Field Size:</label>
    <input id="field-size" type="range" min="1.0" max="50.0" step="1.0" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
</div>

### TODO:

- fix rForce calculation
  - check rComp calculation (not really necessary for this)
- add UI options for rendering the field & its gradients in various ways
  - automatically scale values from rForce texture based on particle density and expected range of values
  - the rForce texture values (correctly) are not 0.0 to 1.0. they are the sum of components from particles.
- eventually remove brownian motion component from particle behavior
  - in the social physics simulation, i want to scale between brownian & gradient motion
  - but that will throw off the thermal velocity calculation
  - and brownian motion should emerge in the system anyways.

### Overview

### Challenges

- using mipmap for aggregate calculations
  - refer to paper that demonstrates algorithm for flock behavior
- calculating the thermal velocity from partilce velocities

<pre class="highlight">Fragment Shader: fsUpdateParticles<code id="codeFsUpdateParticles"></code></pre>
<pre class="highlight">Vertex Shader: vsFields<code id="codeVsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsFields<code id="codeFsFields"></code></pre>
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
  // Update Particles
  // =======================================

  vec4 newRandomFloat = fract(vec4(newRandom) / maxInt + 0.5) - 0.5 ;
  particle = texture(s_particles, uv);
  particle.x += (u_particleSpeed * newRandomFloat.x * u_deltaTime.x / 1000.0);
  particle.y += (u_particleSpeed * newRandomFloat.y * u_deltaTime.x / 1000.0);

  particle.x = mod(particle.x + 1.0, 2.0) - 1.0;
  particle.y = mod(particle.y + 1.0, 2.0) - 1.0;
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

void main()
{
  //ivec2 texSize = textureSize(s_particleAttributes, 0);
  //ivec2 texel = ivec2(v_particleId % texSize.x, v_particleId / texSize.x);
  //vec4 pAttr = texelFetch(s_particleAttributes, texel, 0);
  //vec4 particleColor = vec4(pAttr.r, pAttr.g, pAttr.b, 1.0);

  vec2 pointOffset = gl_PointCoord.xy - vec2(0.5, 0.5);
  float d = distance(gl_PointCoord.xy, vec2(0.5,0.5));
  float rad = atan(pointOffset.y, pointOffset.x);
  vec2 rForce = u_rCoefficient * vec2(cos(rad), sin(rad)) / d;

  repelForce = vec4(rForce.xy, 0.0, 1.0);
  repelComp = vec4(distance(rForce, vec2(0.0,0.0)), 0.0, 0.0, 1.0);
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
    rComp.x,
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
  pasteShaderToCodeBlock('fsRenderFields', 'codeFsRenderFields');
</script>
