---
title: "A Terrible GPU RNG With WebGL"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

# PRNG with WebGL

### Fragment Shader: computeShaderRandoms

<p>
  <figure class="highlight">
    <pre>
      <code id="codeComputeShaderRandoms" class="language-c" data-lang="c">
      
      </code>
    </pre>
  </figure>
</p>

### Floats 0 to 1

I need to identify the boundaries for floats, since colors are encoded from 
one to zero... That way I can xor all the things to my hearts content. 

I'll toss out floats that are exactly equal to one because IDGAF.

#### + zero

```
0:00000000 :0000000 00000000 00000000
```

#### < one

```
0:01111110 :1111111 11111111 11111111
```

#### == one

```
0:01111111 :0000000 00000000 00000000
```

#### exclusion mask

```
1:10000001 :0000000 00000000 00000000
```

#### inclusion mask

```
0:01111110 :1111111 11111111 11111111
```


<!--<script type="x-shader/x-vertex" id="vertCube">-->
  <!--void main() {-->
    <!--vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);-->
    <!--gl_Position = projectionMatrix * mvPosition;-->
  <!--}-->
<!--</script>-->

<!--<script type="x-shader/x-fragment" id="fragCube">-->
  <!--uniform sampler2D texture;-->
  <!--void main() {-->
    <!--gl_FragColor = texture2D(texture, gl_FragCoord.xy);-->
  <!--}-->
<!--</script>-->

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

<!--<script type="x-shader/x-vertex" id="hmmm">-->

<!--</script>-->

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-1-4-webgl-gpu-prng.js" type="text/javascript"></script>

<script type="text/javascript">
  var codeComputeShaderRandoms = document.getElementById("computeShaderRandoms").textContent;
  codeComputeShaderRandoms = '<span class="p">' + 
    codeComputeShaderRandoms.split('\n').join('</span>\n<span class="p">') + 
    '</span>';
  document.getElementById("codeComputeShaderRandoms").innerHTML = codeComputeShaderRandoms;
</script>
