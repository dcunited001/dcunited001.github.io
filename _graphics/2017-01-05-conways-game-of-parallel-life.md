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

<p>
  <figure class="highlight">
    <pre>
      <code id="codeShaderConwayOne" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

<script type="x-shader/x-fragment" id="shaderConway1">
  uniform mat4 colorMap;

  void main() {

    int populatedSolitude = 1;
    int populatedOvercrowde = 4;
    int unpopulatedCreate = 3;

    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    vec4 texel = texture2D(texRandom, uv);

    vec2 texelCoords[8];
    texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[2] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[3] = mod(gl_FragCoord.xy + vec2( 1.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[4] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[5] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[6] = mod(gl_FragCoord.xy + vec2(-1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[7] = mod(gl_FragCoord.xy + vec2(-1.0, -1.0), resolution.xy) / resolution.xy;



    //TODO: color map



  }</script>


<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-05-conways-game-of-parallel-life.js" type="text/javascript"></script>

<script type="text/javascript">
  var codeComputeShaderRandoms = document.getElementById("shaderConwayOne").textContent;
  codeShaderConwayOne = '<span class="p">' +
    codeComputeShaderRandoms.split('\n').join('</span>\n<span class="p">') +
    '</span>';
  document.getElementById("codeShaderConwayOne").innerHTML = codeShaderConwayOne;
</script>
