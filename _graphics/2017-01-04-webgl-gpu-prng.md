---
title: "A Terrible GPU PRNG With WebGL"
categories: "graphics"
tags: "crypto graphics computer-science math"
headline: "Random Number Generation with WebGL and ThreeJS"
excerpt: ""
author:
  name: "David Conner"
---

#### Click Canvas to Step Through When Paused

<div class="row">
  <div class="col-sm-3 col-xs-6">
    <button id="btn-pause" class="btn btn-default" onclick="togglePause()">Pause</button>
    <button id="btn-stats" class="btn btn-default" onclick="toggleStats()">Stats</button>
  </div>
</div>

<div class="row">
  <div class="col-sm-3 col-xs-6">
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-random-variable-1" checked onclick="changeStatsDisplayVars()"> X
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-random-variable-2" checked onclick="changeStatsDisplayVars()"> Y
    </label>
    <label class="checkbox-inline">
      <input type="checkbox" id="chk-random-variable-3" checked onclick="changeStatsDisplayVars()"> Z
    </label>
  </div>
</div>

- TODO: option to initialize with various seed values to demonstrate
  tendency to converge towards uniformity (though with suspect
  quality of randoms) A new PRNG has applications for energy efficient
  data science, math, finance & physics ... This PRNG? Probably not...
- TODO: histogram to demostrate value distribution
- TODO: GPU-friendly method of visualizing entropy and variance in

### Parallelized Random Number Generation in the Browser

#### Yes, the Prison of Zod Effect is Intentional...

This is a basic parallelized random number generator written with
WebGL and ThreeJS. It is, however, a terrible random number generator,
although it could be improved. I've used ThreeJS, a javascript
graphics engine built on top of Canvas and WebGL, to seed a texture
from an array containing random floats.  The alpha channel of the
texture is one. The PRNG simply adds the values sampled from texture
for the current pixel to the pixels surrounding it with distance 1.
Then, the PRNG runs `fract()` to get the fractional part of the float
value for that pixels channels. Fract is explained below.

I hope to add some code soon that will verify the uniformity and
quality of PRNG distribution, along with allowing the user to modulate
parameters for it.  I will write some better variations on PRNG's soon
that are based on this concept, but this is a good enough "hello
world" for GPU PRNG.

The texture is simply 64x64 so the point can be more easily
visualized, but scales to 4096x4096 with no problems at ~30 fps.
That's 30 x 4 x 4096 x 4096 random numbers per second.  Even though
the quality is suspect, that's about 2 Gigarands per second.  There is
no delay from overhead related to WebGL calls and therefore, adding a
bit more state and calculation to the shader should not cause delay.

Here's the shader code for the PRNG. The ThreeJS code to set this up
can be found [here](/js/3d/2017-01-04-webgl-gpu-prng.js).

<pre class="highlight">Fragment Shader: computeShaderRandoms<code id="codeComputeShaderRandoms"></code></pre>
<pre class="highlight">Fragment Shader: shaderStats<code id="codeShaderStats"></code></pre>

### Why Is This PRNG Terrible?

Actually, it's not so bad. If there were major problems with the
calculation, there would be noticeible shifts in the output. While the
problems with this approach are much more difficult to detect with the
human eye, problems with PRNG's rendered to a texture could leave a
discernible color shift.

This PRNG doesn't provides neither **Backtracking Resistance** nor
**Prediction Resistance**, so it's definitely not suitable for security
applications. It's efficency implies it may be more appropriate for
other applications dependent on large quantities of random numbers, such
as physics, lighting, finance and algorithms using monte carlo. However,
since it lacks prediction resistence, it would seem to have deficient
quality in randomness. The quality would be greatly improved by

However, this isn't really a PRNG, as it's randomness depends solely
on the seeded randoms from javascript's `Math.random()` function,
which I used for the input to the initial texture. But what's great
about sufficiently random seeds is that operating on them in specific
ways should yield sufficiently random output, with limited
state. State is a limiting factor for parallelized PRNG's, since GPU
handles various forms of memory in different ways. State must not be
mutated by the CPU/GPU in ways prohibitive to many design approaches
for parallel PRNG's.

This is why the Wallace Transform is useful: it is parallelizable and
it's "good enough" ... apparently. The approach in this blog isn't
exactly the Wallace transform, but that was the closest thing in
literature that I found that seemed to match the approach most
intuitive to me. I didn't want to look at the studies being done
because, to me, the fun is in discovering this stuff myself and so
looking is kind of like cheating, in a way. The only reason I looked
was because someone tried leading me by the nose to encourage me to
give up before completing anything that could be viewed on the web.

I was sent to a mental institution the next day ... for reading a
bible aloud, in front of a statue of Martin Luther, on the property of
a Christian university, and while a track meet of Christian colleges
was underway. I still can't get enough of this shit. I was reading
Romans 7 and 8. Don't judge. Coincidence? I don't really care.

Thanks Obama. I got TDO'd and someone had to pay a $10,400 bill for me
to attend a
[TDO kangaroo court](https://vacode.org/2016/37.2/3/8/4/37.2-809/) to
have my gun rights disrupted, which prevented me from joining the
military. THANKS OBAMA. I was not permitted to have access information
that would have helped me make better decisions in the "court"
hearing. I was rushed through and had less than a minute to talk to my
lawyer, who encouraged me to take a plea deal, which prevented me from
having ANY APPEALS RECOURSE.  Meanwhile, I am never given credit for
any of my strengths, like intelligence, creativity or stubbornness.

I don't actually know if any of this is Obama's fault, but holy shit,
the government paid $10,400 for me to be in that facility for eight
days, which was $10,000 more than I made in 2016! I don't have to file
taxes because I didn't even make $400 this year!  Meanwhile, it
appears the government is willing to pay anything to cover its own ass
for ruining my life, over and over and over again, all the while
interfering with my life.

Anyways, here's proof that I'm at least somewhat technically
competent. Oh an guess what? THIS WAS A "TDO" HEARING, WHICH
APPARENTLY NOW SHOWS UP ON MY CRIMINAL RECORD, FOR WHICH I HAD NO
RECOURSE, NO REPRESENTATION, AND INADEQUATE MEDICAL EVALUATION FOR TDO
-- AND IT SHOWS UP ON ANY FUCKING BACKGROUND CHECK.  Especially one a
military recruiter runs. And honestly, that is the cheapest way to get
a background check if you know why they ask the questions they do.

This is why I would make an excellent intellegence analyst. I knew
what was wrong with my three minute conversation with the recruiter
and I knew exactly what information he was seeing without needing him
to tell me. There was nothing wrong with how the recruiter handled the
situation: he was exposed to information on my criminal record for
which he was trained to handle in a specific way. I'm pissed at the
information now on my background check.

### Can the Government Get the Fuck Out of My Life?!

Stop pissing all over yourself just for me. It's not very becoming.
And if I could ever get a job without being bullied by the facility
security officer (FSO ... a role required by the FCL process DSS runs
for DoD contracting) then HOLY SHIT I might be so distracted, I
wouldn't even care.

And that's why I read Joint military doctrine at night. It's not just
to imagine how logistics are applied to manage thousands of people
across a large organization. It's not just because I wanted to join
the military. I read this stuff and other assorted government reports
because I want to know these people's decision making processes so
that when people lie to me, I know. You see, if you apply a
Clausewitzian perspective to my life, you'll find that, no matter what
happens, David Conner gets fucked in the butt. It doesn't matter how
it happens, but that is what happens.

That's Clauswitz for you. It's an effects-based paradigm for the
philosophy of military tactics that is especially important for
judging second-order and third-order effects from the application of
ways and means. It's not how David Conner gets fucked in the butt
that matters. It is that, in the end, David Conner gets a good poke
in the butt.

And I haven't even ventured into my understanding of the applictation
of the
[Laplacian to information systems](https://github.com/dcunited001/dcunited001.github.io/blob/sources/_drafts/facets-of-greatness-systems-theory.md),
coupled with an understanding of logistics, employee training and law,
which basically means I'm borderline psychic. And damaged goods,
psychologically speaking.

<script type="x-shader/x-fragment" id="computeShaderRandoms">
  uniform float randomStepSeed;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 texel = texture2D(varRandom, uv);

    vec2 texelCoords[4];
    texelCoords[0] = mod(gl_FragCoord.xy + vec2( 0.0, -1.0), resolution.xy) / resolution.xy;
    texelCoords[1] = mod(gl_FragCoord.xy + vec2( 1.0,  0.0), resolution.xy) / resolution.xy;
    texelCoords[2] = mod(gl_FragCoord.xy + vec2( 0.0,  1.0), resolution.xy) / resolution.xy;
    texelCoords[3] = mod(gl_FragCoord.xy + vec2(-1.0,  1.0), resolution.xy) / resolution.xy;

    vec4 texels[4];
    texels[0] = texture2D(varRandom, texelCoords[0]);
    texels[1] = texture2D(varRandom, texelCoords[1]);
    texels[2] = texture2D(varRandom, texelCoords[2]);
    texels[3] = texture2D(varRandom, texelCoords[3]);

    // multiply by primes and add/subract to counter a binary-additive color-shift...
    // - binary addition is simply a recursive bitwise xor + bitshift, which means that
    //   the probability of a change in leading digits is correlated to the number
    //   and position of sequential zeros. this makes it a bit harder to change one
    //   side or the other with simply additive functions...
    //   - the reasoning behind this is the same as why magnitude metrics (seismic, etc)
    //     are more likely to lead with a one or a lower digit than a higher digit.
    // - if i could xor, i wouldn't need this.
    // - also added a random seed,
    //   - it's the same for each step. that's not idea, but with bitcrunching functions,
    //     i can mix the numbers and seed(s) more randomly

    vec4 newTexel = fract(3.0 * texel -
      fract(5.0  * texels[0]) +
      fract(7.0  * texels[1]) -
      fract(11.0 * texels[2]) +
      fract(13.0 * texels[3] * randomStepSeed));

    gl_FragColor = vec4(newTexel.x, newTexel.y, newTexel.z, 1.0);
  }</script>

<script type="x-shader/x-fragment" id="shaderStats">
  uniform float showVariables;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 texels[ballArea];
    vec4 texelSum = vec4(0.0, 0.0, 0.0, 0.0);

    for (int i=0; i < ballSize; i++) {
      for (int j=0; j < ballSize; j++) {
        // a neighborhood w/ ball indexed down & right is mostly equivalent
        vec2 texelCoords = fract((gl_FragCoord.xy + vec2(i,j)) /resolution.xy);
        texels[i * ballSize + j] = texture2D(varRandom, texelCoords);
        texelSum = texelSum + texels[i * ballSize + j];
      }
    }

    vec4 texel = texelSum / vec4(ballArea, ballArea, ballArea, ballArea);
    bool showX = mod(showVariables, 2.0) < 1.0;
    bool showY = mod(showVariables, 3.0) < 1.0;
    bool showZ = mod(showVariables, 5.0) < 1.0;

    //showX = true;
    //showY = false;
    //showZ = false;

    // bitmask (additive) is a group parallel to n-coprimes (multiplicative)
    // - something i explored as a kid, encoding values with a kind of prime-binary
    // - i explored this because i didn't understand how Assembler could process/encode
    //   values *and* instructions in total binary. this was before i had ever
    //   programmed.
    // - OMFG WHY ARE BITMASKING OPS NOT INCLUDED IN WEBGL?
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);

    if (showX) {
      gl_FragColor.x = texel.x;
    } else {
      // TODO: mix texel value to appear more grey
      //gl_FragColor.x = 0.5;
    }

    if (showY) {
      gl_FragColor.y = texel.y;
    } else {
      //gl_FragColor.y = 0.5;
    }

    if (showZ) {
      gl_FragColor.z = texel.z;
    } else {
      //gl_FragColor.z = 0.5;
    }

    gl_FragColor.w = texel.w;
  }</script>

<script type="x-shader/x-fragment" id="shaderEntropyBool">
  void main() {

    // should return the 2d texture coord,
    // - but scaled properly for the 3rd dimension
    float numEvents = entropyDistEventOutcomes;
    numEvents = 4.0;

    vec2 texelUV = gl_FragCoord.xy / resolution.xy;
    vec4 texel = texture2D(varRandom, texelUV);
    texel = vec4(floor(texel * numEvents).xyz, texel.w);

    vec2 res = vec2(entropyDistEventOutcomes * resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / res;
    //float xzOffset = fract(uv.x * numEvents);
    float xzOffset = fract(uv.x * numEvents);

    //float xzOffset = float(int(u.x * numEvents) / int(numEvents)), numEvents);

    // there should be one pixel set to 'true' per x-z segment
    gl_FragColor.x = (xzOffset == texel.x ? 1.0 : 0.0);
    gl_FragColor.y = (xzOffset == texel.y ? 1.0 : 0.0);
    gl_FragColor.z = (xzOffset == texel.z ? 1.0 : 0.0);

    gl_FragColor.x = xzOffset;
    gl_FragColor.w = 1.0;
    //vec4 texels[];
  }
</script>


<script type="x-shader/x-fragment" id="shaderEntropyDist">
  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
</script>

<script type="x-shader/x-fragment" id="shaderEntropy">
  uniform float showVariables;

  void main() {
    vec2 res = vec2(entropyDistEventOutcomes * resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / res;

    gl_FragColor = vec4(uv, 0.0, 0.0);
    //gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
</script>


### The Fract() Function: Floats Zero through One

I need to identify the boundaries for floats, since colors are encoded
from one to zero... That way I can xor all the things to my hearts
content. Or so I thought...

Fract is a function for OpenGL that truncates floats to return the
value from zero to one. I'm glad I found `fract()` because otherwise I
was going to need to stomp whoever left bitcrunching functions out of
WebGL.  C'est vrai: no GPU bitcrunching for you. Assholes, amiright?
And no, I didn't actually know what `fract()` was beforehand.

Here's some info on identifying floats from zero to one.

#### [+] Zero

```
0:00000000 :0000000 00000000 00000000
```

#### [-] Zero

```
1:00000000 :0000000 00000000 00000000
```

#### [<] One

```
0:01111110 :1111111 11111111 11111111
```

#### [=] one

```
0:01111111 :0000000 00000000 00000000
```

#### Fract Exclusion Mask

```
1:10000001 :0000000 00000000 00000000
```

#### Fract Inclusion Mask

```
0:01111110 :1111111 11111111 11111111
```

<script src="/js/three/GPUComputeRenderer.js" type="text/javascript"></script>
<script src="/js/3d/2017-01-04-webgl-gpu-prng.js" type="text/javascript"></script>

<script type="text/javascript">
  function pasteShaderToCodeBlock(shaderId, codeBlockId) {
    var shaderCode = document.getElementById(shaderId).textContent;
    var codeBlock = document.getElementById(codeBlockId);
    codeBlock.innerHTML = shaderCode;
    hljs.highlightBlock(codeBlock);
  }

  pasteShaderToCodeBlock('computeShaderRandoms', 'codeComputeShaderRandoms');
  pasteShaderToCodeBlock('shaderStats', 'codeShaderStats');
</script>
