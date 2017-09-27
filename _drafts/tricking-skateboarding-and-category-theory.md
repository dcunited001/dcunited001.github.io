
- updates to mental model to cover emotions, empathy and emotional
  intelligence
- https://www.youtube.com/watch?v=OD9CtIiBb6s
- need to elaborate thoughts in metaverse section of part one
- also need to tie in category theory to epistemology/cognition in
  beginning of section four
- further explain taoist reference in part 3
  - The Tao Te Ching is moreso talking about the ineffibility of the
    highest truth.
- deconstruction?

- cognitive biases
  - http://io9.com/5974468/the-most-common-cognitive-biases-that-prevent-you-from-being-rational

======== part 4: in depth look at category theory

- how the official terms for belief & knowledge loosely map to what i
  was referring to as knowledge
- compare plato's idea that visual art can pursue the idealized human
  form
  - with with the idea that we can pursue these idealized forms of
    human knowedge without ever achieving them

- applying ideas from programming to real life

- bubble analogy for combining functions
  - use haskell's lazy evaluation as an example of triggering bubbles
    at various levels to combine
- exponential cartesian category
  - generalizes notion of function set

- applications of category theory
  - recombination of AST's
  - recombination of electric circuit diagrams
    - compare input/output with interesting phenomena (low-pass
      filter, amplifier, etc.)
    - vary component strength
    - recombinate component patterns to uncover new designs for
      traditional electronic functionalities
  - compare nuclear permeability amoung families of chemicals
    - define what factors make chemicals nuclear permeable
      - objective function size, electrochemical properties of
        conformations
    - use molecular dynamics software, compared
  - differentiation of ... categorical shit

- brief discussion on epistemology foundationalism/coherentism/etc
  - explain that some people's mental models are different
    - and that these some of theorys may apply differently for
      different people
      - but when considering universal knowledge, some is definitely
        more incorrect than others
    - some mental models more rigidly defined (especially when deeply
      rooted in religious or traditional knowledge)
    - and may set base assumptions so strongly that it doesn't allow
  - compare foundationalism to object oriented programming
    - i.e. it's mostly tree-based
  - compare coherentism to a more flexible approach
    - explain how this is better, even though it doesn't resolve
      circular dependencies
  - explain how category theory allows us to model knowledge in a more
    flexible way
    - a universal system for modeling any problem domain or activity
      type
      - category theory and skateboarding/tricking

- explain some basics of category theory
  - how to combine functions together
  - how to alter notion of equality
    - how to optimize by adhering to an altered notion of equality
  - how to recombinate knowledge while fixating on certain facts
  - tricking and skateboarding as good example of modeling complicated
    activities with category theory
    - explain why tree based models fall far short

``` f(g(x)) == g(f(x)) ??  ```

- idempotence
  - in many cases.  if yes, than f and g are idempotent
    - that is execution can occur in either order and the same result
      will be achieved
  - however, f(g(x)) can *always* be made to be idempotent with the
    addition of another function
    - that determines the order of execution
    - that is, for functions f() and g(), there is some function h
      which will force f(g(x)) to be idempotent
      - by either controlling the order of execution, using a
        higher-order function h()
        - h(f,g,x) = h(g,f,x)
        - this can be done in a few ways
          - one of which is to ensure that the functions f & g are
            applied by h
            - in a predetermined order which is always enforced by h
          - or by constructing an object with h
            - and operating on that object (as self in ruby) with
              functions f and h
            - and ensuring that f & h have no side effects
      - or by parsing the tree of operations, which represent the
        structure of both f and g
        - and taking the result, inverting these tree of operations,
          applying the result
        - obviously, this is not possibly for all functions and is
          more complicated
      - my point is, it's flexible and by getting creative one can
        always

- when i first learned about category theory, i didn't quite get it
  - i sorta understood it, but it was far too abstract to understand
    how it could be applied
  - even though i knew it was used as the basis of higher level math,
    - it was a bit too abstract to really understand how it would be
      useful in application
  - after some meditation, learning about category theory and monads
    really did help
    - a ton when i started to reexamine how i thought about design in
      javascript
      - javascript is a functional language, but a unique one.
        - as much as i don't like using it, i've learned to respect it
- but i still didn't get it. i vaguely remembered back to BC Calculus
  in high school.
  - my teacher briefly discussed natural transformations at the end of
    my senior year,
    - but i hadn't been introduced to higher-level math at all
      - which is a fucking shame because i still haven't reached
        anything in math
      - that i couldn't have understood in high school
      - of course, i wasn't exactly motivated at that time
  - i understood that natural transformation were interesting
    - in that functions can reach the same 'destination' by following
      various paths
- at this point, i couldn't say that i had even had a vague
  understooding of category theory
  - i had grasped the concept of a category as a means of modeling
    relationships
    - a category is defined as "a kind of collection of objects and
      morphisms that describe how they relate"
      - wow that doesn't help at all.  what the fuck is a morphism?
      - also, note that a category is a group-like structure and like
        other structures from group theory,
        - it requires that certain mathematic laws hold
    - a functor is a kind of structure-preserving mapping which is
      applied in category theory.
      - that doesn't really help either.  i kinda get it, but how is
        it useful?
      - ok, it's a homomorphism, whatever that is
        - which basically means it the structure of a category
        - and because it's homomorphic and information(structure) is
          preserved
        - you should be able to move back and forth between categories
      - and it maps to a new category
        - at this point, using the best examples that could come to
          mind
        - i start visualizing categories as various graph-like
          structures
          - and functors as maps between those graph-like structures
        - start visualizing these functors as a means of creating
          nested graphs
          - `F(G1,G2) = G1,2` and F^-1(G1,2) = G1,G2
          - where the graph structure of the combined graph G1,2 would
            basically be G2's structure
            - nested as subgraphs within G1
        - this is an interesting idea, but not quite the idea we're
          looking for
          - it definely *uses* categories and functors, but in a
            different way

pentagon-self-similar-graph.jpg

- ok, at this point, i understood monads from just a programming
  perspective
  - so a monad is a function that returns a function that you can
    combine with other functions, yada yada
    - this limited definition doesn't really encompass the structure
      of categories
  - then i started understanding monads as functions that return a
    category if you need one.
    - so if you've got Thing1 and you need a category that you can
      mesh together with others
      - you can use a monad to take Thing1 and make it adhere to the
        relationships and morphisms of CategoryA
    - this idea helped a lot, still playing around with things in my
      head
      - starting to get it, so far, it's considerably helped me to
        improve my javascript programming chops
        - but it still doesn't seem as useful as it's cracked up to be
- at this time, i looked at the meta aspect of it all.
  - I had read that functors are a like a category themselves, like a
    level higher. a 2-category
      - so i started to understand with a functor's can take things in
        one category
        - and move to another category.
      - and because categories themselves represented ways to model
        something
        - the functors allow you to 'travel' between those
          representation
    - but wtf is a 3-category?
      - i found these periodic tables which seemed to detail all the
        possible combinations of n-categories
        - at various levels.  i understood the significance of this
          table:
          - there's plenty of times where you need to work with higher
            level functions
            - E.G. a higher level function H() that combines the
              functionality of a monad and a 2-category
            - so in programming you'll have a function that just takes
              two or more functions
              - one is fairly basic.  it's a monad.  the other
                function is more complicated
              - and you need to work with these functions, regardless
                of their n-category level
              - in order to combine them into something that results
                in model of final behavior you want
                - in the end, a final basic function is returned
                  - constructed of the behaviors combined by your
                    function H()
  - I started thinking a lot considering a finite system of
    categories - S
    - so, if there's a finite number of categories,
      - there's a finite number of ways to combine those categories
      - so there should exist one functor between for each each
        category
        - also, because you can have a functor that transforms a
          single category to itself,
        - then there should be one functor for each category itself
      - however, since a single pair of categories can have functors
        - which remap its objects and morphisms differently,
        - then there exist a finite number of permutations for these
          relationships
        - and thus a finite number of functors
          - accounting for every possible pairing of the system of
            categories S can be
            - as well as every possible mutation for each pairing
          - functors satisfying some conditions, of course.  so a
            group of functors, i guess
            - this finite group of basic functors for system S must
              have their functionality restricted in some way
            - because i can image that you could have functors that
              would operate in some way which results in
              - a clearly infinite number of possibilities for system
                S that has n finite number of categories.
    - but the metaphysical implications are that there exist these
      categories that model relationships
      - and there are these functors that describe the various ways of
        transitioning between them.
      - and these functors sort of encode the similarities shared
        between these categories
    - so therefore examining Functor F1,2(C1,C2) from system S that
      transitions Category C1 to C2
      - there must be some reflection of the structure of both C1 and
        C2
        - that exists within the functional definition of F1,2
      - in other words: each category in this complete system can be
        - defined entirely in terms of the functors that connect to
          it, without requiring a definition of the category
          - therefore, if System S has five categories, but you lost
            the definition of C5
            - you should be able to reconstruct it's definition based
              on the structure of any two functors that connected to
              it
        - that is, there is a similarity in all things
          - and all things can be defined in terms of their
            relationships with each other
          - and IMO, philosophically, all things can only be defined
            in terms of their relationship to other things
        - furthermore, each category in this complete system S of a
          finite number of categories
          - should be able to be defined in terms of the other
            categories
          - that is, if you're missing the functors that connect to
            C5, but not the definition of C5
            - or you want to add a node C6 to the existing system
          - you should be able to inspect the structure of C5 or C6
            - and completely construct the permutations of functors
              transitioning to C5/C6
- wow, so that blew my head when i started thinking about that
  - it seems like category theory is extremely flexible and extremely
    powerful
    - especially if you could work with categories in a systematic,
      dynamic way
    - although, a little abstract and hard to get, but that's because
      it's so meta

### Hmmmmm idempotence and isomorphism

- but i still didn't 'get' all the commotion over idempotence and
  isomorphism
  - it just didn't seem relevant.  it doesn't even happen that often
    that you can rearrange functions as you please
  - especially when you're working with matrices or integers or .. you
    know, traditional mathy things

nk-table-by-Baez-Dolan.gif

``` f(g(x)) == g(f(x)) ```

- however, there's another function in this statement, do you see it?
  it's the equals function
  - so besides playing around with higher level functions that enforce
    dependency or order of operations
  - another way of creating idempotence in certain situations is by
    altering the notion of equality!
- so rewritten in a more functional notation, it's instead `apply(==,
  f(g(x)), g(f(x)))`
  - where we are applying the equals functions to the arguments of
    f(g(x)) & g(f(x))
    - to get further complicated, we could have a even higher order
      function k
      - which inspects the structure of a statement like `apply(==,
        f(g(x)), g(f(x)))`
      - and 'understands' that == is a comparison function
      - and k could intelligently alter that notion of equality with
        another comparison function
        - such as `within_range(20)` to use an inequality to ensure
          that either result is still contained
          - within a specific distance
        - i imagine this specific higher-order technique, which not
          only replaces the function of ==,
          - but does so both in a methodic way to achieve some
            optimization objective
            - and does so in a functional way so that it is
              abstractable and useful
          - is very,very, very useful when combined with topological
            techniques learned in functional analysis
      - however, explaining this using a function k is very
        complicated, so forgive me for that
        - that would involve higher-order categories
- so if we change the definition of equality to that of an inequality
  or acceptable range,
  - then we can sort of decouple the dependency between f & g
  - and delay execution of either one, without affecting the outcome
    too much
- also, if the notion of equality is instead that a set of
  dependencies or objectives is satisfied
  - then we can significantly alter the behavior of the combination of
    f & g
  - and while the behavior may differ wildly, it is still
    significantly similar
    - in that these dependencies/objectives are satisfied
- this is, in other words, a sort of mathematical definition for
  thinking outside the box
  - examples of 'thinking outside the box'
- examples using social interation
- examples using physics

- furthermore, if you're satisfying sets of dependancy,
  - you could fixate most of those dependencies
  - while selectively rearranging the remaing dependencies,
    - observing that the outcome adheres to the fixated dependencies
    - in this case, you could remove certain dependencies as well
    - and remove certain permutations from considerations if they are
      found to be erroneous or invalid
- offer examples of business cases
  - profit must be greater than x
  - time consumed by employees must be less than x
  - task a must be executed before task b
  - revenume consumed by resource y must be less than x



part 5: application of category theory to model the mundane(?)

- expansion of the mind to elements that before seemed irrelevant
  - how this is hard to deal with and can be confusing
  - if you're suddenly considering massive amounts of information that
    you didn't before

- explain meaning of functional aesthetics to movements in tricking
  and skateboarding
  - explain functional aesthetics & objective functions for
    appearance/success of body motion
    - includes rotation(s), takeoff technique, and basically,
      true/false whether or not you've satisfied the move
    - but in more complicated models, could return a score for how
      well you satisfied the move
      - in these models, the brain can break down infinite spaces into
        a finite set of points distributed across them
      - and then use partial differentiation to examine the
        contribution of each factor
        - vs it's positive/negative effect on the score
      - your brain does this all advanced math in a kind of quantified
        analog, btw
  - the evaluation of the aesthetic functions can be applied after the
    movement is complete
    - to determine success/fail
    - as well as to future movements for optimization
      - say there's several possible movement paths to examine during
        execution
      - which of those movement paths will result in the best rate of
        success for aesthetics
  - the better your self-perception is in judging the success/failure
    of these movements
    - the more critical you will be of yourself and the faster you
      will learn
  - these same aesthetic requirements can have delayed execution
    - but the mind uses these same "objective functions" in multiple
      places

- spotting the landing as perfect example of decoupling of coordinated
  movements
  - occurs both in tricking and skating
  - spotting the landing requires sensory memory of successful
    experiences
    - basically, what did i experience visually when i backflipped
      successfully 100 times
  - in parkour, spotting the landing allows you to achieve functional
    aesthetics of move
    - while maximizing the 'successful move space' that satisfies
      those aethetic objectives
    - that is, you can back flip off something 3 feet up with nearly
      the same technique you would for flat ground
      - and because you can spot your landing, then you can decouple
        your movements to open early
        - to halt your rate of rotation, ensuring that you will have a
          good landing
        - so therefore, the input (your technique and movements for
          the backflip)
          - can variate in many dimensions
          - but your output (your technique for the landing) has been
            decoupled, it's execution delayed
            - specifically so that it can be altered to adjust under
              various parameters
  - if you cannot decouple this in your brain that means that each
    backflip that you do at various heights
    - requires it's own memorized muscle memory - each height would
      require precise timing and technique
    - however, your brain is good at parameterizing this muscle
      memory,
      - so that, after conditioning, the same techniques can be
        applied to adjust for different parameters(heights)
      - your lucky.  it does this unconsciously.
      - so therefore, you can gradually learn this one technique
        - and apply it under a greater variance of parameters and
          conditions

- tricking/skateboarding and category theory
  - construction of moves by functions
    - kickflip = ollie * barrel rotation
    - pop shuvit = ollie * horizontal-rotation
    - double popshuvit = ollie * horizontal-rotation(2),
      - but fixed-point on equality for certain objectives
  - fixing on notion of equality for certain objectives
    - I.E. for tricking, landing technique must remain the same for
      certain move families
      - new moves can be creating by applying base techniques to
        existing moves
        - base techniques = dip, twist, flip, tuck, lift, kick
      - btwist = dip, lift+kick(optimize-height),
        twist(optimize-barrel-rotation)
        - also, while you're dipping, you need to start winding up for
          twist
      - atwist = lift+kick(optimize-height), aerial,
        twist(optimize-barrel-rotation)
      - corkscrew = lift+swing(optimize-height), change gainer
        trajectory, twist(optimize-barrel-rotation)
    - in tricking, these techniques (lift, kick, twist) are combined
      to create new moves
      - but their momentum components must be maximized without
        affecting their functional objectives
        - that is, in lift+kick+twist(single),
          - the functional objective of twist(single) is a 360 barrel
            rotation
          - the combined functional objective of lift/kick is more
            height
          - each technique needs to be executing in synchrony,
          - but the tricker should be able to add greater lift,kick
            - without affecting the single rotational objective of the
              barrel rotation
        - if the tricker can obtain enough hight from lift+kick
          - without losing the functional objective of rotation from
            twist(single)
          - then the tricker should be able to apply more horizontal
            rotation to achieve twist(double)
        - and in tricking, all of these techniques are separate, yet
          combined in their effect.
          - they are interdependent
        - so, therefore, going from btwist(single) to btwist(double)
          - means that your brain must account for changes to the
            lift+kick which is also applied

- for skateboarding
  - for most skate tricks, must get more height on jump
    - to clear board and spot the landing
    - but getting more height cannot alter board trajectory
    - must also center the board's rotations
      - or intentionally alter board position to anticipate landing
  - therefore, all moves stemming from ollie must fixate on keeping a
    clean board trajectory
    - while optimizing for height.
    - so any variations in foot motion must allow for clean jump +
      more height
  - and therefore, foot motions in skateboarding must be precisely
    timed
  - to nose/tail grind, you need to be able to ollie
    - retain optimization for height
    - maintain the board's relative position to your body
      - while modifying your position.
      - you have to ollie, rotate the board, move the board towards
        the target
    - while controlling foot position on the board
      - as well as weight-distribution on the board
      - need to land with an intentional footing
  - so, your brain has to calculate this stuff to some extent before
    you ollie to nose/tail grind
    - however, there's a point at which i believe you can decouple the
      requirements
    - so you can just ollie and, based on your position, trajectory
      and momentum
      - you can satisfy some requirements to an extant without
        considering them before taking off
      - obviously, this requires experience
  - but the point is the decoupling of what you plan on doing and how
    it's executed.
    - this means that your brain is responding instantly by feel
    - within a certain range, there is an infinite number of
      parameterized working solutions
      - that is, the parameters are mostly what your body can effect
        by movements
        - as well as aggregate parameters, like board position after a
          set of possible coordinated movements
      - the brain evaluates combinations of ranges of movement that
        will satisfy the objectives
        - the more flexible your brain is in identifying these
          combinations of ranges of movements,
          - makes you more capable of reflexively responding
    - however, this decoupling between high-level move intent and
      actual execution
      - means that the brain is delaying evaluation of the
        construction of movement choreography
        - it's subconsciously considering the functional dependencies
          that your motions will have on the aesthetic outcome
          - e.g. oh shit, you moved your foot too fast or too far and
            this means your kickflip overrotates
          - or your takeoff doesn't account for how it will affect
            board position
            - the board will rotate, but it will not land under you
          - or you got the board rotation, but did not get enough
            height to spot the landing
            - and spotting the landing is the perfect example
        - and identifying a set of coordinated movements that will
          satisfy the functional aethetics of the move
      - and the delaying the identification of these exact movements
        until it has better information
        - which implies this decoupling leads to more flexible
          response to mistakes and movements
        - after acquiring significant experience, of course

thinking ahead vs reactive movements
- some people are able to do this very well
  - they plan in their head two to three movements ahead
  - this is very hard, because if you're technique is imperfect,
    you'll either need to react in time to adjust
    - which requires shifted focus
  - or you'll need to just be reacting improvisationally from the
    start
    - this is much easier, because as you land a move, your
      subconscious mind tells you the possible moves to chain to
    - therefore, imperfect technique isn't a combo-killer
    - in jamskating, this would lead me to making new moves
      - new move ideas would bubble up from my subconscious mind based
        on what techniques were available to apply
      - i would make a mistake or end up in a new position and i used
        my subconscious mind to determine where to go next

### Other Skills that enhance Cognitive Enhancement

#### Bonsai Trees

- imagining the long-term developments resulting from subtle changes
  to an slowly evolving system

#### Building a Ship-in-a-Bottle

- in order to design a ship in a bottle, you have to imagine the final
  product, then deconstruct it into pieces small enough to fit inside.
  - it can be constructed outside, deconstructed inside, then
    reconstructed again, but this is inefficient and sometimes the
    pieces/joints may be impossible take apart once together.
  - however, a ship in a bottle is a metaphor for interacting with a
    system in a completely indirect way. it could be imagined as a
    metaphor signifying the pinnacle of obfuscation of process (via
    catspaws, etc)
    - so, if my modular theory of mind is correct, then this skill in
      particular is useful for imagining how to deconstruct an end
      product to be reconstructed within the confines of the
      constraints
      - this is all done by interacting with the final product via a
        set of frustrating tools that enable you to appear karmically
        separated from the end product.
    - so, for example, if you wanted to condition an individual to be
      used as a manakin, you would have people interact with that
      person for their entire life like they are a ship in a bottle.
      - you would sow the seeds of their isolation and restrict their
        psychosocial development to keep them completely isolated for
        their entire life, while they are psychologically dependent on
        the people around them who are indirectly nudging them towards
        becoming the puppet-like pawn that can be used without any
        causal connection to the force that sets them in motion.

#### Writing Riddles

- writing riddles is also a great exercise for cognitive enhancement,
  especially in childhood. encouraging this would likely result in
  more intelligence in later development.
  - To inform machine learning to solve riddles is hard enough. For AI
    to generate good riddles, it is incredibly difficult. It has to
    construct a repository of linguistic & semantic data, then
    identify which combinations of semantic meanings of words create
    opposing interpretations and, particularly, confusion in the
    reader. It also must understand how people might frame assumptions
    as they progress through the text. Finally, all the combinations
    of statements & semantic meanings must cohere into an unexpected
    answer.
    - there may be another approach which can be combined with trained
      linguistic/semantic networks from writing samples, where the
      algorithm analyzes riddles and identifies patterns & clusters of
      type/metatype in the grammar trees and parsed information
      representations of existing riddles. this would add some
      [incredibly complicated] shortcuts for the AI to use, so that it
      could tune its understandings of language, interpretation, etc
      to train itself.
    - also, writing riddles is likely a great exercise for cognitive
      enhancement. the earlier things like this are encouraged in
      childhood development, the better. exercises in humanities serve
      to train the brains own neural networks. encouraging things like
      this would likely result in more intelligence in later
      development.


####


