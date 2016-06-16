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

- reminder that i'm working through this problem in my head
  - i realize a lot of it is wrong, but a lot of it is straightforward
    to me, if only at a high level.
  - and the point is, i seem to be good at quickly absorbing this
    stuff and applying these concepts at a high-level to reason about
    problems, which before were completely out of my comprehention.

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

Two very useful values that very useful to know is the rate of
current/energy going into the antenna and how much energy is produced
as EMR.

### Antenna Mechanics

Both of these models assume EMR from a pointlike object, but that's
impossible, isn't it? So, if it's not pointlike, then we can't simply
use a parametric function because that's too much of an approximation.
The mechanics of an antenna's shape contributes to distorting that
ellipsoid. So one could divide the antenna into increasingly small 3D
pieces -- Antenna Volume Element `AVE` for brevity.

Yet, that's complicated, isn't it?  It's going to require a tensor to
map each antenna slice to it's energy output. And it's a bit more
complex because for each SVE, to calculate it's E-SVE, you need the
sum of contributions for a particular timeslice. Because EMR travels
at the speed of light, we'll need to know that SVE's distance to each
AVE in the antenna. And therefore, the mapping for the tensor isn't
just space-to-space (or `(x,y,z) => (x,y,z)` or r-to-r), it's space +
time to space. Or `[r1 | ∂t*c == dist(r1,r2)] => [r2]` where ∂t here
represents the difference in time.... for ....brain fog

The energy contribution of each `AVE` can be summed to match the
output of the antenna.  We'll call this function `E-AVE()` and it has
another function coupled to it called `E-SVE()`, which is the EMR
energy in a particular volume of space surrounding it.  `E-AVE` can be
calculated as a scalar, or a point-like spherical vector field, whose
vectors' magnitudes sum to that scalar, approximately.  `E-SVE` could
be calculated similarly as a scalar value of energy for that volume
element, but for purposes of calculating values for regions on the
surface integral of `E-SVE` for specific timeslices of `t`, it may
help to retain that directional information.



### Convolutional Behavior

- The entire antenna isn't producing signal. i don't know the
  exact mechanics, but I do know that current flows to the outside of
  wires & electronic componets. I also know that fluctuating levels
  of Alternating Current push EMR outwards.  So it would make since
  that it is mostly only the current on the surface of the antenna
  which is contributing to EMR generation.
  - but how does one specify this mathematically?
    - either by creating a functional relationship between each AVE
      and a topological mapping to it's surface (which is kind of an
      approximation)
      - this requires a tensor and a topology, which is specific to
        the shape of the antenna
      - specific antenna shapes may require topologies which result in
        shapes that cannot be so simply mapped.  like donuts.
    - or a topological mapping that creates a 2D surface and from that
      a 3D mapping where the 3rd dimension is the minimum/average
      distance to the surface
    - a minimal convolutional model, where each AVE depends on values
      of it's adjacent neighbors and neighbors within n-distance
  - basically, if the AVE is close enough to the surface to be
    carrying current, then we want to sum that AVE into the
    EMR contribution for that time
    - but yet, the amount of EMR contribution is dependent on not just
      the current value for that state, but for several previous
      timestates. it's dependent on `∂I`, where `I` is the level of
      current
      - therefore, the values for each AME need to be retained for
        several steps at various timescales
      - and this will be useful for stateful interactions as well
    - a more detailed model would include values for adjacent AVE's as
      well, across several time slices.
      - i'm not sure how to structure this, dimensionally, but it's
        similar to a plate model in Probabilistic Modeling



### Radiation Dispersion and Anisotropy



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
