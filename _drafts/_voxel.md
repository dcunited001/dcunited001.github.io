Voxxel, the impersonations app.  Fans and aspiring performers can impersonate quotes and accents from movies, SNL skits and standup comics.  Impersonations are scored and users can earn badges and achievements for getting the best scores.  Voxxel's data can be analyzed to reveal entertainment industry trends.

===============

Please tell us about an interesting project, preferably outside of class or work, that two or more of you created together. Include urls if possible:

In summer 2007, I had been recently introduced to Ruby on Rails framework by a coworker at ABS. I also DJ'd at my family's skating rink and I used it to develop an app that allowed kids to make song requests. I indexed our music by scanning their ID3 tags and storing the titles and artists in MySQL.

The app was a hit with the kids, but I didn't know much about deploying apps at the time. I ran into tons of problems because Ruby was a complete pain to develop with on Windows at the time, so after tons of frustration and lacking the focus to continue, I gave up.

However, during the 3 or 4 months that I was working on it, I really wanted to launch an app for businesses that played music, like Skating Rinks and bars. I would have competed with some of the jukebox apps out there and this was my plan, though I didn't want to accept cash for requests. But at the time, I had no idea how to achieve this or even where to look for advice and I was focused on skating and work, so I gave up without much though. I've been kicking myself ever since, because it was a year or two before I touched Rails again.

===============

How long have the founders known one another and how did you meet? Have any of the founders not met in person?:

I don't have any cofounders =/  However, I'm going to write the rest of this application using the "Royal We" so I don't sound like I'm alone on this stellar app.  Kudos if you picked up the Big Lebowski reference.

===============

How far along are you?

For the product, we've prototyped the UI for listening to soundbytes and recording impersonations, as well as a basic similarity algorithm for scoring a user's impression.  For now, the app is frontend only, with no API and everything done in Angular/WebAudio/Canvas/D3.  

===============

What is your monthly growth rate?

We're not ready to publicly market Voxxel just yet.  Right now, we're growing awareness and getting feedback among a selected set of people.  We need to get an Android/iOS app together before we can begin publicly marketing Voxxel.

===============

If you have already participated or committed to participate in an incubator, "accelerator" or "pre-accelerator" program, please tell us about it.

We've applied to Techstar's Disney Accelerator in April 2015, but haven't commited to anything yet.

===============

Why did you pick this idea to work on? Do you have domain expertise in this area? How do you know people need what you're making?

I was watching Parks and Rec on Hulu one night a few months ago, impersonating the characters on screen -- but not very well.  I found myself wanting an app to improve accents and impersonations, but I couldn't find anything like it.  Since we all sound different to others than we do to ourselves, I wanted an app that could provide me with unbiased feedback.

I'm very passionate about audio and machine learning.  My previous startup was Oscillate, which would allow users to upload sound samples.  I applied to YC W15 with Oscillate.  However, the market was too crowded with competitors.  It would be too easy for Splice or Blend.io to introduce a new feature and kill my product.  But I'm still interested in doing a startup centered around audio.

Since I've developed the Voxxel prototype a few weeks ago, I've been getting feedback from friends and family.  They seem to like it.  I ran into one potential customer in particular at my local coffee shop. He was interested in what I was working on.  I pitched it to him as I was walking through the prototype and he immediately started doing impressions of Rodney Dangerfield and others.  So it's great to see people having fun using my product.

===============

What's new about what you're making? What substitutes do people resort to because it doesn't exist yet (or they don't know about it)?

We're not aware of an app that shows how similar two vocal samples are.  Doing so would require some complicated machine learning algorithms, but I don't see why it can't be done.  If there are voice identification algorithms to detect whether or not voiceprints are identical, then a voice similarity algorithm should also be possible.

There are soundboard apps out there, but that not the same.  Soundboards don't provide an engaging interaction for the user.  The user doesn't really do anything, they just listen to the sound.

We believe our app will provide a novel user experience that would be fun for people of all ages, but especially for kids. We're not sure why it doesn't exist already.

===============

Who are your competitors, and who might become competitors? Who do you fear most?

Soundboard.com is a competitor, I guess.  I ripped off some of their sound samples for the prototype, but the quality is terrible.  There's a ton of reverb, like someone rerecorded the samples on their laptop mic.  And some frequency ranges are completely filtered out, as though their vocal samples may have been marked. 

We're going to need to negotiate with entities in the entertainment industry for the rights to provide their material.  To succeed, we will need to partner with large businesses who have competing interests.  And it makes me a bit nervous that the interests of larger businesses who can throw their weight around might impact my own business' interests. 

===============

What do you understand about your business that other companies in it just don't get?

It's not about what people see, it's what they do. 

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

Then, I saw the Disney Accelerator and thought it'd be perfect, so I pushed myself hard to get a prototype together for that.  Now that I have a basic prototype, I can focus on polishing that while beginning to market my app and building up a user base.  

===============

Are any of the founders covered by noncompetes or intellectual property agreements that overlap with your project? If so, please explain.

No

Was any of your code written by someone who is not one of your founders? If so, describe how can you legally use it.

No

Is there anything else we should know about your company?

No, but I'd love to answer any questions you have.

===============

If you had any other ideas you considered applying with, please list them. One may be something we've been waiting for. Often when we fund people it's to do something they list here and not in the main application.

Tweeted for HBO Silicon Valley's #BadAppIdeas:
- Google Glass for your dog
- Dating site integrated with #23andMe data 
- App to manage multiple todo list apps
- Tangible Bitcoin, printed to paper with QR codes
- Use bots to manage communication with your fb friends #BadAppIdeas a turing-test proven chatbot to talk to your friends for u
- App to rent out your friends' social media data for marketing purposes
- IQ-based sperm donations to the highest bidder 
- Kickstarter for product to help parents beat paternity tests

OK, some of those are really, really bad.  I have lots of good ideas too, but most require sizable investments and specific skill-sets to get started.

===============

Please tell us something surprising or amusing that one of you has discovered.

That I am actually a writer.  I discovered this in the past few months actually, but if someone had told me this ten years ago, I would have never believed it.

It's ironic because I always hated writing.  So much so, that during the summer before my senior year of high school, I took English at a community college.  I found that this way, I could use dual enrollment to skip both my senior year of English in high school, as well as my freshman English classes at Virginia Tech.

===============

What convinced you to apply to Y Combinator?

I wanted to apply for the Summer 2015 session.  However, in the weeks proceeding the deadline, I wasn't as prepared as I would have liked to be and I started looking for a job.  As it turns out, for me, finding a good job is a futile waste of energy.  I don't have a degree, I have negative work history, I'm stuck in Roanoke, VA without a tech community, I've been unemployed so long that I don't actually have relevant experience anymore, etc... I personally don't understand how someone with experience with Rails since 2007 could be unemployed.  I'm sure I could get a job, but I'm pretty picky.

So I'm at the point where I have to start my own business.  Or at least, if I build something like this and show prospective employers, I'll be much more employable, even if the startup doesn't work out.  Killing two birds.

A few weeks ago, I saw the Disney Accelerator mentioned on Twitter, so got a prototype together in about a week and applied.      The Disney Accelerator seems like a perfect match, since it'd nicely position us in the entertainment industry.  I've always wanted to go through YCombinator, so I'm submitting this now, even if it's not likely I'll be accepted.  

===============

How did you hear about Y Combinator?

Through a coworker in 2007/2008, when there was still a Boston YC.  I didn't have the right mindset and knowledge at that time to realize I should pursue it.

===============

Please tell us about the time you, dcunit3d, most successfully hacked some (non-computer) system to your advantage.

So I'm going to tell you a story. It's one that I could literally spend hours talking about, but I've tried to keep it brief.  It's pretty much the most amazing thing that has ever happened to me.  I actually might write a book about it, though I'd need to obfuscate the details.  I hacked the system in several different ways, but also got hacked myself. It's totally worth your time to read, I promise.

I also hacked my own brain and repressed my own memories, providing myself with a key to unlock them later.  Total CIA-Manakin-style.  Seriously, it's hilarious -- I'll get to that part in a minute.  I only remembered all of this about a month ago.  I've been wanting to blog about it, but since it involves a celebrity, I'd rather not post it publicly. 

So it's May 31st 2013 in Denver.  I'd just gotten off the bus from Boulder and I was getting ready for Hack 4 Colorado.  I really wanted to go to Denver Comic Con, which was also going on at that time, but I felt that I should go to Hack4CO for the networking and to give back.  It was a Friday afternoon and I had been up all night at this point, working on getting things ready for our teams entry to the hackathon.

I was chilling at Leela, my usual spot in Denver -- they serve lattés 24 hours a day.  I'm about to order a mocha, when this girl comes up from behind me and says "I'd like to buy you coffee," -- in a British accent, no less.  Score!  I was speechless, trying to figure out what bizarro universe I had fallen into, where girls are so forward.

So we're sitting outside and it's me, her and her friend.  When I ask them where they're from, they replied, "Toronto," which seems a bit weird because of their Brittish accents.  She tells me that she speaks 4 languages and I'm amazed.  I immediately fall in love with her and we start talking about Duolingo and French.  Then, she switches to a Russian sounding accent, to which I say "Wow, you're pretty good at that."  

Then, she and Jordan drop the accents altogether and she tells me her real name, Tatiana Maslany, which I promptly start making fun of, lightly of course.  I also made fun of Canada, which she was really defensive about.  She quizzed me on Canadian provinces and I named like 10 out of 13.  Finally, she tells me she's an actress.  Probably the most successful blind date ever -- we ended up spending like 6 hours together that weekend. 

She mentioned that she never wanted to be famous and I acted like I didn't believe her.  Tatiana and Jordan almost left at this point.  I was really just trying to test to see if she was serious about not wanting fame -- and she was.  So then I started talking about how I struggled with jamskaters who wanted fame, were willing to do anything to get it and how that nearly ruined my life.  I told her I was almost barely famous as a jamskater and how I struggled with it.  I gave her lots of life advice, most of which she probably already knew.  I also mentioned Dale Carnegie's book, as well as 48 Laws of Power.  I explained why she should inoculate herself against many of the tactics in 48 Laws of Power. 

Here's one place I hacked the system and utilized my business smarts. I determined that, as an actress, she has an image that she has to maintain.  She probably has to tell people the same things repeatedly to build that image.  And while she likely enjoys her work, she talks about it all the time -- boring.  But because she probably loves what she does, we should talk about other people's movies and etc, which seemed to work really well.

She started telling me about her show, Orphan Black, which is about clones.  And I jokingly tell her, "Yeh, I'm part of a top secret experiment and there's clones of me everywhere." I continue to tell her about all the doppelgangers in my life and how I even got in a fight with one of them. 

Tatiana tells me they're at the Denver Comic Con to get ready for the San Diego Comic Con, where the Orphan Black cast is doing a panel.  She asked me to come up with some questions so she could practice.  After one generic question, I came up with a really good one: "Which one of the clones would be best prepared for the Zombie Apocolypse?"

We continued talking about all the things: linguistics, philosophy, post-structuralism, movies, etc.  We talked about the Singularity and it's implications for society.  I told her about mass NSA surveillance about a week before the Snowden story broke.  We talked about using 3D filming techniques in 2D films.  She told me about scenes coming up in "The Wolf of Wall Street" and asked several questions about quaaludes, lol.  

We also talked about jamskating and how the rollerskating industry was dying.  And we talked about the show Parks'n'Rec, which is ironic because 3 months later, Tatiana shot not one, but two episodes of Parks'n'Rec that featured rollerskating -- s6e5 & s6e6.  

At one point, we were talking about improv comedy and impersonations.  I had been doing accents and impressions, even though I suck at acting.  She tried to convince me otherwise, but I wasn't buying it.  Anyways, I suddenly had a burst of inspiration and exclaimed "OMG i have a brilliant idea for an app!!"  She asked me what it was, but I wouldn't tell her.  I had just thought of the idea for Voxxel, but I would forget it for nearly two years bc I didn't write it down. 

Eventually, around 7:00, I had to leave to get to the hackathon.  Walking to the Hack4CO venue, I was pretty bummed out about falling in love with this amazing girl that I had no chance with, especially since she had a serious BF anyways.  So I decided to forget about everything.  That way I wouldn't have to deal with losing her, lulz.  I decided it wouldn't be too hard because I had been without sleep for so long anyways.

While I was at the hackathon, I got a phone call from a friend from Leela's asking me to come back down.  It sounded kind of urgent, like i would totally miss out on something amazing.  I wanted to stay, but a few minutes later, my team decided we should work from Leela. 

While we were working at Leela, I kept meeting these amazing girls that seemed to be so interested in me.  The whole time, I'm thinking "Wow -- what am I doing right here?" As I discovered two years later, it was Tatiana acting as each of her clones and I had no idea that it was the same girl.  

Around 3:00am, I'm working alone on our team's project.  I'm still awake and had decided to stay up all night.  This girl with dreadlocks comes up and asks me if I want to smoke a joint with her.  I'm still thinking "Damn! She's cute! That's two in one day. What am I doing right here?!" but I tell her no, since I'm working and need to focus on that.  She comes back in 2 minutes and asks again and I'm like "OK, I can't tell this girl no twice.  Besides she seems like she could be amazing."

So she asks me to roll the joint.  I smell the weed and realize it's Blue Dream -- by far my favorite strain and something I'd mentioned to Tatiana.  While I'm doing that, we're discussing biotechnology and all of these amazing sciency things that I love to talk about.  We also talked about the time my college roommates and I built an igloo -- just to hotbox it.  Pretty much immediately, I fall in love with Cosima -- who is actually Tatiana -- as she could hang with me on Bioinformatics, Epigenetics, Medicene and all these amazing topics!  Of course, I botched the joint completely, lulz.  

This is where I had the system hacked against me. I started talking about how I fell in love with this amazing girl Tatiana Maslany.  She asked me why and I said "She's so smart.  She speaks like four languages and her mom's a translator and we talked about all these amazing things ... Oh yeh and she's an actress, so I have no chance with her," and started telling her how I was planning on forgetting everything.  She didn't believe it would be possible.  I convinced her that it was, but that if I ever watched her show, Orphan Black, that I would remember.  It would be like the key that unlocked my memories. 

Tatiana had told me the show would be streaming in early 2015 on Amazon.  And based on this fact and knowing that I never watch TV, I told Cosima that I would I would probably remember in February or March 2015 -- which was amazingly accurate.  Accurate within a month. 

I asked Cosima where she was from and she said "Toronto, but I go to school in Minnesota."  I thought it was a strange coincidence, but just a coincidence.  But since she was from somewhere so far away, I thought I could tell her whatever and it didn't matter, since I would never see her again ... so I talked about all the things, like all the problems in my life.  Like the fact that I have social anxiety around girls because I had been single for 6 years and ... allll the things.  To be fair, Cosima wasn't exactly leading me on and even tried to stop me.

At certain points, Cosima made some statements and I thought maybe I was talking to Tatiana's sister or cousin, which made me feel like crap since I had just divulged all the things.  And then Cosima said she knew the girl I was talking about and that she would be at Leela the next day.  Sure enough, Tatiana showed up and we spent some time drawing and stuff.

I was so thoroughly convinced that Cosima was a different person that, for months, I had hoped to run into that dready bioinformatics chick in Denver again (I forgot she was from Toronto).  But of course, I never did.  And I suppressed the memories of Tatiana, which was one of the hardest things I've done.  I even deleted tweets and text messages, so I wouldn't remember if I accidentally viewed them. 

The hardest part was when I saw Tatiana for the last time.  It was on Sunday, I think.  She asked me if I would go to San Diego Comic Con with her in July 2013 and I had to turn her down.  I told her I would run out of money at that point.

And I never realized that I had met the other clones either.  I thought they were all different people.  Helena, the crazy clone, spilt a beer on me and walked off.  Rachel was rude and stuck up, so I pretty much told her to $#@! off.  I told Alison, the suburban housewife clone, that she reminded me of my sister-in-law.

When watching her show, I didn't remember anything until the last episode of the first season, which she had told me about.  Even then, there was only a vague familiarity about her characters.  It wasn't until midway through the second season that I started to completely remember everything.  And finally, I figured out that all the other girls were actually Tatiana two.

So I basically fell in love with the same girl multiple times in a single weekend without realizing it.  And now I feel like it's a race against time to chase her down before she gets married.  Basically, my life has turned into the plot for a romantic comedy movie.  lol jk

But even if it's not going to happen -- and it's probably not -- just remembering that this happened is probably the best thing to happen to me since meeting her two years ago.  Two years that were particularly bad, starting a few weeks after we met.  So it's become a kind of raison d'etre.  Even if we don't end up together, it's so amazing that this happened, that it gives me hope that maybe something like it could happen again, which provides me a reason for bettering myself.  I've seriously been laughing about this for like a month now.

None of this would have happened if Tatiana weren't such an amazing person.  As someone with high-functioning autism and anxiety, I'm often not the most social person.  She looked past all that and took the time to get to know me, discovering the amazing person that I am on the inside.  Regardless of whether she felt the same way I do, she spent considerable effort being kind and boosting my confidence. I'm surprised that she never broke character as Cosima.  If I had known it was Tatiana and still said the same things, I'd expect her to have walked off.

By the way, I met several famous people that weekend.  I met the entire cast of Orphan Black, as well as the co-creators.  I also met Emma Stone, who talked with Tat and I for a bit.  I may have also met George Lucas ... without realizing who I was talking to.  LMAO.  If it really was George Lucas, we talked about the Disney/Star Wars deal and why Lucas didn't actually ruin episodes 1, 2 and 3.

Seriously though, if you ever want to hack the system with celebrities, don't recognize them -- they love it when people don't know who they are.  I'm not saying to act like you don't know who they are because that's lame.  Plus, they're actors, they're good at picking up on acting -- you're not going to beat them at their own game.   Many celebrities don't like solely being known for their work and their characters, since fans who recognize them for that are less likely to recognize them for people they actually are.  And that's why I'm never watching TV again.

=============

If no, why not? What level of commitment are you willing to make?

I'm willing to do whatever it takes.  I'll make whatever sacrifices are necessary.

=============

Do you have any other commitments between June through August 2015 inclusive?

I'm skating on the Legends team in the Skate Wars event at Vanilla Summerjam 2015.  Here's video of me from Skate Wars 2014:

https://youtu.be/o4ROc4VdTtw?t=8m48s

=============

Do you have any commitments in the future and if so what?

No, for the past four years, I've intentionally kept myself free of commitments, so I'd be available to work on a startup or travel the world jamskating.
