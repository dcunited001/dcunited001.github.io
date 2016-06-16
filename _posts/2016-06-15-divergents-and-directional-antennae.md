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

However, there's still a problem: in order to calculate a surface
integral for the shell of radiation at a particular time point `t`, or
to calculate the volume of a region of space within a timeslice at
`t`, we can't really specify that operation without either:

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

### Convolutional Behavior

So, yet another "gotcha" and this one kinda sucks.  The entire antenna
doesn't produce signal.  EMR is produced from alternating current

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
