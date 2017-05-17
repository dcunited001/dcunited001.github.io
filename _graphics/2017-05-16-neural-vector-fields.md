---
title: "Neural Vector Fields"
categories: "graphics"
tags: "graphics computer-science"
headline: ""
excerpt: ""
author:
name: "David Conner"
---

####  Requires ES6 & WebGL 2.0 &#x2605; Runs Best In Firefox (and Chrome) &#x2605; Does Not Run On Mobile

<div class="row">
  <div class="col-sm-3">
    <label for="particle-count">Particle Count:</label>
    <input id="particle-count" type="range" min="128" max="10240" step="128" value="1024"/>
  </div>
  <div class="col-sm-3">
    <label for="particle-speed">Particle Speed:</label>
    <input id="particle-speed" type="range" min="0.025" max="10.0" step="0.025" value="0.050"/>
  </div>
  <div class="col-sm-3">
    <label for="rotation-speed">Rotation Speed:</label>
    <input id="rotation-speed" type="range" min="0.0" max="20.0" step="0.25" value="0.5"/>
  </div>
  <div class="col-sm-3">
    <label for="r-coefficient">R-Force Coefficient:</label>
    <input id="r-coefficient" type="range" min="0.025" max="10.0" step="0.025" value="1.0"/>
  </div>
</div>

<!-- TODO: enable/disable display of particle colors -->

<!--<div class="row">-->
  <!--<label><input type="radio" id="radio-effect" onchange="loadEffect('neural-vector-fields')" checked>Neural Vector Fields</label>-->
  <!--<label><input type="radio" id="radio-effect" onchange="loadEffect('pillars-of-creation')">Pillars of Creation</label>-->
<!--</div>-->

# Overview

This is a particle shader where the particles exhibit a force on a
field, which is rendered to a texture.  It's kind of a hello world for
molecular dynamics. In this simulation, the field does not change the
movement of particles. That involves gradient descent, which I will
focus on next. In this animation, the motion of particles is similar
to the [Brownian Motion](/graphics/) shader I just wrote. Here it's
like a polar version of Brownian Motion, where the random numbers that
are generated alter the forward motion of the particles and the
rotation of each.  In this way, the particles have a rotational
orientation, which is important later on and in particular for the
implementation of gradient descent that I will use. This kind of
gradient descent is quite a bit more difficult than normal.

The long term goal of this series on graphics simulations is a social
physics simulation, where the particles exhibit a non-directional
repulsive force and a directional attractive force. This force is
calculated on two shared fields and balanced to produce equilibrium,
so that the particles form molecule-like "conversations." Then,
"programs" can be written "within" the simulation, which are
essentially probabilistic state machines. These allow the exchange of
information and the difference in behavior of various particles types
to be observed. Utilizing Delauney Triangulation and Quad Trees, the
ways in which particles are able to exchange can be greatly expanded.

# Challenges

### Avoiding Use of Blending

The correct way to render the field textures is by using blending,
which I tried to use on the brownian motion shader. Configuring
blending with transparent particles is a bit tricky in 2D, since in 3D
the particle can be sorted and drawn back to front. I ran into
problems doing this and decided to implement it in a different way,
which is much less performant, but still creative.

### Rendering ParticleId and Joining Textures

To avoid blending, I employed a bit of relational algebra and took a
page from SQL. I rendered the particles first, writing the
`particleId` to just one pixel each. This is rendered to a texture
after the particles have their position updated. Then, in the
`fsFields` shader, I join the `particles` and `particleIds` texture.

There is a drawback, which is that occasionally two particles can
overlap, leading to an inaccurately generated field. However, for the
purpose of calculating a shared field used to update the particle
positions, this is fine: with properly tuned parameters, equilibria is
produced, the particles repel and no two particles should ever occupy
the same pixel. If they do, then the particles are still update as
though they are in slightly separate positions, so no two particles
would ever get "stuck" together in the same pixel.

### Improving the Speed

The problem with this implementation is that it's slow. This is
because of the for loop in the `fsFields` shader. I expected there to
be large performance hits. To avoid these, I need to properly
configure blending to minimize the number of pixels rastered. This
will be much better and much simpler in the end.  With a `ballSize` of
21, there is a loop of 445 iterations on every pixel drawn in
`fsFields`.

### Checking Rasterization of ParticleId

To get the `particleId` joining solution working, this required
forcing rasterization of only one pixel in vsParticleId & fsParticleId
shaders. This the motivation behind the following lines:

{% highlight js %}

particle.x = (trunc(particle.x * u_resolution.x) + 0.5) / u_resolution.x;
particle.y = (trunc(particle.y * u_resolution.y) + 0.5) / u_resolution.y;

{% endhighlight %}

Ensuring that each particle only resulting in one pixel draw is
absolutely essential for an accurate field being drawn. I wanted to
minimize debugging math errors in runtime, so to check the output of
the `fsParticleId` shaders, I debugged it with the following lines of
code:

{% highlight js %}

// after using readPixels() to copy pixels from the particleId framebuffer
var maxIntFloat = 2147483647;
var renderedPixels = texContainer.reduce((a,v,i) => { if (v != 0 && v != 2147483647) { a.push([i,v]); } return a}, []);
var particleIdCounts = renderedPixels.reduce((a,v) => { a[v[1]] = (a[v[1]] || 0) + 1 ; return a }, {});

{% endhighlight %}

With this code, I was able to check that there were slightly less than
1024 counts, where the sum in the hash `particleIdCounts` was exactly
one for every pixel. There would be slightly less than 1024 counts for
1024 pixels because of the chance that two particles could be rendered
to the same pixel and overwritten. This is fine, but I needed to
ensure that no single particle would result in the rasterization of
more than one pixel. This is a creative approach to solving the
problem, but ended up being less performant than necessary.

<pre class="highlight">Fragment Shader: fsParticle<code id="codeFsParticle"></code></pre>
<pre class="highlight">Vertex Shader: vsParticleId<code id="codeVsParticleId"></code></pre>
<pre class="highlight">Fragment Shader: fsParticleId<code id="codeFsParticleId"></code></pre>
<pre class="highlight">Fragment Shader: fsFields<code id="codeFsFields"></code></pre>
<pre class="highlight">Fragment Shader: fsRenderFields<code id="codeFsRenderFields"></code></pre>

<script type="x-shader/x-vertex" id="vsPass">
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec2 a_texcoord;

out vec2 v_st;
out vec3 v_position;

void main() {
  v_st = a_texcoord;
  v_position = a_position;
  gl_Position = vec4(a_position, 1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsParticle">
uniform vec2 u_resolution;
uniform ivec4 u_randomSeed;
uniform float u_particleSpeed;
uniform float u_rotationSpeed;
uniform vec4 u_deltaTime;

uniform isampler2D s_particleRandoms;
uniform sampler2D s_particles;

in vec2 v_st;
in vec3 v_position;

layout(location = 0) out ivec4 random;
layout(location = 1) out vec4 particle;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // =======================================
  // Update Randoms
  // =======================================

  ivec4 randomTexel = texture(s_particleRandoms, uv);

  vec2 texelCoords[4];
  texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -2.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), u_resolution.xy) / u_resolution.xy;
  texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), u_resolution.xy) / u_resolution.xy;

  ivec4 texels[4];
  texels[0] = texture(s_particleRandoms, texelCoords[0]);
  texels[1] = texture(s_particleRandoms, texelCoords[1]);
  texels[2] = texture(s_particleRandoms, texelCoords[2]);
  texels[3] = texture(s_particleRandoms, texelCoords[3]);

  ivec4 newRandom = u_randomSeed ^ randomTexel ^ texels[0] ^ texels[1] ^ texels[2] ^ texels[3];
  random = newRandom;

  // =======================================
  // Update Particles
  // =======================================

  vec4 newRandomFloat = fract(vec4(newRandom) / maxIntFloat + 0.5) - 0.5;
  particle = texture(s_particles, uv);

  particle.z += newRandomFloat.z * u_rotationSpeed * u_deltaTime.x / 1000.0;
  float stepLength = (newRandomFloat.w + 0.5) * u_particleSpeed * u_deltaTime.x / 1000.0;

  particle.x += cos(particle.z) * stepLength;
  particle.y += sin(particle.z) * stepLength;

  particle.x = mod(particle.x + 1.0, 2.0) - 1.0;
  particle.y = mod(particle.y + 1.0, 2.0) - 1.0;
}
</script>

<script type="x-shader/x-fragment" id="vsParticleId">
uniform vec2 u_resolution;
uniform sampler2D s_particles;

layout(location = 0) in int a_index;

flat out int v_particleId;
out float v_pointSize;
out vec4 v_position;

const float maxIntFloat = 2147483647.0;

void main()
{
  // textureSize must return ivec & texelFetch must accept ivec
  ivec2 texSize = textureSize(s_particles, 0);
  ivec2 texel = ivec2(a_index % texSize.x, a_index / texSize.x);
  vec4 particle = texelFetch(s_particles, texel, 0);

  // This needs to write to exactly one pixel (otherwise FML)
  // - it appears to rasterize only one pixel with/without the 0.5 constant
  particle.x = (trunc(particle.x * u_resolution.x) + 0.5) / u_resolution.x;
  particle.y = (trunc(particle.y * u_resolution.y) + 0.5) / u_resolution.y;

  v_particleId = a_index;
  v_position = vec4(particle.x, particle.y, 0.0, 1.0);

  gl_Position = v_position;
  gl_PointSize = 1.0;
}
</script>

<script type="x-shader/x-fragment" id="fsParticleId">
flat in int v_particleId;
in vec4 v_position;

out ivec4 color;

const int maxInt = 2147483647;

void main() {
  color = ivec4(v_particleId, 0, 1, maxInt);
}
</script>

<script type="x-shader/x-fragment" id="fsFields">
uniform vec2 u_resolution;
uniform int u_ballSize;
uniform float u_rCoefficient;

uniform sampler2D s_particles;
uniform isampler2D s_particleIds;

layout(location = 0) out vec4 repelField;
layout(location = 1) out vec4 repelComp;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  int ballSizeOffset = - u_ballSize / 2;
  ivec2 particlesSize = textureSize(s_particles, 0);

  repelField = vec4(0.0, 0.0, 0.0, 1.0);
  repelComp = vec4(0.0, 0.0, 0.0, 1.0);

  for (int i = ballSizeOffset; i <= ballSizeOffset + u_ballSize; i++) {
    for (int j = ballSizeOffset; j <= ballSizeOffset + u_ballSize; j++) {
      vec2 texelCoords = mod(gl_FragCoord.xy + vec2(float(i), float(j)), u_resolution.xy) / u_resolution.xy;
      ivec4 particleId = texture(s_particleIds, texelCoords);

      if (particleId.z == 1) { // if particleId is defined
        ivec2 particleUV = ivec2(particleId.x % particlesSize.x, particleId.x / particlesSize.x);
        vec4 particle = texelFetch(s_particles, particleUV, 0);

        vec2 uvScreenSpace = 2.0 * (uv - vec2(0.5,0.5));
        float d = distance(particle.xy, uvScreenSpace) * distance(vec2(0.0, 0.0), u_resolution.xy);
        vec2 particleToUV = particle.xy - uvScreenSpace;
        float rad = atan(particleToUV.y / particleToUV.x);
        vec2 rForce = vec2(cos(rad), sin(rad)) / d;

        repelField.xy += u_rCoefficient * rForce;
        repelComp.x += distance(vec2(0.0,0.0), u_rCoefficient * rForce);
      } else {
        // ¯\_(ツ)_/¯ wut warps
      }
    }
  }
}
</script>

<script type="x-shader/x-fragment" id="fsRenderFields">
uniform vec2 u_resolution;
uniform float u_rCoefficient;

uniform sampler2D s_repelField;
uniform sampler2D s_repelComp;

uniform isampler2D s_particleIds;

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  vec4 rForce = texture(s_repelField, uv);
  vec4 rComp = texture(s_repelComp, uv);

  ivec4 particleId = texture(s_particleIds, uv);

  // "neural vector fields"
  color = vec4(
    distance(vec2(0.0,0.0), rForce.xy),
    float(particleId.x % 8) / 8.0,
    rComp.x,
    1.0);

  // "pillars of creation"
  //color = vec4(
    //10.0 * rForce.x,
    //10.0 * rForce.y,
    //rComp.x,
    //1.0);
}
</script>

<script type="x-shader/x-fragment" id="fsDebugParticleIds">
uniform vec2 u_resolution;
uniform isampler2D s_particleIds;

out vec4 color;

const float maxIntFloat = 2147483647.0;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  ivec4 particleInt = texture(s_particleIds, uv);
  //vec4 particle = fract(vec4(particleInt) / 128.0);
  vec4 particle = vec4(particleInt) / maxIntFloat;

  //color = vec4(1.0, 1.0, 0.0, 1.0);
  color = vec4(particle.rgb, 1.0);
}
</script>

<script type="text/javascript" src="/js/3d/2017-05-15-neural-vector-fields.js"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var codeBlock = document.getElementById(codeBlockId);
    codeBlock.innerHTML = shaderCode;
    hljs.highlightBlock(codeBlock);
  }

  pasteShaderToCodeBlock('fsParticle','codeFsParticle');
  pasteShaderToCodeBlock('vsParticleId','codeVsParticleId');
  pasteShaderToCodeBlock('fsParticleId','codeFsParticleId');
  pasteShaderToCodeBlock('fsFields','codeFsFields');
  pasteShaderToCodeBlock('fsRenderFields','codeFsRenderFields');
</script>
