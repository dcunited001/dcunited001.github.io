---
title: "Conway's Game of Parallel Life"
categories: "graphics"
tags: "graphics computer-science"
headline: "In which Conway lives multiple lives in parallel"
excerpt: ""
author:
  name: "David Conner"
graphics_ui_layout: "graphics/2017-01-05-conways-game-of-parallel-life.html"
---

- [Garden of Eden](https://en.wikipedia.org/wiki/Garden_of_Eden_(cellular_automaton))
- [3D Game of Life](http://gameoflife.samuellevy.com/)

Interestingly, OSX notifies the browser to become active and process
events when the miniturized preview is displayed during OS UI transitions.
When you do the 'four-finger touch' to choose desktops, all browsers
receive notifications to become active again, but otherwise remain
paused. It's as if all desktops are visible.

#### Click Canvas to Step Through When Paused

- TODO: implement starting data sets
- TODO: implement restart button
- TODO: fix data randomization
- TODO: finish themes
- TODO: add randomized theme
- TODO: add timed theme swapping behavior
- TODO: add uniforms to swap out shaders for rule sets
- TODO: add UI sliders to change rule sets
- TODO: map screen space to cube face space to allow click & drag to create new cells
- TODO: Game of Life in 3D Tesselated Hexacgonal Cube Lattice ...

<pre class="highlight">Fragment Shader: shaderConway1<code id="codeShaderConway1"></code></pre>
<pre class="highlight">Fragment Shader: fragCube<code id="codeShaderConwayColor"></code></pre>

<script type="x-shader/x-fragment" id="shaderConway1">void main() {
    int populatedSolitude = 1;
    int populatedOvercrowded = 4;
    int unpopulatedCreate = 3;

    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    vec4 texel = texture2D(game, uv);

    vec2 texelCoords[8];
    texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[2] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[3] = mod(gl_FragCoord.xy + vec2( 1.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[4] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[5] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[6] = mod(gl_FragCoord.xy + vec2(-1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[7] = mod(gl_FragCoord.xy + vec2(-1.0, -1.0), resolution.xy) / resolution.xy;

    vec4 texels[8];
    int neighborCount = 0;
    for (int i=0; i<8; i++) {
      texels[i] = texture2D(game, texelCoords[i]);

      // not sure how to avoid conditional/ternary here
      // - but the GPU always has to execute both paths and cannot do so simultaneously
      neighborCount += ((texels[i].x > 0.0) ? 1 : 0);
    }

    vec4 newFragColor = vec4(0.0, texel.y, 0.0, 1.0);
    if (texel.x > 0.0) { // if populated
      if (neighborCount > populatedSolitude && neighborCount < populatedOvercrowded) {
        newFragColor.x = texel.x + 1.0; // cell ages
        //newFragColor.x = 1.0;
      } else { // cell dies
        newFragColor.x = 0.0;
        newFragColor.y = 0.5;
      }
    } else {
      if (neighborCount == unpopulatedCreate) {
        newFragColor.x = 1.0;
        newFragColor.y = 0.0;
      } else {
        newFragColor.x = 0.0;
        if (newFragColor.y > 0.0) {
          newFragColor.y = texel.y - 0.02;
        }
      }
    }

    gl_FragColor = newFragColor;

  }
</script>

<script type="x-shader/x-fragment" id="shaderConwayColor">uniform vec4 colorMap[16];

  void main() {
    vec4 texel = texture2D(game, gl_FragCoord.xy / resolution.xy);
    int colorId = int(texel.x);

    // NOTE: fails because cannot access array without CONSTANT value
    // gl_FragColor = colorMap[colorId];

    // therefore, this approach is required
    gl_FragColor = colorMap[0];
    for (int i=0; i<16; i++) {
      // conditional statements like this are less than ideal...
      if (colorId == i) {
        gl_FragColor = colorMap[i];
      }
    }

    if (texel.y > 0.0) {
      gl_FragColor = mix(colorMap[0], colorMap[1], texel.y);
    }
  }
</script>

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-05-conways-game-of-parallel-life.js" type="text/javascript"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var codeBlock = document.getElementById(codeBlockId);
    codeBlock.innerHTML = shaderCode;
    hljs.highlightBlock(codeBlock);
  }

  pasteShaderToCodeBlock('shaderConway1', 'codeShaderConway1');
  pasteShaderToCodeBlock('shaderConwayColor', 'codeShaderConwayColor');
</script>
