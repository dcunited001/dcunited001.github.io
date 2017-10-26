---
title: "Nonlinear Time Series: Hyperspectra, Dirichlet Energy and Stochastic Calculus"
categories: "blog"
tags: ""
headline: ""
author:
  name: "David Conner"
excerpt: ""
---


- make it clear that, while i don't actually know this stuff, i can't stop thinking about it


- TODO: find picture of adjacency network
- TODO: include picture from "visible graphs" article

- correlate the picture below to

#### A Heatmap of Combinitorialized Signal Sources, With Hierarchical Relationships Forming One Basis For A First-Order Transvaluation

![Heatmap of Combinitorialized Signal Sources](/img/posts/2017-10-21-speed-of-thought-twenty-postulates-of-social-physics/viz-heatmap.png)




- tie algrebraic convolution of values in the above to a model for
  hyper/spectral analysis which can be further convoluted with
  gradient/laplacian
  - (assuming the heatmap values map to edge activation values {?})
  - what kind of tensor products construct something like this and
    what maps tie these algebraic convolutions together?

> probably not actually going to type this all up in the blog

- TODO: move the content on spectral analysis to its own article?
  - or draft.


#### A Basic Model With Static Structure

  - (1) every edge in a graph is weighted with an activation value,
  - (2) all the edges' values can be rendered to an activation matrix
    with the dimensions as its adjacency matrix
  - (3) then `A(t)` returns the activation matrix at `t`
  - (4) there would be some notion of `P(t, v, d)` that returns a
    matrix of values b/w zero and one representing the probability
    that `(v-d) <= a(t) < (v+d)` is true
    - these notions of probability are much simpler with constraints
    on an edge's range of values
    - are they real, integer, or binary (the simplest)
    - at smaller sampling rates the models can be much more accurate
      - different sampling rates need fundamentally different sets of
        weights when training a model to recognize patterns, unless
        the model can anticipate varied sampling rates

#### Dirichlet Energy on Graphs/Networks

- a notion of dirichlet energy for variance of "optimal" energetic
  distribution of values and the actual distribution of values
  - where an "optimal" measure means the values are dispersed
    minimalized/idealized
  - this provides a global mechanic to the system so that it's
    "energy" is closed in a sense. dirichlet energy is used heavily in
    3D graphics
    - discrete differential geometry,
    - generation of mesh morphs,
    - preservation of volume under mesh deformation, etc
  - without near-total preservation of equilibrium for the globally
    minimized quantity, then dirichlet energy becomes very difficult
    to apply to a model in a useful way (i think)
    - this quantity might a generalized Volume metric for n-cliques,
      where V is some product of the clique's edge weights
  - i don't know that any of this is computable

- "balance is key"
  - high dirichlet energy measures of graph values may indicate
    destabalization, especially high divergence/laplacian of local
    variations in dirichlet energy measures
  - move this down to section on equilibrium or to part three?

#### Hyperspectral Analysis of Time-Series Graphs/Networks

- basically an inductive convolution on the spectral domain, followed
  by a deductive collapse (cyclic iteration?)
  - what would this be like for non-euclidian topologies like spectra
    derived from graphs & graph flows
    - in physical spaces, EM is dramatically affected by the
      emission/reflection/refraction/absorbtion of waves having
      various frequencies
    - assuming you can analyze input to read a full spectrum of EM
      with equalized amplitude, along with the orientation,
      - then the instantaneous EM signal contains information about
        the surfaces which contributed to that measurement of EM
      - even when the frequency components for the waves reflected off
        of different points on the surface and refracted as they
        traveled to that antenna's single point in space
  - some generalized concept of refraction through logical
    graph/network spaces? `R(f)` on some nodes that attempts to
    quantify how different frequencies will be distorted/refracted as
    they are propagated to subsequent nodes.

#### Spatiotemporal Analysis of Time-Series Graphs/Networks

- spatiotemporal analysis of spectrum
  - how do hardware approaches like wifi 802.11n's MIMO w/ spatial
    antenna array correspond to time-series analysis of
    graphs/networks
    - these antennae are spatially separated, but their geometric
      relationships to one another changes the inputs they receive
  - if graph nodes are thought of as antennae, then they too have
    geometric relationships to each other.
    - the sampling rates for the time series must either be
      - (1) effectively continuous (somehow)
      - (2) or samples of values are processed in such a way that a
        differential equation becomes possible.
        - but if you can't sample all the nodes at precisely regular
          time intervals, this becomes difficult
    - viewing nodes' geometric relationships to each other in this way
      provides a basis for a tensor product along the temporal
      dimension. `A(t)` becomes differential `A(t) = f(t, A(t-1),
      A(t-2), ...)`, which means model's algebraic convolution expands

#### Combinatorially Variate Gradient & Laplacian, as needed, towards the identification of Parallel, Anti Parallel and Orthogonal Motion in the network

- further convolute the model with combinatorially variate gradient &
  laplacian of the above types of data points

#### Application of Ideas from Stochastic Calculus Should Actually Result In Performance Enhancements

#### Develop the specification of deconstructed, recomposible behavior types

- everything above provides interrelated signals on extremely
  high-dimensional spaces, which can be used to specify/recognize
  behavior patterns
  - these patterns must be decomposable and recomposable
  - when the graph is extensible and/or inschematic, this becomes much
    more difficult.
    - there must be some more generalized means of specifying these
      patterns so they they aren't tightly coupled to specific schema
      of the graph structure

#### Performance Constraints

  - not all of this is tractible: the quantities of data points are
    hard enough just to sample, then computed/distributed/etc
    - result in too much memory, too many operations
    - in particular, the spatiotemporal analysis probably constrains
      the software design patterns to those that are much less
      efficient
      - i.e. can't just get a current copy of the data and calculate
        this step's result. it either requires more time or finding a
        really good haskell programmer.

#### A Plate-Model-like approach for

- how different is this from the spatiotemporal ideas above


![Four Types of Hyperspectral Analysis](/img/posts/2017-10-21-speed-of-thought-twenty-postulates-of-social-physics/hyperspectral-techniques.jpg)



[^geometry-of-a-time-series]: [Geometry from a Time Series](https://doi.org/10.1103/PhysRevLett.45.712) N. H. Packard, J. P. Crutchfield, J. D. Farmer, and R. S. Shaw, Physical Review Letters (1980)

[^graph-based-time-series-analysis]: [Visibility Graph Based Time Series Analysis](https://doi.org/10.1371/journal.pone.0143015) Stephen Mutua, Gu C, Yang H, PLoS ONE10(11): e0143015 (2015)
