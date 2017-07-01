
### TODO:

- aggregates
- fix finite space type

- aggregate for momentum (p & ∂p)
- aggregate for force (F & ∂F)

- change force splatting to use drawArraysInstanced
- i need to figure out how to get the particle id in without having to set a uniform
-

- replace particle-speed slider with particle-mass


### Overview

# Challenges

### storing aggregate data for simple line graphs

(the vertex transform may be better of as a separate blog post)

- used a circular buffer to retain a history of the scalar aggregate values for the line plot
- this results in minimal writes and efficient performance
- i wanted a rolling graph which would update on the fly, where the user could intuitively understand the values
by the color of the line without any need for axes
- i wanted to render axes and would have used D3, but i couldn't place it anywhere at the top of the page
without having the user scroll up and down, which defeats the purpose of instantly/intuitively tracking
values from the simulation
- so bc of UI constraints, i rolled my own solution. i could have also used D3 to render to an offscreen canvas
and then pasted the canvas texture transparently on top of the simulation
- however, since it's already maxing out my GPU, I didn't want expensive copy/write operations.
- if I roll my own, i can minimize the performance impact of adding simple line graphs
- in this way, a minimal amount of pixels are rasterized (just the line and no copy operations and no 2D texture fetch)

### using WebGL transform feedback to translate vertices for the line plot

- in order for the line to be drawn with width, it has to be expanded into points, triangles, triangle strips or quads
- needed to interleave the vertex data from one buffer to another so that it would be intuitive & quick to insert
new data points into the circular buffers
- in this case, avoiding the vertex transform is pretty simple, but i wanted to learn to use it
- i needed to transform a vec2 into two vec2's per data point
- from here i would have a triangle strip to render as a line
- pretty simple but it required a lot of code

### Aggregate Calculation of Particle Attributes with Mipmaps
- refer to paper that demonstrates algorithm for flock behavior

### Calculating the thermal velocity from partilce velocities

- describe physics calculations
- mass/energy/momentum/speed
- why mass becomes implicitly required for force/momentum, even if all particle masses are all the same
- while this seems obvious, ....
- coordinate systems considered/used

### Resolving Discontinuity Problem in Gradients

- added checkbox for deferred calculation
- holla holla chain rule
- yes, that's a calculus joke
- (the derivative of the gradient when using deferred calculation is equivalent to
the sum of the derivatives of the component particles for that pixel, where blending
is essentially a sum)

![screenshot]()

- resolving discontinuity problem in gradients
- resulted in discontinuities bc of the field size
- blurred field image to remove discontinuities before gradients`
- this sacrifices accuracy of result, but improves accuracy of physics calculations
- ... nevermind, the blur won't help very much and will reduce accuracy too much
- the other algorithm results in less discontinuities,
- especially where it matters for calculating forces: in high-density regions
- nevermind.. does it? there is still effectively an (n x n) ball around each particle
- one option is to transform the values so they taper off to zero
- but how to stretch the domain/range of the ball around each particle
- you can force much cleaner values this way,
- but it's the infinitissimal-to-zero transition of values that's the problem
- another way may be to add a fine amount of noise to the field
- but this also doesn't help

- bottlenecks and options to increase performance
- transparency is for all meshes rendered, so the number of rasterized pixels is the main bottleneck
- therefore, the greatest payoff for performance if more particles are needed is speeding up the
fairly simple fsFields shader
- this can be done by utilizing a texture and avoiding unnecessary instructions
- the payoff is completely linear, proportional to the number of instructions shaved by fetching
precomputed gradients from textures instead of calculating them
- minor performance increases, but the method is a bit less flexible
- however, texture atlas techniques like this are required if you want to render more
complicated electron density clouds

### Questions

- is it possible to utilize force splatting to average attributes of particles (v & ∂v)
over various levels of space to correct for the inability to calculate gradients with a large
field size for each particle?
- e.g. increase/decrease field effect size for local particle density
- force splatting could also be useful in combination with stochastic programming to dynamically
allocate greater GPU power to regions of space with more intricate particle positions
and attributes
- there's an interesting effect produced when viewing the fracted values of the
field/gradient
- it begins to take on curved forms that connected from particle to particle, except
around the edge of the calculated effect on the field for each particle
- that is, at the edge of the particle field, there is a sharp break in values added
that produces jagged curves that would be otherwise smooth if there were no
limits on the computational power
- so, is there any way to generate the ideal field by progressively converging towards something
like a topographical map for a curved space, where the lines represent the locations for
particular values
- as the computed space approaches the ideal space, the curves (values) begin to change less
and less for paricle systems that have spherical forces
- but more importantly, the lines at each value in the field begin to curve more smoothly until
they reach the ideal field
- in the ideal field, the field lines for each axis for the will always intersect at right angles

- there should be a method of constructing the field/gradient for an arrangement of particles
using geometry. there may be at least two geometric methods for doing so:
- (1) given a delauney triangulation mesh of the particles, one expands on the graph/geometry to
produce a mesh which is close enough to match the field
- (2) or via a kind of stochastic programming where ideal points in the space are sampled for
values and the field is interpolated afterwards
- both of these methods can be improved by attaching normals to the vertices to assist in making
the curves more accurate.
- but it's the perculiar nature of the curves that makes it possible for an algorithm to sift
towards their ideal shape
- for either algorithm, but particularly the first, neural networks can assist in identifying
similarity between local subgraphs of the delauney triangulation and the output of the field
- both of these algorithms are likely rendered intractible by variation in particle type &
attributes. for systems with identical particles spread across the system, then similarity
between system arrangments can be more easily identified and harnessed to interpolate the
system
