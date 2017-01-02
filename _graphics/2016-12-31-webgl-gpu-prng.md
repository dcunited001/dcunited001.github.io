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

<script type="x-shader/x-vertex" id="vertCube">
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
</script>

<script type="x-shader/x-fragment" id="fragCube">
  uniform sampler2D texture;
  void main() {
    gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
  }
</script>

<script id="computeShaderRandoms" type="x-shader/x-fragment">
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture2D(texRandom, uv);
  }
</script>

<!--<script type="x-shader/x-vertex" id="hmmm">-->

<!--</script>-->

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2016-12-31-webgl-gpu-prng.js" type="text/javascript"></script>
