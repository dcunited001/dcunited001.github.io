---
title: "Social Physics As Particle Systems"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---

### Requires ES6 & WebGL2

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

<script type="x-shader/x-fragment" id="fsParticleIntRandoms">
uniform vec2 resolution;
uniform ivec4 randomSeed;
uniform float globalSpeed;
uniform vec4 deltaTime;

uniform isampler2D particleRandoms;
uniform sampler2D particles;

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;

void main() {
  float maxInt = 2147483647.0;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  // =======================================
  // Update Randoms
  // =======================================

  ivec4 randomTexel = texture(particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

  ivec4 texels[4];
  texels[0] = texture(particleRandoms, texelCoords[0]);
  texels[1] = texture(particleRandoms, texelCoords[1]);
  texels[2] = texture(particleRandoms, texelCoords[2]);
  texels[3] = texture(particleRandoms, texelCoords[3]);

  ivec4 newRandom = randomSeed ^ randomTexel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3];
  random = newRandom;

  // =======================================
  // Update Particles
  // =======================================

  vec4 newRandomFloat = vec4(newRandom) / maxInt;
  particle = texture(particles, uv);
  particle.x += (globalSpeed * newRandomFloat.x * deltaTime.x / 1000.0);
  particle.y += (globalSpeed * newRandomFloat.y * deltaTime.x / 1000.0);
}
</script>

<script type="x-shader/x-fragment" id="fsParticleUpdate">
  uniform vec2 resolution;
  uniform vec4 deltaTime;
  uniform sampler2D particleRandoms;
  uniform sampler2D particles;

  in vec2 v_st;
  in vec3 v_position;

  out vec4 particleUpdate;

  void main() {
    float globalSpeed = 32.0;
    float maxUint = 4294967295.0;

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // TODO: figure out why sampling this texture throws an invalid operation
    //uvec4 randoms = texture(particleRandoms, uv);
    //vec4 pRandoms = vec4(float(randoms.x), float(randoms.y), float(randoms.z), float(randoms.w));
    vec4 randoms = texture(particleRandoms, uv);
    vec4 pBasics = texture(particles, uv);

    particleUpdate = vec4(0.0,0.0,0.0,1.0);
    //particleUpdate.xy = randoms.xy;
    //particleUpdate.x = 1 - particleUpdate.x;
    //particleUpdate.x = pBasics.x + (globalSpeed * pRandoms.x * deltaTime.x / 1000.0);
    //particleUpdate.y = pBasics.y + (globalSpeed * pRandoms.y * deltaTime.x / 1000.0);
    //particleUpdate.x = pBasics.x + pRandoms.x;
    //particleUpdate.y = pBasics.y + pRandoms.y;

  }
</script>

<script type="x-shader/x-vertex" id="vsFieldPoints">
//uniform sampler2D particles;
uniform sampler2D particles;

layout(location = 0) in int a_index;

flat out int v_particleId;
out float v_pointSize;
out vec4 v_position;

void main()
{
  float maxInt = 2147483647.0;

  // textureSize must return ivec & texelFetch must accept ivec
  ivec2 texSize = textureSize(particles, 0);

  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  //vec4 pBasics = vec4(texelFetch(particles, texel, 0)) / maxInt;
  vec4 pBasics = texelFetch(particles, texel, 0);

  v_particleId = a_index;
  v_position = vec4(pBasics.x, pBasics.y, 0.0, 1.0);
  v_pointSize = 3.0;

  gl_Position = v_position;
  gl_PointSize = v_pointSize;
}
</script>

<script type="x-shader/x-fragment" id="fsFieldPoints">
uniform vec2 resolution;
uniform sampler2D particleAttributes;

flat in int v_particleId;
in vec4 v_position;
in float v_pointSize;

out vec4 color;

void main()
{
  ivec2 texSize = textureSize(particleAttributes, 0);
  ivec2 texel = ivec2(v_particleId % texSize.x, v_particleId / texSize.x);
  vec4 pAttr = texelFetch(particleAttributes, texel, 0);

  // TODO: blend linearly with distance(gl_FragCoord.xy, gl_PointCoord);

  color = vec4(pAttr.r, pAttr.g, pAttr.b, 1.0);
  //color = vec4(intBitsToFloat(v_particleId), 0.0, 0.0, 1.0);
}

</script>

<script type="x-shader/x-fragment" id="fsField">
uniform vec2 resolution;
uniform int ballSize;
uniform float repelMag;
uniform float attractMag;

uniform sampler2D particles;
uniform sampler2D fieldPoints;

layout(location = 0) out vec4 repelField;
layout(location = 1) out vec4 attractField;

vec2 calcRForce(vec2 texelCoords, vec2 particleCoords, float mag) {
  return vec2(0.0, 0.0);
}

vec2 calcAForce() {
  return vec2(0.0, 0.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  float attract = 0.0;
  float repel = 0.0;

  int ballSizeOffset = - ballSize / 2;

  ivec2 pBasicsSize = textureSize(particles, 0);

  for (int i = ballSizeOffset; i < ballSizeOffset + ballSize; i++) {
    for (int j = ballSizeOffset; j < ballSizeOffset + ballSize; j++) {
      vec2 texelCoords = mod(gl_FragCoord.xy + vec2(float(i), float(j)), resolution.xy) / resolution.xy;
      vec2 texelCoordsNoMod = gl_FragCoord.xy + vec2(float(i), float(j)) / resolution.xy;

      vec4 point = texture(fieldPoints, texelCoords);

      // TODO: verify that binary representation of point.x has not been clamped
      int pBasicIdx = floatBitsToInt(point.x);

      ivec2 pBasicTexel = ivec2(pBasicIdx % pBasicsSize.x, pBasicIdx / pBasicsSize.x);
      vec4 pBasic = texelFetch(particles, pBasicTexel, 0);

      float d = distance(pBasic.xy, texelCoordsNoMod) + 0.0001;

      float rForce = repelMag / (d*d);
      float aForce = attractMag / d;

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

<script type="x-shader/x-fragment" id="fsTest">
uniform vec2 resolution;
uniform sampler2D fieldPoints;
uniform sampler2D repelField;
uniform sampler2D attractField;

out vec4 color;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 pointColor = texture(fieldPoints, uv);
  vec4 repelFieldColor = texture(repelField, uv);
  vec4 attractFieldColor = texture(attractField, uv);

  vec4 debugColor = vec4(0.5,0.5,0.5,1.0);
  if (pointColor.x != 0.0) {
    debugColor.x = 1.0;
  }

  color = vec4(fract(repelFieldColor.x), fract(attractFieldColor.x), pointColor.w, 1.0);
  //color = debugColor;
}
</script>

<script type="x-shader/x-fragment" id="fsTestFieldPoints">
uniform vec2 resolution;
uniform sampler2D fieldPoints;

out vec4 color;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 pointColor = texture(fieldPoints, uv);

  vec4 debugColor = vec4(0.5,0.5,0.5,1.0);
  if (pointColor.x != 0.0) {
    debugColor.x = 1.0;
  }

  color = pointColor;
}
</script>

<script type="text/javascript" src="/js/3d/2017-04-17-brownian-motion.es6.js"></script>