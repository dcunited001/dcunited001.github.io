---
title: "Nonlinear Time Series: Hyperspectra, Dirichlet Energy and Stochastic Calculus"
categories: "blog"
tags: ""
headline: "On modeling dynamical systems with tensors and time series"
author:
  name: "David Conner"
excerpt: ""
---

- TODO: change title

- make it clear that, while i don't actually know this stuff, i can't
  stop thinking about it

- TODO: find picture of adjacency network
- TODO: include picture from "visible graphs" article




### Resources

#### &#x2605 [Simons Institute](https://www.youtube.com/user/SimonsInstitute): [Workshop on Tensor Networks and Simulations](https://www.youtube.com/playlist?list=PLgKuh-lKre10UQnP7gBCFoKgq5KWIA7el)

#### &#x2605 [Perimeter Institute](https://www.youtube.com/user/PIOutreach) (Canadian Research): [Tensor Networks Talks](https://www.perimeterinstitute.ca/research/research-initiatives/tensor-networks/tensor-networks-talks)

#### &#x2605; MIT 6.838 Shape Analysis: [Lectures](https://www.youtube.com/playlist?list=PLkHIj5SCfn3-FeWqD3xeOZWP2kQYY654o) and [Content](http://groups.csail.mit.edu/gdpgroup/6838_spring_2017.html)

Few topics have expanded my mathematic imagination to the degree that
watching these
[MIT 6.838 Shape Analysis](https://www.youtube.com/user/justinmsolomon/videos)
lectures did. I've only watched two hours of the content, but it took
me about twenty hours to process and absorb the requisite content. Why
am I so passionate about learning math that is out of my reach?
Because each new tool opens new worlds to me.

Shape analysis is like the artistic application of discrete
differential geometry. There is grueling emphasis on algorithm
composition towards performance, possibility and parity of artistic
vision. This is the stuff that Pixar movies were made of. Especially
during the 90's, you can notice (certain) artifacts constraining
artistic expression in CGI and video games. These apparent artifacts
aren't precisely visible but moreso descend from 3D artists adapting
their style of expression to fill in expanding range of technological
possibility. The tools, interfaces and rendering methods (used by)
Pixar and Dreamworks, represent the pinnacle of 3D technology and 3D
expression. You can see how the range of possibilities expanded, by
inferring how and why artists limited their expression styles and
object design to hide technological limitations.

### [What Is Duff's Device?](#what-is-duffs-device)

[Duff's device](https://en.wikipedia.org/wiki/Duff%27s_device#cite_note-3)
unrolls loops the C compiler did not optimize at the time, making it
an oblique dynamic programming technique that overcame compiler
optimization limitations. Tom Duff
[invented it in 1983](http://doc.cat-v.org/bell_labs/duffs_device)
while working at Lucasfilm. He later worked at Pixar, awarded several
rendering patents there.

### [Why Are Obscure Programming Techniques Relevent To Art And Industry?](#why-are-obscure-programming-techniques-relevant-to-art-and-industry)

Companies like Pixar maintained their competitive advantage by hiring
the top academic talent. This allowed them to extract the most
potential from the bleeding edge of academia. Companies like that are
intimately aware of upcoming developments in their field. Pixar needed
to combine ideas from the latest research on: homogenous/heterogenous
computation architectures, rendering pipelines, and computational
geometry techniques. To understand the impending expansion of
aesthetic possibilities in 3D art, as it is perceived by moviegoers
and video gamers, Pixar needed to stay agile in updating their
artists's creative interface, logistic production pipelines, and range
of expressive techniques. Understanding which computational geometry
techniques are mathematically possible -- and critically, when they
are computationally tractible -- is indispensible towards planning how
hardware/software can be financed, adapted and produced in timely
fashion to be used by the best 3D artists in the world.

# [Intro To Tensors And Algebras](#intro-to-tensors-and-algebras)

- title

There's a limitless variety of tensors found in physical and
mathematic systems, operating in spaces both euclidian and those more
imaginative. When you start looking into tensor calculus, you'll
undoubtedly find the
[Cauchy stress tensor](https://en.wikipedia.org/wiki/Cauchy_stress_tensor)
as a prototypical example. In
[continuum mechanics](https://en.wikipedia.org/wiki/Continuum_mechanics),
this tensor used to calculate the flow of stress through materials to
explain how the material has arrived at its stress state, what that
state is instantaneously and how the paths for
[deformation](https://en.wikipedia.org/wiki/Deformation_(mechanics))
might proceed in the future.

If the Cauchy stress tensor and those types of tensors operating on
physical and euclidian spaces outline your conception of them, then
it's difficult to imagine the full range of possibilities. Only when
you start to look into how these objects are used in the construction
of algebras will you understand their true potential.

#### Tensor Rank, Products and Sums

- how to talk aobut the dimensionality of data

- definitions:
  - mode: a base componet of a vector in a tensor (there's a better
    definition)
  - free algebra: the simplest construction of a non/multi/linear
    system where there are no constraints in place
    - (does this work for non-linear systems or only as a component of
      non-linear systems)
    - or is the notion of an algebra (specifying tensor product
      dimensionality, and the multiplicative and additive functions
      thereof) orthogonal to system linearity and systems in general?
    - the system is composed

#### Tensor Rank:

#### Mode:

#### &#8855; Tensor Product `dim(v &#8855; w) = dim(v) * dim(w)`

#### &#8853; Direct Sum: `dim(v &#8853; w) = dim(v) + dim(w)`

- tensors are a convenience, not a burden
  - (specific kinds of applications require tensor constructions.)
  - similar to how linear operators and <bra | ket> notation is
    designed to simplify/hasten work w/ math/physics (with... heavy
    utilization of (re-ordering) of functions)
  - tensors are designed to abstract away the complexities of
    dimensionality, the specificity of mode and the cumbersome nature
    of specifying indices in order to focus in on more pure,
    generalized mathematic relationships.

#### Algebras

- free algebra
- tensors involving maps b/w elements
  - tensors that operate on trees
    - language construction
  - tensors that require elements of variable length (e.g. to specify
    enumerable paths through a network/graph, where the length of path
    is bounded by the number of degrees)

#### &#2605; [Hopf Algebra]()

#### &#2605; [Partial Combinatory Algebra]()

#### &#2605; [Universal Algebra]()

#### &#2605;



### Convolution Of Structured Algebras With Tensors

- tie algrebraic convolution of values in the above to a model for
  hyper/spectral analysis which can be further convoluted with
  gradient/laplacian
  - (assuming the heatmap values map to edge activation values {?})
  - what kind of tensor products construct something like this and
    what maps tie these algebraic convolutions together?



# The (Eternal) Sublimation of Subjectivity

- Summarize: how math and technology (lead to unexpected developments).

- While liberal arts were traditionally considered less scientific and
  more subjective, they are quickly adapting. Cognitively, these
  skills are actually computationally harder and rigorously
  mathematic, albeit in abstract ways. Our mind operates
  non-deterministically with numeric approximations to optimal
  solutions in the course of generating literature, art and music.




#### "Magma" - Dr. Evil

![Magma]()




### ... [Combinatory Categorical Grammars]()

- CCG (is based on partial combinatory algebra)



- explain using CCG's for textual/semantic analysis of content.
  - with CCG you can combinate through all potential grammatic
    structures (for a language?) into an indexable, ordered collection
    of increasingly structure
    - (either countable? or can be made countable?)
  - using this technique, computational linguistics applications can
    compose this (highly-structured) algebra along with other
    algebraic structures created with tensors

#### Autosuggest Optimized Grammar With More Dense Semantic Content

  - example of CCG usage: identify overly-verbose paragraphs and
    permute the grammatical structures of multiple statements, fusing
    fragments with function words by optimizing a walk through a
    complicated multitiered graph.
  - another example: render a sentence to CCG, examine its CCG
    subunits.
    - join this with thesaurus algorithm informed by a semantic
      network and an understanding of the types of CCG subunits that
      particular words appear in where the semantic result of the
      sentence is similar.
      - you can identify synonyms that result in more succinct
        grammatic structures. (i really need this)

#### Metrics Of (Literature)

- a grammatical analogy of (..metric for writers), you can analyze an
  author's work to measure how varied, well-structured or succinct
  their grammar trees are.

- [Hapax Legomenon](https://en.wikipedia.org/wiki/Hapax_legomenon)
- deviation from
  [Heap's Law](https://en.wikipedia.org/wiki/Heaps%27_law) to quantify
  author's talent for using descriptive language.
  - for me, it's really hit or miss

#### Discourse Analysis to Construct Rhetorical [Valuation](https://en.wikipedia.org/wiki/Valuation_(logic)) of Non-Fiction

- [Discourse Analysis](https://en.wikipedia.org/wiki/Discourse_analysis)

- the need to handle 2nd order logic makes this impossible (i think?)

- [Lotka's Law]() & [Price's Law]()

#### Diffeomorphological Analysis of Contribution to Human Thought

- 



# (A Basis for A Generalized Model of Anything)

- title: this section focuses on using the tools above towards
  creating models for spectral analysis.


- correlate the picture below to a tensor of values with
  dimensionality equivalent to the graph's adjcency matrix

#### A Heatmap of Combinitorialized Signal Sources, With Hierarchical Relationships Forming One Basis For A First-Order Transvaluation

![Heatmap of Combinitorialized Signal Sources](/img/posts/2017-10-21-speed-of-thought-twenty-postulates-of-social-physics/viz-heatmap.png)


### (Converting a Graph Into A System With Time Series)

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
      - for edges that have integer values or real values, if they
        have some mimimum, this may be modeled with something like a
        [Pareto Distribution](https://en.wikipedia.org/wiki/Pareto_distribution)
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

- TODO: mention computational geometry

The techniques taught in Shape Analysis employes abstract notions of
both volume and dirichlet energy throughout the field.

    - Towards the computation of mesh parameterization with minimal
      distortion on the wrapped texture, a notion of dirichlet energy
      is used to maintain proportionality between the triangles on a
      3D object's surface and those triangles on the 2D surface of the
      parameterized texture mapping.
    - Here, a spectral approach improves the results and efficiency of
      optimizating dirichlet energy across the system. This energy
      provides an abstract measure of the global and regional variance
      between each triangle on the 3D surface and its counterpart on
      the 2D surface.[^spectral-conformal-parameterization] When the
      3D-to-2D pairs deviate significantly, this only adds to the
      system's dirichlet.
  - in

- "balance is key"
  - high dirichlet energy measures of graph values may indicate
    destabalization, especially high divergence/laplacian of local
    variations in dirichlet energy measures
  - move this down to section on equilibrium or to part three?


![Four Types of Hyperspectral Analysis](/img/posts/2017-10-21-speed-of-thought-twenty-postulates-of-social-physics/hyperspectral-techniques.jpg)



### Hyperspectral Analysis of Time-Series Graphs/Networks

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

#### Deconstructed & Recomposible Typological Behavior Recognition in Chaotic Systems

- everything above provides interrelated signals on extremely
  high-dimensional spaces, which can be used to specify/recognize
  behavior patterns
  - these patterns must be decomposable and recomposable
  - when the graph is extensible and/or inschematic, this becomes much
    more difficult.
    - there must be some more generalized means of specifying these
      patterns so they they aren't tightly coupled to specific schema
      of the graph structure

Towards the recognition of patterns of flow in energies around
networks, the innovative application of methods from Shape Analysis
would be instrumental. The paper
[Functional maps: a flexible representation of maps between shapes](https://doi.org/10.1145/2185520.2185526)
discusses how to structure functionally derived metrics to gauge
similarity between pairs of 3D objects -- one base 3D mesh and another
mesh that represents some point along a [mesh morph]().

- towards the recognition of objects whose parts have changed, but
  whose form remains mostly similar.

- one approach of structuring these metrics is discussed in the
  following paper[^functional-maps]


![Figure 2]()


![Figure 9]()


# (Resolving Performance/Space/Time/Complexity Constraints)

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

![picture of plate model]()

[^geometry-of-a-time-series]: [Geometry from a Time Series](https://doi.org/10.1103/PhysRevLett.45.712) N. H. Packard, J. P. Crutchfield, J. D. Farmer, and R. S. Shaw, Physical Review Letters (1980)

[^graph-based-time-series-analysis]: [Visibility Graph Based Time Series Analysis](https://doi.org/10.1371/journal.pone.0143015) Stephen Mutua, Gu C, Yang H, PLoS ONE10(11): e0143015 (2015)

[^multilinear-dynamical-systems]: Rogers, M., Li, L. and Russell, S.J., 2013. [Multilinear dynamical systems for tensor time series](http://papers.nips.cc/paper/5117-multilinear-dynamical-systems-for-tensor-time-series). In *Advances in Neural Information Processing Systems* (pp. 2634-2642).

[^spectral-conformal-parameterization]: Mullen, P., Tong, Y., Alliez, P. and Desbrun, M., 2008, July. [Spectral conformal parameterization](https://doi.org/10.1111/j.1467-8659.2008.01289.x). In Computer Graphics Forum (Vol. 27, No. 5, pp. 1487-1494). Blackwell Publishing Ltd.

[^functional-maps]: Ovsjanikov, M., Ben-Chen, M., Solomon, J., Butscher, A. and Guibas, L., 2012. [Functional maps: a flexible representation of maps between shapes](https://doi.org/10.1145/2185520.2185526). ACM Transactions on Graphics (TOG), 31(4), p.30.

[^type-driven-semantics]: Polajnar, T., Fagarasan, L. and Clark, S., 2013. [Learning type-driven tensor-based meaning representations](https://arxiv.org/abs/1312.5985). arXiv preprint arXiv:1312.5985.

[^type-driven-semantics-ccg]: Maillard, J., Clark, S. and Grefenstette, E., 2014, March. [A type-driven tensor-based semantics for CCG](http://www.anthology.aclweb.org/W/W14/W14-14.pdf#page=56). In Proceedings of the EACL 2014 Type Theory and Natural Language Semantics Workshop (pp. 46-54).

[^incremental-semantic-construction]: Kato, Y. and Matsubara, S., 2015. [Incremental Semantic Construction Using Normal Form CCG Derivation](http://anthology.aclweb.org/S/S15/S15-1.pdf#page=287). Lexical and Computational Semantics (* SEM 2015), p.269.
