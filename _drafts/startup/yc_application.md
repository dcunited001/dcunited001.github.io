=============================================================================
In a couple of sentences, what's the most impressive thing you've done?
=============================================================================

Tough question to answer because, even though I'm extremely creative and I've truly influenced a lot of people, it appears haven't built much myself.  I'm very good at finding the right people to entrust with great ideas.  It sounds like a bad excuse, I know.  Yet if I limited myself to working on one thing, I wouldn't have time to be creative.

The most important thing I've done is to write down some of the ideas i've had, though my writing style is terribly conversational.  I've written a series of articles on Epistemology, Cognition and Category Theory.   I just finished a great post about neural networks in a spider's brain.  I've written about GPU-accelerated string neighborhood algorithms, in which i unknowingly used ideas from circuit complexity. 

I independently arrived at an algorithm that generates string neighborhoods for a limited alphabet.  This algorithm approaches linear time -- and can be applied to levenshtein neighborhoods.  I would love it if someone could tell me whether this algorithm is groundbreaking or not -- i'm sure it's not, that's preposterous, it's too simple.  Yet, no one that's read it has told me that it's not groundbreaking.

Soon I'm planning to blog about a Probabilistic Programming Paradigm that I feel provides a novel and brilliant model for genetics, which is basically like a probabilistic program with spatially distributed state.  I don't think people are viewing genetics from this perspective.   I discuss this model in part four of the video series i link to below.

I'll list the URL's for articles I've written below, in the section asking for links to work.

=============================================================================
Describe in a paragraph or three one specific programming task you worked on. Give us some background on the task - why was it important? And then describe how you worked it out, and what the result was. We'd prefer if you choose something small that you can describe thoroughly.
=============================================================================

I've worked on a lot of programming tasks in esoteric languages that are difficult to show to non-technical people.  I hadn't considered game programming or graphics, simply because I didn't have a game idea i thought was truly groundbreaking or that I would have the resources to pull it off.  But it turns out that graphics is perfect for me: I can create stuff to show to other people! Yes, even muggles.  

For my Voxxel app, I was building the Recording activity, where the user records a vocal sample and it is compared against audio of a sample downloaded from the web.  At first, I was just going to go the simple route and create images by processing pixels individually, but I knew it would be slow and possibly unfunctionally so.  I knew that an eventual requirement would to offload some of the processing onto the consumers phone.  In other words, I could preprocess the spectrogram for the audio in an image texture with the GPU and this would prevent a large amount of processing on my servers, which would be a cost constraint early on.  Another requirement would be to integrate with a library like TensorFlow, so the implementation should be extensible.

So I decided to bite the bullet and learn how to use OpenGL or Metal to write the FFT audio data into a texture.  I had never worked with 3D graphics rendering.  I thought this would be simpler, but I knew had a lot to learn.  I picked Metal even though it's exclusive to iOS because it has more flexible compute functionality.  I hadn't worked with pointers since high school and even then, that was with pascal.  I didn't have iOS hardware, so I wrote an OSX app to explore visualizing audio, but I got frustrated with the inflexibility of my code and the sheer number of lines of code.  I looked around, but no one had written many examples and I saw an opportunity to write a library on top of Metal, even though Apple offers tools like SceneKit.  

I wanted to design the library to be as flexible as possible.  The most rigid elements were the graphics pipelines and renderer classes.  These required hundreds of lines of code and using inheritance here was a real headache.  I also wanted to take advantage of Swift's functional nature.  I stepped back to diagram things in UML and found that I could define almost everything in XML, including the scene graph and even graphics pipelines.  This was especially useful for the immutable descriptor objects in Metal.  Then, the application developer could define everything in XML and recombine everything as they saw fit.  Instead of hardcoding everything in a renderer, the application developer could create lists of functions and the graphics resources would be shared and piped from one renderer monad to the next.  Everything would be functional & flexible.  And this would allow people to easily construct new 3D effects and to use compute shaders.  Additionally, the XML could be served via HTTP, which would be incredibly useful for VR/AR -- though there's some security concerns here.

I learned so much by trying to tackle this project.  I enjoyed learning about tessellation and 3D geometry.  I've always said that I'm an artist without a medium and I think that 3D graphics might be my medium, but I need the right tools in order to implement the kind of effects and scenes that I envision.  Current 3D engines like Unity are great, but I just don't think they offer the level of flexibility and customizability that I need.  And I want to learn about this from a low level because VR/AR applications are going to require extensive knowledge of 3D geometry.  

I stopped working on the library because upgrades to XCode broke Cocoapods and I needed to switch to Carthage.  I'm working on the library again, porting my old code into XCode.  I hope to have something to show for my effort soon.  If I can just get this library working, then I'll be able to do so much with 3D graphics.  I'll be able to easily show my friends, since it's so visual.  I can use it to learn about high level math: tensor network, fields, tessellation, 3D transformation, etc.  It's perfect for me.  I'm also excited about exploring Force Touch in these visualizations.  But If I don't have a graphics library that is flexible enough, I won't be able to create maintainable code.

=============================================================================
If not already in your resume, please give us links to any work you've done that we can look at. We'll look at anything: code (open source or samples you can share privately), blog posts, writings including academic papers on CS, things you've built we can try, or presentations or talks you've done.
=============================================================================

I'm going to detail some of my work. I hope that I don't lose you by listing too much. 

========= [Code] =========

### Voxxel (Ruby/Angular)

http://vox.xel.io

This is an alpha version of the app I'm working on.  It allows users to perform vocal impersonations of quotes from movies and tv, then it scores your impersonations.  The web version relies on WebAudio & Canvas, so it doesn't doesn't work on mobile at the moment.  I'm going to scrap web entirely for native mobile apps.  I've been focusing on building a beta in iOS, but I got sidetracked with my 3D graphics library, Spectra.

### Spectra (iOS/Swift) 

https://github.com/dcunited001/Spectra

This is a 3D rendering library built on metal allowing dynamic graphics pipelines.  Both pipelines and scene graphs are configurable in XML, with the goal of providing a platform-independent means of loading content via HTTP.  I'm not sure HTTP will be the means of delivering content for AR, but I want to explore loading scene graphs and especially graphics rendering pipelines via XML. 

The dynamic pipelines allow for radical, new visualization techniques, like distorting perspective for vertices using a field.  The effects that I'm imagining would seem to defy physics and logic.  Also, metal will eventually allow for efficient effects using geometry shaders.  I believe AR will require the development of a CSS-like language, so that the same activity can be deployed in various user environments.  

I explain some of these VR/AR ideas in part 5 of my video series, which I linked below.  However, I haven't published part 5 yet. 

### SpectraNu (iOS/Swift)

https://github.com/dcunited001/SpectraNu

I need to rewrite Spectra using Carthage instead of Cocoapods and I created a new project for this.  I just started working on Spectra again after a two month break.  I feel that it is more important and more fulfilling to me than working on Voxxel at the moment. 

### MetalSpectrograph (OSX/Swift)

https://github.com/dcunited001/MetalSpectrograph

This is an OSX 10.11 app and was my first exploration of the new Metal API.  I used EZAudio to pipe in audio data and there's a few different visualizations you can run.  It needs a lot of work.  I started refactoring elements into the Spectra library.  

### Bioclj (Clojure)

https://github.com/dcunited001/bioclj

Here's some work I did for Coursera's Bioinformatics class, parts 1 & 2.  I received the Hacker Track certifications for this class.  I implemented the solutions in Clojure.  This includes a solution to the string neighborhood problem, which approaches linear order.  That is, once you have generated a neighborhood for [k,d], the algorithm is linear **and can be GPU accelerated.** This can be further accelerated with dynamic programming, as the neighborhood for [k,d] can be generated from [k-1,d] and [k,d-1] with a few additions. 

Here's a playlist from my Livecoding.tv channel where I'm working with my Bioclj library in the Clojure REPL to solve bioinformatics problems.  Just a heads up: when I recorded these videos, I hadn't used the library or Clojure in some time, so the later videos in the playlist are better.

https://www.livecoding.tv/video/dcunit3d/playlists/bioinformatics-920/

### Appistack (Ruby/Angular/iOS/Android)

https://github.com/appistack/appistack

Appistack is my hackathon template and contains Rails, Angular, iOS, Android that are preconfigured to work together.  It allows me to deploy a new project to Heroku and Divshot in TWO HOURS or less by forking the projects.  Appistack is designed to be completely generic and there's no tests included, as those implementations are usually opinionated. The idea here is that this is a great starting point: you only build on top of it, instead of removing parts that you don't need.

This project readme contains a great description of why a Single Page application stack is superior, given that you don't have to expend the effort to configure CORS and resolve other SPA issues.  Each project is containerized with the 12 Factor paradigm in mind, so it's easily configured with environment variables.  Because I've already resolved all the SPA problems, I get all the benefits of increased development efficiency without the time investment to resolve those issues. 

### MRI Scans (DYCOM files)

https://github.com/dcunited001/mri-scans

I open sourced my brain. Here it is. Unfortunately, the scans aren't as high resolution as I'd like.  And woops -- I just noticed that I forgot to attach the MIT License.  Gonna fix that now, lulz.  Or perhaps GNU is more appropriate for my brain, lmao.

Here's the pull request for the license if you'd like to debate MIT vs. GNU license on my brain

https://github.com/dcunited001/mri-scans/pull/1

### Skiima Gem (Ruby)

https://github.com/dcunited001/skiima

This is a gem that I wrote to help containerize SQL scripts for Rails apps and other Ruby apps.  I used this gem to create a flexible Reporting API for the Hispanic Scholarship Foundation, while I was working for Left+Right.  The Reporting API interfaced with the MySQL databases for multiple Rails API's and we were able to quickly provide new reports that were cached in MongoDB. Data points for the cached report results could be charted across time.  Because I used the Skiima Gem, we could easily deploy the Reporting service across multiple environments, production, staging, etc.  I prefer PostgreSQL, by the way.

========= [Blogs] =========

### TEXELIO - http://te.xel.io

This is my blog.  There are no facebook like buttons.  I don't publish on Medium because my content is mine, even though I envy the reach of their publishing platform.  But the greatest artists fly under the radar, am I right?

Here's some articles.  Though again, my writing style is terrible, but it's my voice.  I don't cite sources.  I have 300,000 words worth of content that I need to write.  I have so many ideas and so little time.  I'll star the ones I recommend reading.

#### *** Neural Networks and Spider Brains (11/21/2015)

This one's great.  It combines so many fields, including neurology, artificial intelligence, philosophy and genetics.
http://te.xel.io/posts/2015-11-21-neural-networks-and-spider-brains

#### *** Epistemology, Cognition and Category Theory (8/23/2015)

This one's like an unfinished 15,000 manifesto for self-actualization.  Three parts out of six are completed.
http://te.xel.io/posts/2015-08-23-epistemology-cognition-and-category-theory-part-one

#### *** GPU Accelerated String Neighborhood in Linear Time (3/14/2015)

This was my post for Pi Day 2015.  If someone could tell me that this is not a big deal, that'd be awesome.  I feel like there's a lot of breakthroughs that can be made by harnessing circuit theory and ASICS, lots of ASICS.
http://te.xel.io/posts/2015-03-14-gpu-accelerated-string-neighborhood-in-linear-time

#### Lean, Kanban and Anime (1/27/2015)

Here, I explain how the process from Manga to Anime makes Anime so great.  It allows for experimentation, removes limitations and produces compelling content.
http://te.xel.io/posts/2015-01-27-lean-kanban-and-anime

#### Category Theory and Human Behavior (2/22/2015)

I'm not great at instinctively understanding other people, but anything I can reason about intellectually, I can understand.  And that's what I'm attempting to do by applying category theory to human behavior.
http://te.xel.io/posts/2015-02-22-category-theory-and-human-behavior

#### Workplace Bullying (2/21/2015)

This is like 20,000 words and it's pretty dark.  At almost every place I've worked, I have dealt with a difficult person who seems to contort situations against me.  Although it's been painful, I feel like I've learned a lot, but it's damaged my heart and damaged my ability to trust others.  I know this stuff sounds paranoid, but trust me when I say I know people.  If I didn't understand people, I wouldn't have been able to do some of the things I've done.  I'll just leave it at that.
http://te.xel.io/posts/2015-02-21-workplace-bullying-part-one

========= [Videos] =========

I've produced an unfinished series of videos entitled "Why You Should Give Me One Billion Dollars," where I detail hundreds of ideas that would revolutionize VR/AR, Music Production, Genetics and other fields.  Basically I've been sitting on this notebook full of ideas and I put them all into a video series.  I have yet to publish a few parts because I'm reluctant to give away my ideas on VR/AR.

You can watch parts of this series here:
- Part 1 (Oscil8, a failed music startup) 
https://www.youtube.com/watch?v=Xi18MTvq-28

- Part 2 (Revolutionizing Music Production with AI and Timbre Impressionism)
https://www.youtube.com/watch?v=iAXKiZ5QQHw

- Part 4 (Genetics and a Probabilistic Programming Paradigm)
https://www.youtube.com/watch?v=TOts3mptX_c

Part 3 contains miscellaneous ideas.  Part 5 contains VR/AR ideas, mostly relating UI in VR/AR.  Part 6 explains some novel ideas that I've had for 3D graphics, like distorting perspective for vertices.  

=============================================================================
Tell us why you'd like to work at YC. Or you can paste in or link to a cover letter.
=============================================================================

Basically, I think YC would be perfect for me.  I'm incredibly creative.  I'm intelligent and full of wisdom.  I'm also ethical and I understand how it feels to have ideas "stolen."  I understand that working in a position like this requires ethical restraint.  I value placing ideas in the right hands: I've had many ideas for businesses that could be fairly successful, but I just wasn't passionate about that field.  I'm so excited about upcoming advances in technology and especially VR/AR, which I believe will make technology human again.  Interactions will no longer be completely text-based.  And I want to be a part of this wave of innovation.

I admire the people who work with YCombinator because of their backgrounds.  Many of you were instrumental in shaping the internet as it is today.  Many of you have Computer Science backgrounds and Paul Graham is into Lisp, which is pretty rad.  Other startup accelerators have more business-oriented mentors and that's great, but to me, it's not the same as having a team of mentor's where half have backgrounds in computer science or math. 

Financial data available from API's like Angel list could be incredibly useful in predicting industry trends, especially when combined with social media and news providers. It's important to be able to sift through all of this available data to identify the best upcoming opportunities.  While I believe I have a clear vision of where technology is headed, it's difficult to predict.  Up and coming small players are likely to dethrone major players and major players are going to gobble up new IP through acquisitions.  As an investor, it's crucial to understand how this is going to play out.  The best way to make money via Angel or VC funding is to make hundreds of investments because you don't know who's going to be successful.  But sifting through this data in the right way can help you categorize these potential & existing investments, to have a better understanding of how it's going to play out.

I have a vociferous appetite for startup news.  I'm just one person though and it's hard to consume all the information that's produced daily.  I wish I had a kind of system that could preprocess data and news relating to startups, so that I could digest more information daily.  However, such a system, whether technical or social, implies that I would no longer be capable of personally processing most of the information. That is, I feel that some of my insights surrounding technology occur because I'm parsing the details at a low level and I don't have pre-existing investments or incentives that distort my perception of the technology industry.  I'm also not in a position where people are trying to distort my worldview in order to sell me on something. 

I enjoy dissecting business models and brainstorming macro/micro strategies that optimize resilience and flexibility.  I enjoy designing feature sets for products that maximize non-typical metrics, like user-interactions, user-retention and monetization.  Most successful startups are careful in adding to their feature sets, but many product designers approach this too directly.  Some features can drastically affect the number & quality of user-interactions or influence the profitability of your monetized features.  Such decisions should be carefully vetted with A/B testing, if possible, so that a startup's energy is focused on adding value.  The wrong decisions here can mean tons of energy dispersed in the wrong places. Implementing the wrong feature could mean shooting yourself in the foot.

=============================================================================
Add a cover letter or anything else you'd like to share
=============================================================================





