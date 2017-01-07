---
title: "Conway's Game of Parallel Life"
categories: "graphics"
tags: "graphics computer-science"
headline: "In which Conway lives multiple lives in parallel"
excerpt: ""
author:
  name: "David Conner"
---

<div class="row">
  <div class="col-sm-3 col-xs-6">
    <div class="btn-group">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Colors<span class="caret"></span></button>
      <ul class="dropdown-menu">
        <li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="game">Game</a></li>
        <li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="dos">DOS</a></li>
        <li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="apple">Apple</a></li>
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="zenburn">Zenburn</a></li>-->
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="sanity-inc">Sanity Inc</a></li>-->
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="monokai">Monokai</a></li>-->
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="moe">Moe</a></li>-->
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="solarized">Solarized</a></li>-->
        <li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="cyberpunk">Cyberpunk</a></li>
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="sublime-text">Sublime Text</a></li>-->
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="vibrant-ink">Vibrant Ink</a></li>-->
        <li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="random">Random</a></li>
        <!--<li><a onclick="onClickColorProfile(this.attributes['data-profile-name'].value)" data-profile-name="wink">;)</a></li>-->
      </ul>
    </div>
  </div>

  <div class="col-sm-3 col-xs-6">
    <div class="btn-group">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">Initial Data<span class="caret"></span></button>
      <ul class="dropdown-menu">
        <li><a href="#">Random</a></li>
        <li><a href="#">X</a></li>
        <li><a href="#">Y</a></li>
        <li role="separator" class="divider"></li>
        <li><a href="#">Z</a></li>
      </ul>
    </div>
  </div>

  <div class="col-sm-3 col-xs-6"><button id="btn-pause" class="btn btn-default" onclick="togglePause()">Pause</button></div>
  <div class="col-sm-3 col-xs-6"><button id="btn-restart" class="btn btn-default" onclick="onClickRestart()">Restart</button></div>

  <!-- TODO: dropdown to seed with specific starting sets -->
  <!-- TODO:  -->
</div>
<div class="row">
  <div class="col-sm-3 col-xs-6"><input id="conway-color-1"  class="jscolor" value="#000000" data-color-id="0"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-2"  class="jscolor" value="#44891A" data-color-id="1"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-3"  class="jscolor" value="#A3CE27" data-color-id="2"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-4"  class="jscolor" value="#2F484E" data-color-id="3"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
</div>
<div class="row">
  <div class="col-sm-3 col-xs-6"><input id="conway-color-5"  class="jscolor" value="#005784" data-color-id="4"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-6"  class="jscolor" value="#31A2F2" data-color-id="5"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-7"  class="jscolor" value="#B2DCEF" data-color-id="6"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-8"  class="jscolor" value="#E06F8B" data-color-id="7"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
</div>
<div class="row">
  <div class="col-sm-3 col-xs-6"><input id="conway-color-9"  class="jscolor" value="#BE2633" data-color-id="8"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-10" class="jscolor" value="#EB8931" data-color-id="9"  onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-11" class="jscolor" value="#F7E26B" data-color-id="10" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-12" class="jscolor" value="#A46422" data-color-id="11" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
</div>
<div class="row">
  <div class="col-sm-3 col-xs-6"><input id="conway-color-13" class="jscolor" value="#493C2B" data-color-id="12" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-14" class="jscolor" value="#1B2632" data-color-id="13" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-15" class="jscolor" value="#9D9D9D" data-color-id="14" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
  <div class="col-sm-3 col-xs-6"><input id="conway-color-16" class="jscolor" value="#FFFFFF" data-color-id="15" onchange="changeColorUniforms(this.attributes['data-color-id'].value, this.value);" /></div>
</div>

#### Click Canvas to Step Through When Paused

- TODO: finish themes
- TODO: fix restart button
- TODO: implement starting data sets
- TODO: fix texel (u,v) mapping for fragCube

# Fragment Shader: shaderConway1

<p>
  <figure class="highlight">
    <pre>
      <code id="codeShaderConway1" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderConway1">
  uniform vec4 colorMap[16];

  void main() {

    int populatedSolitude = 1;
    int populatedOvercrowded = 4;
    int unpopulatedCreate = 3;

    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    vec4 texel = texture2D(texConway, uv);

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
      texels[i] = texture2D(texConway, texelCoords[i]);

      // not sure how to avoid conditional/ternary here
      // - but the GPU always has to execute both paths and cannot do so simultaneously
      neighborCount += ((texels[i].x > 0.0) ? 1 : 0);
    }

    vec4 newFragColor = vec4(0.0, 0.0, 0.0, 1.0);
    if (texel.x > 0.0) { // if populated
      if (neighborCount > populatedSolitude && neighborCount < populatedOvercrowded) {
        newFragColor.x = texel.x + 1.0; // cell ages
        //newFragColor.x = 1.0;
      } else { // cell dies
        // TODO: implement "aging" rules
        newFragColor.x = 0.0;
      }
    } else {
      if (neighborCount == unpopulatedCreate) {
        newFragColor.x = 1.0;
      } else {
        newFragColor.x = 0.0;
      }
    }

    gl_FragColor = newFragColor;

  }</script>


# Vertex Shader: vertCube

Just a passthrough shader for vertex positions.

<p>
  <figure class="highlight">
    <pre>
      <code id="codeVertCube" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-vertex" id="vertCube">
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    //gl_Position = vec4( position, 1.0 );
  }
</script>

# Fragment Shader: fragCube

Having some problems getting `ShaderMaterial` to work with a
`GPUComputeRenderer` at the moment. Doesn't seem to acknowledge that
there are different texel `uv` coordinates.

<p>
  <figure class="highlight">
    <pre>
      <code id="codeFragCube" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="fragCube">
  uniform sampler2D texture;
  uniform vec4 colorMap[16];

  void main() {

    //TODO: WHY ISN'T THE GL_FRAGCOORD ISN'T ASSOCIATED WITH THE FRAGMENT?
    int colorId = int(texture2D(texture, fract(gl_FragCoord.xy / resolution.xy / 4.0)).x);

    //int colorId = int(texture2D(texture, gl_FragCoord.xy / resolution.xy).x);
    //int colorId = int(texture2D(texture, gl_FragCoord.xy).x);

    // NOTE: fails because cannot access array without CONSTANT value
    // gl_FragColor = colorMap[colorId];

    gl_FragColor = colorMap[0];
    for (int i=0; i<16; i++) {
      // conditional statements like this are less than ideal...
      if (colorId == i) {
        gl_FragColor = colorMap[i];
      }
    }

    //gl_FragColor = vec4(gl_PointCoord.xy / resolution.xy, 0.0, 1.0);
    //gl_FragColor = vec4(gl_FragCoord.xy / resolution.xy, 0.0, 1.0);
    //gl_FragColor = vec4(fract(gl_PointCoord.xy * resolution.xy), 0.0, 1.0);
    //gl_FragColor = texture2D(texture, fract(gl_FragCoord.xy / resolution.xy));

    //gl_FragColor = texture2D(texture, gl_FragCoord.xy / resolution.xy);
    //vec4 texel = texture2D(texture, gl_FragCoord.xy / resolution.xy);
    //gl_FragColor = colorMap[1];
    //gl_FragColor = vec4(texel.x / 16.0, 0.5, 0.0, 1.0);

  }</script>

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-05-conways-game-of-parallel-life.js" type="text/javascript"></script>

<script type="text/javascript">

  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var processedCode = '<span class="p">' +
        shaderCode .split('\n').join('</span>\n<span class="p">') +
        '</span>';
    document.getElementById(codeBlockId).innerHTML = processedCode;
  }

  pasteShaderToCodeBlock('shaderConway1', 'codeShaderConway1');
  pasteShaderToCodeBlock('vertCube', 'codeVertCube');
  pasteShaderToCodeBlock('fragCube', 'codeFragCube');
</script>

- [Garden of Eden](https://en.wikipedia.org/wiki/Garden_of_Eden_(cellular_automaton))
- [3D Game of Life](http://gameoflife.samuellevy.com/)