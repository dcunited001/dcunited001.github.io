---
title: "Brownian Motion with WebGL Particle Shader"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

# Fragment Shader: shaderVelocity

This shader generates a random velocity for each particle. The particle's
velocity determines its position in the next shader, depending on `∂t`.

<p>
  <figure class="highlight">
    <pre>
      <code id="codeShaderVelocity" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderVelocity">
  uniform float randomStepSeed;
  uniform float deltaT;

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

    vec4 newTexel = fract(3.0 * texel -
      fract(5.0  * texels[0]) +
      fract(7.0  * texels[1]) -
      fract(11.0 * texels[2]) +
      fract(13.0 * texels[3] * randomStepSeed));

    gl_FragColor = vec4(newTexel.x, newTexel.y, newTexel.z, 1.0);
</script>

# Fragment Shader: shaderPosition

Technically, a separate step is not needed, but who cares ... except
for that guy. Do you really want to be that guy? ... lulz (i'm that guy)

Actually, an unnecessary intermediate texture in the middle of a graphics
pipeline is a potential bottleneck, but in this case, may provide for
more flexibility later on.

<p>
  <figure class="highlight">
    <pre>
      <code id="codeShaderPosition" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderPosition">
  uniform float randomStepSeed;
  uniform float deltaT;

  void main() {

  }
</script>

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-08-brownian-motion-with-webgl-particle-shader.js" type="text/javascript"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var processedCode = '<span class="p">' +
        shaderCode .split('\n').join('</span>\n<span class="p">') +
        '</span>';
    document.getElementById(codeBlockId).innerHTML = processedCode;
  }
</script>
