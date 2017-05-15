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
    <input id="particle-speed" type="range" min="0.025" max="10.0" step="0.025" value="0.050"/>
  </div>
  <div class="col-sm-3">
    <label for="rotation-speed">Rotation Speed:</label>
    <input id="rotation-speed" type="range" min="0.025" max="2.0" step="0.025" value="0.5"/>
  </div>
  <div class="col-sm-3">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-render-fields" checked>Render Fields
    </label>
  </div>
</div>


<div class="row">
  <div class="col-sm-6">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>

  <div class="col-sm-6">
    <label for="a-coefficient">A-Force Coefficient</label>
    <input id="a-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
</div>

<div class="row">
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-r-force" checked>R-Force
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-r-components" checked>∑ R-Components
    </label>
  </div>
  <div class="col-sm-6">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-a-force" checked>A-Force
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-a-components" checked>∑ A-Components
    </label>
  </div>
</div>


- https://gamedevelopment.tutsplus.com/tutorials/understanding-goal-based-vector-field-pathfinding--gamedev-9007

### Challenges:

- forcing rasterization of only one pixel in vsParticleId/fsParticleId shaders
  - check with `var reducted = texContainer.reduce((a,v,i) => { if (v != 0 && v != 2147483647) { a.push([i,v]); } return a}, []);`
  - and with `var counts = reducted.reduce((a,v) => { a[v[1]] = (a[v[1]] || 0) + 1 ; return a }, {});`
  - counts should only be one and should sum up to slightly less than 1024,
    - accounting for the case where two particles occupy the same pixel

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
uniform float u_rotationSpeed;
uniform vec4 u_deltaTime;

uniform isampler2D s_particleRandoms;
uniform sampler2D s_particles;

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;

const float maxIntFloat = 2147483647.0;

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

  vec4 newRandomFloat = fract(vec4(newRandom) / maxIntFloat + 0.5) - 0.5;
  particle = texture(s_particles, uv);

  particle.z += newRandomFloat.z * u_rotationSpeed * u_deltaTime.x / 1000.0;
  float stepLength = (newRandomFloat.w + 0.5) * u_particleSpeed * u_deltaTime.x / 1000.0;

  particle.x += cos(particle.z) * stepLength;
  particle.y += sin(particle.z) * stepLength;
}
</script>

<script type="x-shader/x-fragment" id="vsParticleId">
uniform vec2 u_resolution;
uniform sampler2D s_particles;

layout(location = 0) in int a_index;

flat out int v_particleId;
out float v_pointSize;
out vec4 v_position;

const float maxIntFloat = 2147483647.0;

void main()
{
  // textureSize must return ivec & texelFetch must accept ivec
  ivec2 texSize = textureSize(s_particles, 0);
  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  vec4 particle = texelFetch(s_particles, texel, 0);

  // This needs to write to exactly one pixel (otherwise FML)
  // - it appears to rasterize only one pixel with/without the 0.5 constant
  particle.x = (trunc(particle.x * u_resolution.x) + 0.5) / u_resolution.x;
  particle.y = (trunc(particle.y * u_resolution.y) + 0.5) / u_resolution.y;

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

const int maxInt = 2147483647;

void main() {
  color = ivec4(v_particleId, 0, 1, maxInt);
}
</script>

<script type="x-shader/x-fragment" id="fsFields">
uniform vec2 u_resolution;
uniform int u_ballSize;
uniform float u_rCoefficient;
uniform float u_aCoefficient;

uniform sampler2D s_particles;
uniform isampler2D s_particleIds;

layout(location = 0) out vec4 repelField;
layout(location = 1) out vec4 repelComp;
layout(location = 2) out vec4 attentionField;
layout(location = 3) out vec4 attentionComp;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  int ballSizeOffset = - u_ballSize / 2;
  ivec2 particlesSize = textureSize(s_particles, 0);

  repelField = vec4(0.0, 0.0, 0.0, 1.0);
  repelComp = vec4(0.0, 0.0, 0.0, 1.0);
  attentionField = vec4(0.0, 0.0, 0.0, 1.0);
  attentionComp = vec4(0.0, 0.0, 0.0, 1.0);

  for (int i = ballSizeOffset; i <= ballSizeOffset + u_ballSize; i++) {
    for (int j = ballSizeOffset; j <= ballSizeOffset + u_ballSize; j++) {
      vec2 texelCoords = mod(gl_FragCoord.xy + vec2(float(i), float(j)), u_resolution.xy) / u_resolution.xy;
      ivec4 particleId = texture(s_particleIds, texelCoords);

      if (particleId.z == 1) { // if particleId is defined
        ivec2 particleUV = ivec2(particleId.x % particlesSize.x, particleId.x / particlesSize.x);
        vec4 particle = texelFetch(s_particles, particleUV, 0);

        float d = distance(particle.xy, uv) * distance(vec2(0.0, 0.0), u_resolution.xy);
        vec2 particleToUV = particle.xy - uv;
        float rad = atan(particleToUV.y, particleToUV.x);
        vec2 rForce = vec2(cos(rad), sin(rad)) / d;

        repelField.xy += u_rCoefficient * rForce;
        repelComp.x += distance(vec2(0.0,0.0), u_rCoefficient * rForce);
      } else {
        // ¯\_(ツ)_/¯
      }
    }
  }
}
</script>

<script type="x-shader/x-fragment" id="fsRender">
void main() {

}
</script>

<script type="x-shader/x-fragment" id="fsRenderFields">
uniform vec2 u_resolution;
uniform float u_rCoefficient;
uniform float u_aCoefficient;

uniform sampler2D s_repelField;
uniform sampler2D s_repelComp;
uniform sampler2D s_attentionField;
uniform sampler2D s_attentionComp;

uniform isampler2D s_particleIds;

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec4 rForce = texture(s_repelField, uv);
  vec4 rComp = texture(s_repelComp, uv);
  vec4 aForce = texture(s_attentionField, uv);
  vec4 aComp = texture(s_attentionComp, uv);

  ivec4 particleId = texture(s_particleIds, uv);

  color = vec4(
    distance(vec2(0.0,0.0), rForce.xy),
    float(particleId.x % 8) / 8.0,
    rComp.x,
    1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsDebugParticleIds">
uniform vec2 u_resolution;
uniform isampler2D s_particleIds;

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  ivec4 particleInt = texture(s_particleIds, uv);
  //vec4 particle = fract(vec4(particleInt) / 128.0);
  vec4 particle = vec4(particleInt) / maxIntFloat;

  //color = vec4(1.0, 1.0, 0.0, 1.0);
  color = vec4(particle.rgb, 1.0);
}
</script>

<script type="text/javascript" src="/js/3d/2017-05-11-social-physics-conversations.es6.js"></script>
