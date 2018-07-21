---
title: "Metanomics & Probabilistic Programming: Intro"
categories: blog
tags: "genomics epigenetics"
headline: "What Do Cytochrome-P450 Enzymes Imply for Predictive Medicine"
author:
  name: "David Conner"
excerpt: ""
---

### TODO

- rename ergodic => dynamical => chaotic
  - or something similar
  - these are chaotic systems with no definite order and tendency to
    become increasingly unpredictable. however, some components of the
    system can impact the configurational/conformational entropy of
    the system as a whole in predictable ways.
  - programs could be written in these chaotic systems, although they
    are impossible to predict with certainty, some patterns of
    behavior can be assumed to emerge with a degree of confidence
    - in this way, they can ergodically produce a singular result or a
      range of final states
  - is this similar to [Chaos Computing](https://en.wikipedia.org/wiki/Chaos_computing)?
- split into separate files
- organize the first article
- find pictures. make content visual & relatable
  - for an esoteric topic lol
- find articles & papers for P450 (inducers, stats, etc)

- metanomic stochastic programming? (it's a dynamical system)
  - actually, stochastic programming is more about optimization and
    less about an evolving system whose dynamics vary based on state
    and stochastics
- [Probability Space](https://en.wikipedia.org/wiki/Probability_space)
- [Stochastic Process](https://en.wikipedia.org/wiki/Stochastic_process)
- [Stochastic Programming](https://en.wikipedia.org/wiki/Stochastic_programming)
note that
[article](https://www.quantamagazine.org/20160630-how-does-life-come-from-randomness/)
about self-organizing entropy forming life

- [First 3D image of DNA Packing](https://arstechnica.com/science/2017/03/heres-the-first-3d-glimpse-of-how-dna-is-packaged-up-in-a-single-cell/)

# Mechanisms and Supporting Evidence for Spatially-Distributed State

post-translational modifications, protein signaling and protein
targeting are mechanisms essential for diversity of behavior in
genetic programs.

- post-translational modifications can act as a rate-limiting factors
  or a means of conditionally modulating rate of a metanomic product
  by require the presence of a (something that acts as a catalyst)
- as genomics is based in a physical system, protein targeting allows
  for logical management of spatially distributed state by encouraging
  grouping/sorting of proteins
  - these signaling peptides allow ribosomal products to be directed
    to different places in the cell so that the production of genomic
    products becomes sorted by function. this allows for clean
    management of state in physical systems, which are usually
    chaotic.

### Post-Translational Modifications

- [Lysine Acetylation: Codified Crosstalk with Other Posttranslational Modifications](http://www.cell.com/molecular-cell/abstract/S1097-2765(08)00457-7?_returnURL=http%3A%2F%2Flinkinghub.elsevier.com%2Fretrieve%2Fpii%2FS1097276508004577%3Fshowall%3Dtrue)
  - mention the graphs of signaling pathways in this article, which
    are usually inferred from accumulated experimental results
  - one of the inspirations i have with this theory of metanomics (if
    it's novel) is that, instead of a top-down approach of inferring
    signaling pathways from experiments,
    - there might be a bottom-up approach of inferring them from
      molecular dynamics *or some significantly simplified simulation*
    - molecular dynamics is depressingly inefficient (i think) because
      otherwise protein folding should be fairly trivial
  - there is a spatial component to signaling pathways
    state transitions for

### Targeting Proteins for intracellular delivery & extracellular secretion

- [Protein Targeting](https://en.wikipedia.org/wiki/Protein_targeting)
  - [Nuclear Export Signal](https://en.wikipedia.org/wiki/Nuclear_export_signal)
  - [Nuclear Localization Sequence](https://en.wikipedia.org/wiki/Nuclear_localization_sequence)
    - [Nuclear and nucleolar localization of Saccharomyces cerevisiae ribosomal proteins S22 and S25](http://onlinelibrary.wiley.com/doi/10.1016/S0014-5793(99)00669-9/full)
- [Target Peptide](https://en.wikipedia.org/wiki/Target_peptide)
  - [Examples of targets](https://en.wikipedia.org/wiki/Target_peptide#Examples_of_target_peptides)

- [paper on targeting proteins for ER](http://www.molbiolcell.org/content/14/3/889.full.pdf+html)
- [SPdb](http://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-6-249)
- [paper for the SPdb](http://download.springer.com/static/pdf/320/art%253A10.1186%252F1471-2105-6-249.pdf?originUrl=http%3A%2F%2Fbmcbioinformatics.biomedcentral.com%2Farticle%2F10.1186%2F1471-2105-6-249&token2=exp=1475585709~acl=%2Fstatic%2Fpdf%2F320%2Fart%25253A10.1186%25252F1471-2105-6-249.pdf*~hmac=e175bdb4a6e4c7b928a58e79e66caf69776aa79a572b9d06d7d306de1e07af38)
- [Analysis and prediction of leucine-rich nuclear export signals](http://peds.oxfordjournals.org/content/17/6/527)

> Anaesthetically pleasing....

### Probabilistic Programming

[Posner Lecture: Probabilistic Machine Learning]

- bayesian nonparametrics
- probabilistic programming
- bayesian optimization
- probabilistic models for efficient data compression
- the automatic statistician
- rational allocation of computational resouces

#### Bayesian Nonparametrics

problem: we need flexible and realistic probabilistic modeles

soluton: define infinite-dimensional probabilistic models using tools
from stocahsic processes.

examples: guassian processos, Dirichlet processes, infinite hidden
markov models, chinese resaurant & indian buffet


there are parametric & nonparametric forms of these problems:

- guassian processos
- Dirichlet processes
- infinite hidden markov models

# Metanomics Intro

- explain higher level organization of *-nomics
  - reference notes from Pavel Pevzner's lecture
  - define genomics in relation to epigenomics
  - define transcriptomics
  - define proteomics
- lead into metanomics
- also explain it in relation to probabilistic programming

- how should the methodologies of science be expanded to pick up on
  the data that would indicate the need for this theory?
  - expanding a genetic map to a map that includes methylation data
  - collecting the dna-methylation data
    - attaching tissue network address data to dna-methylation
      - and especially its variation
  - faster algorithms for genomic processing
    - more efficient data storage/collection

### explain spatially distributed state at a high level

- hierarchically distributed state
  - this enables execution of tree-like sets of behavior across cells
- physical distribution of cells imparts some higher order
  hierarchical distribution of state (than just cellular)
  - e.g. groupings of cell types, blood brain barrier
- physical channels as mediation of state
  - veins/lymph system in an optimal state, will provide some optimal
    opportunity for exchange of state between tissues
  - ventricular system in the brain (need to look into details here)

ergodics can describe these stable states of biological systems
- these states are like the "resting places" of systems
  - a transition can be

(maybe move somewhere else, but it's important for ergodics
description) in such a system, the variables are really defined as the
presence or absence of a particular molecule in a variably sized space
- this space could be divided into subunits
  - and reoriented
- this is particularly complicated by the need to allow for
  statistical-mechanics-like arrangements of particles (that are not
  spherical cows)

### Value Proposition Summary

- i need a better analogy for explaining these ideas
  - i've always known genomics and DNA to be programs, but yet there
    was always a disconnect there
    - the main disconnect was for cell types, but this is fairly well
      explained by epigenetic mechinisms
    - still, how do you coordinate across neighbor cells and
      communicate?
    - how do you coordinate behavior of nucleus?
    - if genetics is a program, could there be event-driven behavior?
      - there certainly is. and probabilistic programming is like a
        kind of statistical reeinvisioning of event-driven
        programming, but with events described as the intersection of
        two "variables" in space
        - again, a variable is like the presence or absence of a
          variable, with restrictions on orientation
        - so the intersection of these is like the intersection of two
          of those moleculse, but with restrictions on how that
          "intersection" occured.
        - such an event causes a reaction.
    - the spatially distributed state forms a physical
      hierarchy of compartments. these add the notion of scope common
      to many programming languages ... sort of.
      - in programming languages, special steps and handling is needed
        to allow a variable to escape scope. if it's not done
        properly, it may not have the intended effect or could cause
        problems
      - so this spatial hierarchy of containers are really like
        execution closures. they are literally physical closures that
        act as containers for values (proteins, mRNA, etc)

- how do i relate this to someone who doesn't know anything about
  metanomics, probabilistic programming or ergodic theory

- make a value proposition to describe the value in theorizing about
  metanomics in this way
  - it's value is in evaluating/modeling technologies for
    predictive medicine
    - and assessing how to collect better information about what is
      activated
    - identifying epigenotypes in tissue that are precancerous
  - make this the intro article (about assessing state of Cytochrome
    P450 enzymes/proteins)
  - what diseases can be better modeled and how? why?
    - tracing the "epigenotypes" of cancer back through several
      pre-cancerous epigenomic states, which have an observable
      phenotype (mri imaging, etc.)
    - then you can observe/detect that precancerous phenotype and deal
      with it more quickly/safely/effectively, etc
    - by scanning for aberrations in tissue type

#### Transition into P450

- the section on P450 needs to be towards the end of the article
  - so that there's plenty of space to overview everything
- sometimes

### Changes in Cytochrome P450 from long term drug usage

- long term usage of drugs which inhibit and especially those that
  induce metabolism by Cytochrome P450 enzymes should generally
  increase production of them.
  - e.g. consumption of alcohol should increase production of the
    enzymes that metabolize it through feedback loops that trigger its
    production.
  - one specific OTC allergy medication (only one AFAIK - Loratadine)
    induces the production of a enzyme that metabolizes several
    antipsychotics (haldol in particular, i think .. ?)
    - so, overuse of this drug could lead to temporarily and perhaps
      permanently increased production of that Cytochrome 450 enzyme.
    - this means that as your blood circulates through your liver,
      there will be more of these enzymes and they will process the
      substrates they act on much faster.
    - link into the study that demostrates this drug's effectiveness
  - therefore, long term usage of these inhibitors and inducers will
    change the expression of Cytochrome P450 genetic programs
    - inhibitors by providing a greater need for the drug to be
      metabolized faster (and therefore - sometimes - there should be
      a genetic feedback mechanism that encourages more of these
      enzymes to be produced)
    - inducers by directly affecting the mechanisms which interact
      with the cellular nucleus, causing it to create more of these
      enzymes
      - possibly using miRNA or piRNA, which can cause a runaway
        effect (they induce the expression of mRNA by creating protein
        complexes that copy segments of that mRNA's complement)
    - however, i don't really know the specifics of how Cytochrome P450
      production works. and each P450 system and enzyme
      would behave differently
  - but this would imply that a person's personal habits and diet
    would dramatically alter gene expression
    - particularly their usage of specific OTC & Rx drugs
    - this also means that genetic medicene will not be perfect,
      especially for psychiatry, unless the levels of these P450
      enzymes can be measured.
    - or their metabolism characteristics can be observed, then their
      presence could be inferred. yet this technique is susceptible to
      variation from diet (similar to how a cholesterol test would be)
      ... i think
  - so, for some prescription medicines, genetics can offer customized
    treatment with highly predictable outcome types.  but for others,
    the individual may not adhere to their apparent outcome type,
    primarily because of long-term diet and drug history, as well as
    excercise and activity habits.
    - obviously there are much fewer variables to control in animal
      experiments, so we should be wary of highly promising studies on
      predictive medicene where animal subjects were employed.
  - people don't seem to get it: your genes do not control your fate
    nearly as completely as we are lead to believe.
    - your actions and lifestyle can affect how your body functions
      - identical twins raised apart could look very similar, but be
        different heights or have different eye color.
      - if one twin is prescribed specific antipsychotics, that twin
        could be significantly overweight
      - or in this case, prescription drugs could have completely
        different effects on them, based on long term drug, diet and
        personal activity habits.
  - the paradigm that genetics determines your health leads
    people to lose hope over their life.
    - it tricks us into disempowering ourselves because we assume that
      our fate has already been decided.
      - "i'm fat because of my genes"
        - well yes, people are predisposed to different types of
          metabolism patterns and we process food differently
        - but there's not a gene that makes someone fat.
        - yet clearly, some things are harder for people than others
          - knowing how these things are interrelated helps, but i
            think the studies here could be misinterpreted.
      - and far more important than which specific genes you have is
        how they are activated.
        - you can change how genes are expressed through diet, drugs
          and personal activity
        - but we still don't know a lot about how to intentionally
          change genetic expression
      - yet, the message is clear: the habits you form in life and the
        actions you take matter.  the fate of your health is not
        predetermined.

- [Cytochrome]()
- [Buproprion](https://en.wikipedia.org/wiki/Bupropion)

### Measure Distribution of Receptors in Tissue Networks

- {TODO: these ideas need to be processed a bit. this is only
  reasonable if it's detectable, though there may be some parts of
  this otherwise}
  - {look at #3 to understand why}
- (1) measure a distribution of receptors (on both micro & macro
  scales) of receptors in tissue networks of organs. basically,
  measure these from biopsies, while inferring the biopsy location
  within an organ based on structure/size of capillaries in tissue
  - could work for analyzing CYP enzyme distributions
  - this would be especially amazing for neuronal tissue nets
  - high-powered MRI, along with statistical inference on many
    datasets (ugh ... HIPAA?)
  - the point: analyze the variation for receptor distribution in
    different parts of tissue networks. this could be cross-analyzed
    with total flux or fluid diffusion through different parts of
    tissue networks.
    - ... (this needs more description)
    - it would probably
  - identify micro/macro patterns of oscillation characteristic to the
    spatial distribution of receptors for various genotypes

- (2) use these generated receptor distribution profiles specific to each
  patient, to infer generalized receptor distribution models.
  - per genotype combination
  - per environment data
  - {oversimplify much?}
- drugs w/ isotopes & titration can resolve {the systems in additional
  clarity?}
  - these general and specific models can be cyclicly refined, `et ad
    nauseum`

- (3) {This was the "missing" post it note, which i found in a
  screenshot on twitter}
  - some mental disorders could be caused by variations in G-Coupled
    Protein Receptor State
  - these and other large macromolecules should give off
    characteristic resonance patters in conj w/ NMR/MRI
    - {this is impossible. however, another methodology may allow
      insight into measuring g-coupled protein state w/ PET/fMRI in
      the brains of people with specific mental illness to identify
      neurological phenotypes or subtypes of those illnesses}
    - the point is to identify macroscopic, detectible indication of
      State/Quantity of these G-Coupled protein receptors.
      - so that the interaction of psychiatric medications with
        neuropharmocological subtypes of mental illness can be better
        understood

- (4) finally, these general & specific receptor-distribution models
  could be used in conjunction w/ patient-specific brain tissue &
  arterial network models to predict psychiatric drug response
  - accounting for environment-specific epigenetic variation
    - assuming that you train the models w/ biopsy data that encodes
      the spatial distribution of receptor-types, then:
      - you can use this to predict Rx drug response.
        - though it will be much more difficult for the brain than
          other organs (like networks of CYP metabolization in liver)

- accelerate acquisition of neural epigenetic data, where possible by
  sequencing necessarily extracted tissue from surgeries already
  scheduled/required

#### Goals for Neuropharmacological Progression

- eludication of natuarl/artifical induced variants of morphological
  distribution/progression should emerge
  - via poor psychiatric/neuropharmocological assessments
    - wrong medication for diagnosis, medication for wrong diagnosis
  - via medication interactions (known/unknown)
- connect neurological data to an ontologically-informed modeled
  assessing presence/absence/quality of disease traits
  - traits such as: anomolous EEG dispersion/spectra/response,
    phenomology of disease signs/symptoms/progression and the
    qualities thereof

#### Other Experimental Methodologies

- use PET (w/ radiotracers) to model neural receptor distribution to
  model typological variation in mental illness.

- use of DTI-Tract along with fMRI, TCD/TCCD & advanced EEG to
  correlate strucures inferred via tractography with:
  - anomolous EEG (spectra) or fMRI data
  - that is, how does the tractographical structure correlate to
    anomolous signals & impulse patterns
  - how can pattern recognition be trained to detect and
    quantify/dilineate types of anomolous

# Metanomics x Probabilistic Programming

- this may need to be the second part
  - reference details from "Awareness/Chaos" article

### Probabilistic Programming for Computers

- what is probabilistic programming
  - explain PP languages that are being explored
  - and why the research is being done (promising for machine learning
    & ai)
- explain what makes something a program
  - trees/loops
  - explain how it's hard for people to see how a set of probabilities
    - can lead to something with behaviors like a program
    - powersets of interactions, etc, etc
  - cells can even use metaprogramming
- list current models for biological behavior that this model
  - circumscribes ... what did i mean by 'circumscribes'?

- what's the difference between current models and this paradigm for
  genetic behavior?
  - this model not only explains how genetics works in the nucleus,
    which directs operations of the cell
    - but also explains cytoplasmic interactions and
      cytoplasmic-nuclear interactions
      - that is, spatially distributed state extends beyond the
        nucleus
    - it also can help explain inter-cellular interactions
      - caused by chemical messengers (hormones & proteins)
      - or caused by more global change in state (pH, hydration)
      - or caused by more local change in state (changes across
        specific organs)
    - it can also explain inter-chromosome behaviors
  - current models seem limited to describing interactions between
    related genes
    - they don't describe how different chromosomes interact
    - they are overly simplistic in describing how protein products of
      genes interact
    - describing how controlling spaces within the cell and nucleus
      - are totally out of scope for current models
  - the probabilistic programming paradigm for genetic behavior is
    more complete
    - this makes it more complicated, but also simpler at the same
      time
    - basically, for each gene, protein, nucleoulus, transcriptome,
      cell, group of cells, organ, body, etc
      - there are a sets of functions that can be executed, each with
        a probability
        - executing the function changes the local state, which in the
          case of genetics is spatially distributed
    - looking at the complete picture while resolving the most minute
      details and interactions
      - is probably impossible, as you have to consider powersets of
        interactions and behaviors
    - but it should be possible to describe some behaviors and
      tendancies that could not be explained before

mapping out tissue networks in the body
- various kinds of "addressing" systems for communication between cell
  networks.
- cover introduction to ideas in general

### Maximums for Information Processing, Networks, etc

- discuss the maximums encountered here and how they arise
  - arises when various layers of metanomic networks become too large
  - a limit is encountered with chromosomes
    - you can't have 1,000 or 10,000 chromosomes executing one program
    - in order to function, the system needs for specific behaviors to
      be executed dependably without any outside manipulation or state
      modification
    - but if there are 1,000 chromosomes in a nucleus, you can't
      guarantee adjacency of anything.
      - whereas, with 23 chromosomes, you can almost guarantee that
        all of the chromosomes will be relatively adjacent
  - there are other similar limits encountered
  - for example, if you have several chromosomes that are 1,000x the
    "normal" length, then it becomes very difficult

** need to resolve **

- the problem is describing where these limits come into play and
  where they actually matter
  - how to break down the distinctions between these limits
    - many of them aren't "limits" per se.
    - they are idealistic maximums, where exceeding the number
      produces a diminishing effect in the networks
  - but when pairs/tuples of these limits are compared, exceeding any
    two of them for a tuple may cause the entire system to break down
- giving way to a need for multi-karyotic cells

- abstract idea of a maximum of addressable behaviors that is
  'conveniently-accessible' enough in some way, forming a maximum in
  programmable genetic behavior
  - because the space can't manage the information complexity without
    causing problems in it's dependable executablility
  - what to call this concept? ... ergodic network maximum (?)
  - (see Theoretic CS matrioids.md)

- lead into brief discussion on how this limit is another form of a
  mathematical limit imposed on computers as well
  - that is a maximum per-node limit for transformations or
    extensibility
  - imposing various computational maximum for behavior
    - spatial limits (a computer any bigger would create a black hole)
    - per-node mathematic limits
    - network bottleneck/overhead limits
  - this implies the existance of several hard limits for computation

## Example programming problem:

### "Ergodic" State Machine - Particle Shader

Some of the math here can be demonstrated with a special kind of
particle shader that implements a bit of functional analysis to
calculate functions with the local neighborhood as input.
- then each particle can obtain various values of state.
- the neighborhood includes all points in the metric space < d from
  any r (x,y,z,1,etc)
  - this neighborhood is passed as a function that returns the sum of
    changes for each particle in the neighborhood
- these subsets of the space are concatenated (& added/averaged
  togeter)
  - one is calculated for each point (in the GPU)
  - voodoo magic blit stuff
- the set of points in the space is updated with the averaged changes
  in state after (concat/add)
  - this forms a particle based 3D conway's game of life that crosses
    molecular dynamics with state machines
- the goal is to identify some stable states
  - that is, states should emerge from ergodic behavior for
    state-to-state transitions.
    - I.E. Particle Goo G has 10,000 particles p, points that are close
      average their values
      - for all properties on each particle P in G
        - or some other functional modification.
    - there should be some starting conditions or some external
      pressures that can be applied on the system to force it to
      converge in some areas.
      - look for a cross with cymatics (just for grins)
      - great opportunity for embedded youtube video
    - these stable states should be cyclical or mapped to a graph
  - or stable metastates
    - these are like higher-order composition (HOC) of boolean
      membership functions (BMF) for the set of particles p in
      Particle Goo G that satisfy enough of some boolean function
      across the local neighborhood or boundary set
      - this is similar to phase transition math
        - which needs to recognize on various levels the state
          transitions between phases of matter at several scales
      - there's probably some intersection with statiscal mechanics
    - so basically these BMF's can cause large scale parts of a system
      to adhere to specific rules that only apply to that subset or a
      subset extended to some similarity limit Sim(x) <= |d|
      - which collates all similarly conjoint particles/groups that
        lie within that similarity distance
      - TLDR; for phase transitions, this means you can optimize by
        treating chunks of ice as single bodied objects (to some
        degree) and liquid as liquid and gas as gas
    - ^^^ these describe states
      - metastates can be composed of to form a new function that
        selects sets of particles that adhere to a functional
        conjunction or disjunction of some kind
- the system needs to be capable of being asserted as "behaving as an
  A-state like particle system to x degree"
  - and behaving as a B-state like particle system to some degree
  - similarly it should possible to measure some subselection of the
    system's progress towards an aggregate transition from C-state to
    D-state. basically need to know: is it going towards C? or back
    towards D? etc,etc.
- But, with a bit of luck it should be possible to identify stable
  states and metastates that ergodically emerge under certain
  conditions or during specific transitions.
  - you could color or animate the particles which achieve a specific
    state
- there should be a way to set up a graph-like object (with some
  continuities) that allows you to model the higher order metastates
- it should also be possible to colorize and indicate higher-dimension
  data in each particle p

this example project is a kind of metaphor for a "spatially
distributed state machine, that could be easily modeled on top of
molecular dynamics"
- there's really not much of a difference between this particle shader
  and a genomic program
- both can proceed through several series of stable states/metastates,
  - each of which triggers further behavior
  - this gives rise to somethin that parallels the transition between
    nodes on a markov graph
    - but distributed across 10K's of particles and triggering lasting
      permanent changes at various levels
- the "spatially distributed" state-machinary is stratified and
  entangled across various strata of "state-isolation units" and
  spaces


#### State Isolation Unit

- this definitely has to be the "name" for this thing
- a cell
- a closed branch of a tissue network,
- an organ or cellular organelle (endoplasmic reticulum, where protein
  subunits are combinated and sometimes intelligently paired) or
- beyond the nuclear membrane in the nucleus
- a transcriptome "execution bubble" in the nucleus
  - nowhere is the "ergodic state machine theory" of metagenomic
    programs more clearly shown than with the transcriptome bubble (i
    think transcriptome is the term)
  - basically a nucleus has its nucleosome and this is like the
    juggernaut of genomic machinery
    - (IMO) it functions like the kernel in the OS, receiving demand
      for moreso generic cellular machinery
  - therefore the dependencies for this cellular machinery is likely
    also similarly limited.
    - that is, between all cell types for some specifices and for many
      species which are closely colocated on the evolutionary tree:
    - the nucleosome should share some limited subset -- *the nuclear
      kernel* -- that provides the most basic functions
    - i would also go on to say that the nucleosome's rhythms and
      mechanisms are probably also important
    - and because ribosomes enable transcription, this *nuclear
      kernel* executed and transcribed in the nucleosome is mostly
      restricted to genes that are adjacent to that nuclear kernel
  - when DNA is transcribed these transcriptome bubbles appear and are
    like containers for spatially distributed state. in other words,
    the existance of a new transcriptome around specific genes being
    transcribed outside of the nucleosome in the nucleus means these
    genes and their activation factors are shielded from outside
    interference
    - this is like the memory region reserved for a process (but in
      terms of metagenomics and spatially distributed state)
    - if you look at the mRNA, miRNA, piRNA, etc products from DNA
      transcription as the by-product of the execution
    - these by-products are more likely to retained within the
      transcriptome and shielded from non-sequitous byproducts from
      elsewhere in the genome
    - furthermore, the transcriptome can attach activation factors or
      addressable chunklets of RNA to the surface to make it more
      likely to grab specific strands of DNA
      - if this is possible and fairly dynamic, it drastically changes
        the set of protein subunits and genes that can be quickly
        geared up through epigenetic machinery

## Math

### Ergodics

- structure => function && function => structure

- ergodics and other tools for modeling state transformations
  - can ergodics handle logically defined state machines?
  - can ergodics model hierarchically stratified state?
- ergodic systems as spatially distributed indications of the value of
  some function aggregated over a region of space, over a region of
  time
  - am i muxxing up the 'ergodics' here?
  - anyways, this implies the guaranteed emergence of spatially
    distributed shards of information, which self aggregate into
    higher order systems and eventually .. life..
- but the point is that these systems are the emergence of the
  metaphysical to be overlayed onto the physical
  - and that life (esp. intelligent life) is basically the
    metaphysical observing itself via ~self-instantiation through the
    physical
- reference scientific article about self-organizing chaos forming a
  possible basis for life(which is very similar to something i
  discussed with tat), but extend it to meaning the reflection of
  information into the physical

### DNA as a probabilistic program

  - differentiation of genomic programs and cell-types should be
    relatively flat
  - that is, there's a tree that represents the types of cells that
    cells can become
  - but, because of occam's razor, this tree should be flat because
    too much hierarchy induces too much complexity in the system
  - genetic programs modelable by markov graph?



- http://www.scientificamerican.com/article/human-genome-s-spirals-loops-and-globules-come-into-4-d-view-video/

An offhand, uninformed, speculative response to #1 - DNA that encodes
mRNA should not be located directly adjacent to chromatin linkage
sites. Junk DNA may also contain metadata that directs the folding of
chromatin.

Junk DNA *may* also be expressed when an activation factor is not
connected to properly transcribe a gene and thus, transcription begins
at the wrong site. *If* this is the case, expression of some Junk DNA
may form the basis of an if-then-else feedback loop that indicates to
genetic programs that a particular gene is *not* being expressed. For
more info, see this article:
http://www.the-scientist.com/?articles.view/articleNo/43029/title/Silencing-Surprise/


other features of computer programs that must have a mirrored
mechanism in genetic programs
- clocking mechanism (circadian rhythm and others)

distinctions between genetic programs and computer programs
- all programs are tree like structures
- however, because of occam's razor,
  - genetic program trees are likely very flat
  - and the dependency tree of differentiated cell types is likely
    very flat as well

### Implications of Mitotic Heritability

- genes that are turned on in one cell type are also turned on in
  dependent cell types
  - unless they are explicitly deactivated by the dependent cell type
  - therefore, genes expressed in stem cells are all active in
    dependent celltypes
    - unless explicity turned off
    - TET proteins remove DNA methylation, at specific points in
      development
      - TET proteins are very rarely expressed
        - supporting my hypothesis, at least for the methylation
          mechanism
        - however, methylation usually silences genes
      - primarily expressed in primordial germ cells and embrionic
        stem cells
- this creates spatially distributed hierarchies, dependent on the
  state of the parents and their ancestor cell's environment

because loosely packed chromatin is more available to molecules around
it
- it should be easier to silence genes than it is to activate them
- that is, it's easier for epigenetic machinery to access histones of
  active genes
  - than inactive genes
- what does this imply about nature of genetic behavior?
  - it's possible(common?) to activate gene, then expect it to be
    quickly turned off in daughter cell type
  - need to reevaluate the mechanism here, before jumping to
    conclusions

because histone H1 winds up nucleosomes in an ordered fashion,
- since chromatin is wound up in a spiral formation,
  - some histone types should always be center-facing and some should
    be outward facing.
- therefore, some histone types should be more readily accessible to
  epigenetic machinery than others.
  - that is, when genes are activated, these histones will be be the
    first to be altered
  - which opens up the nucleosomes' more hidden histone types.

shape and location of chromosomes definitely affect their function
- chromatin near the periphery is usually heterochromatin
- chromatin near the center is usually euchromatin

### Interrelationships in Evolutionary Trees

- (not novel, of course)
- variance, propagation and retention of epi/genetic features
  - large rearrangement events in chromosomes reverse ordering of
    genes, disrupting genetic expression like snipping and flipping
    sections of cassette tape
  - examine multi-gene chromosome rearragements in context with the
    functional impacts on:
    - methylation from long-term genetic expression, which
      varies among tissue types
    - impacts on histone mark distribution (mostly impossible to
      sequence, but can infer histone presence from spatial analysis
      on themes of chromatin arrangements/movement -- which would be
      prohibitively expensive)
    - impacts on expansion of chromatin by tissue type
      - the chromatin expands and contracts to activate genes.
      - chromosomes with regions that intersect and interact
        - extension of the principles of chapman komolgorov to explain
          the extreme unlikelihood of specific regions in 2+
          chromosomes docking, in a way, to promote/regulate
          tissue-specific programs.
        - (chapman-komolgorov, basically: integration of products of
          event-chains with conditional probability)
        - the likelyhood of gene-specific intersections of chromosomes
          seems infinitesimally small
        - so, there must be an alternate explanantion for why these
          programs run similarly in almost all cells of a tissue type.
      - what are the "themes" of large-scale chromatin rearrangements?
        e.g. rearrangements that accompany cell division
        - these *have* been well-studied in recent years, in the [4D
          Nucleome
          Project](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5617335/),
          for example
  - in summary, examine all of the above epigenetic phenomena, making
    inferences by pairing the epigenetic data to the large-scale
    *chromosome* which begin to delineate species
    - their massive impacts on the biophysical statistical systems of
      genetic programs significantly disrupt interconnected [gene
      regulatory
      networks](https://en.wikipedia.org/wiki/Gene_regulatory_network)
      (GRN's)
    - critically, individual chromosome rearragement events mostly
      isolate GRN expression to those networks which neighbor each
      other. this alters GRN's and their epigentic feedback
      mechanisms, while preserving the holistic behavior of the
      system.
    - to be passed to offspring, this must occur in the gametes
      (reproductive tissues)
  - the combination of these experimental and bioinformatic techniques
    produces better results when studying closely related sub/species,
    whose populations over the few centuries have readily accessible
    specimens, with well-preserved genetic samples
    - i'm assuming its impossible to sequence epigenetic markers in
      aged samples
    - this is all well-studied, but *combining* the inferences from
      the 4D Nucelome Project with the analysis of GRN's in the
      context of frequency/preservation of chromosomal rearrangement
      events would produce amazing results, if tractible



# Blog Post:

## In Nucleus Transcription Factories

- RNA Polymerase 2 is static and DNA is pulled through
  - this is sort of like a program executing in a linear fashion
- transcription factories are often packed with transcription factors
  - different transcription factories have variant levels of
    transcription factors
- coregulated genes share transcription factories
  - this is more efficient bc instead of requiring high levels of
    transcription factors everywhere
  - there is just needed
- transcription factors are like CPU cores? (or a computing process)
  - in that they control the execution of a program (DNA strand)
  - and contain their own environment (transcription factors)
  - maybe better computing analogy

what is the function of the transcription factory membrane?
- do nuclus transcription factories block entry of certain proteins?
  - would it react differently to lncRNA's than to proteins
- does the membrane 'lock in' transcription factors and enhancers on
  it's surface
  - doing so would enable the fast expression and re-expression of
    specific sections of the genome
  - in otherwords, it would enable a loop from reexecuting the same
    genes
    - and the buildup of a byproduct of the expression of these genes
      could dissipate the transcription factory
  	- providing the 'until' condition for a repeat-until loop

nucleolus seems like the process of the most basic DNA program
- the program that ensures ribosomes are created and mRNA can be
  transcribed
  - contains RNA Pol1, which transcribes genes for ribosomes
  - surrounded by RNA Pol3, which transcribes genes for tRNA, which
    translates codons to amino's
- the reason the nucleolus contains RNA P1 and is surrounded by RNA P3
  - is because the nucleolus is like the operating system process of
    DNA
  - and so all of this needs to be in one place
- the other transcription factories are like spawned processes of the
  operating system


x-inactivation requires threshold level of Rnf12
- with only one active X(in XX or XY), there is not enough Rnf12 to
  trigger the code for inactivation
- with two active X expressing Rnf12, there is sufficient Rnf12 so
  that P(inactivation) is close to one
- once the x-inactivation program runs, there is no longer enough
  Rnf12 around, so P(inactivation) is close to zero
- however in Rnf12-knockout, x-inactivation can still occur, but
  usually occurs much later

x-inactivation doesn't occur when x-chromosomes can't spatially pair
- i really don't think there is a 'counting' mechanism.
- Rnf12 is more like a binary mechanism -- X.count == 2 or X.count ==
  1
- if the two chromosomes are adjacent, how does the X chosen to
  activate protect itself against Xist?
  - where is Xist gene located in relation to the X chromosome pairing
    site
  - if the Xist genes are typically located opposite from the pairing
    site
    - this would protect the X chromosome that is chosen to be active
      from accidental inactivation

symmetry in histone arrangement may provide various kinds of "memory"
for epigenetic processes
- first level of symmetry: histones adjacent to H1 face inward towards
  chromatin
  - in heterochromatin, these histone tails would be mostly
    inaccessible
  - in more active euchromatin, these histone tails may have some
    other function
- .....

categorize relationships between genes and the factors affecting their
relationships
- e.g. are two functionally related genes close enough that their
  proximity affects their relationship
- e.g. are two genes activated by similar transcription factors?

early after fertilization, the fertilized egg has two pro-nuclei
- this allows for imprinting of parent-of-origin gene expression
  - is this the only time parent-of-origin gene expression can occur?
    probably not
- this implies genetic programs can run with one copy of each
  chromosome in each nucleus

epigenetic reprogramming immediately after fertilization
- both maternal and paternal genomes reach methylation low around the
  blastocyst stage
  - paternal genome is demethylized fast by hydroxylating the methyl
    groups, which destabilyzes the bonds
    - involves TET proteins
  - maternal genome is demethylized more slowly because DNMT1 is not
    expressed
  - however, what accounts for this difference in behavior?
  - is DNMT1 only suppressed in the maternal genome or both?
  - what triggers hydroxylation in paternal genome?
  - how long do the pro-nuclei remain separate?  only in the
    fertilized egg?

epigenetic reprogramming for primordial germ cell development
- in this case, paternal and maternal germ cells are cleared of
  methylation at about the same rate
  - but spermatogenesis remethylation proceeds slightly faster
  - oogenesis remethylation proceeds more slowly

however, repeats(IAP's) are generally silenced throughout epigenetic
reprogramming during development
- this is because removing the methylation from these would lead them
  to be expressed
  - and expression of IAP's at the wrong time can cause detrimental
    problems
- sometimes, these repeat regions are briefly demethylized (sometimes
  around the blastocyst stage)
  - however, this is usually accompanied by expression of
    complimentary piRNA's which quickly re-establish methylation
  - ** good example of predictable programmatic behavior here.
    - expression of IAP repeats is predictably followed by the
      targeted expression of complementary piRNAs
    - how is this orchestrated?

genomically imprinted genes (aka parental imprinting, gametic
imprinting)
- these genes have monoallelic gene expression (i.e. only one of two
  alleles is expressed)
  - but the expression of alleles occurs in a parent-of-origin
    restricted manner
  - only your maternal copy or only your paternal copy is expressed
- these imprinted genes undergo reprogramming during primordial germ
  cell development
  - but resist the initial reprogramming
- these gene sets are known to be critical for viability of embryo's

expression of imprinted genes is controlled by imprint control regions
(ICR's)
- aka Differentially Methylated Domains/Regions (DMD/DMR)
- imprint is universally associated with DNA methylation at the ICR
  - e.g. paterally imprinted genes are marked with DNA methylation
    - however, this doesn't necessarily imply genes imprinted with
      methylation are always silenced
- ICR's express imprinted genes differently.  each locus is different
  - lncRNA's, enhancer/promotor blocking
- ICR methylation is established during primordial germ-cell
  development!
- protection from clearing of DNA methylation involves oocyte derived
  maternal effect proteins
  - these proteins are expressed in the egg and protect ICR's from the
    widespread demethylation
- in primordial germ cells, these ICR's are erased and then
  re-established

imprinted genes exist in clusters.  there are ~150 imprinted genes in
humans and ~130 in mice.
- each cluster has it's own ICR.  and it's the ICR that controls the
  expression of the surrounding genes.
- imprinted gene expression is not always found in all tissues.
  - imprinted gene expression is common in placenta and brain.

** ICR resembles like an if-then-else.
- when ICR is marked, some genes will be expressed and others
  repressed.
  - refer to document for mouse geneome in video 4-3
- e.g. if the ICR is imprinted on the maternal chromosome,
  - this will result in the maternal expression of certain genes
  - since the ICR is not marked on the corresponding paternal
    chromosome
    - this results in the expression of another set of paternal genes
      within the same cluster

kcnq1 ICR (Chromosome 11) controls gene expression with the lncRNA
kcnq1ot1
- maternal methylation of kcnq1 ICR silences kcnq1ot1
  - the lack of lncRNA expression allows the other kcnq1 genes to be
    expressed
  - on the paternal side, the expression of the lncRNA silences
    expression of other kcnq1 genes
- kcnq1ot1 silences in cis, recruiting G9a and PRC2 to perform H3K9me
  and H3K27me
  - kcnq1ot1 is transcribed in antisense to kcnq1
- however not all genes adjacent to kcnq1 are silenced
- cdkn1c is maternally expressed and is a growth inhibitor (tumor
  suppressor)

### blog post: in addition to being crucial for DNA replication,
- the duality of DNA is also crucial for the function of miRNA's,
  piRNA's and lncRNA's
- evolutionarily, the duality of DNA promotes the similarity of long
  sequences of adjancent DNA
  - this promotes the function of miRNA's, piRNA's and lncRNA's
  - e.g. if large copy-and-paste mutation events occur, then similar
    regions may be created a short distance from each other
  - then it's more likely that the RNA complement of an mRNA can be
    expressed under certain circumstances
    - and this RNA complement can act as an miRNA, piRNA or lncRNA

### DNA transcription game

- similar to pacman where you travel on DNA strands, but involves a
  shifting level (3D?)
  - more focus on node-node connections instead of length of maze
    segments?
- running across certain regions will trigger certain functions
  - release enhancer/inhibitor proteins that follow you and neutralize
    enemies
  - or trigger strands of the level to connect temporarily in new ways
  - combinations of enhancer/inhibitor proteins can be used for AoE
    attacks

H19/igf2 cluster (Chromosome 11)
- H19 is a maternally expressed lncRNA, but it does not affect
  methylation
  - instead it's a miRNA resevoir
- m9n at the ICR instead blocks the CTCF from binding to the ICR
  - without CTCF, m9n spreads to the H19 promotor, deactivating it
  - CTCF is an insulator protein and insulates the igf2 gene from
    downstream enhancers
- when H19 is active, the downstream enhancers will upregulate H19
  - CTCF will block enhancers from binding to and acting on igf2
- when CTCF is insulating, H19 is deactivated by methylation
  - CTCF is not expressed and so enhancers bind to igf2
- it's thought that this action is modulated by chromatin looping
  - CTCF modulates the chromatin loop and so without it, enhancers are
    adjacent to H19
  - with CTCF, enhancers are adjacent to igf2

somehow, the act of transcription through a locus can deactivate a
gene
- still not know exactly how the silencing is set up in these cases.
- not known if Ube3a-antisense or the act of transcribing Ube3a in
  reverse causes inactivation
- possible that the act of transcribing requires the loss of histone
  marks??

"Curiously, many more maternally-methylated than paternally-methylated
DMRs/ICRs have been identified."
- this may be because it's easier to conserve methylation for
  maternally imprinted genes
- because of the maternal effect proteins, which are produced in the
  oocyte

intracisternal A-particles as mechanism for genetic metaprogramming
- these IAP's carry LTR's (long terminal repeats) on either end
- when inserted between exons for genes,
  - this presents the genome with an opportunity to alternativly
    express these genes
  - over time, this means cells can recombinate alternate expression
    of genes
    - e.g. Axin-fused mice with the IAP insert can express the protein
      Axon as both:
      - [...+exon6+exon7+...]
      - or [exon7+...] - which is the expression type that causes
        kinked tails in mice
    - this behavior can be modulated by epigenetic state
      - but otherwise the gene would be only expressed as
        [...+exon6,7+...]
      - because there's no mechanism to signal the alternate
        expression
- IAP's cause lots of problems but also present our cells with a
  myriad of expressions for the same gene
  - it's like metaprogramming with the statements of a lisp function
  - you can create a macro that deconstructs a lisp function into a
    list of functions
    - you can now combinate through this list of functions to
      rearrange elements or insert/modify/remove elements
  - by attempting to run the different variations of function
    recombinations
    - along with tests to ensure the behavior of these variations
      satisfies some notion of equality 4 the expected behavior
      - category theory FTW
    - then you can create new behaviors for your program by
      identifying the successful recombinant variations
  - but in the case of the IAP's, survival of the fittest is your
    'test' for successful variations of gene expression
    - and each generation can only recombine a gene's exons a single
      time
      - it's not very likely for IAP's to be insert itself more than
        once between three or more exons of the same gene
      - fortunately, for evolution, this simplifies things, as the new
        gene can only be expressed a limited number of ways
- IAP's greatly accelerate evolution
  - they can split genes into multiple exons, which can be recombined
    to become more functionally useful
    - that is, if a gene contains a region that is a receptor for an
      activation site
- can the recombinant function method described above be used for
  artificial intelligence
- can the IAP mechanism of insertion of variations of genetic-metadata
  be used with bytecode
  - in otherwords, take a region of bytecode for a function
    - and randomly insert various segments of program-altering
      bytecode
    - e.g. ([begin & instructions] + {new-end + new-instructions +
      new-begin} + [instructions + end])
      - creates a new callable function
      - dealing with this machine code would be a serious mind fuck
  - similar techniques are probably already widely used for compiler
    optimization
    - but can these techniques be used for self-modifying programs
    - that intentionally destructure/restructure their machine code to
      create new behaviors
    - while satisfying dependencies and objectives
- and apparently the recombinant behavior i'm describing is very
  similar to concatenative programming languages
  - such as Joy and Factor
  - concatenative.org/wiki/view/Concatenative%20language/Meta-programming


role of protamine in transgenerational epigenetic inheritence
- sperm doesn't have chromatin. instead it has protamine, which
  retains some histone marks.
- how could epigenetic information be retained through reproduction,
  conception and through the blastocyst stage
  - the blastocyst stage resets methylation


paramutation in mice: kit protein that causes mice to fully develop
black coat of fur
- when injecting wild-type (black) mouse eggs with kit protein mRNA
  from a spotted mouse
  - this sometimes causes the mouse that's born to become spotted
  - but not usually if you inject mRNA from
    - very rarely, injecting this mRNA from a black mouse will cause a
      spotted coat
    - could this be due to the similarity for the Kit protein mRNA
      between black & spotted mice?
    - when mRNA is exact match, it triggers process
    - when mRNA is inexact match, it rarely triggers the process
    - this might mean DNA's complementary nature is at play


miRNA's for piRNA's?
- they would cancel out piRNA's to end the execution of piRNA's

miRNA treatments for diseases involving imprint control regions
- the miRNA would could cancel out the misexpressed allele
- would it be specific enough
  - if not, could it be used to just generally tune down the
    expression of those genes

lncRNA's as genetic state-machines
- it'd be interesting to identify lncRNA's which can transition their
  shape from one form to another
  - each triggering some kind of functionality
    - lncRNA1 transitions (1) A -> B (2) B -> C (3) C -> B (4) C -> D
- this would make them like a genetic state machine
  - they could have certain specific functionalities which are only
    enabled while in certain forms
  - this would be disadvantageous if they became "stuck" in some forms
    - that is, if they are needed in each cell of a cell type
      - if they are used only occasionally to trigger some permananent
        state change, this would be ok
      - otherwise, they would trigger the production of too much waste
        in a nucleus
