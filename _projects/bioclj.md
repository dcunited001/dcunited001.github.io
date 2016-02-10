---
title: "Bioclj"
type: project
date: 2015-09-01
repo_url: "https://github.com/dcunited001/skiima"
categories: ['Libraries']
display_order: 20
headline: Bioinformatics Algorithms Using Clojure
excerpt: This is a set of bioinformatics algorithms written in Clojure.
author:
  name: "David Conner"
tags: "clojure bioinformatics"
---

### Bioinformatics Algorithms Using Clojure

This is a set of bioinformatics algorithms written in Clojure.
Clojure works very well for many of these algorithms.  A language like
Clojure (but C-based) would be absolutely fantastic for farming out
some of these algorithms to Intel Xeon Phi coprocessors.  Some of the
best aspects of Clojure are reducers and transducers. The reducers
allow you to write an algorithm once in reduce form and, assuming
there are no side effects, immediately parallelize that algorithm's
execution across as many processors as you like.  It's magical.  With
transducer's you can compose these reducing functions together like
lego's.  You can compose them to seemlessly distribute them across a
network of workers. These could be machines with coprocessors, if
you've got that kind of budget.

However, Clojure overcomplicates some otherwise simple algorithms,
like those involving tries, for example.  Tries aren't hard to
implement in Clojure, unless you absolutely want to eek every drop of
performance out of your algorithm.  In which case, mutable data
structures are very convenient.  Of course, mutable and immutable data
structures could be combined, as you weave through the genomic
sequencing data, constructing the trie in chunks, then piping the
output tries to be merged and condensed by another process. Or
something like that.  Use your imagination.

> This process is very important.  Novel algorithms here means
> valuable new intellectual property.  If you significantly improve
> the trie algorithm, it means you can reduce constraints for genomic
> sequencing.  The constraints of sequencing are based on cost,
> methodology, time, and computing resources.  An improved algorithm
> here means more accessible genomic sequencing and a lot of money.
> (And yet, I can't find a job LMAO. It's fucking bullshit)

And one last point, if you absolutely, absolutely need the most
performance out of an algorithm and neither development time nor
build time are problems, then **C/C++ always the answer**.

### Nucleotide Neighborhoods in Linear Time

You can read more about it here in
[this post](/posts/2015-03-14-gpu-accelerated-string-neighborhood-in-linear-time.md).
In the post, I describe using dynamic programming and a bit of
ingenuity to write a string neighborhood algorithm for nucleotides
that runs in linear time, after the dynamic programming builds a
cache, of course.
