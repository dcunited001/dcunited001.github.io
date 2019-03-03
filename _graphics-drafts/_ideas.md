---
title: "Graphics Ideas"
---


# WebGL

- display resources allocated by tensorflow (webgl1)
- display resources allocated by WebGL
  - i.e. select texture and provide options to transform it to a GIF
-

- density of emoji description keywords distribution over a semantic
  network (trained in english or chinese)
  - just plot points for each emoji title/descriptions most
    significant keywords over a semantic network (representing
    english) to see which semantic concepts are over-covered and which
    concepts are not covered.

# Misc

### GIS

#### Measure of 2D area of terrain surface visible from a point in 3D space.

  - this is tightly coupled to local/regional changes in convexity/concavity
  - This measure is lower for terrain with ravines, higher for areas of
    high elevation and visibility, Lower for areas of low elevation
  - Connections to variations calculus? I don’t no why but it seems
    there are some intuitive connections here

### Visualized Deconstruction of Probabilistic Values in Catan

- the probabilities of benefitting from the arrangement of values in
  Catan (when the values assigned to each hex is known from the
  beginning of the game) demonstrates some complicated ideas from
  statistics
  - these interdependent nature of the variables leads to some very
    interesting insights into the *interdependent* nature of dice
    rolls, especially the specific impact on probabilistic systems
    that weighted dies can have
    - do the weighted dice produce a greater effect on some games than
      others? of course, but understanding *how* requires knowledge of
      [[priors]] from statistics ...
    - particularly: how distortion in the prior distributions
      correspond to influences on the distributions related to each
      game's mechanics? do some priors extend an undue, cascading
      influence into the mechanics of some games? do the first-order
      and second-order paths (extending from the prior distributions)
      through the bayesian network (or paths through markov networks)
      imply an interdependent interconnectedness of the games
      mechanimcs
    - this has important correspondence with the concavity/convexity
      of some models for various game's objects/mechanics. the
      convexity/concavity of the system's mechanical components
      determines how spatial & temporal complexity for game mechanics
      contribute nuanced tractibility.
      - e.g. in some games, the mechanical components "behave nicely"
        as components of a strategic system to completely solve the
        game: here the game doesn't explode combinatorially. if
        instead, some mechanics combined in ways to provoke
        complexity, it instead leads to intractibility when
        calculating maneuvers based on those mechanics. players don't
        reason about those mechanics, the combinatorial complexity of
        the spatial elements of those mechanics makes them difficult
        to reason about without diminishing returns.



# Computational Geometry

### Efficiently map polygon surface to texture

- calculate the distortion D(p) of individual pixels (distortion
  measured in terms of norm of the affine transformation in the Dual
  Space A* that ()contains all possible affine transformations for
  Linear systems)...
  - i.e. calculate a metric of distorion for a pixel
    - with || norm(a* in A*) || ... adjusted for the pixel's position
      on the triangle/fragment
- implement this algorithm with various goals to act as direction for
  an optimization/minimization process
  - (1) one goal would be the minimization of texture space required to
    contain the mapping.
  - (2) another direction for optimization: would be the general
    reduction of the spread of D(p) for all pixels rendered to
    fragments
    - so, it would require iterating on texture map selection
      progressively towards the optimization goal -- the distribution of
    the magnitude of metric D(p) over the space
    - from here, typical methods can move the texture mapping towards
      a more efficient solution gradient descent (& etc) would be used
      to alter the variables of the texture
  - (3) another metric of optimization would be to produce a measure
    of curved distortion Dk(p), which is based a similar metric of
    norms/dual vector space.  D(p) which measures the norm of d* in D*
    (distance of the parameters of affine transformation from the
    origin in that linear-vector-space's Dual D*). Dk(p) would instead
    identify points on the shape's surfaces and points on the shape's
    texture, trying to minimize the accumulation of distortion when
    summing the Gaussian curvature in a neighborhood of points on the
    shape's surface.
    - Curvature has to be balanced: this is the Theorema Egregia,
      which extends to representational theory by implying the
      existence of structures with symmetries in the curvature of
      surfaces. basically, there should be very interesting
      relationships between Kg(F,x) and dKg(F,x)/dx.
      - for the surface to be defined by a polyinomial, the curvature
        (Kg) and d-curvature (dKg) relate to each other by a need to
        "bounding divergences" (that would otherwise result in
        exclusion in Sobolev spaces or in discontinuities) by
        mediating "such potentially extreme deviation from equilibrium
        as to threaten discontinuoity" via *correlated* changes in
        measure of curvature, where the impact of various "summed"
        trends in F(x) produce "correspondant" impacts on the measures
        of Kg(x) and dKg(x)
    - the ways in which this presents is very much determined by
      constraints on the set of functions considered (linear only,
      linear and/or polynomial, numeric with unknown structure,
      numeric with a known family of relationships governing
      continuity)
    - so, (as a consequence of the Theorema Egregia's application to
      various families of equations/systems), there must also be
      interesting value/equilibrium-preserving relationships that can
      be found in the surfaces of discrete/continuous shapes. the
      structure is more useful when studying continuous surface, but
      once discrete differential geometry is augmented by discrete
      exterior calculus, then many possibiliities initially curtailed
      by the "discreteness" sublimate away (albeit replaced by
      whatever difficulties emerge from the imposition of Discrete
      Exterior Calculus, the nuance for which I am at a loss)


### Calcuation and display of Curvature for Meshes

- calculate curvature and d-curvature on surfaces, update texture

### Calculation of a discrete version of Gauss-Bonnet for Polygons



# Social Physics

### Calculate Physical Distribution of Attention in a 3D Scene

- this is basically a heat-map for the quantity of visual attention
  being directed at objects by visually aware objects
  - IRL: these are people;
  - in simulations: these are enemies, NPCs, objects, etc
  - people usually focus their visual attention onto the surfaces of
    objects, not to the space itself, because that is not what is
    scene. some exceptions are valid (e.g. to guard some ranges of
    space as a goalie in soccer, you might focus on people entering
    that space or the ball entering that space)
- Aggregate a Sum over Depth Shaders for Surfaces in a 3D Scene
  - Run depth shader calculations for multiple cameras in a scene
    - examples:
      - 3D models around a dinner table or still life scene
      - a flat concert venue
      - a raised ampitheatre
      - an open market or downtown area, where the people on the
        outside can't so easily see all the spaces inside the
        store/cart (like behind the counter, etc)
    - there are spaces that tightly restrict the likelyhood that
      someone would attain visual information from them, without
      taking prerequisite actions that signal intention/effort.
      - e.g. the space behind the counter at a store, etc, etc.
      - this is a design consideration behind the physical layout of
        these spaces
  - Attach the 3D position of that rasterized pixel's to another color
    attachment, so the depth shader corresponds to the 3D space in a
    way that can be unified with other depth shaders generated in
    overlapping space
  - aggregate the values for 3D surfaces for each of the dozen or so
    depth shaders into one sum that represents the distribution of
    visual attention or focus onto 3D objects in a scene.
  - onto a render of the same source scene, layer a colorized
    representation of the visual attention distribution
    - red would signify areas of high magnitude shared attention
    - yellow/green etc show medium potential shared visual attention
    - blue would show areas that have a low amount of summed visual
      attention from the intelligent objects in that scene
  - such a shader can not be assumed to function in realtime, but can
    demonstrate visually the concepts of "shared attention" that i'm
    trying to convey in my writing.
    - that people predicate their actions on inferences from this data
      in real-time, emphasizes how computationally powerful people
      are. Even the most blazing current gen hardware butts up against
      serious limitations in even rendering this data, simply. These
      are renders that require what is essentially a depth attachment
      and must be aggregated later. The computations can be simplified
      somewhat by sampling methods for 3D surfaces and the simple
      non-reflective ray-tracing required, yet still, it is hard to
      imagine how to get current-gen to predicate actions for
      intelligent objects based on some objects inferred construction
      for the distribution of visual attention.
    - such information is easily accessible for any human and is
      required for decisions/actions like:
      - can i show this to someone else in the same social setting and
        have only the people intended be the ones that receive that
        visual information? it's easy for people to think this through
      - in a social situation with a hundred or more people, where are
        the maximums of shared visual attention (i.e. there's a
        concert stage, but i can't see it yet, but i can see nearly
        everyone aligned in the same direction and can infer what
        might be in that space)
      - of course, for the above, the human brain can leverage/combine
        alternative signals/methods to make inferences. it does so
        subconsciously and with the drawback that it cannot be so
        confident in its conclusions or certain about relative values.
        - computers aren't so flexible in this regard.
        - so assuming that the method of illustrating the distribution
          of shared attention is the only means if calculating it,
          inferring it or drawing conclusions from an approximation of
          it would be a mistake, since there are most likely more
          efficient routes computers can use to reach the same
          conclusions.

# Statistics and Machine Learning

### From "Shaply Values" to the Recognition of Typology in Input

### Animate Training of Handwritten Digit Training

### Animate textures for Auto/Correlation tensor w/ stock data

### Analysis on Bitcoin/Ethereum/Forex

- calculate correlation/covariance/volatility and animate
- this data is mostly available for free
- where to get datasets? how to load it into WebGL?
- how to interpolate datapoints?
- how to deal w/ ranges of empty data?

### Candlestick Classifier (w/ LSTM extrapolation)

- input financial time-series
- compute correlation/etc
- identify candlestick events, (with relative invariance w.r.t. time)
  - use for technical analysis

### Calculate Free-Energy Landscape

- tensorflow program to calculate the Free Energy Landscape for
  molecules and identify the potential conforomations

### ChemGAN (X) Pharmakineutic Discovery

- [Notes from Siraj's video](https://github.com/llSourcell/AI_for_healthcare/blob/master/Healthcare%20Drug%20Discovery.ipynb)

- download chemical data and animate combinatorial enumeration of
  related drugs.

- classify features of organic compounds within large molecules
  - identify aromaticity, alcohols, aldehydes, methyls, hydrogens w/
    potential to dissociate, carboxyls, etc
    - identifying some properties requires a functional analysis
      approach on the graph of the compound (aldehydes, carboxyles,
      methyls, etc)
    - other properties require a func/analysis approach to the
      electrochemical configuration of the molecule:
      - aromaticity (with parameters: center, electron distribution)
      - propensity for dissociation
  - identify a set of organic reactions that apply
    - this is parameterized by molecular structures, conformations,
      electrochemical properties (aromaticity)

- enumerate stable conformations per molecule
  - identify probable conformation transitions
  - animate conformations
  - detect conformation transitions susceptible to pH influence

- train network on covalent bonding space-filling model data to
  recognize patterns and predict space-filling models for similar
  molecules
- train network on pharmakineutics of existing molecules to predict
  pharmakineutics of new molecules by recognizing structural
  similarities
- train network to recognize metabolization pathways via CYP enzymes
  - to predict sideeffects of new & existing drugs
  - combine with gene network analysis for CYP genes (and genes that
    encode pharmakineutically similar drugs), so that changes to CYP
    enzyme production/levels can be predicted.

- identify compounds with appealing partial features, whose
  electrochemical structure can be restrained by stable attachment to
  a peptide/RNA/fat

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

# Misc

### Calculations of Configuration Space and Phase Space

- simulate some magnetic pendulum desktoy
  - or build a real one with an accelerometer
- calculate/animate the physics
- for specific magnetic arrangements:
  - calculate/project the path through phase space
- for the set of all magnetic arrangements calculate the configuration
  space (to determine interesting arrangements?)

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
