---
title: "Divergents and Directional Antennae"
categories: blog
tags: "math science fusion"
headline: ""
author:
  name: "David Conner"
excerpt: ""
---

So in the past two weeks or so, I dove in headfirst to a series of
[Plasma Physics lectures](https://www.youtube.com/playlist?list=PLbMVogVj5nJS4KY5UFWBLSu7kMzPbL35T)
by V.K. Tripathi. I haven't studied EMR/Maxwell or Thermodynamics or
Netownian Dynamics. I even dropped out of my university physics class
at Virginia Tech after about 2 weeks and haven't tried to seriously
study any physics. I had linear algebra, but hadn't gotten to
vector/tensor calculus.

I quickly found myself surrounded by math I hadn't worked through
before, like gradient, divergence, curl, Laplacian and operators in
general. I'm working towards understanding Hamiltonian and Hermitian
operators. I still don't know all the details, but is very intuitive
to me. Still, that was the greatest challenge. At a high level, I
understood the content, but knew I couldn't do much more without
comprehending the low-level details of the math behind the
physics. That's one big difference between watching a TED Talk on
fusion and actually taking a class on Plasma Physics.

### Radiation of Electromagnetic Energy

I started thinking about directional antennae and reason about what
kind of math would allow me to predict the shape of the energy
distribution, first given idealized omnidirectional or directional
antennae. And later, given the specific structure of a more realistic
antenna, I hoped to identify some relationships that would allow
computation of energy propagation and distribution.

> Just a reminder that I'm working through this problem in my head. I
> realize that a lot of this is probably wrong and that I haven't
> really done the math. But, at a high level, it all seems very
> simple to me. I'm starting to pick up some math/physics tools that
> would greatly augment my ability to reason about domains and
> problems which were formerly completely out of my grasp.

So uhh, keep in mind, this article isn't about providing an accurate
model of this problem. Instead, I'm walking through how I approached
the problem.

I had just learned about surface integrals, which are used in the
Laplacian operator. From intuition, it seems like the energy radiated
by an antenna would be fairly constant over time.  And for a medium in
which the speed of light is constant, the energy radiated for one
timeslice of length `∂t` should be mostly equivalent to the energy
radiated at some other slice. This assumes that `∂t` is sufficiently
larger than `λ / c`, where λ is the wavelength.

### A Spherical Cow

This is much simpler given the spherical cow of a pointlike
omnidirectional antennae, whose signal is one frequency composed of
perfectly distributed energy, radiating in all directions. Given this
scenario, and assuming there are no reflections, then calculating the
energy distribution is dependent on a point's distance from the
source.

But once you start looking at directional antennae, things become more
complicated.  A simple model will just distort the distribution as an
ellispoid-like object on one, two or three axes.  That's not right
though, because the axes don't need to be orthogonal to each other.
And yet, that's still not right because the EMR doesn't even radiate
from a single point. But assuming one goes down this path, this model
is still fairly simple to use.  You can model passing small volumes to
a 3D parametric function `E-dist(t,x1,x2,y1,x2,z1,x2) -> (E)` that
returns a scalar quantity of energy.

### Power In = Power Out + Power Loss

Two very useful values that very useful to know is the rate of
current/energy going into the antenna and how much energy is produced
as EMR. You can correlate those values to the average rate of energy
output, assuming some energy loss given the material specifics. This
power `P` implies that for a timestep large enough such that the
average rate of energy output holds, the sum of energy must equal the
power output for that timeslice. This can be very roughly notated as:
`∫E(r,t)∂t = P * ∂t`, where we're either summing over a thin shell
using surface integral or laplacian or getting the difference in
`E(r,t+1)` and `E(r,t)`. But the point is that we may be able to use
the total power in and efficiency of the antenna to estimate how much
power should appear in a timeslice.

### Antenna Mechanics

Spherical and multi-axis directional parametric - both of these models
assume EMR from a pointlike object, but that's impossible, isn't it?
So, if it's not pointlike, then we can't simply use a parametric
function because that's too much of an approximation.  The mechanics
of an antenna's shape contributes to distorting that ellipsoid. So one
could divide the antenna into increasingly small 3D pieces -- Antenna
Volume Element `AVE` for brevity. The space enclosing & surrounding
the antenna is `SVE`.

Yet, that's complicated, isn't it? It's going to require a tensor to
map each antenna slice to it's energy output. And it's a bit more
complex because for each SVE, to calculate it's E-SVE, you need the
sum of contributions for a particular timeslice. Because EMR travels
at the speed of light, we'll need to know that SVE's distance to each
AVE in the antenna. And therefore, the mapping for the tensor isn't
just `space-to-space` or `(x,y,z) => (x,y,z)` or `(r1) => (r2)`, it's
space + time to space. Or `[r1 | ∂t*c == dist(r1,r2)] => [r2]` where
`∂t` here represents the difference in time for EMR traveling from
`r1` to reach `r2`, instead of the time difference for each slice or
shell of the EMP radiating from the antenna.

So, given this somewhat complicated domain for the tensor, the energy
contribution of each `AVE` can be summed to match the output of the
antenna for each point in space surrounding it.  We'll call this pair
of functions `E-AVE()` and `E-SVE()` -- again, representing the energy
contributions from each chunk of the antenna and the energy received
into each chunk of space surrounding it.  An algorithm to calculate
these values can be set up in many different ways, therefore the arity
or parameters of these functions could vary quite a bit.  But we know
they at least require some time `t`.

`E-AVE` can be calculated to return scalar, or a point-like spherical
vector "field", whose vectors' magnitudes sum to that scalar,
approximately. Technically, it might not be a vector field, since it
only has vectors radiating outwards from that one point -- and it
could require a minimal volume/topology, in order to maintain some
kind of continuity for the calculus. `E-SVE` could be calculated
similarly as a scalar value of energy for that volume element, but for
purposes of calculating values for regions on the surface integral of
`E-SVE` for specific timeslices of `t`, it may help to retain that
directional information. In other words, for each slice of the `SVE`,
the EMR there can be calculated from components, but those components
are actually continuous waves (.. particles) that can be traced
backwords to each contributing `AVE`. I won't be using this fact, and
it gets significantly harder with electromagnetic forces that distort
the path of EMR but it's interesting that everything is kind of woven
together.

So, given an `E-AVE` output with directional information, we should be
able to calculate the `E-SVE` for each region in the surface
integral. From here we can use the other vector calculus tools to get
a bit more information about how the radiation dissipates as it moves
further away from the antenna.

### Surface & Volume Mapping

Another problem: in order to calculate a surface integral for the
shell of radiation at a particular time point `t`, or to calculate the
volume of a region of space within a timeslice at `t`, we can't really
specify that operation without either:

#### (1) Knowing a bit about the shape of that shell at `t` and its topology

#### (2) Or calculating it from the shell of EMR at t = 0 (the surface of the antenna)

Either way, you might have to account for changes in the topology,
requiring your algorithm or math to remap the space. I think this
implies a kind of discontinuity.  E.G. you have a donut shaped
antenna: at some point, as the EMR travels outward, that will change
from a donut to a disk. Therefore, there will be a timestep that
requires a discontinuity if you're mapping the "surface" of the EMR
radiating outwards over increasing timesteps.  If you're just mapping
volume chunks and then integrating on those, it's possible to maintain
continuity.  I wonder if that's generally true: that you can just
abuse dimensionality, do a bit of remapping and get around problems
with continuity in topology.  And if so, under what conditions will
that hold and why?

This differentiability across a shape that could change topology is
important when you want to structure higher order behavior on top of
the distribution of EMR. E.G. if you want to design an algorithm that
optimizes antenna design for phase coherence at specific distances,
where you might want to have a receiver or something. I donno. I
really don't.

But, I *think* this differentiability across shapes that aren't
topologically continuous is important for differential manifolds, but
I haven't looked into it much yet. I just found Harvard
[Math 253](http://www.math.harvard.edu/~canzani/math253.html)'s
compiled lecture
[notes](http://www.math.harvard.edu/~canzani/docs/Laplacian.pdf) and
got that onto my Kindle.  These look like good notes going from
laplacian operator to manifolds to Reimann manifolds, which are used
in relativity. I can't really say I know what a manifold is. I just
learned exactly what a vector field was, though they were in my high
school textbooks. I thought they were boring because "vector" in the
name.

Also, this paper from Toronto on
[fluid simulation using laplacian eigenfunctions](http://www.dgp.toronto.edu/~tyler/fluids/FluidDynamicsLaplacianEigenfunctions.pdf)
looks cool. I think eigenfunctions allow you to vary operations &
behavior based on state of local systems within a large complicated
system. I've been trying to figure that out for a long time. How to
specify various higher-order behaviors to emerge in a particle-based
system. It's probably important for physics based on statistical
mechanics and quantum mechanics.

### Minimum Distance to Surface

So, yet another "gotcha" and this one's complicated. The entire
antenna doesn't produce signal. There are a lot of higher order
effects here, including those from macro structures and micro
structures.

One of the effects from macro structure is caused by the
[Skin Effect](http://www.edisontechcenter.org/wires.html#skin), which
causes current to flow towards the outside of electronic structures
and influences the design of antenna. This is fairly important in
antenna design, but how do you mathematically model it? This is
another topological issue where various topological fundamentals may
result in drastically different models.  It could be an opportunity
for performance enhancement, since you might not have to calculate too
far into the surface.

But basically, you need to map a coodinate system onto the surface and
then unroll the shape at the midpoint into a 3D surface. where the the
`X` and `Y` axis give you coordinates on the surface and the `Z` axis
gives you depth into the antenna.  Although, depending on the
structure, you may only be able to penetrate some units into the
design on the `Z` axis before running into mapping issues. This map
will be used for calculating the current contribution of each `AVE` to
the EMR output by checking the minimum distance to surface and
checking the current flowing through its neighbors.

You will either need to hardcode in a simulation of the Skin Effect or
model convolution onto each `AVE` and its neighbors.  If you don't do
with a small enough `AVE` size, then you won't see the
current/potential looping in the wire that causes the Skin Effect.
Convolution is incredibly expensive. More in a second.  That distance
will help you determine how much EMR that node is contributing, but
you need to know how current flows between the nodes to determine the
direction the EMR will be projected.  So you need that convolution
anyways.

If you're modeling a more complex object, you have to specify how to
unroll the object so that you don't cover volumes twice.  You may have
to chain several mappings so that the `X`, `Y` and `Z` coordinates map
proportionally and ideally *one-to-one*.  This is a harder problem
than mapping meshes to surfaces of 3D objects and probably requires
algebraic geometry. Instead of keeping the object as one piece, you
can break it into pieces using an indexed map, but then you may end up
with continuity problems and you have to use another map to mark the
surface that's exposed.

### Convolutional Behavior

Then, to tie it all together, you have to use another map to map the
`AVE` as they are subdivided from the original object to the set of
maps to calculate distance to surface.  This is so that the
convolution-based behavior can be modeled more easily, without needing
fibers & sheaths and only God knows what kind of algebraic geometry
objects to tie everything together .... I finally figured out how to
read the wikipedia math articles and I found the good YouTube
lectures ... but I can't really do this math.  I'm probably making a
lot of glaring mistakes here.

Convolutional behavior is found in machine learning and specifically
in computer vision, where it's used in the lower levels of neural
networks to discover edge and color patterns.  In computer vision,
there are multiple layers, which connect into larger and larger
pieces.  These are used to identify higher-level and more complicated
features. The lower levels often compare the difference in pixel value
or contrast value in each pixel and 2 - 5 adjacent pixels.

#### A Convolution on a pixel and 2 adjacent pixels

```
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [X] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
```

Results in up to 25 operations per pixel at that layer.

But convolution in a 3D object would be similar, but in 3 dimensions.
Except, instead of training layers for recognition of patterns --
which actually might be useful -- you're passing these values into a
function that updates the state of the center pixel based on the
gradient of current flow and the divergence in adjacent pixels.  Then
it uses the `∂E` value for that pixel to determine its EMR
contribution, since AFAIK, EMR is based on fluctuations in
current. Again, I haven't taken an E & M class.

This is chained together in a 3D version of Conway's Game of Life.
Every timestep, the state of each pixel is updated based on the
results of its convolutions.  Sometimes this stuff can be GPU
accelerated.  Sometimes it can't.

<iframe width="420" height="315"
src="https://www.youtube.com/embed/DJuUmMWihB8" frameborder="0"
allowfullscreen></iframe>

But the value for EMR produced for each `AVE` may more accurate if
something like a plate model is used for each convolution.  This means
retaining several copies of each convolution, for each time slice.
It'd be 4D instead of 3D.  Plate models are from statistical modeling
and are often used in AI for video games, where you want the computer
to become adjusted to reacting to similar sequences of actions that
may occur over similar but different timescales.

### Absorption, Reflection, Dispersion and Anisotropy

These factors are much more complex to accomodate.  They require
modeling absorption and reflection data into the materials and then
monte carlo sampling to cast rays.  For video games, the rays are cast
from lighting sources and bounce around the scene.  Lighting is one of
the first complicated aspects of graphics that you'll run into.  It's
computation intensive and you have one camera.  If you're calculating
radiation reflection and absorption, each `SVE` is basically a camera.
However, if there's an unobstructed path, one can assume that the
values for adjecent `SVE` nodes can be calculated by simply extending
vectors, instead of recalculating everything from the sources.

orientation of energy radiation from AVE
- orientation of energy radiating from AVE
- E/M anisotropy of adjacent AVE affecting trajectory
  - alters dispersion and path
  - requires ray tracing (afaik)
  - also, i might be completely ignorant of E/M
- reflection from objects in environment
  - not even going to touch this one


### Stateful Interactions

Further, there are many magnetic and EMR interactions that
emerge from micro/macro structures in the antenna's crystal
lattice. From those interactions emerge stateful behaviors that would
cause that.

- A convolutional mapping is required here

### Directional Antennae



- one problem is that: if you are trying to model the energy
  distribution of an antenna and that's dependent on itself, how do
  you know what shape to use for each timeslice?
