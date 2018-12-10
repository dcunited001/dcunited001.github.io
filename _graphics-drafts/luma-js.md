---
title: "Luma.js"
headline: "Ideas with Uber's awesome Luma.js and Deck.js"
---

> Uber's Luma/Deck libraries are like Christmas come early


## Math/Calculus (Luma.js)
==================

### Plotting Gaussian curvature onto 3D curves


### Gaussian curvature for distrete 3D shapes.



## General Graphics (Luma.js)
==================


### Barycentric coordinates for texture mapping

#### Unrolling the faces of 3D polytopes onto a texture

- to distort a texture mapping with barycentric coordinates
- parameterizing the surface of each face with Barycentric cooefficients
  - these cooefficients allow the image of a texture to be distorted
    (for each face)
- also, (the notes say...) use random noise to sample values for the texture)

#### distorting the texture mapping of curved 3D surfaces with barycentric coordinates

- so the surface of a 3D shape is unrolled, similar to how a texture
  is mapped to texels. this 3D shape is curved.
  - for each texel on the surface of the 3D polytope, it's immediate
    neighborhood corresponds to a square/circle whose curvature is
    accounted for purely by the cooefficients that describe the
    barycentric coordinate system (for that texel)
  - this is basically describing a curved shape in terms data that
    corresponds to Gaussian curvature (but encoded as coefficients
    that describe local barycentric distortion for each texel)
    - not all curved shapes can be described in this way! there are
      some challenges related to this. additionally, encoding data to
      use as example 3D curved surfaces, etc is challenging enough.

### Killing Fields (& Killing Vectors)

## Statistics (Luma.js)
==================

### Animating/Drawing/Analyizing Fields

#### Histograms for field values

#### Histograms for field values + calculated, variance, moments, entropy, max/min

#### Calculate variation in values for neighborhoods of texture

### Pearson's Method of Gaussians, Animated

### Random Numbers with Entropy Correction

### Probabilities of Changing Lines in I Ching

- construct a 64x64 complete graph with values that reflect the
  probabilities of hexagram sampling along the diagonal (a uniform
  distribution) and the probabilities of sampling changing hexagrams
  in the triangular regions of the matrix (graph/texture)
- sample random values to start the simulation. each value is a markov
  process whose state changes with probability according to its
  current state and the probability of sampling a changing
  hexagram.
  - there are 64 states each process can be in.
  - from each state there are 63+1 potential transitions (representing
    63 changing hexagrams + one change to the same hexagram)
- color a texture with values that correspond to the number of
  processes in each hexagram.
  - as the simulation runs, all the processes should converge to:
    - one hexagram (Hexagram 2: the receptive), since the yarrow
      sticks method is biased towards Yin (for changing hexagrams)
    - or a circuit of related hexagrams: this possibility should at
      least emerge briefly, but will only be perpetuated under certain
      conditions.


## Physics (Luma.js)
==================

### Cymatics with H3.js Hexagons

### Generalized Diffusion


## Machine Learning (Luma.js + Tensorflow)
==================

### Interpretation of depth from Art/Lighting

- particularly from Chrono Cross & Final Fantasy Backgrounds
- then distortion of the 3D surfaces, maintaining the perceived
  effects of lighting, while running surface-pattern interpolation to
  "fill in the gaps" of surfaces which weren't originally proscribed
  texture data.
  - in other words, you shift the perspective tensor (that defines a
    camera's frustum) of a 3D scene (which itself is only interpreted
    from 2D data), which results in 3D surfaces which have no data.
    - to fill in this data, one can use something similar to Photoshop
      pattern-interpolation stencils

Deck.js (map-based animations)
===================

### Given a mixture of topographical & Bathymetric data

#### Load topographical data as texture and colorize a Deck.js layer

- colorize with gradient or curvature

#### Heatmap in Ocean that shows distance from closest shoreline

#### Include UI Controls for Tidal Change, Predicted Ocean for X,000 B.C.E

### Identify Potential Landbridges (and quasi-landbridges)

#### Identify regions of strong ocean currents disrupted by land bridges

- assume ocean currents in the modern era are sufficiently similar to
  those at the begining of the Holocene
- laplacian of average ocean currents (with sliding window for
  seasonal changes) gives a texture of ocean current hotspots.
  - where these hotspots coincide with topological changes,
    - where landbridges that create new holes in the manifold are
      colocated in regions with high values for laplacian, this
      indicates areas of strong change in ocean currents
    - e.g. Bering Strait, Bosporous Strait, Strait of Gibralter (not
      in the modern era)
- it's extremely difficult to predict how the ocean currents would
  respond, but it's easy to identify where there would be significant
  changes in weather patterns because of introduced landbridges.

### Population Flux

#### As Diffusion along a field of Topographical data

#### With bounds on diffusion via Climate & population density
