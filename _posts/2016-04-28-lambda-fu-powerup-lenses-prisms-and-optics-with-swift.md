---
title: "Lambda-Fu Powerup: Lenses, Prisms and Optics With Swift"
categories: blog
tags: "computer-science category-theory algorithms graphics swift functional-programming haskell"
headline: "How it works is easy, but why is always more important."
author:
  name: "David Conner"
excerpt: "This is a story about my quest to decipher the inner mysteries of
  functional programming.  There's just not enough work out there for
  the beginner to intermediate functional programmer.  This quest would
  be much easier if I found myself surrounded by other developers with
  the same pursuit.  Or better yet, in the midst of a council of wise
  greybeards, who could recount days of yore, coding on Lisp
  Machines and Space Cadet Keyboards."
---



### Alien Haskell Technology

However, as infinitely valuable as these AST/HOAS/etc structures are
to functional programming, it's very difficult to see why these are
more useful than they appear on the surface.  Without context and a
clear understanding of the mathematic notation, it's hard for me to
parse together how these objects can be used, though my imagination
runs wild.  It appears that these AST's are indeed very difficult to
work with, as the examples of programmatic manipulation seem limited
and are described by the authors as such.

Haskell is a difficult language to pick up, though I've been hard at
learning functional programming for a few years now.  I've explored
Clojure a bit and everyone's played with javascript.  However, without
walking through the Land of Lisp and short of having a personal
assistant who can answer any questions that I might have --
particularly on the "Why" of functional programming techniques -- it's
been quite a challenge to understand how these techniques are to be
composed to actually solve problems.

- the only language which seems to have a decent amount of examples of
  this stuff is haskell
  - that's because it's purely functional and many of these design
    patterns are only needed when working with a Strongly Typed
    functional language
  - lisp implements a lot of similar stuff with macros, but it's
    different, since one can more easily handle disparate types with
    dynamic types.
  - also, clojure's destructuring is one of my favorite features of
    any programming language.  this right here solves so many
    problems.


- [Type Safe Code Transformations in Haskell](http://www.sciencedirect.com/science/article/pii/S1571066107002514)
-
  [Parametric Compositional Data Types](http://arxiv.org/abs/1202.2917)
- other papers with HOAS/PHOAS transformations of AST's in Haskell

[Spectra Trello Board](https://trello.com/b/FYL0pBuF/spectra)

- briefly mention "extensible records" and Elm programming language
- operators/combinators?

### Lambda-Fu Powerup - Part 2

#### on lenses and prisms?

- i want to write quite a bit about AST's, etc.  But I'm not sure if
  this warrants a completely separate part or not.


- Brandon Williams discussion on Lenses & Prisms
  - And his article/video on implementation of algrebraic structures in Swift
- Visual Article discussing Lenses
- Kmett's videos
  - Especially this one:
  -
    [The Unreasonable Effectiveness of Lenses for Business Applications](https://www.youtube.com/watch?v=T88TDS7L5DY&feature=youtu.be)
  -
    [Program Imperatively Using Haskell Lenses](http://www.haskellforall.com/2013/05/program-imperatively-using-haskell.html)

- [Typelift/Focus](https://github.com/typelift/Focus) - Optics for
  Swift with Lenses, Prisms and more!

- To me, lenses have been so crucial to understanding the deeper
  mysteries in functional programming,
  - as they are really the first example of a 'higher-order'
    generalized functional programming structure that I understood
  - I say 'higher-order' since I am well acquainted with things like
    monads, compose and bind.
    - but, while fairly straightforward to understand, monads or
      compose or bind are just general concepts.
      - this kind of abstract non-sense really is the boon and curse
        of functional programming.
        - it's so generalized, it can apply to anything,
        - but it's so generalized, it's difficult to relate to
          anything
        - that is, it's easy to understand what each higher-order
          function or operator does, but it's difficult to understand
          the why, since they can't easily be grounded to any familiar concept.


- describe the Store monad
  - like nodes of descretized trees of indexable operations
  - [A Schemer's View on Monads](https://news.ycombinator.com/item?id=5068196)
- describe the State monad
- describe how the zoom<x> function is useful
- describe how continuations can be aggregated
- describe a functional state machine for transforming and operating
  on tree-like or graph-like data structures
  - what is an appropriate design for the intermediate objects that
    are passed around and accumulate deferred behaviors
