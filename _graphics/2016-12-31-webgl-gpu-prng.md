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



<script id="computeShaderRandoms" type="x-shader/x-fragment">
  uniform sampler2D textureRandom;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = texture2D(textureRandom, uv);
  }
</script>

<!--<script type="x-shader/x-vertex" id="hmmm">-->

<!--</script>-->

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2016-12-31-webgl-gpu-prng.js" type="text/javascript"></script>
