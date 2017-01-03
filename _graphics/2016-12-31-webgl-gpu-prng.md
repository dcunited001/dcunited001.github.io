---
title: "A WebGL GPU PRNG"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

# PRNG with WebGL

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

### Fragment Shader: computeShaderRandoms

<p>
  <figure class="highlight">
    <pre>
      <code id="codeComputeShaderRandoms" class="language-c" data-lang="c">
      
      </code>
    </pre>
  </figure>
</p>

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
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float color = uv.x * uv.y / 256.0 * 256.0;
    //gl_FragColor = vec4(color, 1.0 - color, 63, 1);
    gl_FragColor = texture2D(texRandom, uv);
  }</script>

<!--<script type="x-shader/x-vertex" id="hmmm">-->

<!--</script>-->

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2016-12-31-webgl-gpu-prng.js" type="text/javascript"></script>

<script type="text/javascript">
  var codeComputeShaderRandoms = document.getElementById("computeShaderRandoms").textContent;
  codeComputeShaderRandoms = '<span class="p">' + 
    codeComputeShaderRandoms.split('\n').join('</span>\n<span class="p">') + 
    '</span>';
  document.getElementById("codeComputeShaderRandoms").innerHTML = codeComputeShaderRandoms;
</script>
