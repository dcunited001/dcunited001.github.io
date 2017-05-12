---
title: "Social Physics: Conversations"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---


<div class="row">
  <div class="col-sm-3">
    <label for="particle-count">Particle Count:</label>
    <input id="particle-count" type="range" min="128" max="10240" step="128" value="1024"/>
  </div>
  <div class="col-sm-3">
    <label for="particle-speed">Particle Speed:</label>
    <input id="particle-speed" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
  <div class="col-sm-3">
    <label for="a-coefficient">A-Force Coefficient</label>
    <input id="a-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-r-force" checked onclick="changeStatsDisplayVars()">R-Force
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-r-components" checked onclick="changeStatsDisplayVars()">∑ R-Components
    </label>
  </div>
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-a-force" checked onclick="changeStatsDisplayVars()">A-Force
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-a-components" checked onclick="changeStatsDisplayVars()">∑ A-Components
    </label>
  </div>
</div>

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

<script type="x-shader/x-fragment" id="fsParticle">
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

const float maxInt = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // =======================================
  // Update Randoms
  // =======================================

  ivec4 randomTexel = texture(s_particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -2.0), resolution.xy) / resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

  ivec4 texels[4];
  texels[0] = texture(s_particleRandoms, texelCoords[0]);
  texels[1] = texture(s_particleRandoms, texelCoords[1]);
  texels[2] = texture(s_particleRandoms, texelCoords[2]);
  texels[3] = texture(s_particleRandoms, texelCoords[3]);

  ivec4 newRandom = randomSeed ^ randomTexel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3];
  random = newRandom;

  // =======================================
  // Update Particles
  // =======================================

  vec4 newRandomFloat = fract(vec4(newRandom) / maxInt + 0.5) - 0.5 ;
  particle = texture(s_particles, uv);
  particle.x += (particleSpeed * newRandomFloat.x * deltaTime.x / 1000.0);
  particle.y += (particleSpeed * newRandomFloat.y * deltaTime.x / 1000.0);
  // TODO: particle.z for angle ...
}
</script>

<script type="x-shader/x-fragment" id="vsParticleId">
uniform vec2 u_resolution;
uniform sampler2D s_particles;

layout(location = 0) in int a_index;

flat out int v_particleId;
out float v_pointSize;
out vec4 v_position;

const float maxInt = 2147483647.0;

void main()
{
  // textureSize must return ivec & texelFetch must accept ivec
  ivec2 texSize = textureSize(s_particles, 0);

  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  vec4 particle = texelFetch(s_particles, texel, 0);

  // This needs to write to exactly one pixel (otherwise FML)
  particle.x = trunc(particle.x * u_resolution.x) / u_resolution.x;
  particle.y = trunc(particle.y * u_resolution.y) / u_resolution.y;

  v_particleId = a_index;
  v_position = vec4(particle.x, particle.y, 0.0, 1.0);

  gl_Position = v_position;
  gl_PointSize = 1.0;
}
</script>

<script type="x-shader/x-fragment" id="fsParticleId">
flat in int v_particleId;
in vec4 v_position;

out ivec4 color;

void main() {
  color = ivec4(v_particleId, 0, 0, 1);
}
</script>

<script type="x-shader/x-fragment" id="fsField">
layout(location = 0) out vec4 repelField;
layout(location = 1) out vec4 attentionField;

void main() {
  repelField = vec4(0.0, 0.0, 0.0, 1.0);
  attentionField = vec4(0.0, 0.0, 0.0, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsFieldOld">
uniform vec2 u_resolution;
uniform int u_ballSize;
uniform float u_repelMag;
uniform float u_attentionMag;

uniform sampler2D s_particles;
uniform sampler2D s_fieldPoints;

layout(location = 0) out vec4 repelField;
layout(location = 1) out vec4 attentionField;

vec2 calcRForce(vec2 texelCoords, vec2 particleCoords, float mag) {
  return vec2(0.0, 0.0);
}

vec2 calcAForce() {
  return vec2(0.0, 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float attract = 0.0;
  float repel = 0.0;

  int ballSizeOffset = - u_ballSize / 2;

  ivec2 pBasicsSize = textureSize(s_particles, 0);

  for (int i = ballSizeOffset; i < ballSizeOffset + u_ballSize; i++) {
    for (int j = ballSizeOffset; j < ballSizeOffset + u_ballSize; j++) {
      vec2 texelCoords = mod(gl_FragCoord.xy + vec2(float(i), float(j)), u_resolution.xy) / u_resolution.xy;
      vec2 texelCoordsNoMod = gl_FragCoord.xy + vec2(float(i), float(j)) / u_resolution.xy;

      vec4 point = texture(s_particleIds, texelCoords);

      // TODO: verify that binary representation of point.x has not been clamped
      int pBasicIdx = floatBitsToInt(point.x);

      ivec2 pBasicTexel = ivec2(pBasicIdx % pBasicsSize.x, pBasicIdx / pBasicsSize.x);
      vec4 pBasic = texelFetch(s_particles, pBasicTexel, 0);

      float d = distance(pBasic.xy, texelCoordsNoMod) + 0.0001;

      float rForce = u_repelMag / (d*d);
      float aForce = u_attentionMag / d;

      // TODO: calculate vec2's for rForce & aForce
      // TODO: calculate aForce, given the directional component of the particle

      repel += rForce;
      attract += aForce;
    }
  }

  repelField = vec4(repel, 0.0, 0.0, 1.0);
  attractField = vec4(attract, 0.0, 0.0, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsRender">
void main() {

}
</script>

<script type="x-shader/x-fragment" id="fsRenderDebug">
void main() {

}
</script>

<script type="text/javascript" src="/js/3d/2017-05-11-social-physics-conversations.es6.js"></script>
