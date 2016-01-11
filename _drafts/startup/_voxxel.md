We score vocal impressions (to improve voice algs)

===============

Video Dialogue:

Voxxel, the impersonations app, is two things.  

Firstmost - 

- Voxxel scores your vocal impressions of quotes from movies and politicians.

By analyzing the symbolic vocal data that people include to impersonate a sound or accent, 

We believe that our data will provide a new symbolic perspective for voice recognition.  

That is, Voxxel's algorithms may more proficiently analyze spectral audio data to infer emotional and contextual information.

Thus secondly, Voxxel seeks to help computers better understand human speech.



===============

Voxxel, the impersonations app, is firstmost an app that scores your vocal impressions of quotes from movies, characters and accents.  It is similar to Dubsmash, but we analyze and score vocal impersonations.  

By analyzing the symbolic vocal data that people include to impersonate a sound or accent, we believe that the data we collect will provide a new symbolic perspective whereby we can better analyze spectral voice data.  Thus secondly, Voxxel seeks to help computers better understand human speech.

Fans and aspiring performers can impersonate quotes and accents from movies, SNL skits and standup comics.  Impersonations are scored and users can earn badges and achievements for getting the best scores.  Voxxel's data can be analyzed to reveal entertainment industry trends.

To avoid copyright issues early on, we hope to capitalize on the upcoming presidential elections, as sound bytes from political candidates are clearly fair use.  So yeh, I guess it'd be good for business if Donald Trump stays in the elections.  Just until Iowa though. 

===============

Please tell us about an interesting project, preferably outside of class or work, that two or more of you created together. Include urls if possible:

Lately, I've been spending a lot of time on LiveCoding.tv.  I'm currently working on Spectra, which is a Swift-based 3D rendering framework for Metal.  I've been working on it for about a month.  At first, I was just learning how to process audio with the GPU to create visualizations on OSX.  Then, I realized there may be a need for a more low-level Metal framework than what Apple provides with SceneKit.  

Swift's strongly-typed functional behavior may arm a 3D rendering framework with some unique capabilities -- like highly flexible graphics pipelines and dynamic geometry using compute functions.  There are many patterns in OpenGL programming that emerged because of hardware-based resource restrictions -- I believe Metal & Vulcan present an opportunity to shake things up.  I don't actually believe Spectra will be the library that takes off, but holy shit have I learned a ton this past month.

Spectra Library: https://github.com/dcunited001/spectra
OSX Audio Visualization: https://github.com/dcunited001/MetalSpectrograph/tree/before-spectra

A few months ago, I created Appistack, a set of hackathon app templates, which I've used to deploy a live, API-backed, single-page app in less than an hour after forking.  I designed this with hackathons in mind and for those inevitable small project ideas that I have.  You can find Appistack at https://github.com/appistack/appistack

I also recently completed three Coursera courses, earning verified certificates with distinction:  Epigenetics, Bioinformatics I & II.  I completed the Hacker Track for UC San Diego's Bioinformatics series, writing the solutions in Clojure, which include bit-crunching nucleotide neighborhood algorithms.

===============

How long have the founders known one another and how did you meet? Have any of the founders not met in person?:

I don't have any cofounders =/  However, I'm going to write the rest of this application using the "Royal We" so I don't sound like I'm alone on this stellar app.  Kudos if you picked up the Big Lebowski reference.  I know this answer is long, but if I lack cofounders, I hope to at least give you insight into what I'm looking for.  I just recently won a coworking membership at the Grandin Colab two months ago, so I'm definitely looking hard.  I have some candidates in mind, but I don't want to rush it.

Good news -- I don't have any bad cofounders.  Finding the right person might be really hard, but I don't want to bring the wrong person in.  There are many people who I could sell on invest their time/energy in my startup -- if I just had a better demo, maybe one on the iPhone.  In other words, it's often easy to get someone to sign on as a cofounder if they could just *see* the product that's **already halfway built.**  They might be an early hire, but they're probably not a cofounder.

Why doesn't Voxxel have cofounders yet?  I have a few criteria that filter out almost 100% of people:

(1) Is this person willing to drop everything to move to another city when this startup is funded and/or starts to grow?  This one right here filters out nearly 100% of people who would otherwise 'have their shit together' enough to be seriously considered in the first place.  In other words, most smart, successful people I know also have obligations like family or career that keep them locked down to one location.  

(2) Can this person work locally with me until we move?  I live in Roanoke and I love it here, but we have a metro area of 300,000.  For the early stages, I really would prefer to work with someone in person.  I've been trying to transition to NYC or SF, but I'm worried that getting a full-time job will distract me from the startup i'm working on -- which is exactly what's happened to me for the past 4 years.  Again, the combination of this criteria with the first one above effectively leaves no valid solutions.

(3) Does this person have the right personality traits?  Again, another criteria that filters out a lot of people who otherwise would be successful in business.  I want to find the cofounders who are crazy enough to believe changing the world is worth the risk of failure.  Most typical successful people choose safety and security over potential for change in their life.  In other words, when prompted with an high-risk, high-reward opportunity to change their life, some people will stick with what's comfortable  every time.  Or what they have already obligated themselves to.  You can't say they're wrong, but these are not the people who are going to change the world.

Additionally, I have some other criteria that filter out a lot potential cofounders:
** Does this person bring enough to the table?  Skills, creativity, passion, etc.  There are many people out there who'd love a free ride.  If the person currently lacks several key skills, I can provide them with resources and direction to get up to speed in many areas, but do they seem to have the right personality traits for this? How do they assess their own value to the organization?
** Is this person an asshole?  Voxxel has a strict no asshole policy.
** What is our story?  How did we meet?  What compelled us to work so hard on this problem? This is one of the most important aspects to a new startup.
** What does this person prioritize without intervention?  An interviewer should give the interviewee enough autonomy and that person's problem solving skills & experience will become more evident.  So, in other words, does this prospective cofounder realize on their own the opportunity that Voxxel presents?  Or are they the kind of person that waits for permission and needs tons of prompting?  Is it an idea they are so passionate about, they can't stop thinking about it and won't stop bugging me about it?  That's perfect - I'm looking for someone as passionate as me.  
** What has this person built in the past?
** Is this person ethical, empathetic, conscientious, mindful, loyal, patient? What virtues does this person value most?

===============

How far along are you?

Voxxel has a web demo online, to help illustrate the idea. The web demo doesn't work in safari and some mobile browsers, which is disappointing. 

We're close to finishing an alpha of the iPhone app.  I've got the app downloading & playing audio samples from the cloud and I'm working on rendering and comparing the spectrograms for vocal samples.  After finishing this, we need to assess how users will discover audio content and the metrics we'll measure for user behavior.

After getting the iPhone alpha completed, we need to get our algorithm scoring samples in the cloud.  We may skirt this launch requirement by completing all or most of a simplified scoring algorithm on the user's phone. 

We started developing an android app first, but decided that Apple's hardware platform is ideal to launch with, as there are more consistent audio specs across the board -- 48KHz only, for example. 

===============

What is your monthly growth rate?

None.  We're not ready to publicly market Voxxel just yet.  Right now, we're growing awareness and getting feedback among a selected set of people.  We want a much more polished version of the app to launch with -- it doesn't need to be perfect, but we want Voxxel to create a strong first impression in early users.  We want to create a strikingly unique, visual, interactive user experience that is memorable and positive, while being poised for early growth.  We have our fingers crossed for Instagram-level early growth.

===============

If you've applied previously with the same idea, how much progress have you made since the last time you applied? Anything change?

I applied for YC Summer 2015.  Since then, I've written around 15,000 lines of code: Angular, Android, and iOS.  I've made a lot of effort towards a beta iPhone app.

This summer, I was hoping to begin marketing my app and growing the user base with the Angular app at http://vox.xel.io.  However, inconsistent web audio implementations and poor mobile browser support have been disappointing.  I need the product to be there before I start growing the user base and I need the product to be mobile and native.

As a solo founder working alone, I'm not able to holistically develop my business, which risks having poor execution ruin everything. I have to stay focused on the product and technical aspects. If I just had the resources to delegate responsibilities, Voxxel would be making a ton more progress.

I've been working on an impressive budget: in total, I have made less than $3,000 this year. I'm basically DJ'ing and counting tickets for little kids at my family's skating rink.  Such a low budget is stifling: I only just got an iPhone 2 weeks ago, even though I've been developing my iOS app for 3 months.  I can't afford the cloud storage or processing that my app will require.

So, I'm close to a point where I require funding or I can't continue.  And I'm wary of overhang math, which makes me nervous when pursuing investors. 

===============

If you have already participated or committed to participate in an incubator, "accelerator" or "pre-accelerator" program, please tell us about it.

N/A, we're not waiting on an accelerator.  We're building this thing and when we're ready, we'll find funding.  One of my mistakes in the past has been placing too much hope on accelerator programs and losing momentum when I'm not accepted -- instead, I should just build it and if an accelerator seems right, then it will happen.

===============

Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?

I was watching Parks and Rec on Hulu one night a few months ago, impersonating the characters on screen -- but not very well.  I found myself wanting an app to improve accents and impersonations, but I couldn't find anything like it.  Since we all sound different to others than we do to ourselves, I wanted an app that could provide me with unbiased feedback.

I'm very passionate about audio and machine learning.  My previous startup was Oscillate, which would allow users to upload sound samples.  I applied to YC W15 with Oscillate.  However, the market was too crowded with competitors.  It would be too easy for Splice or Blend.io to introduce a new feature and kill my product.  But I'm still interested in doing a startup centered around audio.

I can't wait to get the alpha version of the iOS app into people's hands for testing.  Since I've developed the Voxxel web prototype a few months ago, I've been getting feedback from friends and family. They seem to like it. My nieces and nephews had fun playing with it. I ran into one potential customer in particular at my local coffee shop. He was interested in what I was working on.  I pitched it to him as I was walking through the prototype and he immediately started doing impressions of Rodney Dangerfield and others. So it's great to see people having fun using my product.

===============

What's new about what you're making? What substitutes do people resort to because it doesn't exist yet (or they don't know about it)?

We're not aware of an app that shows how similar two vocal samples are.  Doing so requires some complicated machine learning algorithms, but I don't see why it can't be done.  If there are voice identification algorithms to detect whether or not voiceprints are identical, then a voice similarity algorithm should also be possible.

Also, we're not aware of vocal machine learning algorithms that analyze user impersonations to make inferences about people's symbolic interpretation of sounds.

We believe our app will provide a novel user experience that would be fun for people of all ages, but especially for kids. We're not sure why it doesn't exist already. 

===============

Who are your competitors, and who might become competitors? Who do you fear most?

As an app for entertainment, Dubsmash is a competitor.  As a service augmenting voice recognition, Google/Amazon/Apple are competitors.

We're going to need to negotiate with entities in the entertainment industry for the rights to provide their material.  To succeed, we will need to partner with large businesses who have competing interests.  And it makes me a bit nervous that the interests of larger businesses who can throw their weight around might impact my own business' interests. 

===============

What do you understand about your business that other companies in it just don't get?

(1) By driving the right mix of compelling user audio interactions, Voxxel has a unique capability to develop new kinds of audio/vocal recognition algorithms.  When many users impersonate a vocal sample, they are providing machine learning algorithms with information about the symbolic features that people think are important in that sound.  This data could be used to filter out noise and unrelated sounds from the user's intentional vocal sounds for voice recognition.  

This is one aspect of my business that I've been hesitant to describe to people --  it's not very obvious and it's why our technology could be very valuable. I'm not an expert in voice recognition, but I don't see other apps driving the kinds of user interactions that would allow them to collect the data required for these inferences. Most people I demo my idea think it's creative and could be a fun app, but wonder how I'd monetize it.  Few make the connection to improving audio recognition with machine learning. 

(2) GPU-powered machine learning in the cloud is expensive, AFAIK.  However, these new GPU frameworks Metal & Vulcan are exciting because they might provide an opportunity to partially crowdsource machine learning algorithms.  By preprocessing data into images and then processing those images, Voxxel avoids both the cost of cloud-based GPU processing and some voice recognition patents.

(3) Also, Voxxel drives experiences that are useful for marketing entertainment to consumers. "It's not about what people see, it's what they do."

Basically, as studio, you can advertise all your new movie or TV show all you want.  Users are going to see those advertisements and this is definitely effective to some degree.  But, getting those same people to participate in **interactions** will be a dozen times more effective than advertising.  

This is because these interactions are much more effective at forming conscious memories and associations.  This is why it's more effective to learn a foreign language by speaking it.  If you don't speak it, you're not going to learn as much and you'll retain even less.  So, Voxxel will provide a great platform for engaging consumers of entertainment and growing brand awareness of new movies & tv.  Obviously, this platform will work better for some genres of entertainment than others.

===============

How do or will you make money? How much could you make?

There are several options for monetization:
- selling new soundbytes to users
- promoting sounds & upcoming media to users
- analyzing trends in media consumption
- insertion of ads into sound playback
- intellectual property

We'd rather avoid selling sounds to users because the only users that can interact with purchased sounds are those who have purchased them, which reduces the value of the network.  So, Voxxel would rather have all sounds available for all users.  

A better route to monetization is creating a space in our applications where users can expect to discover sounds for current/upcoming movies and TV shows.  We could then sell the rights to this space in our application to the entertainment industry.

For example, if a trailer is released and at the same time, a small set of soundbytes from the trailer is released on Voxxel, we could measure the user response to those sounds to help predict whether this new movie is going to be popular.  And getting people to impersonate sounds from current/upcoming media would be great for brand recognition!  Lots of value for the entertainment industry, we just need to figure out how to package it up.

Another option is to analytics on trends in media consumption.  We could show that certain actors & characters are and have always been very popular.  We could also produce analytics to show which upcoming movies are popular with our users. 

We could also occasionally insert audio ads into our player.  So when users are recording their impersonations, every 50 times that a user clicks play, we insert a quick ad and then play the sound.  Users can pay a membership fee

Oh and then there's the possibility of intellectual property we might develop.  At the moment, I need to do more research on IP related to voice technology.  I know there are patents for voice recognition and biometric voice identification. Voxxel will need to research these voice patents, but we also may develop our own. For example, processing voice data across a distributed big-data system or comparing voice samples for similarity, instead of identity.  Really, this is going to be some fun software to work on.

===============

How will you get users? If your idea is the type that faces a chicken-and-egg problem in the sense that it won't be attractive to users till it has a lot of users (e.g. a marketplace, a dating site, an ad network), how will you overcome that?

Our app doesn't depend on an existing user base to provide a compelling user experience.  This is because user-to-user interactions don't drive use of our application.  We do want to focus on creating and designing user-to-user interactions because, even though we don't need to social element to get started, Voxxel needs a social element to succeed.  

There is a chicken-and-egg problem with providing soundbytes.  Initially, in our first public release, we won't be able to provide copyrighted soundbytes.  We'll likely only be able to offer soundbytes from movies once Voxxel can use significant momentum as leverage to negotiate licensing.  

However, in itself, the lack of soundbytes presents two opportunities for growth: creating our own soundbytes to distribute and slowly releasing new soundbytes, as we negotiate for more rights.  

One of our tactics for acquiring initial users is to leverage our personal network for people to provide original accents/soundbytes/quotes etc.  There's a two-fold benefit to doing this.  First, we can get our friends and family to invest their time and energy in helping us grow, which increases initial awareness of our product.  Who knows, maybe one of our friends will create a soundbyte that makes them famous.  And second, we're able to provide our own material early on. 

However, Voxxel wants to ensure that our users have a consistent product experience early on.  So, we want to provide a limited set of soundbytes, so that our users have a similar experience.  We're exploring the idea of providing one to three sounds that every user will be first introduced to.  We want these sounds to not just be funny/interesting, but to be fun to imitate.  This way, we create a shared experience on our product for our early adopters.

Once we have started to acquire rights to copyrighted material, another tactic to early growth is to steadily trickle out new content, instead of releasing it at once.  This will help us reengage existing users.  So, the fact that we have to negotiate for these rights actually becomes a benefit, in a way.  If we play our cards right, Voxxel can actually use this to facilitate growth.

As someone who has lived in several states and toured the country as a pro jamskater, I have a particularly geographically distributed social network.  There are people in pretty much every state who are aware of who I am, as a jamskater.  So, when Voxxel is ready, I can leverage my personal network.  I also believe my product will be compelling enough to quickly facilitate growth early on.

Obviously, as a marketing strategy, this isn't enough.  There's so much more that Voxxel needs to consider.

===============

If you have not formed the company yet, describe the planned equity ownership breakdown among the founders, employees and any other proposed stockholders.

I'm willing to provide cofounders with between 10% to 30% equity, depending on what they bring to the table.  At the moment, I don't have any cofounders. I'm going to build this anyways and when I find the right people, I'll bring them in.  Obviously, the earlier they get on board, the more equity I'm willing to part with.

I'm actively searching for a CTO and in particular, cofounders who have experience with IP licensing and rights publishing.  I have lots of technical experience, but I'm looking for a CTO to help offload this, so I can holistically focus on other aspects of the business.  I'm a fairly good programmer, but I'm just not fast enough to be the guy in charge of our tech stack and I would be far more effective elsewhere in the business.

===============

Please provide any other relevant information about the structure or formation of the company.

So, there's an interesting story behind the idea for the business, but I'll elaborate on that in my founder's profile, in the "hacking" question.  

Basically, I had the idea for the app, but forgot about it for about two years.  Then, a few months ago, I had the idea again, right before the SNL 40th anniversary episode.  I was pushing myself hard to get the prototype together for this, so I could launch that same night.  However, I only had 48 hours before SNL aired, so I fumbled and gave up for a few weeks.  

===============

Are any of the founders covered by noncompetes or intellectual property agreements that overlap with your project? If so, please explain.

No

Was any of your code written by someone who is not one of your founders? If so, describe how can you legally use it.

No

Is there anything else we should know about your company?

No, but I'd love to answer any questions you have.

===============

If you had any other ideas you considered applying with, please list them. One may be something we've been waiting for. Often when we fund people it's to do something they list here and not in the main application.

Dappergang -- this one's hilarious -- upload a photo of yourself to find real-life dopplegangers, who you can hire via a TaskRabbit-like system.  
** Don't feel like going to the DMV?  Dappergang.  
** Need a stand-in for that awkward blind date your friend set up?  Dappergang.  
** Your pop music group just lost your lead guitar player in a tragic DUI?  Dappergang.  
** Need to skip out on your high school buddy's wedding?  Dappergang.  OK, this app might be unethical.  But hilarious.

Here's a few more interesting ideas, though they're not that great.
** Twitch for Interviews: users can interview guests on their channel.  Requires custom RTMP streaming implementations.
** App to match people up with a pair-programming partner for short-term, late-night coding sessions.  LiveCoding.tv partially solves this problem for me.
** Netflix + Google Hangouts -- i donno about you, but I miss actually watching TV shows with other people.

I have a notebook for tech/startup/app/innovation ideas that's pretty much like the warehouse from Indiana Jones -- you know, the one that they ship all the relics to, from where they're never seen again.  I've got so much creativity, but more ideas than a dozen people could complete in their life.  So, long term, I'm hoping to get networked in a position where I can realize some of these innovations through other people and organizations.

===============

Please tell us something surprising or amusing that one of you has discovered.

The metaphysical structure representing the sum of all human knowledge greatly exceeds the computational capacity of the universe, implying that the universe can never observe in totality the knowledge contained within it.

Also, can the functions that generate points for platonic solids be correlated to things like symmetric groups in abstract algebra?  If so, what does that imply?


===============

What convinced you to apply to Y Combinator?

Well we're working on this fantastic Hollywood 2.0 app and we want to be mentored by the best in the world. 

===============

How did you hear about Y Combinator?

Originally via a coworker at ABS in 2008

===============

Please tell us about the time you, dcunit3d, most successfully hacked some (non-computer) system to your advantage.

This one time, I spontaneously designed a memetic virus just to prove a point about religion.  It might have escaped the lab.  SOCOM still won't let me talk about it.

=============

If no, why not? What level of commitment are you willing to make?

=============

Do you have any other commitments between June through August 2015 inclusive?

=============

Do you have any commitments in the future and if so what?

