---
title: "Graphics Ideas"
---

### 3D Lens Flare Prismatic Effect

- Stereoscopic Lens Flare, where voxelized objects are pieced apart
  into colorized 3-dimensional components, arranged in a line, like a
  lens flare.
  - the direction of these "voxel flares" can be aligned, randomized
    or some mixture of both.

### Mesh Generation & Mesh Morphs w/ Voxels

- Mesh Parameterization X Voxellated Data
  - Morph Interpolation X Voxels

- utilization of inferred volumetric data from stereo-3D data or
  streamed 3D data across time, applied to generation of mesh morphes
  - e.g. expected volumetric inferrence from interpolation of inferred
    morph vs. actual volumetric change
  - this may be more useful on global/local features other than volume

### Inference of Lighting from Stereo3D

- inference of lighting artifacts from Stereo3D streaming data
  - infer/construct surfaces w/ a temporal model & estimate distance
    to visible pixels/voxels (w/ Stereo3D Depth Attachment?)
  - Also estimate change to visible pixels across time. These values
    can be reduced to a sampling of (x1, y1, x2, y2) domain
    - can they really? (x,y,z) sampling instead
  - (finish) identify patterns of composite images that vary linearly
    w/ distance, but at a different rate than most inference data

### Computer Vision Techs

- connect existing computer vision techniques to utilize inference of
  material composition via database of materials and their
  refractive/spectral properties
  - it would help if augmented with spectra outside of visible light
  - this will fail quite often and may not be possible. it will need
    to permit noise/distortion, but a wider range of color channels
    would be able to significantly augment large-scale feature
    detection (esp for natural objects like butterfly species
    detection)
    - especially for natural objects, whose color is not so tightly
      bound to a set of industrial-friendly chemicals for color
    - but image encoding destroys spectral data, so this can't be
      trained on or run on traditional image formats and probably
      needs to occur in hardware.

### 4D to 3D projection

### "Shape" of Rational Numbers Coloring Texture/Mesh/Points by factors

- Pre/generate textures for rational numbers along with stats on which
  factors and how many are required to generate the number
  - also, stats on how many rational numbers each new numerator/divisor
    contribue
  - generate these with a shader, then have a second shader that colors
    them or is used as input to a vertex shader
    - so, select a shader with a hardcolored color function, or pass
      a uniform that colors the rational numbers associated with
      specific factors

- allow user to select from multiple surfaces that the texture can be
  displayed on, including manifolds that circumvent the need for zoom


### Using ideas from Statistical Mechanics & Thermodynamics For Smooth/Bounded Motion/Acceleration of Particles

- basically, the difference b/w plain statistical mechanics and
  quantum mechanics is in how arrangements of particles are considered
  for each configuration of particles in the configuration
  distribution
  - for statistical mechanics, any configuration with overlapping
    particles is thrown out. particles are randomly sampled one at a
    time
  - for quantum mechanics, (the 10,000ft unacademic view) the
    configurations with greater potential in the particle system are
    less likely ... unless the potential energy is accompanied by
    momentum (and thus the configuration is transient... this
    explanation far too simplistic for the actual math, i think)
    - in other words, the likelihood of a configuration of the system
      depends greatly upon the Hamiltonian interplay between p, dp, q
      and dq as they all relate to the energy of the system. when the
      resulting configuration distribution has higher potential
      energy, it is much less likely.
      - this probably relates to the boltzmann distribution from
        thermodynamics
      - and there are probably some really interesting
        deductions/inductions to make when taking into account the
        range of motion across phase space (in classical mechanics,
        the range of "valid" particle motions given by the
        Hamiltonian)
        - of course this is different with quantum mechanics, which
          use the imaginary time operator and euclidean path integrals
    - there may be further conclusions that can be reached by
      assessing the "free energy landscape" of the particle system
      - that is, the short-term evolution (future and past) of phase
        space and configuration space are linked to the free energy
        landscape.
        - that is, the landscape as a whole, for each particle and for
          poset neighborhoods of particles. this may be relevant when
          considering the discrete, pixelated shape of space (as in
          quantum gravity)
        - the characteristics of the shapes of the free energy
          landscape and the particles relationship to them will
          influence each configuration's energy and "connectedness" to
          other energy landscapes.
        - each configuration is linked by symmetry and other means,
          which can help identify its energy and likelihood. each
          configuration's free energy landscape also causes the
          configurations to be "connected" in a different way.
          - viz. the likelihood that one configuration or "type/kind"
            of configuration would evolve to be similar to other
            configurations (or types/kinds).

- anyways, this concept from thermodynamics or statistical/quantum
  mechanics can be used to "properly" address the issue of jitter in
  particle shaders with forces (which are either physical or
  sociophysical simulations)
  - this addresses a problem i encountered where one particle would
    "zoom" out because two particles would occupy a very close space.
    - to fix this, i just need to add another shader that "corrects"
      the new momentums of particles by coaxing the distribution to
      cohere a more reasonable distribution.
      - that is, the values that are n*sigma away are corrected in
        proportion to their deviation from the norm.
        - AND so that the entire simulation preserves energy/momentum,
          at least across time







- (as i'm writing this, i'm at the skating rink and trying to assert
  whether there are sociophysical anomolies in my local 5m space,
  since i'm on my laptop with scary words on it. the space around me
  is a nexus, but it's been clear for a little too long. like someone
  with bad gas lulz. it could be anomolous configuration
  distribution. then again, probably imagining things, but at least
  there are metrics i can assert to even know anything)
  - for things most people assume are unknowable or unquantifiable,
    there is actually far more informartion that can be quantified
    about sociophysical interactions. this means they are actually
    *more* knowable and *more* quantifiable.
    - so, people tend to take actions assuming that no one could
      possibly understand their reasoning, when in fact the opposite
      is true. their reasoning is just not apparent to each other
      because they don't understand themselves and their actions
      influence on sociophysical metrics.
    - really it's not important right now. besides, if you can't
      explain it to the average person in 100 words or less, it's not
      even worth trying. it's amazing the degree to which people want
      to win an argument, regardless of the merit of their rhetoric.
