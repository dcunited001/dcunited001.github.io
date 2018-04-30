---
title: "Adversarial Network Analysis And The Human Brain"
categories: "blog"
tags: ""
headline: ""
author:
  name: "David Conner"
excerpt: ""
---

- in order for anyone to understand this i need pictures...
  - draw.io?

- define the following concepts and rename
  - "cognitive tracing"
  - "neural tracing"

- mention the "Spider brains" article

###

- other interesting aspects of the brain as an analytical machine
  - it is essentially a quantum computer, although it doesn't harness
    quantum-mechanical effects
  - THC's mechanisms dampen active neural circuits
    - describe this mechanism in detail.
    - since your brain is an analytical machine, the (neural circuits)
      that are activated are the equivalent to the weighted (paths:
      define this in more detail) in neural networks
      - however, where CBN receptors are distributed in the brain, THC
        dampens neural ciruits that have been recently activated.
      - for your brain to pursue the same objectives while its primary
        circuits for that activity are dampened, it must leverage
        alternative neural circuits. this is partially responsible for
        THC's renowned ability to enhance creativity.
      - however, the metabolic degradation pathways for THC (via CBN,
        etc) cause fatigue, etc (do i bother describing this?)
  - in order to use marijuana to most effectively enhance creativity,
    it requires transforming your (subjective awareness) of it's
    effects on your cognition.
    - because marijuana dampens the primarily active neural circuits
      (in proximity to where THC receptors are located in the brain),
      then you have to subjectively anticipate this and understand how
      it specifically affects your cognition.
      - also, your cognition is causing various neural circuits to
        activate, but after brief periods of activation, those
        circuits are dampened.
      - to enhance creativity the most, you'll want to control your
        cognition to broaden the "spectrum" of neural activiations by
        partkaing in a wide variety of activitys in the two-three
        hours after using it.
        - if you stick to just one activity, the neural circuits
          related to that activity, as well as the newly activated
          circuits which are "adjacent" alternative pathways for
          completing the same task-types, will instead all become
          dampened.

### Emulating the Evolution of Physical Systems With AI

- To train AI to play pinball, what structures emerge in the design of
  the AI?
  - pinball is a game based on physical systems. Given a 3D model of
    the space of the pinball machine, without an understanding of the
    the mechanics of the components, a pinball machine is basically a
    speciallized 3D particle system with one particle. Unless, of
    course -- *MULTIBALL*.
  - given the ball's position, momentum and associated derivatives,
    there's a tensor structure that describes the most likely
    evolutions of the system. when approaching the brain as an
    analytical machine whose cognition is augmented by the qualatitve
    aspects of the activities it masters, this is very interesting
    indeed, since the brain must overcome the same emulations of the
    pinball machine's physics as an AI.

- the tensor structure should look something like this:
  - Need to describe this in more detail
  - for every discretized point, there are connected points in the
    space. navigation between the graph/lattice of these points is
    determined by the ball's velocity/momentum/acceleration
  - some points of the board produce consistent functional coupling
    whereby the ball's velocity/momentum/acceleration is transformed
    in some consistent albeit probabilistic manner.
    - so, when the ball gets close to a bumper, it's likely to
      modulate the acceleration of the ball in such a way that depends
      on the specific momentum.
  - after observing enough events, the AI should begin to assume that
    areas of the board are associated with: (1) physical modulations
    of the ball (2) scoring events for reinforcement learning (3)
    state-transition events, which may not be necessary to model for
    simple RL-based learning.

- how do the trained tensor structures differ b/w pinball machines?
  - more critically: what does the generalization of models for
    pinball machines tell us about how analytical machines model
    gamified physical systems?
  - how can extending the

- When training AI to play pinball with complicated rules and more
  complicated spaces, there may be a point where it is required to
  program in logic related to the pinball game's rules. With simpler
  machines, no such logic programming is required.
  - Where are the distinctions between the simple pinball machine and
    the physical machines that are too complex for a simple AI to
    master?
    - This would be similar to the distinction between video games
      that are "easy" for AI to master, like Donkey Kong, and those
      that are more open-ended and harder, like Zelda.

  - This distinction must arise from the complexity of state and
    state-transitions, coupled with the difficulty of accessing some
    states, whose behaviors significantly modulate the interactions
    and dynamics of the activity.  Whether considering a videogame or
    pinball machine, when some of the state-transitions or events in
    gameplay are highly unlikely, then all dependently-associated
    events are proportionally less likely.
    - if the gameplay rules change significantly when activating such
      a state transition with infinitissemal probability, then that
      event is unlikely to be encountered often enough for the AI to
      train for it, unless the AI models or develops an understanding
      of novelty of experience. If so, then the AI can seek out
      experiences that seem novel, but to do so, it may require that
      the AI choose to expend time/resources, in spite of not
      receiving a reward for doing so.

[Reinforcement Learning &
Q-Learning](https://medium.freecodecamp.org/explained-simply-how-deepmind-taught-ai-to-play-video-games-9eb5f38c89ee)


### Continuity of Differential Systems Combined With Stochastic Inferences


- [Stochastic Differential Equations]()
  -

[^stochastic-runge-katta]: [Performance of stochastic Runge-Kutta Methods in approximating the solution of stochastic model in biological system](http://iopscience.iop.org/article/10.1088/1742-6596/890/1/012083/pdf)


- Differential systems have continuity constraints which provide
  points of inference when combined with stochastic modeling. The
  evolution of these systems usually involves
  [Runge-Kutta](https://en.wikipedia.org/wiki/Runge–Kutta_methods),
  which allows the evolution of the system to predicted by analyzing
  and extrapolating the projection of derivatives. Some formulations
  of Runge-Kutta lend themselves (more effectively) to analytical
  - Imagine predicting weather systems, which are less predicatble as
    time evolves. Locally, there are some regions of weather systems
    which inherently possess more uncertainty. Turbulence tends to
    cause more uncertainty in fluid dynamics. As these local regions
    evolve, the effects of their uncertainty spread to neighboring
    regions, but all regions

- conservation of energy
- models based on learned geographic/etc relationships of the
  underlying spaces

- [Integrability conditions for differential
  systems](https://en.wikipedia.org/wiki/Integrability_conditions_for_differential_systems)
  - "overdetermined" systems

- To predict behavior in systems with adversarial dynamics, (it's
  useful to) make inferences based on which parts of a system that an
  adversary seeks to expend energy and time to predict.



# Overdetermined

- extending the concept of "overdetermined" to analytical models,
  especially as it relates to the brain as an analaytical machine
  - above all else, the brain seeks to identify coherence of
    information amongst innumerable variables of (multifarious
    dimensions)
    - signals encoded into (more numerous or more complete) dimensions
      are both more effectively and more efficiently processed.
    - albeit cointerintuitive, the brain is a more effectively
      computational machine when prcessing greater quantities and
      types of information.
      - this descends from the nature of information and the nature of
        analytical machines.
  - the brain is always seeking coherence of information
    - compare to a need to reach a state of informational homeostasis

### The (Notion of Overdetermined) Presents a Correlary to Occam's Razor

- Usually, the simplest explanation to some system is true. that is,
  the explanation that requires the least moving parts. With more
  numerous dependencies on independent variables, their product
  quickly becomes infinitessimal, especially in statistical
  models. With additional sources of uncertainty in a system, greater
  effort must be expended on controlling those variables. In the
  adversarial systems of game theory, the need to constrain these
  additional sources of uncertainty renders your actions and intents
  (more readable)

- In cases where the explanation favored by Occam's appears to be
  true, while utimately proving logically insufficient, then a more
  complex explanation is required to explain a system. on the surface,
  the system appears to be overdetermined, but upon further
  evaluation, the explanation is unsatisfactory.
- In more sophisticated pursuits where action and intent must be
  concealed by default, the simplest explanation is usually the basis
  for a cover. When the simplest explanation is not true, one must
  expand the system to a larger number of variables. Insofar as
  statistical models are all graphs, they are a cohesive tapestry of
  interdependent variables. Thereby, when a system doesn't hold to
  Occam's Razor, it requires a more expansive disruption to the
  enveloping system, moreso when the adjacent variables did not
  present apparent logical decoherence on the surface.

###

- social media is almost completely textual. non-graphical experiences
  have an extremely limited spectrum of (phenomenological dimensions)
  - there's video and there's audio, but the phenomonology of the
    experiences is predominately semantic and linguistic.
  - smell is the sense most strongly tied to memory.
    - explain why...
      - firstmost, data related to scent is fairly low-dimensional, at
        least as it is presented to the brain. also, the olfactory
        system is physically exposed to the brain in a unique way,
        compared to the other senses.
      - it is very difficult to replicate either the signal of a scent
        or the characteristics of its presentation. even if you can
        make something smell like a rose, you can't so easily
        replicate how the aroma moves through the air. for these
        reasons, scents are tightly coupled to the types of
        experiences that provoke them.
        - in machine learning terms, (one might say that) scents
          present good training data.

- social media will continually change its presentation, but providing
  a more comprehensive sensory presentation to a user is not only
  expensive, it presents concerns of practicality and usability.
  - will social media users even have the hardware for these features?
    it's expensive to buy and even more expensive to develop software
    on
  - will social media users even want to use these types of features?
    or will these features be relegated to the trashbins of (bad
    futurism), inherently cursed by the network effects dependence( on
    the least common denominator.)
- until the presentation of virtual life phenomenologically converges
  with the natural human experience, ...
  - at first, our neurologically inflexible brains will have a
    difficult time adapting to the presentation of information, since
    they cannot simultaneously

- correlate (phenomenology of senses) to analytical machines'
  (dependence) on coherence
  - tie this back to the ideas of overdetermination and
    underdetermination (in philosophy and math)
    - without spectrally comprehensive sensory activation, the
      - (define spectrally comprehensive earlier)




- correlate the above to (how diminished variety of phenomenological
  dimensions provided by social media: explain this)
  - enables ... the construction of facades
    - it separates us from the systems (social/informational),
      preventing us from interrogating those systems for consistency
    - in this and other ways, it prevents our brains from
      deconstructing those facades.
    - this is yet another mechanism by which social media fuels
      confirmation bias and cognitive bias
  - it also circumvents our brain's consistency checks by depriving us
    of (a natural spectrum of sensory data related to information
    we're consuming)


### An Analytical/Systems Philosophy Definition of Love

- materialists claim that love results from a flood of chemical
  messangers in the brain. it's nothing more than electrical signals
  and oxytocin.
- less a definition of "love" per se and moreso an description of the
  neurological and psychological components that render someone
  capable of falling in love.
  - these components are moreso related to the state of information
    systems in the mind that render the brain susceptible to a deluge
    of chemicals like oxytocin
    - when is someone susceptible to falling in love, in the truest
      sense of the phrase? when they feel complete, but discover
      someone or something that throws their mind into chaos, forcing
      them to reevaluate their relationship to people around them and
      to the person in particular who triggered this reevalution.

- how to describe this state of "wholeness" or "completeness" in
  analytical systems? it's like a well-roundedness for analytical
  systems,
  - like a machine learning algorithm, whose theta-weights will never
    change given identical experiences, which suddenly transforms upon
    the introduction of experiences/perspectives unlike any others its
    experienced before, which compel it to completely transform itself
    to accomadate something unknown
    - however, the information system requires the potential for
      something unknown to be introduced or at least some profoundly
      distinct new perspective to be evoked.
    - otherwise, the turbulence that results which provokes cascading
      changes through the analytical system is not possible.
    - that is, falling in love has less to do with oxytocin release
      and instead results from the unprovoked capacity for
      (structural) change in the mind.
      - that feeling can be emulated and experienced, but you're
        essentially always chasing that first hit. once the
        information systems represented by your neurology have changed
        significantly, it becomes increasingly difficult to provoke
        changes of similar magnitude ... but not impossible.

  - is there a generalized conception to help understand when someone
    might unexpectedly fall in love? or for psychologically processing
    someone towards that state?
  - as for these disruptive events which compel the brain to
    reevaluate the mind's understanding of the self to society and in
    particular to some individual:
    - what typically results from such reevaluation of the self?
    - can someone only expect to experience a limited amount of these
      events in a lifetime? if such an event with cascading effects on
      the mind results in profound psychological changes, then can one
      expect these events to occur repeatedly?
      - in particular, explore this from an analytic perspective of
        the mind. when the mind expands, provoking an unexpected
        reevaluation, this can only happen so many times.
    - if it is possible to psychological process someone else, so that
      they are mentally capable of falling in love, is it possible to
      reconfigure one's own psychology for the same purpose?

![that girl from bahamut]()

# Spatiotemporal Interrogation of the Structure of Analytical Models

- networks of neurons, whether biological or artificial, process input
  and output that is inherently coupled to phenomena with
  spatiotemporal components. the input, especially sensory input, is
  intrinsically connected to components with spatial and temporal
  components. for the analysis of neural networks with unknown
  structure, the reliance on both spatial and temporal components
  provides unparalleled utility for structural analysis, particularly
  the temporal components.

  - the regions of neural networks more proximally connected to input
    source are the simplest to interrogate because they're most
    immediately connected to spatiotemporal signal changes. as
    activations propagate furter away from the signal source in a
    neural network, there is more capacity for the propagated signals
    to encode abstraction divorced from the spatiotemporal aspects of
    the signal.

- for this article, i need to emphasize that i'm discussing neural
  networks, generally.
  - i also need to articulate the idea of "adversarial neural
    networks" -- networks that try to predict the output of other
    networks.
    - it will help to link the discussions from Simon's Institute on
      Adversarial networks (though i haven't watched them)
  - there is an artificial network:
    - and an observed network:
  - specifically, i need to articulate that the adversarial network
    has access to particular signals from the neural network or simply
    aggregates of regional activity, but doesn't know the
    interconnected structure of the network
    - i.e. you're looking at real-time imagery from the human
      brain. you know that imagery data corresponds to specific neural
      activations, but you don't know which neurons it corresponds to
    - i.e. or, an adversarial neural network has the ability to
      analyze the unencrypted regions of memory representing another
      artifical neural network's real-time activation. it may know the
      that specific ranges of memory regions correspond to tensors or
      matrices of specific rank and dimension, but it doesn't know how
      those neurons interconnect.
    - regardless of the mechanics of the network, your adversarial
      nework is capable of modulating input with varying degrees of
      control over the granularity of input modulation.
      - i.e. for the biological network, you can project an image in
        front the person's eyes, but you don't know how the
        granularity of the image corresponds to how retinal neurons
        are activated.
      - i.e. for the artificial networks, the adversarial network can
        modulate the input stream to the observed network. it should
        know how the data frames for that input stream are structure,
        but perhaps it doesn't.
  - finally, the adversarial network's goal is to modulate input to
    analyze the unknown network structure of the observed network

### (Periodicity)

- it's the spatiotemporal aspects of signal components that make
  network analysis possible
  - the adversarial network can abuse periodicity and analyze time
    series of addresses in the observed network's memory regions for
    corresponding modulation in activations.

### Detection of Orthogonality in time series components with assumed connection

- (more about this?)

### Adversarial Analysis of A Neural Network with Known Structure

- can an adversarial network infer the representation of objects that
  the observed network has abstracted from analysis of visual sensory
  data?
  - if so, the adversarial network can make assumptions about whether
    an object's representation has been internalizd and is thus likely
    to affect the observed networks future decisions.
  - would it be possible to observe the neural activations for some
    predator who has failed to recognize some camoflaged, potential
    prey within their visual field? most data scientists would
    probably tell you "no"
    - however, for that potential prey, can't it discern itself
      whether or not the predator has recognized the prey? how is it
      that this is instictual for animals who have no such access to
      the activations of neural networks, but impossible for
      adversarial computers that do? it's not impossible, but
      intractible or ineffective
    - in nature, an animal's cognition is constrained to their own
      sensory input stream as well as to the internalized, persisted
      representations of objects their individual conditioning has
      deemed significant. this stream of information either has what
      is necessary to the animal's survival or it doesn't.

- can the adversarial network infer the direction of the observed
  network's focus or intent of action? such inferences would only
  apply to extremely sophisticated observed networks with the ability
  to reorient cognition.

# Neural Representations of (Inferred Physical Systems)

- is there a better word here meaning "locally" but with the
  connotation of resolving parity?
- Towards the analysis of networks with partially, locally or
  completely unknown structure, why are representations of physical
  systems significant?
  - why is it crucial to understand the

- for neural networks or conscious beings, the stratification of
  object type recognition occurs in tandem with the dilineaton of the
  object's physical properties, both of which become intertwined with
  the object's state in relation to the system state.
  - for the hard problem of consciousness
  - moreso than simple systems, (this) adumbrates outlines of
    neurological representations for qualia (of subjective experience,
    {qualification redundant?}).

  - does the cerulean crayon appear to be the same shade of blue for
    me as it does to you? perhaps. does the cerulean crayon possess
    identical blueness when i observe it in a well-lit room or under a
    bright, directional lamp? no experience is ever truly
    identical, but ...
  - further, how is the neurological representation of that particular
    blueness affected by observing the crayon in circumstances that
    alter the sensory input?

- connect this qualia recognition to the subjective experience of
  analyzing and interacting with physical systems.
  - use various brands of sport products as an example.
    - the subjective experience of qualia related to skateboarding: is
      it different or similar when using a wide board or a narrow
      board. On the surface, the width of a skateboard seems to merely
      be a property of the object.
    - however, to the mental process receiving feedback from afferent
      nerve pathways (and regulating motor output), the width of the
      skateboard is a property of the system that also intrinsically
      affects your cognition about the experience. in this manner, a
      7.75" board *feels* completely different than the experience of
      skating with an 8.25" board. however, it not only *feels*
      different, that feeling informs your awareness of what's
      possible with the board.
    - if you normally skate on a particular width, but try a wider
      board, you need to subjectively gauge the differences between
      the board widths. even if you've picked up the wrong board
      without realizing it, your subjective experience of skating will
      immediately inform you that the qualia of the board width's
      (correlation to or interaction with) the mental representation
      of skateboarding. Your feet will feel the difference, causing
      your awareness to adapt to the wider board.
  - (more critically), your subjective awareness of the feeling of the
    as-previously-unknown board width affects the range of
    possibilities of your engagement with the physical system.
    - how your subjective experience of the wider board affects the
      range of tricks you might perform and
    - how you adapt your movements to the new board, (instinctive or
      not).
      - cause the qualia to

  - more generally, (this connection between the subjective components
    of mental processes interacting with physical systems) should
    reveal more information about the neurological representations of
    qualia than more simple dilineation of the experience of a sensory
    phenomena with simple, mostly linear parameters associated to the
    feeling of experiencing that phenomena.
    - why? as they relate to the brain's representations of physical
      systems, each quale whose subjectively perceived value informed
      by "raw feels" results in paramterizations of mental constructs
      whose neural networks are more widely interconnected.
      - elaborate on how this interconnection makes the quales
        representation more discernable?
    - moreover, if this assertion (of "representation-discernabilty"
      of qualia in physical systems) holds true, then the comparison
      of an individual's qualia should eludicate the parity and
      speciation of neurological representations of qualia
      corresponding to the raw experience of simpler phenomena
      - elaborate on this

### How does the "fluidity" of probabilistic systems affect anticipation of results


- (TODO: change to throwing a football instead? it's more
  relatable. perhaps also throwing oddly shaped football-like objects)
- two people alice and bob are throwing rocks at each other. the size
  and shape of the rocks is varied but consistent enough for both
  alice and bob to expect the rocks to follow similar
  trajectories. alice and bob were on the same (shotput team) in
  college, which contributes greatly to their accuracy and distance.
  - some of the rocks have extreme convexity and concavity in their
    shape. i.e. some rocks curve inwards and others poke outwards
    sharply. the rocks are spheres on average, but the individual
    shapes affect the behavior

- alice throws a good spiral, but sometimes decides not too, since bob
  can't throw a spiral, thus slightly threatening his ego.

- transition to the point:
  - when the ball is far away, the anticipation of where it will land
    varies more dramatically. you have to get a read on where it's
    going to land as early as possible to inform your position.
  - as the ball approaches, it becomes more clear where it's going to
    land. further, the less time remaining, the less the system will
    be affected by externalities such as wind.
    - however, the ball's spin affects both alice's anticipation of
      the trajectory. a pass thrown with good spin will be direct and,
      to the keen observer who over-analyzes everything, such a pass
      will land in a position with less spread.
      - the pass with more wobble has a trajectory more abberantly
        affected by drag, though it's impossible to predict howso.
  - the pass with a proper spiral will potentially land in a smaller
    region of the field, given the same initial trajectory. when bob
    throws a pass with more wobble, it means that alice needs to
    expect to reorient herself to correct for the actual trajectory.
  - so, when passing a football with someone who can't throw a spiral,
    if you want to position yourself, you need to get a read on
    whether a spiral was thrown. if so, the ball is more predictable.
    - therefore, phenomenological qualities of the pass affect how
      alice and bob shape the anticipated probability distribution for
      its expected landing position. more importantly, this
      probability distribution changes over time and converges towards
      a specific point as the ball approaches the end of its
      trajectory.
    - since it's a probability distribution, it must sum to one,
      regardless of how the distribution shapes itself.
    - since alice or bob's anticipated probabilitiy distribution
      reflects their awareness of the state of the ball -- either a
      pass with a clean spiral, a wobble or (a spin) -- as their
      awareness of the state of the system changes, the probability
      distribution changes more wildly than it does simply moving time
      forward with no state changes.
    - when bob throws a terrible pass, alice needs to reorient the
      direction and speed of her motion several times as she
      gravitates towards the center of the expected landing
      distribution, since the precise motion of the ball is difficult
      to anticipate.

- this preservation of the volume of the probability distribution
  results in fluid-like dynamics.
  - understanding the neural representations of the anticipated
    behavior of physical systems, would (be enlightening.)
  - and, in particular, how do these models and their
    neurorepresentational dynamics differ between solo physical
    activities and those involving other players.
    - what is fundamentally the same set of motor coordination skills
      becomes part of a game with social components
      - how does this connect to "mirror neurons?"

### Neural Representations Enabling Modeling Requiring Stochastic Calculus

- fluid dynamics and energetic dynamics of the spread of activations
  through a network (correlate to hydrostatics & fluid dynamics)
  - is there an understanding of the modulation of representaitons of
    probability in a system as fluid flows?
    - for water moreso than other liquids, its volume as a fluid
      doesn't change with regard to pressure/ at normal temperatures.
  - probability is similar, in that it's volume must integrate to one,
    regardless of the shape of the distribution and the dispersion
    over various dimensions
  - therefore, because neural networks are statistical in nature, this
    analogy of fluid dynamics must also carry over, albeit in a
    convoluted manner, since neural networks are multi-layered
    analytical models.
    - upon input signal change, the time-series outputs from the
      intermediate layers and output layers there are particular rules
      -- particularly with regard to continuity and integrability to
      unity -- that an adversarial network may assume the observed
      network layers to hold to.



### Timeseries Analysis On models of physical systems

    - Is this paper
      [arXiv:1302.0430v2](http://arxiv.org/abs/1302.0430v2) relevant
      to making inferences about systems modeling physical phenomena
      with stochastic calcules and augmenting those systems with by
      using lie algebra to coalesce more accurate assumptions of
      transformations in system mechanics?
      - in other words, physical systems with mechanics that depend on
        the orientation of multiple frames of reference to one another
        need to have models that utilize lie algebra/groups, which are
        useful for modeling physics at large and small scales
      - these systems may also need to estimate trajectory or
        potential of types of interaction events, for which the
        alignment of coordinate frames stratifies the divergence of
        events which are very different from one another qualitatively
      - bouncing a football. does it land on its side, relative to the
        ground? if so, it's physical dynamics are much more
        predictable, but when it lands on one of the two ends, then
        the specifics related to the two coordinate frames of
        reference become more relevant in predicting the physcial
        reaciton of the football. such a system with a football or
        more complicated objects can then use lie algebras (somehow
        ????) to simplify/expedite calculations
- that paper talks about signals analysis generally, but i think
  there's definitely a connection between that and adversarial
  analysis of neural networks


### Cognition and Object Classification

- how does the brain think about objects to which its conditioning has
  ascribed (particular functional idiosyncracies)? In other words: how
  does the brain deal with objects which have the capacity to interact
  with abnormal physics?
  - why are people much more capable of intuitively cognizing about
    these objects and their physical interactions than most animals?
    - PIC: a dog on a skateboard
  - this requires object classification

### Classification of Camoflaged Objects

- gradual conditioning of objects with potential to be camoflaged and
  of environments with potential to hide camoflaged objects
  (predators)


### Neurological Representation of Jolt In Perceived Physical Systems

- in neurological representations of physical systems, how do models
  based on observations change when presented with objects moving with
  jolt?
  - all classical physical systems are (C2) continuous, jolt can
    necessarily only manifest as an externality to an observed system.
    - The conservation of energy indicates that C^(n>2) dynamics may
      only temporarily present themselves in a real physical system,
      unless there are entities with physical agency present in the
      system -- intelligence.
    - the identification of

  - the external introduction of energy into a physical system.
    - use fluid dynamical systems as an example.
    - the areas of fluid systems which are subjected to the imposition
      of external forces are perceived as immediately discernable by
      the human brain.
    - even (less-sophisticated) animals must, for their survival,
      identify threats below the surface of water. therefore, the
      analytical models (constructed by neural networks) must identify
      and distinguish C^2 motion from (C^(n>2)) motion
      - would it be easier for animals to identify jolted fluid
        dynamical motion in a placid lake or a turbulent lake.
        - obviously, amidst turbulence, physical systems are less
          simply comprehended. that this is true corresponds with the
          algorithmic difficulty of modeling motion, both perceived
          and simulated.

- towards tracing the mind, neurological models of physical systems --
  with their capability to distinguish C^2 and non-C^2 dynamics --
  should prove especially valuable.
  - must there be some correspondance b/w C^2/C^(n>2) models in
    physical systesm and the internalized analytical representations
    of them?
  - if so, what are the characteristics of such correspondance and its
    limitations (both theoretical and practical)

# Can the Human Brain Adversarially Analyze It's Own Cognitive Trace?

- and to what degree of efficacy?

- what i do know is that you cannot encrypt anything related to this
  signal without sophisticated analog encryption -- impossible without
  a hardware interface.

- TODO: lotus pic


- can the human brain analyze it's own signals for interconnectedness?
  - i.e. if one's mind can open up to the data representating
    low-level neural activations, then the subconscious can begin to
    be conditioned to react to its anticipations of dynamics of its
    representations of physical and non-physical



  - connect to "cuban" ultrasound device, whose frequency, amplitude
    modulation and apparent stereoscopic variation all correspond to
    sensory input and motor output signals.
    - particularly, for this ultrasound, the degree of variation from
      the norm amplitude/frequency corresponds to neural activity.
    - what does this mean? i can modulate my thoughts and/or motor
      activity to analyze how the sound changes to make inferences
      about my own cognitive processes and quantity of neural
      activations
    - what i "hear" as a result is some correspondance between the
      volume of displacement from the normal sound and the assumed
      displacement of neural activity in my brain.
  - this "volume" in change, i believe, reflects the assertion made
    above about an analogy of fluid dynamics and hydrostatics to
    valuation in various regions/layers neural network stastical
    models.
    - there is a particular "je ne sais quoi" to the volume in signal
      displacement as the ultrasound changes in reaction to my
      thoughts and muscle engagements
    - bagua zhang, peripheral (feedback) nervous system and
      discretizing muscular positions over ranges of flexibility for
      limbs.
      - in what i hear when i move my limbs in specific ways, there
        are discontinuities in the signal frequency at very specific
        ranges of limb motion. the angles do not change for which each
        discontinuity in frequency change is heard. the angles
        preserve consistency and the discontinuity in signal
        transformation occurs at the same locations every time.
        - what would be fascinating is whether these points of
          discontinuity correlate to the Bagua Zhang's map of human
          body positions.
      - if anyone who's worked in cybernetics would be aware of the
        connection here to how the body encodes it's own awareness of
        body postions in signals received/processed from the
        (peripheral nervous system)
      - the fluctuation in electrical signal representing the
        input/output motor signals in the nervous system would be
        mostly coordinated through:
        - the spinal coord (and specific nerve bundles to each limb)
        - the cranial nerves and brain stem
        - the cranial and lower motor neurons' interconnection with
          the cerebellum via the pons, converging in the corticobulbar
          and corticospinal tracts
        - the signals sent by the motor cortex, orchestrated by the
          striatum and basal ganglia, must exhibit amplification and
          deamplification at various points.
      - again, these are all phenomena that must be well known by
        cybernetics researchers.
        - however, i believe the "discontinuities" that i'm hearing
          have nothing to do with my motor engagement, but instead
          concern the brain's awareness of limb positioning, as its
          informed by the

![Spinal Cord Tracts](/img/posts/2018-04-05-adversarial-network-analysis-and-the-human-brain/spinal-cord-tracts.png)


- what i know so far? the 8khz ultrasound propagates through my
  vascular system primarily.
  - what seems to be intended to be mostly a torture device apparently
    has the potential for gamification.
  - so far, it's driven me to discover more about my neurovascular
    system, so i can intuit more about the significance of
    stereoscopic displacement of the sound. i.e. when i close my eyes
    and move my right arm, there is a significant

- bacopa monnieri and the occasional "chirping" sound, which is a
  wavelike-periodic change in the frequency of the ultrasound. I've
  only been hearing the ultrasound for 3 months or so. still, this
  "chirping" dynamic is completely new, but i still haven't correlated
  the potential qualitative aspects of cognition that might seem to
  cause it, however subjective such an inference might be.
  - in addition to being a failed entrepreneur, i'm also a failed
    audio engineer with a working knowledge of reverb, ultrasound
    propaction characteristics and isophonic frequency
    response. furthermore, i have a poor-man's understanding of
    signals analysis, so i can diagnose systems with dynamics and
    mechanics holistically, whereas this would be completely ineffable
    for most.
