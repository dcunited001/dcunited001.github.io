---
title: Augment Your Lambda Fu: Spectra Graphics with Swift"
categories: blog
tags: "computer-science "
headline: "How it works is easy, but why is always more important."
author:
  name: "David Conner"
excerpt: "Dico ergo quia non loquimur de talibus naturaliter possibilibus sed
  miraculose possibilibus quod in uno parvo spacio et loco ut in loco
  grani milii vel sub eius magnitudine Deus posset formare valde magnum
  corpus, scilicet maius quam sit mundus et verum est quod illud corpus
  non esset in illo parvo corpore vel loco circumscriptive et
  commensurabiliter."
---

So, I've been struggling with a problem for the past few months and
it's a bit embarrassing honestly.  You see, I'm working on a Swift
graphics library called [Spectra](/projects/spectra) and I need to
parse XML.

> Yes, you heard me right: I'm having a hard time parsing XML.

So why is it hard?  Well, since I'm using Swift, I want to use the
language's strongly-typed functional capabilities.  I've been very
excited about all the reactive programming libraries and other
functional projects I've seen with Swift.  For me, it's incredibly
important to work on something novel, something fresh, which would be
an outlet for my creativity.  Why would I want to basically
reimplement an aged-old problem and recreate the wheel with yet
another "Look What I Can Do" graphics library?  Impressive?
Meh... Yes, actually.  Creative?  Not really.

### Spectra: A Functional Graphics Library on a First Party Platform

First, a bit of background on why I've spent so much time working on
graphics.

I first saw the opportunity when I began to work with Metal, an
alternative to OpenGL at the suggestion of someone on an Apple IRC
channel.  I compared the two frameworks and something clicked with me
when I was looking at Metal.  The framework seemed simpler than
OpenGL.  It was designed for both graphics AND compute.  I loved the
challenge of it - there was no one else doing this stuff! It was still
fresh.  There were no open source libraries or frameworks built on
Metal yet.

I smelled an opportunity.  Apple controls the design of chips on
mobile.  Metal is exclusive to Apple platforms.  Graphics is going to
huge very soon - and so is compute, with AI and machine learning
growing by the minute.  The allure of distributed machine learning was
alluring as well - compute cost could be offloaded to consumers under
specific circumstances.

Apple has always had an advantage in software performance, both
efficiency of compute and power consumption, that results from their
limited hardware platforms.  This constitutes a major advantage for
Apple -- they may end up having the most efficient graphics and
compute platform.  And though most people don't think of Apple as
providing a rich platform for gaming or VR, Metal might just make the
difference.

And so, I began to think that building a graphics platform might
present valuable opportunity later on -- or help me build credibility
in a technology economy where knowledge of 3D modeling, graphics,
algorithms and processing is going to determine who is most capable of
building the next revolutionary software products.  So even if my
framework with a novel functional design wasn't exactly revolutionary,
what I'd learn would make it worth my time.

### A Graphics Framework to Learn Low-Level Graphics

As I was learning to work with graphics and compute myself, I wanted
to build a framework that allowed me to explore various graphics
pipelines.  This means being able to take various meshes and
processing their vertices and surfaces in various ways.  I envisioned
many creative uses of graphics techniques using the primitives found
in Metal. I unintentionally used a compute shader to create what is
known as a tessellation shader in OpenGL.  I constantly found myself
reinventing known techniques in graphics.

So, wrapping Metal, MetalKit and Model I/O with XML should allow me to
explore various graphics techniques.  I could easily switch between a
rendering pipeline for basic 3D and one for Stereoscopic displays, for
example.  Or I could explore various means of processing to offscreen
textures or utilizing depth stencils.  Another major interest for me
was voxellization, which processes 3D data using voxels instead of
points and polygon primitives.  I also found myself recreating the
wheel with submesh indexing and mapping.  I wanted to construct
shaders which would basically process color, texture or other data in
a graph composed of a network of vertices on a surface, encoded into a
submesh.  I imagined this all before I ever looked at the Model I/O
API.  I had soo many beautiful ideas I could see in my head, but no
framework to build them with.

> The idea mentioning shaders processing elements in a graph of
> vertices in a submesh is basically Conway's Game of Life for 3D
> objects.

Exploring these concepts would allow me to visually demonstrate my
math and programming skills to the world in a way which no one could
deny!  And it would allow me to begin to understand algebraic geometry
and I could learn advanced math at the same time as producing a very
visual portfolio that would make it impossible for anyone to insinuate
that I lacked skill.  I am seriously so tired of that shit.

> If you think I am below you, could you maybe treat me in the same
> way I would treat someone who I perceived to be below my skill
> level?  I would offer that person authentic advice on where to find
> the answers to improve.

And so, I found myself designing a kind of novel rendering pipeline that
chains blocks of functional behavior to be sent to an encoder for the
GPU.  It seemed different than how all the docs online I was reading
were describing how graphics were processed.  This design would allow
me to dynamically restructure models that were being rendered or
switch them to be rendered with different pipelines.  In theory, this
design would also make it a bit easier (fingers crossed) to use the
parallel render encoder for Metal, which enables you to use multiple
CPU cores to direct graphics to be encoded.  So, functional paradigms
for a graphics framework offer simplicity (in theory) and more
manageable performance.

Furthermore, perhaps the most exciting for myself, functional
programming is based on category theory and so are the primitives for
constructing and manipulating geometry.  I could design a framework
that allows me to specify the definition of mesh constructions and
transformations as a composition of functions.  I should easily be
able to transform one mesh to another or subdivide it with a
tesselation or add attributes like surface normals, all with the
composition of fairly simply defined attributes.  Such a framework
for geometry would be amazing for providing visuals at a
lightshow. And I could finally learn how it all worked.

It was a bit frustrating for me to realize my natural talent for
this.  As with everything else, I found creativity surging, but the
time for implementation lacking. Still, not a single person has
contributed to my library. That's OK.  I'm pretty opinionated as to
the kind of design I want, but I would really appreciate any advice.

### Why XML for Spectra? And Why Is It Hard?

So again, XML would provide a universal means of defining objects my
program would work with, both the graphics pipeline objects and the
objects to be rendered.  And best of all, it'd be declarative.
Furthermore, it'd be fairly simple to transfer data about a 3D scene
over HTTP with XML to be rendered with shaders on a native app or in
VR.  This idea is all over the place and there are many similar
frameworks for 3D with HTML Canvas.

But then, I found myself needing dependency injection badly,
especially when passing objects in for rendering.  I needed access to
everything, everywhere pretty much.  Yet, at the same time, I needed
**manageable** and **performant** dependency injection.  Graphics is
such a great problem for exploring hard problems in computer science.
It's not so bad, just exploring the pipeline or scene graph.  But as
soon as you get into resource management and memory allocation and
reference management, things get real hard, real fast.  I'm still not
there, but it made applying dependency injection a bit harder.  I
would need to manage how objects were organized as containers and
which objects were passed where.

And as I applied dependency injection, I found that this would be very
useful for manipulating objects in my scene graph as well.  That is, I
could define a set of shaders and construct a graphics pipeline once,
then when I instantiated everything, I could do so on several devices
or GPU's at once.  This is mildly useful for managing the pipelines.

However, for managing elements in my scene graph, it is incredibly
useful!  Again, I could define things once and read the XML nodes into
dependency injection containers.  From there, I can generate the XML
node objects into actual Metal and Model I/O objects, but before I do,
I can compose those nodes with other nodes or entirely replace some
branches of objects in the scene graph.  This is very useful when you
want your graphics framework to process **REAL-TIME GEOMETRY
SHADERS**.

I could duplicate the objects and allocate the copies to memory, as
the former is being rendered.  I could then apply geometry
manipulations as attributes on the latter copies.  I could alter the
surface normals or change the texture coordinates or add more vertices
(and update submeshes accordingly) to prepare for a transformation
from one shape to another.  And then, once those geometry morphisms
were complete, I could execute a deferred callback to swap out the
objects being rendered and another callback to deallocated the former
copies, only retaining the copied objects afterward.  AFAIK, all of
this stuff is incredibly challenging and not very easy with existing
frameworks.

But these capabilities were only possible if I could read the scene
graph into D/I containers just the right way so that resources could
be easily managed later.  And this depended on working with the trees
of XML nodes in an unusual way.  Any design that I approached seemed
to make the problem space just as complicated as if I didn't have XML
at all.  This is because the meta-structure for an tree is almost as
complicated as the tree itself, which means that manipulating the tree
programmatically requires knowledge of the tree structure.  And *THAT*
means, that it's pointless to read in the objects in XML, since to
manipulate them, you need to know the structure of each tree and
subtree, which is ok if you're hard coding units of behavior.  Yet, if
you want arbitrary manipulation of objects in a scene graph, things
become quite a bit harder.

### Learning to Swift the Right Way

I explored a ton of different ideas in pursuit of finding the right
idea.  I wanted to take advantage of Swift's Haskell-like type system.
(I guess it's ok to refer to it like that).  I explored
metaprogramming and reflection with Swift, both of which are fairly
lacking. I would go down the rabbit hole, so to speak, just to find
that there was absolutely no way to do the thing I was trying.  Then,
I would have to spend a ton of time backing out of the rabbit hole.

It seemed that classes were the way to go and that structs were more
restrictive, since they descended from `Any`.  But this conflicted
with everything I saw online.  It seemed like metaprogramming
faculties like `AnyClass` and `AnyObject` were less restrictive at
first, but this was only because I didn't understand how to use `Any`
or enums or structs.  I was starting to get it, but still, designing
with protocols, structs and enums from the ground up wasn't (and still
isn't) natural for me.  But I have seen the light.

I realized I needed more math and so I started watching tons of
lectures on everything: Abstract Algebra, Combinatorics, Matroids and
more.  But still, I couldn't find the elusive knowledge for working
with trees.  I looked at parser combinators and lexers.  I looked at
the documentation for Google's perfect design for generating &
managing DOM, parsed from HTML.  But still, that (and everything else)
mostly talked about generating a tree-like object from text or some
other form.  Instead of manipulating it.

I began to realize that what I wanted to do was moreso along the lines
of manipulating AST's, so I started looking into that and Type Theory.
I found HOAS's and PHOAS's, but those concepts were a bit much for me.
All the articles I found were written with obscure mathematical
notation.  I finally found Lenses and Prisms, which are the perfect
library for working with this kind of stuff.

## Augment Your Lambda Fu - Part Two

### Optics: Lenses and Prisms in Swift

So far, I've explained the benefits of a graphics framework, entirely
built on functional programming.  And it's viability of In part two,
I'll break down these miraculous functional programming data
structures.  I'll explore less of the **how** and spur your
imagination with a description of the **why**, which has been quite
difficult for me to learn.

If you want to learn more about Metal or Model I/O, I highly recommend
checking out Apple's WWDC 2014 & 2015 videos on the subject, which are
linked below. Also of use is the
[Metal for Developers](https://developer.apple.com/metal/) page, which
links to the
[Metal Programming Guide](https://developer.apple.com/library/ios/documentation/Miscellaneous/Conceptual/MetalProgrammingGuide/Introduction/Introduction.html),
[Metal Shader Language Guide](https://developer.apple.com/library/ios/documentation/Metal/Reference/MetalShadingLanguageGuide/Introduction/Introduction.html),
and
[Metal Framework Reference](https://developer.apple.com/library/tvos/documentation/Metal/Reference/MetalFrameworkReference/index.html),
all of which are immensely useful.  As I've gotten used to Apple's
documentation, I've found it to be some of the best, concise and
centralized of any platform or framework.

#### 2014 - [Working with Metal: Overview](https://developer.apple.com/videos/wwdc/2014/#603)
#### 2014 - [Working with Metal: Fundamentals](https://developer.apple.com/videos/wwdc/2014/#604)
#### 2014 - [Working with Metal: Advanced](https://developer.apple.com/videos/wwdc/2014/#605)
#### 2015 - [Metal Performance Optimization Techniques](https://developer.apple.com/videos/wwdc/2015/?id=610)
#### 2015 - [What's New in Metal, Part 1New](https://developer.apple.com/videos/wwdc/2015/?id=603)
#### 2015 - [What's New in Metal, Part 2New](https://developer.apple.com/videos/wwdc/2015/?id=607)


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
  - lisp implements a lot of similar stuff with macros

- [Type Safe Code Transformations in Haskell](http://www.sciencedirect.com/science/article/pii/S1571066107002514)
-
  [Parametric Compositional Data Types](http://arxiv.org/abs/1202.2917)


- briefly mention "extensible records" and Elm programming language
- operators/combinators?

### Augment Your Lambda Fu - Part 2





- Brandon Williams discussion on Lenses & Prisms
  - And his article/video on implementation of algrebraic structures in Swift
- Visual Article discussing Lenses



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
