---
title: "A Terrible GPU RNG With WebGL"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

This is a basic parallelized random number generator written with
WebGL and ThreeJS. It is, however, a terrible random number generator,
although it could be improved. I've used ThreeJS, a javascript
graphics engine built on top of Canvas and WebGL, to seed a texture
from an array containing random floats.  The alpha channel of the
texture is one. The PRNG simply adds the values sampled from texture
for the current pixel to the pixels surrounding it with distance 1.
Then, the PRNG runs `fract()` to get the fractional part of the float
value for that pixels channels. Fract is explained below.

I hope to add some code soon that will verify the uniformity and
quality of PRNG distribution, along with allowing the user to modulate
parameters for it.  I will write some better variations on PRNG's soon
that are based on this concept, but this is a good enough "hello
world" for GPU PRNG.

The texture is simply 64x64, so the point can be more easily
visualized, but scales to 4096x4096 with no problems at ~30
fps. That's 30 x 4 x 4096 x 4096 random numbers per second.  Even
though the quality is suspect, that's about 2 Gigarands per second.
There is no delay from overhead related to WebGL calls and therefore,
adding a bit more state and calculation to the shader should not cause
delay.

Here's the shader code for the PRNG. The ThreeJS code to set this up
can be found [here](/js/3d/2017-01-04-webgl-gpu-prng.js).

### Fragment Shader: computeShaderRandoms

<p>
  <figure class="highlight">
    <pre>
      <code id="codeComputeShaderRandoms" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="computeShaderRandoms">
  void main() {
    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    vec4 texel = texture2D(texRandom, uv);

    vec2 texelCoords[4];
    texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

    vec4 texels[4];
    texels[0] = texture2D(texRandom, texelCoords[0]);
    texels[1] = texture2D(texRandom, texelCoords[1]);
    texels[2] = texture2D(texRandom, texelCoords[2]);
    texels[3] = texture2D(texRandom, texelCoords[3]);

    vec4 newTexel = fract(texel + texels[0] + texels[1] + texels[2] + texels[3]);
    gl_FragColor = vec4(newTexel.x, newTexel.y, newTexel.z, 1.0);
  }</script>

<script type="x-shader/x-fragment" id="computeShaderRandomsNoMutate">
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float color = uv.x * uv.y / resolution.x * resolution.y;
    //gl_FragColor = vec4(color, 1.0 - color, 63, 1);
    vec4 colorTransform = vec4(color, 1.0 - color, 63, 0.75);
    //gl_FragColor = abs(colorTransform - texture2D(texRandom, uv));
    gl_FragColor = texture2D(texRandom, uv);
  }</script>

<script type="x-shader/x-fragment" id="computeShaderRandomsStrobe">
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float color = uv.x * uv.y / 256.0 * 256.0;
    //gl_FragColor = vec4(color, 1.0 - color, 63, 1);
    vec4 colorTransform = vec4(color, 1.0 - color, 63, 1);
    gl_FragColor = abs(colorTransform - texture2D(texRandom, uv));
  }</script>

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-04-webgl-gpu-prng.js" type="text/javascript"></script>

<script type="text/javascript">
  var codeComputeShaderRandoms = document.getElementById("computeShaderRandoms").textContent;
  codeComputeShaderRandoms = '<span class="p">' +
    codeComputeShaderRandoms.split('\n').join('</span>\n<span class="p">') +
    '</span>';
  document.getElementById("codeComputeShaderRandoms").innerHTML = codeComputeShaderRandoms;
</script>
