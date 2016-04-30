---
title: "Lambda-Fu Powerup: Lenses, Prisms & Optics With Swift"
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

In the previous
[Lambda Fu Powerup](/posts/2016-04-27-lambda-fu-powerup-spectra-graphics-with-swift.html),
I discussed Spectra, a functional graphics framework I've been working
on, using Swift and Metal.  In this entry, I'm going to discuss some
specific techniques I've learned with functiona programming, beyond
the basic boring "Look at my glorious monads" post.  There's so much
info out there on introductory functional programming using category
theory, but there are very few posts I've seen that delve into
higher-level design concepts that build on monads, bind, etc.  At
least, there aren't very many that are written in a language besides
Haskell, which is pretty dense for someone who hasn't much experience
with it. Haskell intrigues me and it's near the top of my list for the
next language for me to learn, but I just don't have the time right
now.

### Optics: Lenses and Prisms

The answer to my problem has been **optics**, which is a pattern
borrowed from Haskell that enables you to zoom down into object like
structures, functionally, with **lenses** and **prisms**.  You can
retrieve data several layers deep by composing them together and also
compose their setters.  I'm going to assume that you're familiar with
the basics though because there's a lot of good content out there for
this.  I'll link to it at the end of the article.  I really think that
lenses are a great example of one of those higher-level design
patterns for functional programming that enable you to see what it's
*realllly* all about.

First, I'm going to tackle some high level concepts about why lenses
would be useful.  Some people just can't see it.  I saw some pretty
ugly comments on this
[lightning talk](https://www.youtube.com/watch?v=ofjehH9f-CU) on
lenses and prisms, where some people obviously just didn't get it.
And i'm not gonna lie, it's not easy to figure out.  Some libraries
are more basic than others and you're going to want to use lenses that
allow you to return objects of various type and arity because that
allows you to return a tuple containing your target and functions for
callback or continuation (i.e. retaining references for deferred
execution).  This is an important point though because there are a few
of libraries out there that don't give you the full **Lens<S,T,A,B>**,
which allows you to be more fluid with how you work with these
objects.

> If you can't return a different tuple for the modified source or the
> modified target, that means you can't return deferred functions for
> callback or continuation.

By the way, if you're using swift,
[Typelift/Focus](https://github.com/typelift/optics) is a fantastic
implementation of lenses.  It's broken down to be completely
functional and based on the `IxStore` monad.  It also includes the
`IxMultiStore`, `IxState` and `IxCont` monads, each of which has
several traditional operators implemented, like `bind`, `fmap`,
`imap`, `contramap` and `f-apply`.

**Note: if you don't understand what `IxStore`, `IxMultiStore`,
`IxState` and `IxCont` actually do in `Typelift/Focus`, then you don't
understand how to use this library** and you likely don't understand
how to use lenses.  If you're coming into this just by using Focus to
create lenses and prisms with getters and setters, you're missing the
point because that doesn't give you anything that object oriented
programming doesn't.

**You need to trace through the source from the Lens `zoom<X>` method
through the `IxState` implementation**.  After doing so, with some
reflection, I finally "got it" and I could finally say that I
understood functional programming beyond monads and simple
categories.  I still have a ton to learn, but that's why I feel that
learning about lenses is worthwhile for someone that's interested in
upping their ** *Lambda Fu* **.

So, I'm doing you a huge favor by writing this article.  No, it won't
include lots of code snippets.  In the past, for me, looking at tons
of Haskell and F# code snippets basically did nothing for me.  Writing
Haskell and F# code may have allowed me to get it, but I don't have
much experience with those languages.  Talking to the right people may
have allowed me to grasp it, but I don't know very many people in my
area who are interested in truly functional code.

I'm doing you a huge favor because I'm summarizing some functional
programming techniques, which for me were very difficult to identify
on my own.  For example, I'll describe how to process elements of a
tree or list in order to collect **continuation monads** to be
executed later.  When I review my first functional approach to
transforming XML node trees later, I'll explain how continuation
monads were really the missing piece.

### Parameterized Types for Lenses

#### S => Source

#### T => Modified Source

#### A => Target

#### B => Modified Target

Read over that real quick.  It's a bit confusing, but that's OK.  T
isn't the Target type.  If you're like me, you'll trip up on that a
few times.  A Lens is composed of a getter and setter. The `Getter` is
a morphism from `S => A` and the `Setter` from `(S,B) => T`. However,
a complete get/set operation on a Lens is a basically morphism from `S
=> T`.  With the getter, you extract from source `S` some target type
`A` into a context where you can modify it to type `B`, typically
outside the lens, unless using `Lens.modify` or `Lens.zoom<X>`.

### Zoom [rename section]

Sounds pretty simple, right? Here's where things get interesting.  You
can also use the `zoom<X>` method from to inject affect the arity of
data returned from a Lens Getter. That is, you can use `zoom<X>` to
return not only the object you're inspecting.  In order to use `zoom`,
you'll need to understand `IxState`, which is a state monad
implementation. However, you're basically just zooming into the lens's
context and passing the `IxState` down to it.  This returns another
`IxState` coupled to the lens's getter context and the `IxState` is
essentially a monad that transforms the lens getter into type `S =>
(X, A)` where `X` is whatever type you passed in with the `IxState`
arg to `zoom<X>`.

#### But what does it alllll meannn?!

What all this means is that not only can you retrieve whatever `A:
Target` type you normally retrieve with your lens, but you can also
perform some transformation using other elements available in the
closure of the `IxState` monad you passed in to return a tuple of type
`(X, A)`.  Here `X` could represent some kind of `state` or an `enum`
coupled to transition behaviors for a state machine or simply a map of
collected callback behaviors.  In other words, whereas the lenses
typically process object-like data container types, the `zoom<X>`
method allows you to specify any type `X` that acts as monadic glue.

So, if on one of my XML nodes, I define a property that tells my
generator that I should always register this to a dependency injection
container, but only after `generate()` has completed processing all
nodes, then I can use `zoom<X>` to return a callback with the
generated node.  I would then collect the callbacks into an array as
I'm processing the list/tree of nodes to generate.  And because the
closure for D/I registration was created within the `IxState` monad,
it's still coupled to the reference to the node and maintains that
until it's called later.  This is somewhat useful with one type of
callback, but moreso useful when you want to collect multiple types of
callbacks when processing a tree or list.

So basically `zoom<X>` and a few other Optics techniques allow you to
create an interface between object-like structures that hook them
together with a kind of functional state-machine glue. AFAIK, I am
still a novice here, but that's what it seems like to me. It's a kind
of `computational metatype` or something. Over the past few days, I've
been thinking about whether there would be generalized `kinds` of
these `λ-glue` objects and, if so, what they'd look like.  I've also
been thinking a lot about how the typical functional operators `bind`,
`fmap` and `imap` would apply to lenses and prisms.  It's easy to see
what these do, but it's a bit harder to understand how to apply them
towards design without having a ton of experience.

### Modus Opticae

#### Other Incredibly Useful Techniques with Optics

The two main optics types are `Lenses` and `Prisms`.  I've covered
Lenses pretty thoroughly and these work great for for processing and
constructing `Product Types` -- tuples and structs.  Prisms work far
better for processing `Sum Types`, which are enums for Swift.  Sum
types are also referred to as `disjoint unions`.

- Lenses for Sum Types (tuples)
  - Prisms for Product Types (enums)

- describe the Store monad
  - like nodes of descretized trees of indexable operations
  - [A Schemer's View on Monads](https://news.ycombinator.com/item?id=5068196)
- describe the State monad
- describe how continuations can be aggregated
- describe a functional state machine for transforming and operating
  on tree-like or graph-like data structures
  - what is an appropriate design for the intermediate objects that
    are passed around and accumulate deferred behaviors






### Parsing XML with Swift

First of all, there's a lot of Apple developers that will be quick to
ask why I chose XML over PLists, since those would have been much
easier.  Yes, yes that was most certainly a mistake. However, I'd
still have the problem managing the parsed trees of data, regardless
of whether I'd used XML, JSON or PList.

And why would I spend so much time on this?  I was really searching
for a means of retaining functionality while ensuring my interface for
working with pipelines and the scene graph would be uniform, instead
of complicated and highly variadic.  I tried several things to achieve
this end.  I thought I could pass in a closure, along with metadata
for the tree of nodes I was generating, but this didn't resolve the
complexity.

While I found this to be a very useful pattern, actually
implementing it to override how XML nodes were generated into Model
I/O objects was clunky in real practice.  If one needed to replace a
mesh that was three levels deep in an XML node tree, it meant a
developer would have to mostly hand code a structure that mirrored the
node tree down three levels at least.  That is, it'd actually be
simpler just to instantiate the classes by hand than to ever use the
XML at all, if you wanted custom behavior by composing subtrees of XML
nodes together.  I eventually found

#### The SpectraInjected Tuple

{% highlight swift %}
// pass in a map of containers,
// - along with metadata to retrieve objects from them when necessary
public typealias SpectraInjected = (inj: [String: Container], options: [String: Any])
{% endhighlight %}

#### The MetalNodeInjector Closure

{% highlight swift %}
// A Closure to optionally inject
// - to enable some flexibility when generating a tree of nodes
public typealias MetalNodeInjector = (inj: [String: Container], options: [String: Any]) -
(inj: [String: Container], options: [String: Any])
{% endhighlight %}


#### The MetalNode Protocol

{% highlight swift %}
// Note: the typical java method of parsing XML nodes
// - with simple generics may have been superior

public protocol MetalNode {
associatedtype NodeType
associatedtype MTLType

var id: String? { get set }
init() // adding this blank initializer allows me to work with Self() in RenderPassAttachmentDescriptorNode extension
init(nodes: Container, elem: XMLElement)
func parseXML(nodes: Container, elem: XMLElement)
func generate(inj: [String: Container],
                   options: [String: Any],
                   injector: MetalNodeInjector?) -> MTLType
func register(nodes: Container, objectScope: ObjectScope)
// copy is required for ensuring immutability when retrieving nodes from D/I containers
func copy() -> NodeType
}
{% endhighlight %}





### Summary [edit section title]

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


### Resources

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

### Lambda Fu Powerup - Part 3 - Operators/Combinators

### Lambda Fu Powerup - Part 4 - HOAS & PHOAS - Alien Haskell Technology


#### on lenses and prisms?

- i want to write quite a bit about AST's, etc.  But I'm not sure if
  this warrants a completely separate part or not.
