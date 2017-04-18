---
title: "Brownian Motion"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---

## Requires ES6 & WebGL2

<script type="x-shader/x-vertex" id="vertexPassthrough">#version 300 es
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 1

layout(location = POSITION_LOCATION) in vec3 a_position;
layout(location = TEXCOORD_LOCATION) in vec2 a_texcoord;

out vec2 v_st;
out vec3 v_position;

void main() {
  v_position = vec3(position);
  gl_Position = vec4(position, 1.0);
}
</script>

<p>
  <figure class="highlight">
    <pre>
      <code id="codeRandoms" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderRandoms">#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;

uniform vec2 resolution;
uniform uvec4 randomStepSeed;
uniform usampler2D texRandom;

in vec2 v_st;
in vec3 v_position;
out uvec4 color;

void main() {
  //vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 uv = vec2(0.0,0.0);
  uvec4 texel = texture(texRandom, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

  uvec4 texels[4];
  texels[0] = texture(texRandom, texelCoords[0]);
  texels[1] = texture(texRandom, texelCoords[1]);
  texels[2] = texture(texRandom, texelCoords[2]);
  texels[3] = texture(texRandom, texelCoords[3]);

  uvec4 newTexel = randomStepSeed ^ texel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3];

  color = uvec4(newTexel.x, newTexel.y, newTexel.z, 255); // TODO: fix alpha to max for integers
}
</script>



<p>
  <figure class="highlight">
    <pre>
      <code id="codeVertex" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-vertex" id="shaderVertex">#version 300 es
#define POSITION_LOCATION 0
#define TEXCOORD_LOCATION 1

precision highp float;
precision highp int;
uniform mat4 mvMatrix;
uniform mat4 pMatrix;
uniform sampler2D displacementMap;

layout(location = POSITION_LOCATION) in vec3 position;
layout(location = TEXCOORD_LOCATION) in vec2 texcoord;

out vec2 v_st;
out vec3 v_position;
void main()
{
    v_st = texcoord;
    float height = texture(displacementMap, texcoord).b;
    vec4 displacedPosition = vec4(position, 1.0) + vec4(normal * height, 0.0);
    v_position = vec3(mvMatrix * displacedPosition);
    gl_Position = pMatrix * mvMatrix * displacedPosition;
}
</script>


<p>
  <figure class="highlight">
    <pre>
      <code id="codeFragment" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderFragment">#version 300 es

precision highp float;
precision highp int;
precision highp sampler2D;
uniform sampler2D diffuse;

in vec2 v_st;
in vec3 v_position;
out vec4 color;

float textureLevel(in sampler2D sampler, in vec2 v_st)
{
    vec2 size = vec2(textureSize(sampler, 0));
    float levelCount = max(log2(size.x), log2(size.y));
    vec2 dx = dFdx(v_st * size);
    vec2 dy = dFdy(v_st * size);
    float d = max(dot(dx, dx), dot(dy, dy));
    d = clamp(d, 1.0, pow(2.0, (levelCount - 1.0) * 2.0));
    return 0.5 * log2(d);
}
void main()
{
    vec2 sampleCoord = fract(v_st.xy);
    float level = textureLevel(diffuse, v_st);
    // Compute LOD using gradient
    color = textureLod(diffuse, v_st, level);
    // Compute flat normal using gradient
    vec3 fdx = dFdx(v_position);
    vec3 fdy = dFdy(v_position);
    vec3 N = normalize(cross(fdx, fdy));
    color = mix(color, vec4(N, 1.0), 0.5);
}

</script>

<script type="text/javascript" src="/js/gl-matrix.min.js"></script>
<script type="text/javascript" src="/js/gltf-loader.js"></script>
<script type="text/javascript" src="/js/3d/2017-04-17-brownian-motion.es6.js"></script>