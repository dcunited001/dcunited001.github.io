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

### It Zøøms Ze Thingz

Sounds pretty simple, right? Here's where things get interesting.  You
can also use the `zoom<X>` method from to inject affect the arity of
data returned from a Lens Getter. That is, you can use `zoom<X>` to
return not only the object you're inspecting, but also some
information about it or some monad to call later.  In order to use
`zoom`, you'll need to understand `IxState`, which is a state monad
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

## Modus Opticae

### Other Incredibly Useful Techniques with Optics

The two main optics types are `Lenses` and `Prisms`.  I've covered
Lenses pretty thoroughly and these work great for for processing and
constructing `Product Types` -- tuples and structs.  Prisms work far
better for processing `Sum Types`, which are enums for Swift.  Sum
types are also referred to as `disjoint unions`. So with prisms, you
can instantiate an enum type or evoke various transitions from them to
another.  And your getter produces an optional for the target, so your
morphism from `A => B` can handle the case where `S => A?` returned a
nil target.

As for the `IxStore<O,I,A>`, these are mainly a means to store context
(i.e. closure) for `Lens`, `Iso` and `Prism`.  When you create a
`Lens`, what `Typelift/Focus` does under the hood is create a function
that returns an `IxStore<A,B,T>`. This store is indexed by a value of
type A, the target returned by the lens getter.  When you run `set` or
`peek` on the the Store, you're accessing a coherent context for the
setter monad you created the lens with.

One thing that looks interesting for `IxStore` is "braiding" together
various `IxStore` objects returned for lenses and prisms with `imap`,
`contramap`, `seek` and `seeks`. I haven't done any of this
yet and since it requires 4 for 5 generics, so keep that in mind.  But
it may be very useful to do so, since you're recomposing lenses in a
more general sense than with just compose.

### Here It Is Y'all: the Hokey Pokey

> And that's what functional programming is all about: taking these
> small units of behavior and recomposing them as you need them.  And
> to do so, you have to construct your programs such that these pieces
> retain the ability to be recomposed.  The smallest pieces are the
> best, but the tradeoff is that it requires a ton of glue to
> recompose them in pursuit of a program that is actually useful.

I'm in search of a general technique for combinatoric deconstruction
of code & design patterns into small chunks of functionality which can
be algebraically reconstructed.  The issue is the same with functional
programming & category theory: and that is everything is so general
that it's difficult to relate the tools of functional programming to
the actual, concrete application of any problem.

### IxStore x Dynamic Programming

Another useful technique for IxStore would be an IxStore that memoizes
the results of retrieval and update operations for dynamic
programming. But it would only be useful in circumstances where you
can guarantee `B => T` to be deterministic. There are similar
performance optimizations and dynamic programming techniques when
you can guarentee that `S => A` is also deterministic.  In this
case, you can cache the monadic `IxStore` objects that that are
returned by the lens getter, and thus, the stores closure and
execution path can be predetermined.  However, many of these
operations are so fast anyways that you don't really save any time
by doing this. In general functional progamming is excellent at
enabling the developer to silently inject behavior to be utilized
for dynamic programming or to otherwise alter behavior.  Dynamic
programming techniques are only useful when you're given sufficient
memory.

### Simply Automorphic

Again, there are some optics libraries out there which don't provide
the four parameterized types for lenses.  `SimpleLens` and
`SimplePrism` are examples of these in `Typelift/Focus` and they're
useful for some situations I'm sure, but they lack the capacity to
provide most of what makes these optics so useful in functional
programming.  Without the full range of type parameters for optics,
you can't process your `Source` and `AltTarget` type to be stored in
an `AltSource` type that differs from `Source`.

That is, your **morphisms** on `Source` and `Target` are restrained to
**automorphisms**.  That means `AltSource` can't be a tuple of
`(Source, (Something -> Else))`, which restricts the capacity for
continuations.  Similarly, you can't modify `Target` and then specify
a tuple of `(Target, (Something -> Else))` as the `AltTarget` type for
your setter.  If you can do this, then you can trigger alternate
behavior that's coded inside your `Setter`.  Maybe you want your
setter to include conditional behavior triggered by it's parameters.
Or maybe you want your setter to execute an optional monad that's
included with the parameters.

You can't do the above, if you're restricted to `Source == AltSource`
and `Target == AltTarget`.  But, if you haven't done a lot of
functional programming in the past, you might have a hard time seeing
why this is restrictive.  At least, at first.  I did.

### Moar Zooms!!

Again, it's hard to adequitely summarize the utility offered by the
`Zoom<X>` method in `Typelift/Focus`.  It's so useful, especially with
`IxCont` and that computation metatype concept I just mentioned, which
seem like great ways to recursively process trees like parsed XML
docs.  Another design pattern that seems incredibly useful is using
`Zoom<X>` with `Lens.split()` and `Lens.fanout()`.  Doing so with
multiple lenses operating over similar Source & Target types could
allow you to evaluate the result of multiple similar operations. This
is basically like a kind of "horizontal composition." This horizontal
composition can also be usef to simultaneously retrieve both a
property and a pair it with the right monad to be continued.

> "Continue. Continue. Continue... Continue." - Dr. Pavel Pezner

And what `IxStore` and `IxState` essentially allow you to do is
construct these discretized trees of indexable operations.  These
functional trees are malleable via functional programming operators
and optics that allow you to braid operations together and specify how
you can insert new behavior into the branches of the tree at specific
points. That's like a 10,000ft view that summarizes what I've learned.

### Optical Lambda Trees

I'm really just making this shit up.  There is no such "thing" as an
optical lambda tree, but I'm not sure what to call this.  For
processing or transforming tree-like or graph-like data, there is an
inverted tree-like structure composed of either maps or tuples.  In
the case of tuples, the first entry is the next lens to cap on,
required for each of tis operations.  The next entry is a self-similar
data structure describing subsequent levels of processing.  For maps,
the keys are either values or lenses. If the key is a value, then no
recursion is necessary and the value attributed to that key is
processed with the lens stack.  If the key is instead another lens, it
is composed onto the current stack when processing the data attached
to that lens key.

And for this **Optical Lambda Tree** -- or whatever you want to call
it; I'm sure there's a better, more descriptive, more technical
name... Anyways, for this tree, there is an associated recursive
function, or dictionary with several defined & recursive behaviors,
that processes the tree of data using the "lens-tree" to provide
instructions and data access logic.  Such a functiona can also be used
to simultaneous iterate through the tree and collect data or
functional units of behavior to be applied later, as continuation
monads.

All in all, for a specific example relating to graphics, this
technique could be used to transform/update branches of a tree, while
storing information about which parts of a tree need to be registered
for dependency injection or be instantiated with buffer allocation
after initial processing is complete.  That is a great example of how
to use this to process the tree of nodes for a Scene Graph.

It's still complicated as hell though.  But so is any solution to the
efficient distribution of computing resources in a scene graph of
objects to be rendered.  It is very difficult to find a simple way to
distribute resources for rendering, while providing flexibility and
limiting complexity.  There are so many interdependent constraints.


### Unnecessary Abstraction

#### A quick fable on the seductive promise of "unified" frameworks

Usually frameworks that promise to simplify the deployment of a mobile
app to multiple frameworks actually increase complexity.  Instead of
the implementation details being a result of the complexity of the
union of those two frameworks, it's more like the complexity of one of
these frameworks is like the product of the disparity of those two
frameworks. Frameworks built on Cordova, like Ionic, can be useful
though, but you'll find yourself running into a ton of problems.

#### Moral of the Story

These unnecessary abstractions never actually simplify anything. A
solution that maps multiple problem spaces into one usually needs to
take into account all the complexities in each one.  Therefore, you
have to make a choice between flexibility and excessive configuration
or simplicity and convention.  But in neither case do you have a
simplified problem space.

> And so now you have FOUR problems: you need to learn the API for
> iOS, the API for Android, the differences between them AND the API
> for Ionic. Or whatever framework (not trying to pick on ionic here)

For Cordova-based frameworks, you'll find that many of the plugins
only have one implementation.  Or that the API/design of the problem
domain addressed by a plugin diverges so significantly that there is
no single API that could reasonably simplify it.

### Parsing XML with Swift

So now for a few, quick examples.  I just want to explore an
alternative to lenses.  This is the functional technique that I wanted
to explore first, before I discovered lenses.

First of all, there's a lot of Apple developers that will be quick to
ask why I chose XML over PLists, since those would have been much
easier.  Yes, yes that was most certainly a mistake. However, I'd
still have the problem managing the parsed trees of data, regardless
of whether I'd used XML, JSON or PList.

And why would I spend so much time on this?  I was really searching
for a means of retaining functionality while ensuring my interface for
working with pipelines and the scene graph would be uniform, instead
of complicated and highly variadic.  That's another thing that's
magical about functional programming -- **uniform interfaces**.
Fucking pixie dust. I love it. I tried several things to achieve this
end.  I thought I could pass in a closure, along with metadata for the
tree of nodes I was generating, but this didn't resolve the
complexity.  It was like a shell game where I was shifting the
complexity from the interface to the implementation.

While I found this to be a very useful pattern, actually
implementing it to override how XML nodes were generated into Model
I/O objects was clunky in real practice.  If one needed to replace a
mesh that was three levels deep in an XML node tree, it meant a
developer would have to mostly hand code a structure that mirrored the
node tree down three levels at least.  That is, it'd actually be
simpler just to instantiate the classes by hand than to ever use the
XML at all, if you wanted custom behavior by composing subtrees of XML
nodes together.  I eventually found that lenses and prisms were the
functional answer to this problem.

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

So, basically what I was trying to provide with this interface was a
means of expressing the differences between a parsed node tree and the
node tree that you want to generate.  For example, you might parse an
XML for an object to render representing a general type of enemy or
something. But say you want to reparse it and render one section with
a different color. Or apply a different texture to some meshes that
are located two or three levels into the mesh.  But you still want to
share 99% of the resources for the object.  That is, the data for the
triangles in the meshes, you don't want to allocate that memory that
twice if you don't have to.  That's expensive in terms of time and memory!

So, I wanted to find an answer to this so that it was simple and
efficient.  It's still going to be complicated, but I think that
Lenses and Prisms will help me delve in to a node tree, swap out the
things that are different, while still allowing me to share memory
resources.

Yet people want to act like I can't parse XML or some shit. Excuse
me for not having someone I can ask that just gives me the answers.
That'd sure be nice.

### Summary

So to mi, lenses have been so crucial to understanding the deeper
mysteries in functional programming.  They were really the first
example of a 'higher-order' functional programming structure or design
pattern that I understood.  I say higher-order, since I am well
acquanted with things like monads, compose and bind.  But, while
fairly straightforward to understand, monad or compose or bind --
these are just general concepts.

For me, the challenge is not how, it is why.  It's not how do I use
these tools, but where should these tools be used to acheive a design?
And how does one envisage the overall design?  And this abstract
non-sense really is the boon and curse of functional programming.
It's so generalized that it can apply to anything.  But again, it's so
generalized that it's difficult to attach to things in some concrete
way.

### Resources

Here's some resources that I've found to be invaluable in learning
functional programming techniques.

First of all, the
[F# for Fun and Profit blog](https://fsharpforfunandprofit.com) is
fantastic and so are Scott Wlashin's videos.  I'd recommend starting
out with [Functional Design Patterns]() and
[A Functional Approach to Domain Driven Design](https://vimeo.com/97507575).
Then, finally, take a look at
[Coding Like Frankenstein](https://vimeo.com/142347199), which is a
great story about Dr. Frankenfunctor and the Monadster.  These videos
talk about functional programming using F#, which is a strongly-typed
language from Microsoft, very similar to Haskell in it's capabilities
and implementation. I wish I'd known how cool that was about 7 years
ago lol.

> I'm impressed, Microsoft.

If you're looking for some Swift examples of functional programming
and, in particular, presentations on optics, here's some links.  First
of all, Brandon Williams has a lightning talk on
[Lenses in Swift](https://www.youtube.com/watch?v=ofjehH9f-CU) using
MST3K as an example.  What an excellent choice! Brandon also has a
blog on implementing
[a basis for algebraic structures in Swift](http://www.fewbutripe.com/swift/math/algebra/2015/02/17/algebraic-structure-and-protocols.html)
like Magmas and Semigroups.  I haven't watched it yet and I don't
really know what those things are ... but uhhh mag-ma!

![Doctor Evil - Magma](/img/posts/2016-04-30-lambda-fu-powerup-lenses-prisms-and-optics-with-swift/doctor-evil-magma.jpg)

Or... nevermind, I guess I was thinking about the implementation of
Magma in [Typelift/Algebra](https://github.com/typelift/Algebra).
Mr. Williams, where is the magma?

The best talk that I found in relating the usefulness of lenses was
[The Unreasonable Effectiveness of Lenses for Business Applications](https://www.youtube.com/watch?v=T88TDS7L5DY&feature=youtu.be),
which involves some Haskell, but not too much.  I love Haskell, but
it's a bit dense for me to parse right now.

Here's some other resources, that are great if you're not scared of
Haskell.  There's the illustrated
[Lenses In Pictures](http://adit.io/posts/2013-07-22-lenses-in-pictures.html)
article, as well as
[Program Imperatively Using Haskell Lenses](http://www.haskellforall.com/2013/05/program-imperatively-using-haskell.html)

## Lambda Fu #3

### HOAS & PHOAS - Alien Haskell Technology

So, next time, I'm going to explore AST manipulation and Type Theory.
AST's are ridiculously useful, but incredibly complicated.

These infinitely valuable AST/HOAS/etc structures are to functional
programming, it's very difficult to see why these are more useful than
they appear on the surface.  Without context and a clear understanding
of the mathematic notation, it's hard for me to parse together how
these objects can be used, though my imagination runs wild.  It
appears that these AST's are indeed very difficult to work with, as
the examples of programmatic manipulation seem limited and are
described by the authors as such.

Here's some articles that I'll be reading over the next month or
so. There is
[Type Safe Code Transformations in Haskell](http://www.sciencedirect.com/science/article/pii/S1571066107002514)
and
[Parametric Compositional Data Types](http://arxiv.org/abs/1202.2917),
as well as some other papers with HOAS/PHOAS transformations of AST's
in Haskell.

Haskell is a difficult language to pick up, though I've been hard at
learning functional programming for a few years now.  I've explored
Clojure a bit and everyone's played with javascript.  However, without
walking through the Land of Lisp and short of having a personal
assistant who can answer any questions that I might have --
particularly on the "Why" of functional programming techniques -- it's
been quite a challenge to understand how these techniques are to be
composed to actually solve problems.

And thats because the only language which seems to have a decent
amount of examples of this stuff is haskell. That's because it's
purely functional and many of these design patterns are only needed or
applicable when working with a Strongly Typed functional language.
Lisp implements a lot of similar stuff with macros, but it's
different, since one can more easily handle disparate types with
dynamic types.  Also, clojure's destructuring is one of my favorite
features of any programming language.  this right here solves so many
problems.

Another pattern I found to be immensely useful in my quest to process
these tree-like data structures are the **Extensible Records**
available in the Elm Programming Language.

That's it for today.  Peace!
