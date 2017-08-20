---
title: "The Topography of a Field"
categories: "graphics"
tags: "graphics computer-science"
headline: "2D Particle Simulation"
excerpt: ""
author:
  name: "David Conner"
graphics_ui_layout: "graphics/2017-07-10-the-topography-of-a-field.html"
---

# Emitter with particles that follow a static field defined by particles

- onclick: background particles stop
- as user holds mouse, particles emerge from mouseclicks
- the paths are preserved as the particles travel outward from mouse xy
- should look like fireworks or something where the particles follow
the curvilinear space of the field
- this is pretty much a particle emitter where the particles follow and animate
the line integral
7

<pre class="highlight">Fragment Shader: fsParticles<code id="codeFsParticles"></code></pre>
<pre class="highlight">Vertex Shader: vsFields<code id="codeVsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsFields<code id="codeFsFields"></code></pre>

<script type="text/javascript" src="/js/3d/2017-07-10-the-topography-of-a-field.js"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var codeBlock = document.getElementById(codeBlockId);
    codeBlock.innerHTML = shaderCode;
    hljs.highlightBlock(codeBlock);
  }

//  pasteShaderToCodeBlock('fsUpdateParticles', 'codeFsParticles');
//  pasteShaderToCodeBlock('vsFields', 'codeVsFields');
//  pasteShaderToCodeBlock('fsFields', 'codeFsFields');
</script>
