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

- TODO: perhaps include greedy alg & matroid info in this article
  - correlate to signal representation & recovery
  - are there many such "atomic" representations of varying parity?


#### TODO: add description of multilinear linear systems,

- connect them to exterior analysis
  - especially the symbolic/structural impacts of nuanced
    differentiation onto multilinear systems
- refer to instagram picture?
  - and when you go from #Linear (with simple commutivity) to
    #MultiLinear, it takes shapes like this:
  - also, this picture helps with imagining shapes:
    https://math.stackexchange.com/questions/1115910/checking-that-a-3-d-diagram-is-commutative
  - and adds more complicated, less-regular shapings of paths for
    transforming the system symbolically. sooo... the local area in a
    commutativity diagram might then incidentally look something like
    a ferris wheel (but not really and it probably wouldn't be
    commutative). this is especially true once you take a system like
    this and differentiate it, then try to permute it symbolically.and adds more complicated, less-regular shapings of paths for transforming the system symbolically. sooo... the local area in a commutativity diagram might then incidentally look something like a ferris wheel (but not really and it probably wouldn't be commutative). this is especially true once you take a system like this and differentiate it, then try to permute it symbolically.

So I went on a run when I had a Eureka Paths through #Cohomology
Diagrams of #MultiLinear Function/al/s is like the Ambrosia for
Tensors ... and under some system configurations i.e. depending on
coordinates set for the 1-lifted dual vector space and the n-lifted
dual vector spaces of the BRAIDABLE(?!) co-chain that represents local
isomorphic “paths” from [(n-2, m-k) .... (n+2, m+2)] .... then the
image-kernel “transitions” from morphism to morphism can braid or
loop, though solving for precise equivalently isomorphic paths would
be complex, perhaps literally)


#### MultiLinear systems are relevant for GPS applications but...

are more profitable to learn for data science
applications. multilinear techniques are useful generally for physics
and engineering, as the #DifferentialOperator is a linear operator
that yields multilinear systems. so taking the derivative (gradient)
of higher-dimensional spaces for anything in vector calculus and
beyond yields the tools of #ExteriorAnalysis, but quickly becomes
complicated. #WedgeProducts (which are used for a "simple" definition
of divergence/curl) are not so bad in 3D because the number of
differential n-forms is fairly bounded by the few dimensions. In n-D
systems, the size of matrices/tensors required to complete model
differential apsects of the system are far more complicated.

#### For machine learning

for machine learning, to inform the backpropagation algorithm that
changes the weights from training set to training set, ideas from
#ExteriorAnalysis that build on #MultiLinear systems help you optimize
the selection of weights, especiaally if your algorithm extrapolates
many potential sets of weights simultaneously

- connect to energetic dynamics on high-dimensional surfaces &
  un/restricted boltzman machines

#### In astronomy

A good example of solving #MultiLinear system would be raytracing
light paths through compounded gravitational lensing, where the 2+
large galaxy clusters are separated by vast distances. Another very
interesting aspect of physics where these ideas are applicable is
considering/assuming the absence of #Jolt in real-world physical
systems without intelligent life. So, basically because all physical
laws (i.e. F = m*a = (kg * (m/s*s)) all max out at the second
derivatve, then when a third derivative emerges, it's interesting,
though not by itself indicative of intelligent life.

#### Detection of Jolt in physics

So, basically, when physical systems are left play out by themselves
with their own rules, then certain dynamics related to #WedgeProduct &
#ExteriorAnalysis show distinctive patterns and almost never exhibit
3rd or 4th derivatives. When those derivatives emerge in physical
systems, it is almost always extremely temporary and results from
high-level phenomena of the system that are usually interesting and
meaningful, for engineering or philosophy.

### Resources

#### &#x2605 [Simons Institute](https://www.youtube.com/user/SimonsInstitute): [Workshop on Tensor Networks and Simulations](https://www.youtube.com/playlist?list=PLgKuh-lKre10UQnP7gBCFoKgq5KWIA7el)

#### &#x2605 [Perimeter Institute](https://www.youtube.com/user/PIOutreach) (Canadian Research): [Tensor Networks Talks](https://www.perimeterinstitute.ca/research/research-initiatives/tensor-networks/tensor-networks-talks)

#### &#x2605; MIT 6.838 Shape Analysis: [Lectures](https://www.youtube.com/playlist?list=PLkHIj5SCfn3-FeWqD3xeOZWP2kQYY654o) and [Content](http://groups.csail.mit.edu/gdpgroup/6838_spring_2017.html)

#### IAS (simons institute on steroids)

#

Few topics have expanded my mathematic imagination to the degree that
watching these [MIT 6.838 Shape
Analysis](https://www.youtube.com/user/justinmsolomon/videos) lectures
did. I've only watched two hours of the content, but it took me about
twenty hours to process and absorb the requisite content. Why am I so
passionate about learning math that is out of my reach?  Because each
new tool opens new worlds to me.

Shape analysis (and computational geometry) is like the artistic
application of discrete differential geometry. There is grueling
emphasis on algorithm composition towards performance, possibility and
parity of artistic vision. This is the stuff that Pixar movies were
made of. Especially during the 90's, you can notice (certain)
artifacts constraining artistic expression in CGI and video
games. These apparent artifacts aren't precisely visible but moreso
descend from 3D artists adapting their style of expression to fill in
expanding range of technological possibility. The tools, interfaces
and rendering methods (used by) Pixar and Dreamworks, represent the
pinnacle of 3D technology and 3D expression. You can see how the range
of possibilities expanded, by inferring how and why artists limited
their expression styles and object design to hide technological
limitations.

#### Example Papers:


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

# ... (Computational Linguistics and Stylometrics)

- title: non-technical ... this section mostly focuses on data science
  w/ linguistics, stylometrics, etc

- CCG (is based on partial combinatory algebra ... {is it really?} )
  - where to describe PCA?

### [Combinatory Categorical Grammars]()



- explain using CCG's for textual/semantic analysis of content.
  - with CCG you can combinate through all potential grammatic
    structures (for a language?) into an indexable, ordered collection
    of increasingly structure
    - (either countable? or can be made countable?)
    - this is actually the ideal destination, but is usually not
      possible to generate this
  - using this technique, computational linguistics applications can
    compose this (highly-structured) algebra along with other
    algebraic structures created with tensors



- [General Type-Raised Categories]()
  - this is a name for higher-order CCG's
    - higher-order GTRC CCG's can be overlaid on top of the
      lower-order GTRC CCG's and CCG's
  - see these papers:
    - (1997) [Efficient Parsing for CCGs with Generalized TypeRaised Categories](http://repository.upenn.edu/cgi/viewcontent.cgi?article=1089&context=ircs_reports)
    - (1997) [Generative power of CCGs with generalized type-raised categories](http://dl.acm.org/citation.cfm?id=979686)
    - (1991) [Type-raising and directionality in combinatory grammar](http://dl.acm.org/citation.cfm?id=981354)

- [CCGbank: A Corpus of CCG Derivations and Dependency Structures Extracted from the Penn Treebank](http://www.mitpressjournals.org/doi/pdf/10.1162/coli.2007.33.3.355)
  - [OpenCCG](https://github.com/OpenCCG/openccg/blob/master/docs/ccgbank-README)

- why can't all CCG's be enumerated for a language from a set of
  grammatical primatives?
  - other than really, really, .. really, long infinte recursion, etc
  - are there limiting conditions for subclauses that can handle this?
    - or creative means of circumventing the uncountability issues
      here? needs to be countable


### Autosuggest Optimized Grammar With More Dense Semantic Content

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

### Basic Metrics Of (Literature) ... Stylometrics

- a grammatical analogy of (..metric for writers), you can analyze an
  author's work to measure how varied, well-structured or succinct
  their grammar trees are.

#### [Hapax Legomenon](https://en.wikipedia.org/wiki/Hapax_legomenon)

- using hapax legamemnon's and (meta?) locutionary signal as a kind of
  trackable beacon to gauge spread of influence.
  - for me, if people start writing about *semioteleology* or
    *sociohierchical territory*, i know my ideas have begun to
    influence people and a little about how that influence has spread.
  - according to google, i was pretty much the first person to use the
    word *semioteleology* in a manner not combinatorially generative.

#### Heap's Law

- deviation from
  [Heap's Law](https://en.wikipedia.org/wiki/Heaps%27_law) to quantify
  author's talent for using descriptive language.
  - for me, it's really hit or miss

### (Quantifying Conversation and Human Interaction)

- what is the point of this? how can it be used?
  - therapeutic: to help enumerate potential conversation pathways for
    completely clueless people like me who may have never walked
    through enough successful social interactions
    - with a meaningful quantity of statements/responses
    - i simply do not know what to say. it's only bc i have never been
      conditioned by enough experience

  - social interaction quantification:
    - to understand the paths they could have taken.
    - to understand what conversation paths or path types seem
      successful/engaging
      - are there measures of energy here? (informational energy)

- scoring/analyzing conversational ability with CCG/linguistic
  analysis to (quantify social vulnerability)
  - CCG typology of questions/responses,
    - where the [PCA]() is gradually & combinatorially opened up
      - information is gradually abstracted from the specific CCG
        representation.
      - this is necessary to measure similarity b/w statements ... but
        is disconnected from the semantic propositions established by
        statements.. (e.g. there is a car; it is blue; ...)
        - does this matter?

- for a language, generate structure that contains all potential
  grammatical CCG structures (of reasonable length)
  - as well as a means of addressing/mapping all the combinatorially
    "curried" PCA's for each CCG
  - wtf would this look like? is the top-level structure
    combinatorially enumerable (countable?)
    - i think so, if only normal form CCG's are included. it will also
      depend greatly on the language's grammar

- need a structure for analytics:
  - to tabulate frequency of CCG(& curried-PCA) occurances, then
    generalize with partial types in the first few levels of the PCA

- the results can identify individuals with severe social restriction
  (their frequency/variance of specific/partial statement types is
  profoundly diminished)
  - most of the "social interaction quantification" usages are too
    complex. it should be trivial to identify people who have severe
    restriction in conversational variety

- can map paths through graphs (built on semantics & typologized
  (grammatical ...))
  - also account for transitions (relationships b/w seq-to-seq of
    specific CCG types & their partial-type expansion)

### Seq-to-Seq Learning

- quick overview of learning/predicting sequence data
- what are n-grams?
  - how do they relate to language & specific contexts of language
    usage.

### Mention "Hapax" Idea?



### Discourse Analysis to Construct Rhetorical [Valuation](https://en.wikipedia.org/wiki/Valuation_(logic)) of Non-Fiction


- [Lotka's Law]() & [Price's Law]()
  - move up?

- [Discourse Analysis](https://en.wikipedia.org/wiki/Discourse_analysis)

- the need to handle 2nd order logic makes this impossible (i think?)
  - and the need to make inferences about higher-order
    logics/grammatical structures. or the usages of imagery
  - grammar is hard enough, but when it comes to understanding the
    intended semantic imprint of statements in an
    argument/description/narrative/etc,
    - methods of constricting the domain of extrapolated
      grammer/semantics by enumerating through highest frequency
      interpretations poses problems when the intent is to mask
      meaning:
      - (1) multiple meanings can be implied
      - (2) sometimes the intent is actually to use
        locution/imagery/etc that is less probably understood by the
        common reader
        - systems that usually pick the most probable grammatical
          structure interpretation(s) may fail -- even when the
          algorithm uses semantics to constrict/inform the choice
          - the frequency of CCG structures (constructed via treebank)
            does not follow a power law (does not cohere to zipf's
            distribution)
          - this has particularly important consequences when parsing
            the appropriate interpreted grammatical structure for
            statements, as well as extrapolating that to understand &
            infer the intended semantic imprint(s) of the statement(s)
          - if the author/speaker doesn't want everyone to understand,
            then they will intentionally pick low-probability
            ambiguous grammar and semantic imagery, so that it expands
            the domain of possible interpretations -- unless you have
            the keys that collapse the domain
            - semiotics & cultural universals form a kind of framework
              within which references to imagery are structured, even
              when there are many potential ways of mapping these
              signifiers to meanings
            - everything is based upon the human experience that we
              know. when you must communicate without writing, without
              words, how do you convery meaning?


### Diffeomorphological Analysis of Contribution to Human Thought

- describe how to analyze this in the age of internet & social media



### Tactically Reorder of Grammar For (specific) Semantic Emphasis

- reordering statements to delay "triggershock"
  - it's actually an impressively hard problem. as in, it's a
    computationally hard problem, where the most efficient solutions
    are unintentially discovered by people observing emotional
    reactions that others present to their statements.
    - they are then propagated. the statements that produce
      functionally relevant emotional reactions (e.g. humor, shock,
      etc) are duplicated and have greater propensity for
      self-replication

- however, one can algorithmically process many of the grammatical
  structres discussed above (i.e. CCG trees that are corrolated to
  their diffeomorphic impact on perceived semantic valuation)
  - homomorphic permutation of rhetorical components while preserving
    semantic impact. that is, one combinatorially permutes through
    grammatical CCG trees that hold fixed the result semantic
    valuation (or change in valuation) within some threshold.
    - if one enumerates all the possibilities, the list that results
      is a list of reordered grammar that the speaker/writer can
      assume establishes the same impact, semantically
    - one can then reenumerate over these statements, applying some
      functional analysis techniques to optmize them in some specific
      functional way.
    - such techniques are useful for comedy, rhetoric, debate, etc.
    - they allow you to enumerate all the possible ways to say
      something, in order to identify the specific statements which
      create the desired reaction amoungst various people.
  - the simplest such example of this technique is taking a CCG
    statement that contains a list of ~5 elements, each of which
    provokes a specific response.
    - the CCG allows you to permute this statement in at least (5!)
      ways, while mostly preserving the statement's semantic impact.
    - however, as the reader proceeds over what is functionally the
      same statement, completely different reactions may emerge in the
      reader's mind based on the ordering of the statements.
    - this idea basically lays out the design of such statements
      algorithmically.

- C := the semantic context of listeners
  - dC := the change in semantic context produced by a statement
  - M := the semantic meaning of a statement
  - dM := the difference in semantic meaning of two similarly
    structured statements
  - every statement S has some grammatically structure represented
    by a CCG.
  - the point is to represent the semantic meaning of a statement and
    its change in some contexts logical/semantic valuation
    - where a listener's context is the set of facts inferred from a
      speaker's statements...
  - then the algorithm would take some statement S, along with a
    context C and permute the statement's grammatical structure,
    extrapolating and comparing the C, dC, M & dM, which parameterize
    some function f which is to be optimized for impact.
    - there's no simple answer and the only way for an algorithm to
      know how statements affect a listener's context is evaluate
      every possibility.
    - for people learning to speak/socialize, we are forced to make
      assumptions about the listeners' contexts, which are necessarily
      imprecise, ephermeral and transient.
      - they are imprecise: we can't know someone's mental state.
      - ephemeral: it doesn't matter if we have a fairly accurate
        assessment of someone's mentally constructed semantic context
        because they can simply say they were thinking something else.
      - transient: everything we say changes what people are thinking
    - for people engaging in public speaking, the best way to make
      assumptions about the context of listeners in the audience is to
      have about 5 minutes to talk and hope they listen for long
      enough to construct similar enough informational contexts about
      your presentation/speech
      - when speaking about more intellectual endeavors which are less
        understood, it's practically hopeless, unless you can
        guarantee the background of your audience (i.e. they have
        degrees in X,Y,Z, etc.)
  - without understanding this concept algorithmically, it's possible
    to condition oneself with successful behaviors/habits when
    speaking publicly or in casual conversation.
    - however, if no one has walked you through these techniques (or
      you deal with neurologically derived communication issues) it
      can be incredibly challenging.
    - at that point, one can hope that people in society are tolerant,
      welcoming and understanding.
    - for me, almost every social endeavor (whether its family, etc)
      involves people playing "conversation keepaway" -- basically
      gaming the rhythm, topics and focus of conversations to prevent
      me from being able to have a chance to speak.
      - if i open my mouth, the topic is quickly changed. the focus of
        the conversation never falls on me, unless it is to
        chastise/belittle me.
      - i'm socially vulnerable as it is and have experienced nothing
        other than a decade of humiliation for no reason that can be
        explained to me.

- someone who repeatedly uses these tactics of reconstructing their
  statements for rhetorical optimization has almost certainly been
  taught to do so.
  - there are many reasons you might want to do so. you can reorder
    statements to lead someone on, only to make them laugh at the end
    or perhaps to offend them.
  - psychologists do this all the time: they plan their conversations
    and statements carefully, to draw the patient into revealing more
    information without putting that person on guard.
  - people also use this tactic in negative ways. regardless, you can
    only intend to do this if you have a ton of conversational
    experience and a high emotional intelligence.
    - again, the intent is to optimize the ordering/sequence of
      statements for emotional/informational impact. anything with
      high magnitude emotional/informational impact can be used with
      positive or negative intent.
  - (regardless), using this technique to tactfully rearrange
    statements requires effort and intent, both of which speak louder
    than any words spoken. again, it's a hard problem, with some
    general higher-order types of CCG permutation that are slightly
    more efficient.

# [Intro To Tensors And Algebras](#intro-to-tensors-and-algebras)

- title

There's a limitless variety of tensors found in physical and
mathematic systems, (operating in spaces both euclidian and those more
imaginative). When you start looking into tensor calculus, you'll
undoubtedly find the
[Cauchy stress tensor](https://en.wikipedia.org/wiki/Cauchy_stress_tensor)
as a prototypical example. In
[continuum mechanics](https://en.wikipedia.org/wiki/Continuum_mechanics),
this tensor used to calculate the flow of stress through materials to
explain how the material has arrived at its stress state, what that
state is instantaneously and how the paths for
[deformation](https://en.wikipedia.org/wiki/Deformation_(mechanics))
might proceed in the future.

#### Cauchy Stress Tensor

![Cauchy Stress Tensor](/img/posts/2017-10-26-nonlinear-time-series-hyperspectra-dirichlet-energy-and-stochastic-calculus/cauchy-stress-tensor.png)

If the Cauchy stress tensor and those types of tensors operating on
physical and euclidian spaces outline your conception of them, then
it's difficult to imagine the full range of possibilities. Only when
you start to look into how these objects are used in the construction
of algebras will you understand their true potential.

![Tensor Flow Image (somewhere)]()

#### Tensor Rank, Products and Sums

- how to talk aobut the dimensionality of data

- definitions:
  - mode: a base component of a vector in a tensor (there's a better
    definition)
  - free algebra: the simplest construction of a non/multi/linear
    system where there are no constraints in place ... (the only
    constraints are those imposed on (a) universal algebra)
    - (does this work for non-linear systems or only as a component of
      non-linear systems)
    - or is the notion of an algebra (specifying tensor product
      dimensionality, and the multiplicative and additive functions
      thereof) orthogonal to system linearity and systems in general?
    - the system is composed

#### Rank:

#### Mode:

#### &#8855; Tensor Product `dim(v &#8855; w) = dim(v) * dim(w)`

#### &#8853; Direct Sum: `dim(v &#8853; w) = dim(v) + dim(w)`

#### Fibers/Slices (relationship to fiber bundles?)

#### Trace: (include?)

- tensors are a convenience, not a burden
  - (specific kinds of applications require tensor constructions.)
  - similar to how linear operators and <bra | ket> notation is
    designed to simplify/hasten work w/ math/physics (with... heavy
    utilization of (re-ordering) of functions)
  - tensors are designed to abstract away the complexities of
    dimensionality, the specificity of mode and the cumbersome nature
    of specifying indices in order to focus in on more pure,
    generalized mathematic relationships.

### Tensor Methods For Inferring Structure From Data

- [Factor Analysis](https://en.wikipedia.org/wiki/Factor_analysis)
- [Singular Value Decomposition](https://en.wikipedia.org/wiki/Singular-value_decomposition)
- [Higher-Order SVD](https://en.wikipedia.org/wiki/Higher-order_singular_value_decomposition)
- [Multilinear Principle Component Analysis](https://en.wikipedia.org/wiki/Multilinear_principal_component_analysis)

- [Sparse Dictionary Learning](https://en.wikipedia.org/wiki/Sparse_dictionary_learning)
  - many-to-many example-to-class maps
    - where threshold determines examples matching class
    - here, the data destructures into groups of examples
      (matching class or classes) and can be operated on as groups

### Algebras

- free algebra
- tensors involving maps b/w elements
  - tensors that operate on trees
    - language construction
  - tensors that require elements of variable length (e.g. to specify
    enumerable paths through a network/graph, where the length of path
    is bounded by the number of degrees)

#### (from tensor algebra wiki)

\\( T^kV = V^{\otimes k} = V\otimes V \otimes \cdots \otimes V \\)

\\( T(V)= \bigoplus_{k=0}^\infty T^kV = K\oplus V \oplus (V\otimes V) \oplus (V\otimes V\otimes V) \oplus \cdots \\)

#### &#x2605; [Free Algebra]() (on [Tensors](https://en.wikipedia.org/wiki/Tensor_algebra))

#### &#x2605; [Lie Algebra](https://en.wikipedia.org/wiki/Lie_algebra) & Their [Representations](https://en.wikipedia.org/wiki/Lie_algebra_representation)

#### &#x2605; [Hopf Algebra](https://en.wikipedia.org/wiki/Hopf_algebra)

#### &#x2605; [Partial Combinatory Algebra](https://ncatlab.org/nlab/show/partial+combinatory+algebra)

#### &#x2605; [Universal Algebra](https://en.wikipedia.org/wiki/Universal_algebra)



### Convolution Of Known Structure With Tensors/Algebras

- tie algrebraic convolution of values in the above to a model for
  hyper/spectral analysis which can be further convoluted with
  gradient/laplacian
  - (assuming the heatmap values map to edge activation values {?})
  - what kind of tensor products construct something like this and
    what maps tie these algebraic convolutions together?






#### "Magma" - Dr. Evil

- PCA is a magma
  - i think PCA/magma's are the things i didn't "get" from functional
    programming, where it appeared that i should use lenses/optics
    - if so, these would allow you to destructure/restructure any
      parameterization
      - AND map any function parameterization to any other function
        parameterization
    - but if this is so ... then how?

![Magma]()


# (Learning Models For Time Series Analysis)

- title: this section focuses on using the tools above towards
  creating models for spectral analysis.


- correlate the picture below to a tensor of values with
  dimensionality equivalent to the graph's adjcency matrix
  - or connect to tensor factorization/decomposition via:
    - SVD/HOSVD/etc
    - method to produce sparse coding

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

### Dirichlet Energy on Graphs/Networks

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

### Spatiotemporal Analysis of Time-Series Graphs/Networks

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

### Application of Ideas from Stochastic Calculus Should Actually Result In Performance Enhancements

- [the uncertainty principle](https://johncarlosbaez.wordpress.com/2010/10/19/entropy-and-uncertainty/)

### Deconstructed & Recomposible Typological Behavior Recognition in Chaotic Systems

- (tie the functional maps below to sparse coding & representation
  learning techniques above)

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


### (Resolving Performance/Space/Time/Complexity Constraints)

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

# (unexpected technological developments)

  - pixar (needed to stay ontop) of academic advances in rendering
    tech and computational geometry, (but they were hardly trying to
    save the world)
    - in the near future, everything that precipates will be enabled
      by math, networking and computation. we're close to rendering
      obselete (the existing academic application of the scientific
      method)
      - developments computational medicine, chemisty, psychology and
        sociology will unfold faster than ever
      - the truth is usually the simplest explanation even if it is
        occasionally riddled with more paradoxes than should be
        attributed to a wholly beneficent God.
      - but these advances in all fields ranging from the sciences to
        the arts will reveal all, starting with the truth.
      - no one can expect all the ways this (trend) will unfold, but
        since math has been so well hidden in plain sight for so long,
        this will upset a lot of powerful people who felt secure in
        things (they didn't truly understand, they felt certain would
        not come to light)

- regardless of how or why it got there, people are going to see
  what's been swept under that rug all this time.
  - harmful or ignorant treatments in conventional medicine or
    psychiatry, especially those which were so rigorously vetted by
    academic journals, will be undeniably seen for what they are.
    - Modern healthcare institutions are (obsessive) about mitigating
      risk and liability, so they react appropriately when the
      wellbeing of patients is at stake.
    - In medicine, psychiatry has the most to worry about, the
      chemical imbalance theory is mostly a pill simple enough for the
      patient to swallow and only recently has accounted for genetic
      factors and epigenetic response. Any psychiatrist must have
      impressive (awareness) of neuropharmacology and many of their
      treatments are (helpful), though I believe that too often they
      treat the symptoms and not the cause.
      - by justifying and prescribing treatments solely through the
        lense of the chemical imbalance theory, patients tend to avoid
        augmenting their treatment with more effective alternatives.

    - Computational neurology will determine which psychiatric
      treatments work and why. If there are epigenetic mechanisms that
      explain why specific prescription medications lead to
      neurological destabalization, the results that computational
      medicine will quickly lead us to will be undeniable.
      - how psychiatry chooses to respond to this is critical.
  - the danger here is how quickly this relevations like these will
    accumulate. they will table-flip long-held
    (assumptions/maxims/truths) in nearly all academic fields
    - (things) well-hidden throughout history will become known

- the harder that the powerful struggle against this as it happens,
  the worst it will look. the best solution is to understand there's
  so much we couldn't have known, correcting our path to act justly
  and ethically, when need be. we should instead place our hope in
  words and actions that will certainly speak towards our credit. this
  phenomenon will affect everyone across the globe. it will generate
  effects that lend themselves towards being used, (which is the
  greater danger).
  - This is why we should have always acted as though God is watching
    and always was. We should assume all that was hidden will be
    revealed. This is a phenemonon of sociocultural transformation,
    resulting from man-made technology, so it need not be understood
    supernaturally. Still, it never hurts check yourself, remembering
    that there just might be someone upstairs who knows everything
    you've ever done.

# The (Eternal) Sublimation of Subjectivity

- TODO: this section is way off the original intent

- While liberal arts were traditionally considered less scientific and
  more subjective, they are quickly adapting. Cognitively, these
  skills are actually computationally harder and rigorously
  mathematic, albeit in abstract ways. Our mind operates
  non-deterministically with numeric approximations to optimal
  solutions in the course of generating literature, art and music.
  - Algorithms can decompose and understand nearly everything we've
    created, to a degree that defies the anticipation of our brightest
    minds, depending on the types of data and the complexity of
    analysis necessary.
    - algorithms empowered by the level of computational
      infrastructure we are soon to develop will table-flip many
      assumptions considered axiomatic in the humanities.
      - many controversial unsolved mysteries will be (resolved) as
        these techniques become more advanced.
        - e.g. [Computer analysis reveals Shakespeare's collaborators](https://newatlas.com/algorithm-shakespeare-coauthor-marlowe/46130/)
        - unexpected quantification of spirituality (neurological
          basis for meditation & other spritual experiences)
          - this goes both ways: the more spiritually inclined people
            claim "see, it was real the whole time." and the
            materialists claim "see, it was in your head the whole
            time."
            - the former is much more interesting, doncha know...
              - uhhhh you didn't know?

- TODO: explain more about how/why subjectivity fades away.
  - and why the tractibility of some problems means there will always
    be (some space) that can never be objectified

- From here on out, the illusion of subjectity pervading many aspects
  of life begin to fade away. (but it never completely disappears)
  - (Things) long held to be based on opinion and preference can be
    quantified
    - The way we exercise disernment to form opinions, engage in
      behaviors, participate in (hobbies/society/etc) becomes moreso
      defined by what we know at the time, even though we may have
      believed it impossible to ever know.
      - society adapts in several ways: institutions start to codify
        (things) formerly left to preference, promoting some and
        disdaining others. Many (things) will be prohibited or overly
        regulated.
      - even if you don't understand, those with power will have the
        ability to structure what is within their grasp to adhere to
        their reality. they might justify this via academia, but novel
        computational methods will justify these policies and
        regulations through arguments which could otherwise never be
        made.
    - in some ways, this is good. in other ways, it sucks the soul out
      of life by enabling those with "knowledge" inaccessible to most
      to dictate what an individual can be or can do.
      - by quashing the elements (contributing towards) our
        individuality, we threaten to undermine evolutionary
        mechanisms in society by encouraging homogeny.
      - in response, the individual should familiarize themselves w/
        the basis of their subjective perceptions (of each phenomenon)
        - (... and?)
      - society, while stress-testing data science methods (...),
        should also encourage individuals to continue exploring all
        paths. homogeny is the mother of weakness.

  - (bitemark analysis: there are huge connections b/w confidence in
    techniques like those and computational methods used in the
    humanities)psyq
    - the hardest part about designing studies using these methods is
      proving that one can be confident in the conclusions. if the
      analytical methods can't be proven, inferences and deductions
      provided by methods are circumstantial at best.
    - (regulations, policies, and ... etc) should always be
      questioned. where, in the past, these social institutions'
      (policies) were built around best understanding, preference,
      adherence to specific belief systems or the rights of
      individuals to believe in what they want, social institutions
      can now justify their policies through the unprecedented power
      of science and data.
      - knowledge has always been power. social hierarchies and
        institutions have always been designed with reason and higher
        goals in mind. those in power typically seek refuge in
        duplicitous or flawed reasoning, keeping the truth for
        themselves, while they squirrel away the knowledge of power
        (into esotericism) and place a neat red velvet rope around
        educational institutions.
    - Throughout the past, access to education was limited to
      aristocrats, the (priest class) and (to other selected few.)
      - the masses were controlled by keeping them in ignorance, but
        today, that differential in knowledge (between the select few
        and everyone else) *could* become proportionally greater than
        at any point in history.
      - we have to allow people to understand (the possibilities of
        technology)

- philosophical singularities {that word is too typical and too
  loaded}
  - insight that is relevatory to our understanding of life ends up
    sequestered away over time, (sealed behind social
    hierarchies). this has happened repeatedly in history.
  - an undercurrent of this dynamic seems to be playing out now with
    knowledge related to science/technology. people are encouraged to
    fear science/tech/math and especially extrapolations which sound
    outlandish.
  - there are specific (things) that must be established, gradually
    and hidden in plain sight, in order to seal people (inside a false
    paradigm)
    - we should be wary of this possibility because the
      disproportionate power granted by today's technology might never
      be overturned.
    - it seems impossible to hide knowledge/information now because
      we're all superconnected. (yet, can we freely use it? it seems
      like the creation of digital artifacts of this time is generally
      being suppressed).
      - since we're all living in this new world inundated with
        stimulis we don't understand yet, we haven't thought much
        about life without it or whether knowledge/information can be
        sealed away, in spite of being superconnected.

- power corrupts and absolute power corrupts absolutely
- this should be a warning: allow the relinquishment of neither your
  right to knowledge nor your right to individual beliefs.
  - there are obviously some exceptions, since technology can be
    dangerous.

- Summarize: how math and technology (lead to unexpected
  developments).
  - without at least a (working understanding) of the math concepts in
    this article, (these unexpected extrapolations) are almost
    impossible to anticipate.
    - don't necessarily need to be able to use the maths, but instead
      understand where they can be used, how they can be combined and
      why they address specific problems.
    - this gives insight into how advanced in math and computing
      translate phenomonologically into sociocultural changes
      - (they enable new business opportunities, change the ways that
        we communicate, etc. ... duh)


[^geometry-of-a-time-series]: [Geometry from a Time Series](https://doi.org/10.1103/PhysRevLett.45.712) N. H. Packard, J. P. Crutchfield, J. D. Farmer, and R. S. Shaw, Physical Review Letters (1980)

[^graph-based-time-series-analysis]: [Visibility Graph Based Time Series Analysis](https://doi.org/10.1371/journal.pone.0143015) Stephen Mutua, Gu C, Yang H, PLoS ONE10(11): e0143015 (2015)

[^multilinear-dynamical-systems]: Rogers, M., Li, L. and Russell, S.J., 2013. [Multilinear dynamical systems for tensor time series](http://papers.nips.cc/paper/5117-multilinear-dynamical-systems-for-tensor-time-series). In *Advances in Neural Information Processing Systems* (pp. 2634-2642).

[^spectral-conformal-parameterization]: Mullen, P., Tong, Y., Alliez, P. and Desbrun, M., 2008, July. [Spectral conformal parameterization](https://doi.org/10.1111/j.1467-8659.2008.01289.x). In Computer Graphics Forum (Vol. 27, No. 5, pp. 1487-1494). Blackwell Publishing Ltd.

[^functional-maps]: Ovsjanikov, M., Ben-Chen, M., Solomon, J., Butscher, A. and Guibas, L., 2012. [Functional maps: a flexible representation of maps between shapes](https://doi.org/10.1145/2185520.2185526). ACM Transactions on Graphics (TOG), 31(4), p.30.

[^type-driven-semantics]: Polajnar, T., Fagarasan, L. and Clark, S., 2013. [Learning type-driven tensor-based meaning representations](https://arxiv.org/abs/1312.5985). arXiv preprint arXiv:1312.5985.

[^type-driven-semantics-ccg]: Maillard, J., Clark, S. and Grefenstette, E., 2014, March. [A type-driven tensor-based semantics for CCG](http://www.anthology.aclweb.org/W/W14/W14-14.pdf#page=56). In Proceedings of the EACL 2014 Type Theory and Natural Language Semantics Workshop (pp. 46-54).

[^incremental-semantic-construction]: Kato, Y. and Matsubara, S., 2015. [Incremental Semantic Construction Using Normal Form CCG Derivation](http://anthology.aclweb.org/S/S15/S15-1.pdf#page=287). Lexical and Computational Semantics (* SEM 2015), p.269.



[^helmholtz-free-energy-for-simplices]:
    - Paper: [On Helmholtz Free Energy For Finite Simplicial Complexes](https://arxiv.org/abs/1703.06549)
    - Article: [Helmholtz free energy for simplicial complexes](https://www.quantumcalculus.org/helmholtz-free-energy-simplicial-complexes/)
      - basically, uses Gauss-Bonnet theorum to describe a basis for
        how a graph's structure itself has energy

- [Oliver Knill - Graph Geometry](http://www.math.harvard.edu/~knill/graphgeometry/)



[^representation-learning]: Bengio, Y., Courville, A. and Vincent, P., 2013. [Representation learning: A review and new perspectives.](https://arxiv.org/abs/1206.5538) IEEE transactions on pattern analysis and machine intelligence, 35(8), pp.1798-1828.

[^representation-learning-hyperspectral]: Chen, Y., Lin, Z., Zhao, X., Wang, G. and Gu, Y., 2014. [Deep learning-based classification of hyperspectral data](https://doi.org/10.1109/JSTARS.2014.2329330). IEEE Journal of Selected topics in applied earth observations and remote sensing, 7(6), pp.2094-2107.
