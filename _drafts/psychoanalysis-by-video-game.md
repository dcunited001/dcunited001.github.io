---
title: "Psychoanalysis of Video Game States"
---

### Psychoanalyze From Analysis of Save States

- this is great for RPG's -- and dating sims lulz
  - there were all those choices you could make
    - if these choices include timestamps, that's fantastic.
    - intelligent players (or those with a strategy guide) make more
      progress during game sessions

- i had this idea forever ago. it even works for old cartridges and
  game systems, as long as they had a save feature and can be tracked
  to someone's identity.
  - if there's no link to identity, it still serves to aid in data
    processing, but for the most part, there really isn't enough data
    or consistency.
    - even if you ID the owner, you can't really ID the player.
  - however, there are some signatures that can be lifted from old
    game saves that can provide information about the player's
    psychology

- spectral decoherence of individuals' collective experience degrades
  the ability to make inferences here. if you can't guarantee that
  there were enough people that spent enough time playing the game --
  ideally at the same time -- then you can never collect enough data
  to make any helpful inferences
  - along the same grain, it is much more useful to compare elements
    of the gamestate related to the beginning of the game, since most
    players are likely to encounter these scenarios.

#### What can you learn from an RPG?

- what can you learn from an RPG? (either just by watching someone's
  game experience or with data analysis)
  - is the player a completionist?
  - what story states were triggered?
  - what did the player complete?
  - do they care about the objectives, the story or the experience?
  - what rate of progress did they maintain?
    - if you're analyzing timestamps, then does it appear that there
      was always a task at the forefront of their mind or were they
      wandering?
  - what routes did they select for traveling through the world?
    - did the player instinctively choose the most efficient route?
  - did the player talk to many NPC's? All of them?
  - how long were their gaming sessions?
    - did they switch games often?
  - did they constantly think about trying new techniques/things
    instead of using the same small set of ideas/tactics repeatedly?
  - did they buy items consistently to have enough? did they buy way
    more than necessary? did they forget and need to start over?

#### Most Importantly: response to failure

- critical for any video game, what did the player do in response to
  frustration and failure?
  - if you're looking at timestamps of gameover events, were they
    frequent? too frequent? did they always end a gaming session?

#### what can you learn from a game like metroid?

  - which items the player obtained. some are much harder to obtain
    than others bc they require intuition and types of situational
    inference
  - for a kid, playing metroid without looking at a strategy guide can
    serve as a kind of intelligence test, as can many other games.
  - when they killed enemies, did they shoot only the minimum number
    of required shots? are they even aware of the number of shots
    required to take down each enemy or does that never enter their
    cognition?

#### Intelligence, Generally

- many of the above behaviors reflect psychological traits. these
  traits include intelligence, which is one of the hardest to measure.
  - in video games, intelligent people are constantly varying their
    experinece. this reflects strong cognitive ability, situational
    awareness and, most critically, metacognitive ability.
    - intelligent people dynamically vary their behavior, which is
      either de/coupled from situational awareness. those who variate
      their behavior constantly AND succeed regardless of what they do
      are usually more intelligent.
      - furthermore, intelligent people always enter new situations
        with more tools for inspecting the unfamiliar
      - of course, intelligence varies widely as it applies to video
        games, in a career and in social interactions

#### Structure of Game Save-States

- game save states are packed binary that represent trees of
  world-state data. they may sometimes include graph-like structures.
  - unfortunately, many games have schema definitions require higher
    order functions. here, there's no single rigid schema for a game's
    data, so:
    - (1) it's much tougher to compare game states and games from
      multiple players
    - (2) ... ?
  - for much older games that had hardware limitations (8-bit and
    16-bit) these had much more consistent addressing schemes for game
    values

#### Sidetrek into Processing Data With Varying Schemas

  - the wide speciation of schema of data presents an interesting
    problem. it's almost identical to the problem i was going to solve
    for Oscil8 (similar to splice.com) to allow users to share the
    MIDI Sysex data for synth patches and controller presets.
    - every piece of MIDI hardware is different, so I was going to
      need to scan a lot of PDF docs with automated processing,
      storing the MIDI Sysex schema in a document database
      - there may be some hand-coding for each instrument/controller.
    - then the Sysex files could be intelligently processed AND you
      could run machine learning in the cloud (cloud unnecessary)
      - load MIDI Sysex patch to synth (hardware or software VST) and
        generate sample with MIDI input
      - then process the audio output and try to correlate input with
        output.
     - it's complicated, but you have the benefit of processing
       patches that were COOL enough to be uploaded in the first
       place.
       - from here, you can deep dream the Synth Patches and if you go
         far enough with it, you can get an algorithm that attempts to
         impressionistically emulate some natural sound (obviously the
         deep dream idea was 2015, but the rest was early 2012)
         - all this and more I discussed in the video series that no
           one ever watched:
           https://www.youtube.com/playlist?list=PLEJEA9mYfeKjEbBxmiHEHpLcqnx5DIrYr
       - you actually get better results (the best results?) by
         getting the alg to generate synth patches fairly randomly,
         then sifting through to see what you like and why.
