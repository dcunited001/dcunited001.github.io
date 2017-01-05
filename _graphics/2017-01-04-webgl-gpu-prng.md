---
title: "A Terrible GPU RNG With WebGL"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

### Parallelized Random Number Generation in the Browser

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

The texture is simply 64x64, so the point can be more easily
visualized, but scales to 4096x4096 with no problems at ~30
fps. That's 30 x 4 x 4096 x 4096 random numbers per second.  Even
though the quality is suspect, that's about 2 Gigarands per second.
There is no delay from overhead related to WebGL calls and therefore,
adding a bit more state and calculation to the shader should not cause
delay.

Here's the shader code for the PRNG. The ThreeJS code to set this up
can be found [here](/js/3d/2017-01-04-webgl-gpu-prng.js).

### Fragment Shader: computeShaderRandoms

<p>
  <figure class="highlight">
    <pre>
      <code id="codeComputeShaderRandoms" class="language-c" data-lang="c">

      </code>
    </pre>
  </figure>
</p>

### Why Is This PRNG Terrible?

Actually, it's not so bad. If there were major problems with the
calculation, there would be noticeible shifts in the output. While the
problems with this approach are much more difficult to detect with the
human eye, problems with PRNG's rendered to a texture could leave a
discernible color shift.

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
RECOURSE, NO REPRESENTATION, INADEQUATE MEDICAL EVALUATION FOR TDO --
AND IT SHOWS UP ON ANY FUCKING BACKGROUND CHECK.  Even one that a
military recruiter runs. And honestly, that is the cheapest way to get
a background check if you know why they ask the questions they do.

CAN THE GOVERNMENT GET OUT OF MY LIFE? Stop pissing all over yourself
just for me. It's not very becoming. And if I could ever get a job
without being bullied by the facility security officer (FSO
... required for DoD contracting) than HOLY SHIT I might be so
distracted, I wouldn't even care.

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

    // multiply by primes and add/subract to counter a binary-additive color-shift...
    // - binary addition is simply a recursive bitwise xor + bitshift, which means that
    //   the probability of a change in leading digits is correlated to the number
    //   and position of sequential zeros. this makes it a bit harder to change one
    //   side or the other with simply additive functions...
    //   - the reasoning behind this is the same as why magnitude metrics (seismic, etc)
    //     are more likely to lead with a one or a lower digit than a higher digit.
    // - if i could xor, i wouldn't need this.
    vec4 newTexel = fract(3.0 * texel -
      fract(5.0  * texels[0]) +
      fract(7.0  * texels[1]) -
      fract(11.0 * texels[2]) +
      fract(13.0 * texels[3]));
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
  var codeComputeShaderRandoms = document.getElementById("computeShaderRandoms").textContent;
  codeComputeShaderRandoms = '<span class="p">' +
    codeComputeShaderRandoms.split('\n').join('</span>\n<span class="p">') +
    '</span>';
  document.getElementById("codeComputeShaderRandoms").innerHTML = codeComputeShaderRandoms;
</script>
