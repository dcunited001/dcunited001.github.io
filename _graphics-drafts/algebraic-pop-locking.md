---
title: "Algebraic Poplocks and Entropy of Motions..."
categories: "graphics"
tags: "graphics computer-science"
headline: "2D Particle Simulation"
excerpt: ""
author:
  name: "David Conner"
graphics_ui_layout: "graphics/2017-06-29-animating-the-gradient.html"
---

- this is all geometric mechanics
  - [parametric pendulum](https://www.youtube.com/watch?v=eC_TJeLcZ6A)
  - [parametric resonance](https://www.youtube.com/watch?v=Hi_4SsbwaeE)
  - every position on a
    [double pendulum](https://en.wikipedia.org/wiki/Double_pendulum)
    maps to the surface on a torus. here, this is why the
    configuration space can be mapped using a manifold.
    - for a double pendulum, the manifold transforms angles describing
      the system into coordinates on the surface of a torus.
    - to mimic the mechanical constraints of a joint, the surface of
      the torus can be limited to including only valid values of
      theta1 & theta2.
  - to symbolically enumerate the possible configurations of a n-joint
    system, one can discretize the space of (theta[1] .. theta[n]) or
    the surface of the toroidally generated shape.

- a primer on
  [geometric mechanics](https://arxiv.org/pdf/1206.3302.pdf).
- [configuration space of a double pendulum](http://www.nestedtori.com/2015/08/the-configuration-space-of-double.html)
- [distributing points on a 2-sphere](http://www.nestedtori.com/2015/09/distributing-points-on-spheres-and.html)

# Discrete Differential Geometry and Pop Locking

- discrete differential geometry to help define configuration spaces
  for joints in a body, where the distance between connected joints
  cannot change.
  - this is distinguished from the usual discrete differential algebra
  - the goal is to come up with a framework for specifying rhythmic
    movements of *any jointed body*, not just any jointed human body.
    - i.e. you could take any 3D mesh's skeleton and generate a
      framework for producing mesh morphs. so apply this higher-order
      functional math to a 3D mesh and skeleton and produce functions
      that enable you to move it rhythmically

### Combinatorial Generation of Involutes in the Configuration Space

- involutes are essentially unrollings of lines/planes
  - if you have a finite-length string and you hold one fixpoint, the
    involute is the set of curves that emerge from moving the free
    point to anywhere it can be moved and altering its curve in any
    way that length of unfixed string allows
  - also works with infinite length strings, but makes a bit more
    sense if you can hold two points fixed, but move the points

- so, with the language dancer's use, involutes describe the set of
  possible isolations where one point is fixed at a joint and the
  other joints are free to move anywhere.
  - with isolations, you could also hold several joints in place and
    try to imagine the isolations available with the joints between
    them.

- so in a jointed, discrete system where the distance between points
  is constant and motions of jointed 1-segments are constraint by the
  mechanics of those joints (i.e. shoulder joints only permit the
  segment to move at angles relative to the shoulder joint)
  - you identify a generator, which is a map for enumerating the space
    of available configurations of that joint.
    - the generator is a kind of higher-order manifold. it takes a set
      of joint positions with specifid constraints on motion
    - when given a set of new points for each joint, where the length
      of the segments is the same and the joint motion constraints are
      held, it produces a configuration of a body or 3D mesh skeleton
      that is essentially the body's position.
    - there is a higher-order kind of manifold on top of the 3D-mesh
      skeleton generator.
      - the manifold essentially enables metrics and distances that
        are held, so that the enumerated 3D-mesh skeletons can be
        constrained in some way.
      - e.g. for an arm from the shoulder down, you can say, enumerate
        the combinations of all body positions where divide each
        joint's range of valid motions into n-different angles.
        - for example, the elbow can move almost 180 degrees. if you
          want to combinate through the space of configurations for
          the arm, you can look at a set of mesh-skeleton positions at
          values of 180/n.
          - if n is 6, your looking at mesh-skeletons where the elbow
            is at 0, 30,60, 90,120, 150 and 180 degrees.
          - the rest of the joints are combinated similarly.
      - this way, the configurations for a mesh can all be enumerated,
        but there is a set of metrics (distance methods) that can tell
        you how "similar" a mesh skeleton configuration is to another.

### Evolutes

- check over this, how much does the evolute have to do with dancing
  and permuting different configurations of a jointed body? the
  involute makes a ton more sense (remove...)
- evolutes describe curves that emerge from a curve by selecting
  points... (define properly: it only works for this context when
  imagining the curves in a short line with low curvature. i.e. a
  straight line, with minor variation; otherwise the evolute changes
  in very unpredictable ways that aren't useful)
  - (depending on the curve?) when the normals of a curve result in
    evolutes that are increasingly closer to the original curve, the
    evolute that results is simply the original curve. the curve that
    is its own evolute is a straight line.
  - but if a curve is selected whose curvature can be changed
    slightly, there is a space of possible evolutes that emerges.
  - now look at the area (or volume) of difference between the curve
    and its evoluted form. the greater the area, the more motion.
    - for pop-locking this is more visually appealing. larger waves
      through the body look better, although the wave doesn't describe
      evolutes.
    - if your body is in a certain configuration, you might want to
      move it to assume the evolute of that position, for a range of
      joints. no one would ever consciously think of dancing in this
      way, but the idea is to create rhythmic distortion of a jointed
      body. the more distortion, as long as it's coherent and
      rhythmic, usually results in more visually appealing moves.



### describe math behind poplocking

- combinating sets of joints in human (and other bodies)
  - as balls/neighborhood for the enumeration of set pairs for
    isolation
  - "hilbert space"-like concepts for application/optimization of
    movement functions across
  - a universalizeable method for how the human mind can "score" the
    motion and correlation of motion in poplocking movement functions
    applied to pairs of isolation, applied to maximize score by
    observing the gradient of the optimal selected "hilbert space" for
    the isolation pairing
    - this "hilbert space" might not actually be a hilbert space. i'm
      probably confusing it for something else (draw a picture?)
    - how this universalizeable scoring method for perceiving
      poplocking motions is also related to
      driving/coordinating/choosing
      - that is there are overlapping domains for domain-types (types:
        scoring/driving/choosing)
    - so because these structures overlap, there is an AI notion of
      ping-ponging with the function applications of domains &
      domain-type structures (for domain types [A & B: (A), (A,B),
      (A,B,A2), (A,B,A2,B2)]
      - so the person driving the motions is utilizing generalized
        polynomial expansions across the combinatorial enumerated
        domains [A & B: (A), (A,B), (A,B,A2), (A,B,A2,B2)]
      - if the person perceiving is engaging their brain as attuned
        with experience, then they are running similar algorithms to
        optimize with [A & B: (B), (B,A), (B, A, B1)]
        - i.e. this translates into a mathematic modeling of: what i
          think, what i think you think, what i think you think i
          think

- and, for both functions A (driving motions/behaviors) and
  B (scoring/analyzing motions/behaviors):
  - what's happening here is that there is some metaphysical solution
    that the brain is trying to emulate by finding an analytical
    solution
    - the analytical solution can be mapped to some structure of
      neurons. the structure of neurons would not usually map
      one-to-one with the structure of the analytical solution
      - the analytical sol'n may not map one to one with the numerical
        sol'n, but it rarely may.
      - i know that the numerical sol'n for some problems is not
        modelable for some problems. in order to solve the problem
        with incomplete knowledge of the parameters (i.e. in some
        useful way)
        - then an analytical sol'n is required and solutions are not
          necessarily/ordinarily/usually exact, especially if the
          solution requires learning weights to the problem

- an inefficiancy arises when the human mind must relearn patterns of
  motion (or some abstract behavior/expression)
  - this is bc the mind is finding the structure for some analytical
    solution (ALL of which [sometimes] for a problem are combinatorial
    enumerable using binomials or combinatorials, at least to some
    degree of polynomial)
  - when it settles on a non-ideal solution to the problem or does not
    use a polynomial-expansion to describe values of weights, or the
    physical neural network representing that analytical solution is
    damaged, then the mind must repair itself by transforming the
    neural network from (A <- (B -> C))
    - where it's trying to simply go from (B -> A), but because it
      must transform its existing structure, it cannot
    - it instead must try to find some (B -> C), where C is the
      closest approximate solution to A from B
      
- ... maybe transition to something else... lulz

- connection to negative occupational therapy
  - how this explains why it's expensive to unlearn
  - why negative OT & cognitive behavioral therapy will systemically
    burden our population with unnecessary complexes
  - unlearning these anxieties, conditioned behaviors, neuroses and
    conditions is incredibly expensive for the brain & mind
    - especially when they are systemic in the person's psychology
      (i.e. the person's mind is overly dependent on or suffers as a
      whole because of these unnecessary, intended problems)
  - when a negative effect is intended through CBT and Occupational
    Therapy, it means the people designing these "treatments" are
    trying to maximize the negative effects and thus, trying to
    maximize the extent to which a persons mind/behavior becomes
    dependent on suggestion
- who the fuck pays for this shit when it goes horribly wrong? who
  does that benefit? why would someone want this for america if it
  redirects(WASTES) the wealth we generate from GDP


* thoughts on algorithms for poplocking both humans and non-human
  jointed objects,
* generalizations to AI & psychology,
* how negatively-intended cognitive behavior therapy unnecessarily:
  burdens our society and benefits liberals who are using it for
  harassment and mind control.


### Misc

- fighting style in martial arts, as it relates to the minimization of
  energy.
  - when and how does the aesthetic of the minimization of energy
    present itself in a fighting style?