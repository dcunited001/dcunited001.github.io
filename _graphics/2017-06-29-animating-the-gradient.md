---
title: "Animating The Gradient"
categories: "graphics"
tags: "graphics computer-science"
headline: "2D Particle Simulation"
excerpt: ""
author:
  name: "David Conner"
graphics_ui_layout: "graphics/2017-06-29-animating-the-gradient.html"
---

<pre class="highlight">Fragment Shader: fsUpdateParticles<code id="codeFsUpdateParticles"></code></pre>
<pre class="highlight">Vertex Shader: vsFields<code id="codeVsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsFields<code id="codeFsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsGradients<code id="codeFsGradients"></code></pre>
<pre class="highlight">Fragment Shader: fsRenderFields<code id="codeFsRenderFields"></code></pre>
<pre class="highlight">Fragment Shader: fsForceSplat<code id="codeFsForceSplat"></code></pre>
<pre class="highlight">Vertex Shader: vsLinePlotTransform<code id="codeVsLinePlotTransform"></code></pre>

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
uniform int u_particleIdLimit;

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

  if (uv.x * uv.y + uv.x > u_particleIdLimit) { discard; }
  if (uv == u_particleUv) { discard; }

  vec4 accumulatorParticle = texelFetch(s_particles, uv, 0);
  vec4 particle = texelFetch(s_particles, u_particleUv, 0);

  particleUpdates.xy = u_rCoefficient * calcForce(accumulatorParticle.xy, particle.xy);
}
</script>

<script type="x-shader/x-fragment" id="fsUpdateParticles">
uniform vec2 u_resolution;
uniform vec2 u_fieldResolution;
uniform ivec4 u_randomSeed;
uniform float u_particleSpeed;
uniform vec4 u_deltaTime;
uniform int u_spaceType;
uniform int u_physicsMethod;
uniform bool u_bilinearInterpolation;

uniform isampler2D s_particleRandoms;
uniform sampler2D s_particles;
uniform sampler2D s_particleMomentums;
uniform sampler2D s_particleForceSplat;
uniform sampler2D s_repelField;

#define physicsMethodBrownian 0
#define physicsMethodSplat 1
#define physicsMethodField 2

#define spaceTypeFinite 0
#define spaceTypeWrapped 1
#define spaceTypeInfinite 2

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;
layout(location = 2) out vec4 particleMomentums;
layout(location = 3) out vec4 particleForces;

// TODO: temperature: update another texture with particle velocities
// layout(location = 2) out vec4 particleVelocities

const float maxInt = 2147483647.0;

// because float textures are not texture-filterable in webgl
vec4 bilinearInterpolation(sampler2D s, vec2 rs) {
  vec2 rsOffset = fract(rs);
  vec2 baseCoords = trunc(rs) + vec2(
    rsOffset.x >= 0.5 ? 0.5 : -0.5,
    rsOffset.y >= 0.5 ? 0.5 : -0.5);

  vec2 coords[4];
  coords[0] = baseCoords;
  coords[1] = baseCoords + vec2(1.0, 0.0);
  coords[2] = baseCoords + vec2(0.0, 1.0);
  coords[3] = baseCoords + vec2(1.0, 1.0);

  vec4 texels[4];
  texels[0] = texelFetch(s, ivec2(trunc(coords[0])), 0);
  texels[1] = texelFetch(s, ivec2(trunc(coords[1])), 0);
  texels[2] = texelFetch(s, ivec2(trunc(coords[2])), 0);
  texels[3] = texelFetch(s, ivec2(trunc(coords[3])), 0);

  vec4 color = vec4(0.0, 0.0, 0.0, 0.0);
  for (int i = 0; i < 4; i++) {
    coords[i] = coords[i] - rs;
    float area = abs(coords[i].x * coords[i].y);
    color += area * texels[i];

    //color += texels[i] / 4.0;
    //color += vec4(coords[i] / 4.0, 0.0,0.0);
  }

  // it's returning 0,0,0,1 because the coordinates are off the screen
  // but if that's the case, area should not sum to one and it does
  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // =======================================
  // Update Randoms
  // =======================================

  ivec4 randomTexel = texture(s_particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), u_resolution.xy) / u_resolution.xy;
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
  // Update Physics
  // =======================================

  particle = texture(s_particles, uv);
  particleMomentums = texture(s_particleMomentums, uv);
  vec2 netForce = vec2(0.0, 0.0);

  switch (u_physicsMethod) {

    case physicsMethodBrownian:
      vec4 newRandomFloat = fract(vec4(newRandom) / maxInt + 0.5) - 0.5 ;
      netForce = newRandomFloat.xy;
      break;

    case physicsMethodSplat:
      netForce = texture(s_particleForceSplat, uv).xy;
      break;

    case physicsMethodField:
      //vec4 field = bilinearInterpolation(s_repelField, particleToFieldSpace);
      //vec4 field = texture(s_repelField, (particle.xy + 1.0) / 2.0);

      vec4 field = vec4(0.0, 0.0, 0.0, 0.0);
      vec2 coordOffsets[8];
      coordOffsets[0] = vec2(-1.0, -1.0);
      coordOffsets[1] = vec2(0.0, -1.0);
      coordOffsets[2] = vec2(1.0, -1.0);
      coordOffsets[3] = vec2(-1.0, 0.0);
      // skip the center pixel because values are too high
      coordOffsets[4] = vec2(1.0, 0.0);
      coordOffsets[5] = vec2(-1.0, 1.0);
      coordOffsets[6] = vec2(0.0, 1.0);
      coordOffsets[7] = vec2(1.0, 1.0);
      //coordOffsets[8] = vec2(0.0, 0.0);

      for (int i = 0; i <= 8; i++) {
        if (u_bilinearInterpolation) {
          vec2 particleToFieldSpace = ((particle.xy + 1.0) / 2.0) * u_fieldResolution.xy;
          vec2 coords = particleToFieldSpace.xy + coordOffsets[i];
          field += bilinearInterpolation(s_repelField, coords.xy);
        } else {
          vec2 coords = ((particle.xy + 1.0) / 2.0) + (coordOffsets[i] / u_fieldResolution.xy);
          field += texture(s_repelField, coords);
        }
      }
      field /= 8.0;

      //if (u_bilinearInterpolation) {
      //  vec2 particleToFieldSpace = ((particle.xy + 1.0) / 2.0) * u_fieldResolution.xy;
      //  vec2 coords = particleToFieldSpace.xy;
      //  field += bilinearInterpolation(s_repelField, coords.xy);
      //} else {
      //  vec2 coords = ((particle.xy + 1.0) / 2.0);
      //  field += texture(s_repelField, coords);
      //}

      netForce = vec2(field.x, -field.y);
      break;
  }

  // =======================================
  // Update Particles
  // =======================================
  // TODO: adjust units for u_particleSpeed (and fix in netForce calcs above)

  particleForces = vec4(netForce.xy, 0.0, 0.0);
  particleMomentums.xy += netForce * u_deltaTime.x / 1000.0;
  vec2 particleUpdate = u_particleSpeed * particleMomentums.xy * u_deltaTime.x / 1000.0;

  switch (u_spaceType) {
    case spaceTypeFinite:
      particle.x = particle.x + particleUpdate.x;
      particle.y = particle.y + particleUpdate.y;
      break;
    case spaceTypeWrapped:
      particle.x = mod(particle.x + particleUpdate.x + 1.0, 2.0) - 1.0;
      particle.y = mod(particle.y + particleUpdate.y + 1.0, 2.0) - 1.0;
      break;
    case spaceTypeInfinite:
      particle.x = particle.x + particleUpdate.x;
      particle.y = particle.y + particleUpdate.y;
      break;
  }
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
uniform sampler2D s_particleMomentums;
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

    // jacobian of the vector field
    repelFieldGradient = vec4(
      df.x / delta.x, df.x / delta.y,
      df.y / delta.x, df.y / delta.y);
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

  // gradient of a vector field (jacobian)
  repelFieldGradient = vec4(
    df.x / delta.x, df.x / delta.y,
    df.y / delta.x, df.y / delta.y);
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

uniform bool u_audioColorShiftEnabled;
uniform vec3 u_audioColorShift;

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
          4.0 * rGradient.z,
          4.0 * rGradient.y,
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

  if (u_audioColorShiftEnabled) {
    color = vec4(color.rgb + u_audioColorShift.rgb, 1.0);
  }

  if (u_fractRenderValues) {
    if (u_maxFieldLines > 0.0) {
      color.xyz = clamp(color.xyz, -u_maxFieldLines, u_maxFieldLines);
    }
    color = vec4(fract(color.xyz), 1.0);
  }
}
</script>

<script type="x-shader/x-fragment" id="fsMipmapAggregate">
uniform vec2 resolution;

out vec4 particleMomentum;
out vec4 particleMomentumStats;

out vec4 particleForce;
out vec4 particleForceStats;

void main() {

}
</script>

<script type="x-shader/x-vertex" id="vsLinePlotTransform">
uniform mat4x4 u_projection;
uniform float u_lineWidth;

layout(location = 0) in vec2 a_position;

out vec4 v_positionA;
out vec4 v_positionB;

void main() {
  v_positionA = u_projection * vec4(a_position.x, a_position.y, 0.0, 1.0);
  v_positionB = u_projection * vec4(a_position.x, a_position.y, 0.0, 1.0);

  v_positionA.y += u_lineWidth;
  v_positionB.y -= u_lineWidth;

  gl_Position = v_positionA;
}
</script>

<script type="x-shader/x-vertex" id="fsNull">
out vec4 color;

void main() {

}
</script>

<script type="x-shader/x-fragment" id="vsLinePlot">
layout(location = 0) in vec4 a_position;

out vec3 v_position;

void main() {
  gl_Position = a_position;
}
</script>

<script type="x-shader/x-fragment" id="fsLinePlot">
uniform vec4 u_lineColor;

out vec4 color;

void main() {
  color = u_lineColor;
}
</script>

<script type="x-shader/x-fragment" id="fsParticleAggregatesFilter">
// TODO: add filters for particle aggregates
uniform vec4 ;

uniform vec2 u_resolution;
uniform ivec2 u_particleUv;
uniform int u_particleIdLimit;

uniform sampler2D s_momentums;
uniform sampler2D s_forces;
uniform sampler2D s_deltaForces;

layout(location = 0) out vec4 momentum;
layout(location = 1) out vec4 deltaMomentum;
layout(location = 2) out vec4 force;
layout(location = 3) out vec4 deltaForce;

// TODO: implement a filter for aggregates

void main() {
  ivec2 uv = ivec2(trunc(gl_FragCoord));

  if (uv.x * uv.y + uv.x > u_particleIdLimit) {
    // TODO: replace with 'null' value
    momentum = vec4(0.0, 0.0, 0.0, 0.0);
    deltaMomentum = vec4(0.0, 0.0, 0.0, 0.0);
    force = vec4(0.0, 0.0, 0.0, 0.0);
    deltaForce = vec4(0.0, 0.0, 0.0, 0.0);
  } else {
    momentum = vec4(texelFetch(s_momentums, uv, 0).xy, 0.0, 0.0);
    deltaMomentum = vec4(texelFetch(s_momentums, uv, 0).zw, 0.0, 0.0);
    force = vec4(texelFetch(s_forces, uv, 0));
    deltaForce = vec4(texelFetch(s_deltaForces, uv, 0));
  }
}
</script>

<script type="text/javascript" src="/js/3d/utils/quad.js"></script>
<script type="text/javascript" src="/js/3d/utils/line_plot.js"></script>
<script type="text/javascript" src="/js/3d/utils/mip_reducer.js"></script>
<script type="text/javascript" src="/js/3d/2017-06-29-animating-the-gradient.es6.js"></script>


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
  pasteShaderToCodeBlock('fsForceSplat', 'codeFsForceSplat');
  pasteShaderToCodeBlock('vsLinePlotTransform', 'codeVsLinePlotTransform');
</script>
