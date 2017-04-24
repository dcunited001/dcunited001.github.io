---
title: "Social Physics As Particle Systems"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---

## Theoretical Computer Science & Probabilistic State Machines

### Requires ES6 & WebGL2

<script type="x-shader/x-vertex" id="vertexPassthrough">
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 4

layout(location = POSITION_LOCATION) in vec3 a_position;
layout(location = TEXCOORD_LOCATION) in vec2 a_texcoord;

out vec2 v_st;
out vec3 v_position;

void main() {
  v_st = a_texcoord;
  v_position = a_position;
  gl_Position = vec4(a_position, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="shaderParticleRandoms">
precision highp float;
precision highp int;
precision highp usampler2D;

uniform vec2 resolution;
uniform uvec4 randomStepSeed;
uniform usampler2D particleRandoms;

in vec2 v_st;
in vec3 v_position;
out uvec4 randomColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  //vec2 uv = vec2(0.0,0.0);
  uvec4 texel = texture(particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

  uvec4 texels[4];
  texels[0] = texture(particleRandoms, texelCoords[0]);
  texels[1] = texture(particleRandoms, texelCoords[1]);
  texels[2] = texture(particleRandoms, texelCoords[2]);
  texels[3] = texture(particleRandoms, texelCoords[3]);

  uvec4 newTexel = (randomStepSeed ^ texel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3]);
  randomColor = uvec4(newTexel.x, newTexel.y, newTexel.z, 255); // TODO: fix alpha to max for integers
}
</script>

<script type="x-shader/x-fragment" id="shaderParticleUpdate">
  precision highp float;
  precision highp int;
  precision highp usampler2D;
  precision highp sampler2D;

  uniform vec2 resolution;
  uniform vec4 deltaTime;
  uniform usampler2D particleRandoms;
  uniform sampler2D particleBasics;

  in vec2 v_st;
  in vec3 v_position;
  out vec4 particleUpdate;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uvec4 pRandoms = texture(particleRandoms, uv);
    vec4 pBasics = texture(particleBasics, uv);

    particleUpdate = vec4(0.0,0.0,0.0,1.0);
  }

</script>

<script type="x-shader/x-vertex" id="shaderFieldVertex">

#define IDX_LOCATION 0

precision highp float;
precision highp int;
precision highp sampler2D;

uniform sampler2D particleBasics;

layout(location = IDX_LOCATION) in int a_index;

void main()
{
  ivec2 texSize = textureSize(particleBasics, 0);

  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  vec4 pBasics = texelFetch(particleBasics, texel, 0);

  gl_Position = vec4(pBasics.x, pBasics.y, 0.0, 1.0);
  gl_PointSize = 10.0;
}
</script>

<script type="x-shader/x-fragment" id="shaderFieldFragment">
precision highp float;
precision highp int;
precision highp sampler2D;

//uniform vec2 resolution;

out vec4 color;

void main()
{
  color = vec4(gl_FragCoord.x, gl_FragCoord.y, 0.3, 0.2);
}

</script>

<script type="x-shader/x-fragment" id="shaderTest">
precision highp float;
precision highp int;

in vec2 v_st;
in vec3 v_position;
out vec4 color;

void main()
{
    vec3 fdx = dFdx(v_position);
    vec3 fdy = dFdy(v_position);
    color = vec4(vec2(1.0, 1.0) - v_st, fract(fdx.x), 1.0);
    //color = vec4(v_st,0.5,1.0);
    //color = mix(color, vec4(N, 1.0), 0.5);
}
</script>

<script type="text/javascript" src="/js/gl-matrix.min.js"></script>
<script type="text/javascript" src="/js/gltf-loader.js"></script>
<script type="text/javascript" src="/js/3d/2017-04-17-brownian-motion.es6.js"></script>