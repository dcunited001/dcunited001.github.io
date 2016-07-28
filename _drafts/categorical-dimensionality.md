
---
title: "Categorical Dimensionality"
categories: "blog"
tags: ""
headline: ""
author:
  name: "David Conner"
excerpt: ""
---



- kind of a basis for sql data bases
- but basically the sum of different ways in which data can be
  organized, grouped and aggregated.
  - the number of different ways data can be manipulated:
    - within k = 0 to n, where n is the number of operations allowed
    - and where operations group, filter, aggregate etc
- once the data is processed & transformed in stream
  - then the data rows can be filtered, grouped, etc again
  - or selected from... which sounds a lot like sql or basically just
    data with operations and nested data/operations, but ...
- it can apply to decision/action types
  - and the action has information associated to it representing the
    data of the action and any functions to act on it with.
  - you can group these decisions/actions by functions based on the data
    - and this includes operating on your perceived reactions of
      - another actor/group, an opponent in a game
      - temporal, cardinal or ordinal data
      - that is, a set of elements at specified time intervals of a
        specific range
- data structure very similar to javascript/lisp,
  - more of a mathematic structure for declaring these kinds of data
    as well as macroing, configuring and running operations across
    different kinds of windows of your data

- if you have a set of data you are collecting on a interval of some
  size where the minimum value within some minimal/optimal range of the
  maximized value
  - then you can always(?) simulate the sequential collection of data.
    - and simulate data points that are exactly evenly spaced out
  - or at least you can if the data is collected on some kind of
    regular interval

- if you have a perfectly spaced time interval, you can retain the
  other data points as well and still predict the simulated, but
  interpolated points
  - you can prioritize the real valued

but it could model
  simultaneous/sequential/mixed games/subgames between any
  number/grouping of actors,

- given time-parameterized function and data points along a given
  interval, can you use fft results to accurately predict
  - more usefully, can you do this with irregularly collected data
    - that is, multi-dimensional fft where data for the multiple
      dimensions are collected on at intervals along a random of
      various window functions (uniform, bell, triangular, etc)
