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
  <div class="col-sm-4">
    <label for="particle-count">Particle Count:</label>
    <input id="particle-count" type="range" min="128" max="10240" step="32" value="1024"/>
  </div>
  <div class="col-sm-4">
    <label for="particle-speed">Particle Speed:</label>
    <input id="particle-speed" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
  <div class="col-sm-4">
    <label for="particle-speed">Particle Mass:</label>
    <input id="particle-mass" type="range" min="0.00625" max="2.0" step="0.00625" value="1.0"/>
  </div>
</div>
<div class="row">
  <div class="col-sm-4">
    <label for="field-size">Field Size:</label>
    <input id="field-size" type="range" min="1.0" max="100.0" step="1.0" value="1.0"/>
  </div>
  <div class="col-sm-4">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.0625" max="2.0" step="0.0625" value="0.125"/>
  </div>
</div>


<div class="row">
  <div class="col-sm-6">
    <label>Render: </label>
    <input type="radio" name="render-texture" value="0" checked/>&nbsp;Field
    <input type="radio" name="render-texture" value="1"/>&nbsp;Gradient
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input id="fract-render-values" type="checkbox"/>Fract Render Values
    </label>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input id="render-magnitude" type="checkbox"/>Render Magnitude
    </label>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input id="defer-gradient-calc" type="checkbox"/>Defer Gradient Calculation
    </label>
  </div>
</div>

### TODO:

- fix edge values in gradient field by transforming the space with a parameterized sigmoid s-curve
  - [Sigmoid curve](https://en.wikipedia.org/wiki/Logistic_function)
  - can this or its derivative be parameterized to skew the numbers right
- replace particle-speed slider with particle-mass
  - figure out mass/energy/momentum/speed, the order of each calculation, etc

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

# Challenges

### Aggregate Calculation of Particle Attributes with Mipmaps
  - refer to paper that demonstrates algorithm for flock behavior

### Calculating the thermal velocity from partilce velocities

- describe physics calculations
  - mass/energy/momentum/speed
  - why mass becomes implicitly required for force/momentum, even if all particle masses are all the same
    - while this seems obvious, ....
- coordinate systems considered/used

### Resolving Discontinuity Problem in Gradients

- added checkbox for deferred calculation
  - holla holla chain rule
    - yes, that's a calculus joke
  - (the derivative of the gradient when using deferred calculation is equivalent to
    the sum of the derivatives of the component particles for that pixel, where blending
    is essentially a sum)

![screenshot]()

- resolving discontinuity problem in gradients
  - resulted in discontinuities bc of the field size
  - blurred field image to remove discontinuities before gradients`
  - this sacrifices accuracy of result, but improves accuracy of physics calculations
- ... nevermind, the blur won't help very much and will reduce accuracy too much
- the other algorithm results in less discontinuities,
  - especially where it matters for calculating forces: in high-density regions
  - nevermind.. does it? there is still effectively an (n x n) ball around each particle
- one option is to transform the values so they taper off to zero
  - but how to stretch the domain/range of the ball around each particle
  - you can force much cleaner values this way,
  - but it's the infinitissimal-to-zero transition of values that's the problem
- another way may be to add a fine amount of noise to the field
  - but this also doesn't help

- bottlenecks and options to increase performance
  - transparency is for all meshes rendered, so the number of rasterized pixels is the main bottleneck
    - therefore, the greatest payoff for performance if more particles are needed is speeding up the
      fairly simple fsFields shader
    - this can be done by utilizing a texture and avoiding unnecessary instructions
    - the payoff is completely linear, proportional to the number of instructions shaved by fetching
      precomputed gradients from textures instead of calculating them
    - minor performance increases, but the method is a bit less flexible
      - however, texture atlas techniques like this are required if you want to render more
        complicated electron density clouds

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
uniform bool u_deferGradientCalc;

//in vec4 v_position; // not linkable to fsFields ?
in float v_pointSize;
flat in int v_particleId;

layout(location = 0) out vec4 repelForce;
layout(location = 1) out vec4 repelFieldGradient;

vec2 calculateRForce(vec2 point, vec2 center) {
  vec2 pointOffset = point.xy - center;
  float d = distance(point.xy, center);
  float rad = atan(pointOffset.y, pointOffset.x);
  return vec2(cos(rad), sin(rad)) / d;
}

void main()
{
  vec2 particleCenter = vec2(0.5, 0.5);
  vec2 rForce = u_rCoefficient * calculateRForce(gl_PointCoord.xy, particleCenter);
  repelForce = vec4(rForce.xy, 0.0, 1.0);

  if (!u_deferGradientCalc) {
    vec2 delta = vec2(1.0, 1.0);
    vec2 point2 = gl_PointCoord + delta / v_pointSize;

    vec2 df = u_rCoefficient * calculateRForce(point2.xy, particleCenter) - rForce;

    repelFieldGradient = vec4(
      df.x / delta.x,
      df.x / delta.y,
      df.y / delta.x,
      df.y / delta.y);
  }
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

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 delta = vec2(1.0, 1.0);

  vec2 uv2 = mod(gl_FragCoord.xy + delta, u_resolution.xy) / u_resolution.xy;
  vec4 df = texture(s_repelField, uv2) - texture(s_repelField, uv);

  // gradient of a vector field
  repelFieldGradient = vec4(
    df.x / delta.x,
    df.x / delta.y,
    df.y / delta.x,
    df.y / delta.y);
}
</script>

<script type="x-shader/x-fragment" id="fsRenderFields">
uniform vec2 u_resolution;
uniform float u_rCoefficient;
uniform bool u_fractRenderValues;
uniform bool u_renderMagnitude;
uniform int u_renderTexture;

uniform sampler2D s_repelField;
uniform sampler2D s_repelFieldGradient;

#define renderTextureField 0
#define renderTextureGradient 1

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec4 rForce = texture(s_repelField, uv);
  vec4 rGradient = texture(s_repelFieldGradient, uv);

  switch (u_renderTexture) {
    case renderTextureField:
      if (u_renderMagnitude) {
        color = vec4(
          distance(vec2(0.0,0.0), rForce.xy),
          0.0,
          0.0,
          1.0);
      } else {
        color = vec4(
          rForce.x,
          rForce.y,
          0.0,
          1.0);
      }
      break;
    case renderTextureGradient:
      if (u_renderMagnitude) {
        color = vec4(
          4.0 * distance(vec2(0.0,0.0), rGradient.xz),
          4.0 * distance(vec2(0.0,0.0), rGradient.yw),
          0.0,
          1.0);
      } else {
        color = vec4(
          4.0 * rGradient.x,
          4.0 * rGradient.y,
          4.0 * rGradient.z,
          1.0);
      }
      break;
  }

  if (u_fractRenderValues) {
    color = vec4(fract(vec3(color)), 1.0);
  }
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
