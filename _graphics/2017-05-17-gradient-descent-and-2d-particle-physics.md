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
    <input id="particle-count" type="range" min="128" max="5120" step="16" value="1024"/>
  </div>
  <div class="col-sm-4">
    <label for="particle-speed">Particle Speed:</label>
    <input id="particle-speed" type="range" min="0.0125" max="10.0" step="0.0125" value="0.05"/>
  </div>
  <div class="col-sm-4">
    <label for="particle-speed">Particle Mass:</label>
    <input id="particle-mass" type="range" min="0.00625" max="2.0" step="0.00625" value="1.0"/>
  </div>
</div>
<div class="row">
  <div class="col-sm-4">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.0625" max="4.0" step="0.0625" value="1.0"/>
  </div>
  <div class="col-sm-4">
    <label for="field-size">Field Size:</label>
    <input id="field-size" type="range" min="1.0" max="300.0" step="1.0" value="50.0"/>
  </div>
  <div class="col-sm-4">
    <label for="max-field-lines">Max Field Lines:</label>
    <input id="max-field-lines" type="range" min="0.0" max="10.0" step="1.0" value="1.0"/>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label>Render: </label>
    <input type="radio" name="render-texture" value="0" checked/>&nbsp;Field
    <input type="radio" name="render-texture" value="1"/>&nbsp;Gradient
    <input type="radio" name="render-texture" value="2"/>&nbsp;4-Channel
  </div>
  <div class="col-sm-6">
    <label>Physics: </label>
    <input type="radio" name="physics-method" value="0" checked/>&nbsp;Brownian
    <input type="radio" name="physics-method" value="2"/>&nbsp;Splatting
    <input type="radio" name="physics-method" value="1"/>&nbsp;Gradient
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
      <input id="scale-render-values" type="checkbox"/>Scale Render Values
    </label>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input id="calc-force-in-glpoint-space" type="checkbox"/>Calc Force in GL Point Space
    </label>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input id="circular-field-effect" type="checkbox" checked/>Circular Field Effect
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

- add button to reset data
- balance rCoefficient with particle count
  - either this or add correction for thermal velocity
    - when thermal velocity is too high, set uniform to scale down particleAttributes values

- add parameter presets

- how to fix problems introduced by particles wrapping to the other side

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

### Questions

- is it possible to utilize force splatting to average attributes of particles (v & ∂v)
  over various levels of space to correct for the inability to calculate gradients with a large
  field size for each particle?
  - e.g. increase/decrease field effect size for local particle density
- force splatting could also be useful in combination with stochastic programming to dynamically
  allocate greater GPU power to regions of space with more intricate particle positions
  and attributes
  - there's an interesting effect produced when viewing the fracted values of the
    field/gradient
    - it begins to take on curved forms that connected from particle to particle, except
      around the edge of the calculated effect on the field for each particle
    - that is, at the edge of the particle field, there is a sharp break in values added
      that produces jagged curves that would be otherwise smooth if there were no
      limits on the computational power
  - so, is there any way to generate the ideal field by progressively converging towards something
    like a topographical map for a curved space, where the lines represent the locations for
    particular values
    - as the computed space approaches the ideal space, the curves (values) begin to change less
      and less for paricle systems that have spherical forces
    - but more importantly, the lines at each value in the field begin to curve more smoothly until
      they reach the ideal field
    - in the ideal field, the field lines for each axis for the will always intersect at right angles

- there should be a method of constructing the field/gradient for an arrangement of particles
  using geometry. there may be at least two geometric methods for doing so:
  - (1) given a delauney triangulation mesh of the particles, one expands on the graph/geometry to
    produce a mesh which is close enough to match the field
  - (2) or via a kind of stochastic programming where ideal points in the space are sampled for
    values and the field is interpolated afterwards
  - both of these methods can be improved by attaching normals to the vertices to assist in making
    the curves more accurate.
    - but it's the perculiar nature of the curves that makes it possible for an algorithm to sift
      towards their ideal shape
  - for either algorithm, but particularly the first, neural networks can assist in identifying
    similarity between local subgraphs of the delauney triangulation and the output of the field
  - both of these algorithms are likely rendered intractible by variation in particle type &
    attributes. for systems with identical particles spread across the system, then similarity
    between system arrangments can be more easily identified and harnessed to interpolate the
    system


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

<script type="x-shader/x-vertex" id="fsForceSplat">
uniform vec2 u_resolution;
uniform ivec2 u_particleUv;
uniform float u_rCoefficient;

uniform sampler2D s_particles;

layout(location = 0) out vec4 particleUpdates;

vec2 calcForce(vec2 r, vec2 r2) {
  vec2 dr = r - r2;
  float d = distance(r, r2);
  float rad = atan(dr.y, dr.x);
  return vec2(cos(rad), sin(rad)) / d;
}

void main() {
  ivec2 uv = ivec2(trunc(gl_FragCoord));
  if (uv == u_particleUv) { discard; }

  vec4 accumulatorParticle = texelFetch(s_particles, uv, 0);
  vec4 particle = texelFetch(s_particles, u_particleUv, 0);

  particleUpdates.xy = u_rCoefficient * calcForce(accumulatorParticle.xy, particle.xy);
}
</script>

<script type="x-shader/x-fragment" id="fsUpdateParticles">
uniform vec2 u_resolution;
uniform ivec4 u_randomSeed;
uniform float u_particleSpeed;
uniform vec4 u_deltaTime;
uniform int u_physicsMethod;

uniform isampler2D s_particleRandoms;
uniform sampler2D s_particles;
uniform sampler2D s_particleAttributes;
uniform sampler2D s_particleForces;

//uniform sampler2D s_repelFieldGradient

#define physicsMethodBrownian 0
#define physicsMethodSplat 1
#define physicsMethodGradient 2

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;
layout(location = 2) out vec4 particleAttributes;

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

  particleAttributes = texture(s_particleAttributes, uv);
  vec2 netForce = vec2(0.0, 0.0);

  switch (u_physicsMethod) {

    case physicsMethodBrownian:
      if (u_physicsMethod == physicsMethodBrownian) {
        vec4 newRandomFloat = fract(vec4(newRandom) / maxInt + 0.5) - 0.5 ;
        netForce = newRandomFloat.xy;
      }
      break;

    case physicsMethodSplat:
      if (u_physicsMethod == physicsMethodSplat) {
        netForce = texture(s_particleForces, uv).xy;
      }
      break;

    case physicsMethodGradient:
      if (u_physicsMethod == physicsMethodGradient) {
        // TODO: update from gradient
      }
      break;

  }

  // =======================================
  // Update Particles
  // =======================================
  particle = texture(s_particles, uv);

  // TODO: adjust units for u_particleSpeed (and fix in netForce calcs above)

  particleAttributes.xy += netForce * u_deltaTime.x / 1000.0;
  vec2 particleUpdate = particleAttributes.xy * u_deltaTime.x / 1000.0;

  particle.x = mod(particle.x + particleUpdate.x + 1.0, 2.0) - 1.0;
  particle.y = mod(particle.y + particleUpdate.y + 1.0, 2.0) - 1.0;
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
uniform bool u_circularFieldEffect;
uniform bool u_forceCalcInGlPointSpace;

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
  if (u_circularFieldEffect && distance(gl_PointCoord.xy, vec2(0.5,0.5)) > 0.5) { discard; }

  vec2 particleCenter = vec2(0.5, 0.5);
  vec2 fieldPoint = gl_PointCoord.xy;
  vec2 delta = vec2(1.0, 1.0);

  if (!u_forceCalcInGlPointSpace) {
     particleCenter *= v_pointSize;
     fieldPoint *= v_pointSize;
  } else {
    // incorrect but causes the shape of the field space to be emphasized
    delta /= v_pointSize;
  }
  vec2 rForce = u_rCoefficient * calculateRForce(fieldPoint, particleCenter);
  repelForce = vec4(rForce.xy, 0.0, 1.0);

  if (!u_deferGradientCalc) {
    vec2 fieldPoint2 = fieldPoint + delta;
    vec2 df = u_rCoefficient * calculateRForce(fieldPoint2.xy, particleCenter) - rForce;

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
uniform bool u_forceCalcInGlPointSpace;

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
uniform bool u_scaleRenderValues;
uniform int u_renderTexture;
uniform float u_maxFieldLines;

uniform sampler2D s_repelField;
uniform sampler2D s_repelFieldGradient;

#define renderTextureField 0
#define renderTextureGradient 1
#define renderTexture4Channel 2

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
          4.0 * distance(rGradient.xz, vec2(0.0,0.0)),
          4.0 * distance(rGradient.yw, vec2(0.0,0.0)),
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
    case renderTexture4Channel:
      if (u_renderMagnitude) {
        color = vec4(
          4.0 * distance(rGradient.x, 0.0),
          4.0 * distance(rGradient.z, 0.0),
          4.0 * (distance(rGradient.y, 0.0) * distance(rGradient.w, 0.0)),
          1.0);
      } else {
        color = vec4(
          4.0 * rGradient.x * rGradient.z,
          4.0 * rGradient.z * rGradient.w,
          4.0 * (rGradient.y * rGradient.w),
          1.0);
      }
      break;
  }

  if (u_scaleRenderValues) {
      vec3 scaled = 1.0/(1.0 + exp(-color.xyz));
      color = 10.0 * vec4(scaled - 0.5, 1.0);
  }

  if (u_fractRenderValues) {
    if (u_maxFieldLines > 0.0) {
      if (color.x > u_maxFieldLines) {
        color.x = u_maxFieldLines;
      }
      if (color.y > u_maxFieldLines) {
        color.y = u_maxFieldLines;
      }
      if (color.z > u_maxFieldLines) {
        color.z = u_maxFieldLines;
      }
      if (color.x < -u_maxFieldLines) {
        color.x = -u_maxFieldLines;
      }
      if (color.y < -u_maxFieldLines) {
        color.y = -u_maxFieldLines;
      }
      if (color.z < -u_maxFieldLines) {
        color.z = -u_maxFieldLines;
      }
    }
    color = vec4(fract(color.xyz), 1.0);
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
