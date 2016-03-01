---
title: "Spectra"
type: project
date: 2015-09-01
repo_url: "https://github.com/dcunited001/spectraNu"
categories: ['Graphics', 'Libraries']
display_order: 3
headline: 3D Graphics For iOS Using the New Metal Framework
excerpt: Spectra is a 3D Graphics Library for iOS, written in Swift.  It's based on the new Metal framework, which opens the door for new possibilities!  Spectra is focused on utilizing the functional facets of the Swift language to enable vibrant new graphical programming techniques.  Dependency Injection maximizes simplicity.  Render pipelines can be constructed dynamically.  Nodes in the Scene Graph can be flexibly interweaved.  Geometry and Compute Shaders are at the forefront.
author:
  name: "David Conner"
tags: "graphics ios swift"
---

## Spectra => Metal Graphics Engine (Swift - iOS - OSX)

I'm back to building my 3D Graphics engine.  Spectra is really designed for learning low-level graphics 
techniques.  I'm building it primarily to learn these techniques myself and to explore mathematic concepts.  
But I've designed it in such a way that it is easy for users to pick up the basics of low-level 3D graphics.  

[Trello Board](https://trello.com/b/FYL0pBuF/spectra) if you want to contribute or see what i'm building next.

> **N.B.** -> this library will be moved to replace [dcunited001/Spectra](http://github.com/dcunited001/Spectra) at
> some point. Soooo, actually using it is not recommended yet. I'm rewriting this library for like the fifth 
> time (using Carthage) since cocoapods is broken.  And now i'm rewriting it again to have proper 
> dependency injection'

## Declarative | Composable | Functional

### 3D Graphics with a first-party, strongly typed functional language. 

### Everything is declarative - from render pipelines to assets and meshes. 

### Everything you need is accessible through dependency injection.  

### Everything is composable, with a focus on combinating monadic mesh/submesh generation for dynamic and flexible geometry manipulation (hopefully in real time)

### Composable, dynamically swappable, parallelizable graphics.

### Stream Data to Metal Inputs & Buffers, for audio visualization or vertex streaming.

Here's some video of [OSX audio visualization](https://www.youtube.com/watch?v=LKVYEnu8sLk) using a very early version of the library

> Note: almost none of this is functional right now.  I'm writing this for myself, primarily so I can explore [3D & Advanced Geometry](http://www.geometry.caltech.edu/)

> Also Note: performance is absolutely not a focus at this point.  I'm not sure it'd be a good idea to use this design in production.

### Spectra Features

- Read Metal graphics pipeline objects into a DescriptorManager with the S3DXML format.
- Some classes set up to manage rendering (Renderer, RenderStage) but these will change soon.

### Spectra Roadmap

- Finish the SpectraXML format for defining Model I/O objects.
- Rename S3DXML and possibly split it into a separate framework.
- Set up some basic resource management classes.
- Rewrite Renderer, RenderStage, etc.
- Configure auto-injection for Swinject containers, so users can dynamically define higher order factories as they
  read in XML data (requires Swinject 2.0.0)
- Integrate with MPS Metal Performance Shaders for convolutions, etc.

