
# Two-Force Particle Interactions with statemachine for Maxima Identification

- set up the two force particle simulation that will be used for social physics
- set up a framework for state machines
- in this simulation, the first state will be free motion of particles defined
  by the two forces
  - the next states are described below, but i will only implement the ones
    needed for maxima identification
- while the simulation is in the state processing grayscale morphology,
  - the particles are stationary, but the identification of maxima is
    slowed down and animated
- this also requires the implementation of scan that uses the texture data from
  the MipReducer class

### Render field & gradient

### Use RNG to sample ~1024 random field/gradient values

#### Use Mip Reducer to identify the min/max of field/gradient values

### Given min/max/range of field & gradient, run a image threshold

### Use morphological operators to identify local minima/maxima

- https://mathematica.stackexchange.com/questions/9928/identifying-critical-points-lines-of-2-3d-image-cubes
- http://matlab.izmiran.ru/help/toolbox/images/morph13.html

### Return minima/maxima as vertices

- Use sparse matrix filtering with GPU to filter as many nulls as possible
- sparse matrix compaction (see thrust library)
- GPU Stream Compression/Compaction
  - http://www.davidespataro.it/cuda-stream-compaction-efficient-implementation/

- can implement Scan Compaction with MipReducer:
  - (1) calculate prefix sum to learn number of elements
    - the resulting texture functions similarly to a quadtree
  - (2) bind the resulting texture(s)
    - there will be two textures (bc its pingponged)
  - (3) copy their contents to preinitialized Float32Array
  - (4) using the mipmap pos/res array, recursively iterate each branch
    - move to next branch when the number of elements in that branch are acquired

### Triangulate with Delaunay

- [Delaunator](https://github.com/mapbox/delaunator) can triangulate 100-1,000 vertices in
  less than 10ms

### Reduce the triangulation to calculate the conversation graph

- a parallel fold can process the triangles to produce a list of graph matrices,
  which can simply be added togeter
- the rows or columns of this matrix can be filtered individually to retreive
  the subgraphs of each "conversation" or molecule.

# Abstraction of Social Physics "Program" as State Machine

The following can be run as a state machine that transitions across multiple frames:

- (1) prefix sum for min/max calculation
- (2) image threshold & morphological processing
- (3) scan & compaction to retrieve a list of maxima
- (4) delaunay triangulation
- (5) fold to calculate graph as a matrix
- (6) update of particle state/attributes

Then, this state machine can be wrapped up in its own object, mostly separate from
the physical calculations.

- The state machine updates particle state/attrs
- And then the particle state/attrs influnece the physics calculations

The update to particle state/attrs can be further abstracted from the state machine, so
that most of the "program" logic is contained with step 6 of the state machine.

This framework idealizes social physics and biophysics. If this framework could be
efficiently extended to 3 dimensions, it could be used to create crude biophysics
and molecular dynamics simulations, where particle fields are stored in maps of 2D
and 3D textures, events are triggered by identifying minima/maxima in field overlap,
and events are determined by the subgraphs of adjacent molecules. Given a
triangulation/graph of adjacent particles with parameters for orientation,
distance, and conformation state, then the probabilities for events to occur during
the next timestep can be crudely simplified to a fairly trivial lookup/calculation.

