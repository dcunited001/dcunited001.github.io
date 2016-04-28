---
title: "Lambda Fu Powerup: Spectra Graphics with Swift"
categories: blog
tags: "computer-science category-theory algorithms graphics swift functional-programming haskell"
headline: "Swift and Metal power novel new design for 3D graphics"
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

This is a story about my quest to decipher the inner mysteries of
functional programming.  There's just not enough work out there for
the beginner to intermediate functional programmer.  This quest would
be much easier if I found myself surrounded by other developers with
the same pursuit.  Or better yet, in the midst of a council of wise
greybeards, who could recount days of yore, coding on **Lisp
Machines** and **Space Cadet Keyboards**.

#### Weep now, for thee shall dream nevermore of greater splendor...

![Space Cadet Keyboard](/img/posts/2016-04-27-lambda-fu-powerup-spectra-graphics-with-swift/space-cadet-keyboard.jpg)

Bask in the glory of the  Cadet Keyboard, among whom there is no
equal! Wherefore art thou, Lisp Machine, oh divine purveyor of
opulence and majestic wisdom.. . . ... So, anyways, I've been
struggling with a problem for the past few months and it's a bit
embarrassing honestly.  You see, I'm working on a Swift graphics
library called [Spectra](/projects/spectra) and I need to parse XML.

Yes, you heard me right: I'm having a hard time parsing XML. Well,
technically, I'm parsing it just fine into node trees, registering
those into dependency injection.  The hard part is working with those
trees and allowing everything to remain generic and flexible.

So why is it hard?  Well, since I'm using Swift, I want to use the
language's strongly-typed functional capabilities.  I've been very
excited about all the reactive programming libraries and other
functional projects I've seen with Swift.  For me, it's incredibly
important to work on something novel, something fresh, which would be
an outlet for my creativity.  Why would I want to basically
reimplement an aged-old problem and recreate the wheel with yet
another "Look What I Can Do" graphics library?  Impressive?
Meh... Yes, actually.  Creative?  Not really.

### Metal and Vulkan Signal Opportunity for 3D Graphics

First, a bit of background on why I've spent so much time working on
graphics.  And then I'll describe the difference in design and
performance that functional programming can make for graphics.

VR means that Graphics is shaping up to be a high-demand
skill rapidly -- and so is compute, with AI and machine learning
growing by the minute.  The allure of distributed machine learning is
enticing as well -- compute cost could be offloaded to consumers under
some circumstances.

#### Look What I Can Do!

![Everyone's favorite 500 Line Triangle](/img/posts/2016-04-27-lambda-fu-powerup-spectra-graphics-with-swift/triangle.png)

#### I Drew A Triangle with 500 Lines of Code!

I first saw the opportunity when I began to work with Metal, an
alternative to OpenGL at the suggestion of someone on an Apple IRC
channel.  I compared the two frameworks and something clicked with me
when I was looking at Metal.  The framework seemed simpler than
OpenGL.  It was designed for both graphics AND compute.  I loved the
challenge of it - there was no one else doing this stuff! It was still
fresh.  There were no open source libraries or frameworks built on
Metal yet.

Metal is exclusive to Apple platforms. The competing framework Vulkan
was designed by the Kronos Group, a graphics industry consortium.  It
just came out and is impressive as well. I smelled an
opportunity. Since these major graphics developments just came out,
that means that there's a need for frameworks to be built for them.
The vastly superior flexibility of Metal and Vulkan implies
drastically novel implementations for higher level graphics
frameworks.

Yes, there are already existing frameworks like Unity and Unreal
Engine.  And yes, those frameworks have massive followings in the game
development world.  Developers have contributed years of their life
becoming familiar with those designs, so it's not going to be easy to
unseat them.  However, the new frameworks with a completely fresh
start on design are the frameworks that are capable of truly
harnessing the power of Metal and Vulkan.

The existing major players will want to take advantage of many of the
new features, like superior memory access modes and other
optimizations, for performance and flexibility.  Doing so will mean at
least two or more years of migration.  And they are anchored to OpenGL
support for older devices as well.  Even still, these larger
frameworks are locked into maintaining some design patterns for the
next complete major version at least.

And no, I don't think my framework will ever be on their level -- the
best thing it has going for it right now is the name, Spectra.
However, I'm excited to work on building a graphics framework from the
ground up with zero a priori knowledge on the traditional design of
such a framework, aside from what I picked up from the basic tutorials
out there.

### Spectra: A Functional Graphics Library

#### On a First Party Platform and Language

Apple tightly controls the design of their mobile chips.  Vulkan is
required to support a much wider array of graphics cards, which
honestly is still fairly limited since almost everything running
hardware from a handful of companies.  Check the
[Vulkan Hardware Chart](https://en.wikipedia.org/wiki/Vulkan_(API)#Hardware)
for more info.  For example, only NVidia cards from Fermi onwards will
support Vulkan and to varying degrees of functionality.  That's
basically NVidia's products from the last 3 years.  Support is not
uniform across operating system and the software interface may vary
slightly, both of which mean somewhat more complex software design or
more likely a markedly reduced usage of Vulkan's distinguishing
features.

Apple's minimal variance in hardware means performance optimization is
minimally complex, even though the reduced diversity in devices for
Vulkan means there's not too much of a difference here.  But more
tightly controlled hardware design for Metal-capable devices implies
several advantages.

### Metal Advantages Driven By Hardware

#### &#x2295; Faster consumer adoption of Metal-capable devices

#### &#x2295; Simpler software complexity to realize performance gains

#### &#x2295; Nearly complete Metal feature penetration.

#### &#x2295; Simpler software tooling for developers, like debuggers.

#### &#x2295; Segmented market means Metal is decoupled from other industry progress.

All of this translates into opportunity for Apple to provide unique
offerings to marketably distinguish it's graphical and gaming
capabilities.  That's Apple.  And to those who question my exploration
of graphics and gaming on Apple's platform, I have my reasons.  And
yes, the software developed to ride Metal will have a smaller market.
But that's a good thing.  The past decade has shown that Apple
platforms tap markets that are consistently more affluent and
sophisticated.

Apple has always had an advantage in software performance, both
efficiency of compute and power consumption, that results from their
limited hardware platforms.  This constitutes a major advantage for
Apple -- they may end up having the most efficient graphics and
compute platform.  They'll definitely have the earliest, most
consistent set of software tools for developers.  The Metal debugging
tools are fantastic, trust me. And though most people don't think of
Apple as providing a rich platform for gaming or VR, Metal might just
make the difference.

And so, I began to think that building a graphics platform might
present valuable opportunity later on -- or help me build credibility
in a technology economy where knowledge of 3D modeling, graphics,
algorithms and processing is going to determine who is most capable of
building the next revolutionary software products.  So even if my
framework with a novel functional design wasn't exactly revolutionary,
what I'd learn would make it worth my time.

### Swift: Functional For Fun and Profit

#### A Graphics Framework to Learn Low-Level Graphics

And yet another major strength for Apple: the Swift language.  Yes,
it's open source now and available on Linux.  But it's still a first
party language and one of the few that's functional and enjoys wide
support.  The programming patterns in Haskell seem to work fairly well
in Swift, which opens interesting new design possibilities that aren't
as available for other operating systems and platforms. Apple is
great at concentrating their energy into the right places and Swift
exemplifies this.

As I was learning to work with graphics and compute myself, I wanted
to build a framework that allowed me to explore various graphics
pipelines.  This means being able to take various meshes and
processing their vertices and surfaces in various ways.  I envisioned
many creative uses of graphics techniques using the primitives found
in Metal. I unknowingly used a compute shader to create what is
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

#### Conway's Game of Life

![Cellular Automata and Conway's Game of Life](/img/posts/2016-04-27-lambda-fu-powerup-spectra-graphics-with-swift/cellular-automata.gif)

Processing elements in a graph of vertices in a submesh is basically
Conway's Game of Life for 3D objects.

Now, imagine the above, but instead of manipulating the value of each
cell, you are manipulating the position, texture coordinate, color,
anisotropy or surface normal value for a vertex on a mesh.  And you're
doing so by constructing a random, balanced graph using a submesh on a
mesh, which only requires the addition of one attribute to your mesh
-- basically, an XML tag or just one mesh transformation.  Paired with
anisotropy modulation and the right fragment shader, this technique
could be particularly amazing.  However, it does require execution of
a compute shader on each frame, as well as sacrificing some
performance declarations for some of the fragment shader function
inputs.

You can find more info on *Cellular Automata* and *Conway's Game of
Life* [here](http://mathworld.wolfram.com/CellularAutomaton.html). I
remember coding this in Pascal in high school, though I wasn't aware
of the name at the time.

Exploring these concepts would allow me to visually demonstrate my
math and programming skills to the world in a way which no one could
downplay or deny!  Where before, a handful of people have, towards my
detriment, essentially claimed that I lack skill or knowledge in
technology and pointed to my difficulty with UI design/implementation,
if I begin to excel in graphics, it'd be visibly obvious that they've
been wrong the whole time.  What is often preclusively difficult for
these same detractors, I soak up like a sponge. It's just frustrating
that I haven't had the opportunity to work with this stuff.  Or work
at efficiently at 60 hours per week at any time during the past four
years, for whatever reason.

Graphics and especially geometry manipulation would allow me to begin
to understand algebraic geometry, which studies the functional
"shapes" that emerge from morphisms between increasingly complicated
categories and their duals -- the stuff functional programming is made
of. I could learn advanced math at the same time as producing a very
visual portfolio that would make it impossible for anyone to insinuate
that I lacked skill.  I am seriously so tired of that shit.

> If you think I am below you, could you maybe treat me in the same
> way I would treat someone who I perceived to be below my skill
> level?  I would offer that person authentic advice on where to find
> the answers to improve.

And so, I found myself designing a kind of novel rendering pipeline
that chains blocks of functional behavior to be sent to an encoder for
the GPU.  It seemed different than how all the docs online I was
reading were describing how graphics were processed.  This design
would allow me to dynamically restructure models that were being
rendered or switch them to be rendered with different pipelines.  In
theory, this design would also make it a bit easier (fingers crossed)
to use the parallel render encoder for Metal, which enables you to use
multiple CPU cores to direct graphics to be encoded.  So, functional
design paradigms for a graphics framework should promote simplicity
(in theory) and more manageable performance.  Swift's nature opens up
possibilities for faster realization of Metal's benefits.

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

It was a bit frustrating for me to realize my natural talent for this.
As with everything else, I found creativity surging, but the time and
skill for implementation lacking. Still, not a single person has
contributed to my library. That's OK.  I'm pretty opinionated as to
the kind of design I want, but I would really appreciate any
advice. And admittedly, some of these problems are a bit out of my
reach.  Buffer allocation and the kind of speciallized resource
utilization required for complex 3D graphics is really just too hard
for me right now. Also, benchmarking and estimating the workload for
each frame, 60 times a second -- and especially redirecting resources
when you detect a workload that exceeds your throughput -- this is
incredibly tough.  Resource prioritization and resource allocation for
3D graphics are problems that are orders of magnitude more difficult
than designing a scene graph and rendering some things.

But that challenge is exactly what I find alluring.

### Why XML for Spectra? And Why Is It Hard?

So again, XML would provide a universal means of defining objects my
program would work with, both the graphics pipeline objects and the
objects to be rendered.  And best of all, it'd be declarative.
Furthermore, it'd be fairly simple to transfer data about a 3D scene
over HTTP with XML to be rendered with shaders on a native app or in
VR.  This idea is all over the place and there are many similar
frameworks for 3D with HTML Canvas.

But then, I found myself needing dependency injection badly,
especially when passing objects in for rendering.  D/I is usually an
object-oriented design pattern, but I wanted to bring over the
simpilicity I saw in Angular.  I needed access to everything,
everywhere pretty much.  Yet, at the same time, I needed
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
want your graphics framework to process *real-time geometry shaders*.

I could duplicate the objects and allocate the copies to memory, as
the former is being rendered.  I could then apply geometry
manipulations as attributes on the latter copies.  I could alter the
surface normals or change the texture coordinates or add more vertices
(and update submeshes accordingly) to prepare for a transformation
from one shape to another.  And then, once those geometry morphisms
were complete, I could use continuation and state monads to execute a
deferred callback to swap out the objects being rendered and another
callback to deallocated the former copies, only retaining the copied
objects afterward.  AFAIK, all of this stuff is incredibly challenging
and not very easy with existing frameworks.

But these capabilities were only possible if I could read the scene
graph into D/I containers just the right way so that resources could
be easily managed later.  And this depended on working with the trees
of XML nodes in an unusual way.  Any design that I approached seemed
to make the problem space just as complicated as if I didn't have XML
at all.  This is because the meta-structure for any tree is almost as
complicated as the tree itself, which means manipulating the tree
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
Each time, I made a design change, I had to replicate it across
between 20 and 40 classes ... because I'm a genius...

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
the documentation on Google's perfect design for generating & managing
DOM, parsed from HTML.  But still, that (and everything else) mostly
talked about generating a tree-like object from text or some other
form.  Instead of manipulating it.

I began to realize that what I wanted to do was moreso along the lines
of manipulating AST's, so I started looking into that and Type Theory.
I found HOAS's and PHOAS's, but those concepts were a bit much for me.
All the articles I found were written with obscure mathematical
notation.  I finally found Lenses and Prisms, which are the perfect
library for working with this kind of stuff.

By the way, if you want a great intro to Type Theory, check out Erik
Hinton's presentation on
[The Derivative of a Regular Type is its Type of One-Hole Contexts](https://www.youtube.com/watch?v=K7tQsKxC2I8).
I'll try to write a Lambda Fu Powerup post on AST/HOAS/PHOAS
soon. It's an incredibly powerful concept that I've been fascinated
with the topic for quite some time, but I have a ton to learn.

## Next Up on Lambda Fu!

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

And finally, if you're getting into Metal, you're going to want to
check out [FlexMonkey's blog](http://flexmonkey.blogspot.com/).  He
has some amazing examples with Metal, as well as image processing.
[@FlexMonkey](https://twitter.com/FlexMonkey) Follow him on Twitter if
you're into this stuff, for real!

### WWDC Presentations on Metal

#### 2014 - [Working with Metal: Overview](https://developer.apple.com/videos/wwdc/2014/#603)

#### 2014 - [Working with Metal: Fundamentals](https://developer.apple.com/videos/wwdc/2014/#604)

#### 2014 - [Working with Metal: Advanced](https://developer.apple.com/videos/wwdc/2014/#605)

#### 2015 - [Metal Performance Optimization Techniques](https://developer.apple.com/videos/wwdc/2015/?id=610)

#### 2015 - [What's New in Metal, Part 1New](https://developer.apple.com/videos/wwdc/2015/?id=603)

#### 2015 - [What's New in Metal, Part 2New](https://developer.apple.com/videos/wwdc/2015/?id=607)
