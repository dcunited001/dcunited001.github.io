---
title: "Lemmings Animation in 3D"
headline: ""
---

- relevance to distinction b/w "almost certainly" and "almost never"
  - how can the design of terrain in this simulation imply that
    certain events occur with probability "almost never" and "almost
    certainly"
  - given constant parameters for the physicial interactions, if one
    numerically derives whether specific events occur either a.n. or
    a.c.:
    - what are the boundaries on parameter values?
    - if it is impossible to numerically derive whether events happen
      with probability "almost never", is it ever possible to then use
      analytical methods to determine the same (with complete
      confidence)

- in the design of levels for video games, the movement mechanics of a
  player and the enemies/etc on the level inform the construction of
  the terrain to ensure that specific events occur with probability
  "almost never"
  - e.g. in some levels it is possible for the player to fall off the
    level. in other levels, it is not possible whatsoever.
  - neglecting this understanding leads to poor level design and
    frustrating gameplay.
    - e.g. it is possible for the player to become stuck in a specific
      area of the level and never get out

### Three.js Lemmings animation design

- this is an animation, not a game
  - these can be lemmings or sociophysical particles.
- given some simple terrain, lemmings are created in the world in a
  specific terrain, which can be selected from several layouts.
- the lemming's movement is determined by a fragment shader. it's
  brownian motion, basically, that prefers to be oriented along
  steepest increase for the gradient of the terrian
  - they prefer to move to higher elevations.
  - each terrain is designed so that `grad(h)` compels the lemmings to
    move towards specific features of the level
- as the particles pass into some spherical region of the map, or
  below some `h`, they randomly drop from a point defined on the map

### Lemmings as Puzzles for Social Physics and Q-Learning

- Lemmings is basically a social physics puzzle

- Solving lemmings levels requires reasoning about physical systems
  probabilistically. This requires Q-Learning.
  - but the nature of the systems being solved and the puzzles that
    can be constructed implies that some puzzle-patterns are:
    - relatively easily solved by q-learning algorithms
    - unsolveable by

- however, for a specific puzzle game, how can a human (a biological
  q-learning machine) create a puzzle (with a solution) that is
  unsolvable by a computer?
  - informed by its experience solving puzzles, can a machine learning
    algorithm generatively design lemmings-levels using specific
    design patterns?
    - if so, can it generate puzzles that it cannot solve, but which
      are determined to be solvable?
    - or is it restricted to designing puzzles with design patterns it
      recognizes? no: because the composition of design patterns can
      result in puzzles of a completely different nature.
