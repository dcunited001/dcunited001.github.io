---
title: "Divergents and Directional Antennae - Measurement and Inference"
categories: blog
tags: "math science physics neuro medicine machine-learning health bioinformatics"
headline: "How many experimental measurements?"
author:
  name: "David Conner"
excerpt: "
This categorical coherence looks for higher level patterns.  It
could identify the presence of diseases previously unknown, not
because it's matching against a list of diseases and their
progressions, but because it's identified unknown patterns of
neurodegeneration in a patient. In addition to unknown disease
progression, this could also identify the combination of drug-induced
neurological damage or damage induced by the combination of diseases."
---

#### [&#x2605; Part One: Divergents and Directional Antennae](/posts/2016-06-17-divergents-and-directional-antennae-2-measurement-and-inference)

### In Which David Conner Cures Cancer

This article continues from the last one, but is concerned moreso with
analytically modeling a system from observed measurements. Then I
continue on to establish the concept of neurological &
neuropharmocological "fingerprints" by which diseases can be diagnosed
earlier via MRI. And by looking for patterns and deviation from
patterns, we should be able to treat cancer much, much earlier. *(This
section header is facetious; many of these techniques are already
known, but the ramifications to available cancer diagnosis
methodologies are serious)

### How Many Experimental Measurements?

Continuing from part one, how many experimental measurements does one
need to make in order to infer the distribution of EMR energy from an
antenna?  Is it less or more?  For a quadratic equation, you need 3
measurements. For a cubic equation, you need four.  And generally, for
any n-polynomial in two dimensions, you need n+1 measurements.

But for determining this kind of distribution, how many measurements
do you need to make to be more confident in the rest of the values?
When determining the average value for EMR in any `SVE` over a short
time-scale? And when you take into account how the values for each
`SVE` and `AVE` fluctuate over time? Note: `SVE` is spatial volume
element and `AVE` is antennae volume element from the model in part
one)

Is there the same kind of relationship as with n-polynomial equations
in two dimensions? Where more information allows you to confidently
make more inferences?  Or is there some maximum confidence with which
you can infer the distribution because of the nature of the mathematic
model? Can you fluctuate the power of the antenna when you make
measurements and use the derivative of EMR value with respect to the
derivative of the power fluctuation to make better inferences?  I'm
pretty sure you can.

### Noise Confers Intuition

On the surface, it would appear that you have to make more
measurements the more complicated the relationship is, but I contest
that the more complicated the relationship, the more specific it's
influence -- and therefore, the *easier* it is *sometimes* to make
more confident measurements.

And especially, if you can inject some known pattern of noise into the
system, you can generally make inferences that allow you to more
confidently understand the nature of the system, even though "it's
just random noise." This is especially true if the derivative is
useful because you can look for the signal of the derivative of the
noise transformed in the output.

### When Methodology Affects Data

When the methodology affects the data you collect, this makes the
inference of something like the distribution of EMR so much more
difficult. This is because you can never truly measure the thing you
want because the instrument or whatever introduces noise that changes
the values.  So you're measuring a system that's completely different
from the one you want to understand.  It basically turns your systems
into something like differential equations.

However, the analogy to linear polynomial equations in two dimensions
above applies here: you're just comparing systems of equations, not
values for points.  So, to understand the "zero system" which is like
the system of equations which you haven't actually affected with your
methodology for measurement, you just have to observe enough kinds of
"non-zero systems." Then you should be able to cancel things out and
infer the nature of the "zero system" you're looking for.

### Statistical Resolution

When you add the "dimension" of statistics to your mathematic models,
you are empowering yourself to understanding the likelihood of a
system to assuming various states.  This allows you to solve the
problems from a completely different perspective.  You almost don't
need to know anything about how the system works to begin reducing it
further.  You're basically just eliminating space until you find an
analytic system that at least simulates the numeric system you're
looking for.

This is similar to how the LHC engineers looked for the Higgs Boson.
They kept making measurements with experiments at high enough energies
until they reached sixth sigma.  They almost certainly eliminated the
possibility of a particle with energies of the Higgs *not existing*.

### Artificial Intelligence

But you can pretty much apply this statistical dimension to any system
and whittle away at the space of things that are not true, leaving you
with a better understanding of what must be true.  This scares the
shit out of me, in the context of AI.  It basically means that the
more information and data that AI has to process, the more completely
it can understand a system and the more efficiently it can do so.

This can also delude people, who, when given a deluge of information
about a system, can be led to making the wrong decisions about it by
hyperfocusing on one subsystem within it.  E.G. when people have
security cameras, they feel safer because they think they see
everything going on, but often their eyes lie to them.  But this
doesn't really work with AI because machine learning algorithms can
process information, the significance of which it doesn't need
conscious awareness.  Yes, bias is a huge problem in machine learning,
but given enough processing power and enough of the right kind of
data, it will always produce frighteningly accurate inferences about
systems.

## Noise Injection X Statistical Imaging

This noise injection, as I have noted on twitter, is very useful in
understanding the results of MRI, especially diffusion-tensor imaging.
We should be able to conbine data from various methodologies.

> The following inferences do not cite sources. Do not infer what I
> write here as fact. Do your own research. Keep reading if you'd like
> to know how to cure cancer. And by cure, I mean identification
> through such early and non-invasive methodologies that it rarely
> reaches the later stages like metastasis, which are notoriously hard
> to treat.

### Spatial Coherence

First, to link images spatially; to get spatial coherence between
image sets.  There are several types of MRI -- T1 and T2 is one
distinction.  Whether or not a dye was used is another dimension.
There are sagital, axial, and coronal image sets.  It's all lined up
with the same physical space as a domain generating the MRI data.
Though the individual spaces of each MRI methodology may be different,
they can all be correlated to the same 3D cartesion physical space,
relative to the person being imaged. This means that specific
structures in the brain, varying in how the data specifically depicts
them, can be correllated across images.

This technique can link multiple types of MRI images, so they can be
corrected into the same spatial coordiante system and their values can
be combined.  Their values would be spatially shifted though, so
standard algorithms like binomial image interpolation would not work
without some customization.  However, the higher resolution the MRI,
the less effect that spatial dissonance would have on image analysis,
since data from the images would be more spatially "in phase."

### Temporal Coherence

Temporal coherence varies from short term to long term, but it
basically means the identification of patterns in how systems evolve
over time. Short term: being able to track blood flow through
someone's brain or change in oxygenation of specific structures in the
body, with respect to specific body postures -- ahem: yoga.  Long
term: understanding patterns of development in brain structures or
differentiated brain development of people who lack sensory input.  By
the way, if there really is a sixth sense, and someone seems to have
it very strongly, then analyzing neural structures for anomolous
development progression types may allow us to identify a physical
structure that enables E.S.P.  Ahahahh, that's probably not real
though.

### Categorical Coherence

One final step is to get categorical coherence, which requires
understanding more about the input in order to make inferences across
data sets.  For MRI, this means understanding the patient's age,
recent/chronic diet/nutrition habits, medical status, etc.  So that
inferences can be made across data sets.  I.E. without spatial or
temporal coherence, the hippocampus could be recognized in an axial
image by an algorithm trained to identify hippocampus shapes at
various ages, young or old.

This "categorical coherence" looks for higher level patterns.  It
could identify the presence of diseases previously unknown, not
because it's matching against a list of diseases and their
progressions, but because it's identified unknown patterns of
neurodegeneration in a patient.  In addition to unknown disease
progression, this could also identify the combination of drug-induced
neurological damage or damage induced by the combination of diseases.
It could even identify WHAT DRUG CAUSED THE NEUROLOGICAL DAMAGE by
understanding the dispersion and extent of damage in the brain.

## Neural Fingerprint for Pharmaceuticals

### Drug Absorption in the Human Brain.

The brain is very particular in that it has the blood brain barrier,
which restricts entry of charged particles.  The blood brain barrier
is a linining of brain cells that receives and filters nutrients from
arteries and capallaries.  The only way a charged particle can pass
through that is if it is briefly neutralized, which is a
low-probability event. The point is that this has a big effect on the
dispersion of specific chemicals throughout the brain, which form the
basis of a "neural fingerprint" for neurological damage or for normal
activity and absorption.

### Neural Fingerprint for Receptors

Another factor that influences dispersion of chemicals throughout the
brain is expression and distribution of the receptors a drug interacts
with.  Because our brains evolved to interact/reuse chemical
messangers that share similar qualities, structures and behaviors, our
genes developed and reused long sequences of amino acids and began to
copy/paste those sequences elsewhere within the genome.  There are
many introns within genes which are reused or similar versions are
pasted elsewhere.

This allows chemical behavior to be encoded in one place, but
reused. It exponentiates the variety available to our genetic
programs. It's analogous to an input/output adapter, like a 1/4" to
1/8" headphone adapter. It's also analogous to interfaces and
inheritance in object oriented programming. The point is: our bodies
evolved similar mechanisms to work with similar chemicals. And
particularly, to work with different spatial aspects of a specific
chemical messenger's chemistry. This is why some SSRI's have such a
wide array of recepter activity. Different parts of the drug fit
different locks. And this is true with engodenous chemicals too.

### Blood Flow and Neuropharmacology

The point is, when someone takes a drug, it flows in through the
arteries and hits the places that receive the most blood first.  It
then reaches the capillaries. But if it's a charged particle, it takes
forever for it to penetrate the blood brain barrier, if it's at all
possible. This is because the molecule needs to undergo several
chemical changes, which are low-probability events. And it can't even
get into a neuron (or affect the surface ion channels & receptors of a
neuron) until it does.  This is why strong acids and bases are
incredibly dangerous -- *JESUS CHRIST CUTTING COCAINE WITH BAKING SODA
IS EVIL*. Strong acids and bases could damage the blood brain barrier
and cause hellacious damage.  I don't know enough of the structure of
the endothelial cells in the blood brain barrier to know if it's a
significant problem, but it seems like that could be damaged by
strong, localized deviations in pH.

> By the way, cigarette manufacturers include ammonia by the way
> because it changes nicotine into its "crack" form.  The freebase
> form of nicotine bypasses the blood brain barrier faster and is felt
> almost immediately.

The receptor profile determines where a drug will stick around.  The
receptor profile is a list of receptors, along with information on
whether or not a drug will activate it, inhibit the action or block
other chemicals from interacting with it.  It also includes the
timescales for drug interaction with receptors.  Some drugs bind
tightly to receptors for much longer than others, blocking their
action.  The amount of time a drug interacts with a receptor, along
with the receptor's prevelance in areas of the human brain determines
how long a chemical will remain in an area of the brain once it's
penetrated that region via blood flow.  If those receptors have
already be activated by another drug that binds more tightly or for
longer, then the molecules will continue randomly floating around
until they find something to interact with.  The pattern of space in
the human brain that a drug would normally bind to forms a kind of
neural fingerprint.

This is incredibly complicated and hard to measure.  And leads into
another subject on predictive medicene, which I will write on soon.
The point here is that the spatial information trumps genetic
information.  The distribution of receptors matters a lot more than the
phenotype of the patient's genetics. AND IT IS MUCH HARDER TO MEASURE!

### Competing Chemicals Change the Neural Fingerprint

One more factor is the presence and absence of competing chemicals and
their profile for neuological activity. These competitors can preclude
other chemicals from interacting with receptors.  If a chemical has a
stronger binding action with a specific receptor, it can knock other
drugs off and interupt their activating or inhibiting or blocking
action.  This is regardless of how long they stay bound to the
receptor, even though strongly binding drugs tend to stay bound for
longer.  This is not always the case.

The action and interaction of competiting chemicals causes their
neural fingerprints to shift.  This isn't very predictable, as it is
strongly dependent on the distribution of receptors in the human
brain, as well as plasma concentrations of endogenous and foreign
chemicals. But that distrbution of cell types typically determines
distribution of types of receptors, especially in the brain.  So if
it's possible to use machine learning to understand the location of
neuronal types in someone's brain, given simply an MRI, as well has
higher order structures like the
[Substantia Nigra](https://en.wikipedia.org/wiki/Substantia_nigra),
then this could lead to novel diagnostic criteria.  These
methodologies could predict cancer and disease much earlier and much
more accurately than many of the current methods.  And not just in the
brain!

### Identifing Neuronal Structure Types

So, if you can pinpoint the Substantia Nigra and you know that it
often contains
[Nicontinic Acetylcholine Receptor (nAChR)](https://en.wikipedia.org/wiki/Nicotinic_acetylcholine_receptor),
then you can assume that the presence of these receptors and the
specific shape of this region of someone's brain may affect the
distribution of nicotine.  Also, if you detect that someone's
substantia nigra or some other structure is significantly distorted,
this may be caused by strong local pressure in their brain, which
could be an indication of a brain tumor.  Just by using algorithms to
classify types of structures in the human brain and identify them and
their specific shape.

## Curing Cancer

### With Early Prediction and Detection

This cell type and shape distribution may allow us to identify other
kinds of cancer earlier.  This is much more effective than predictive
medicine from genetics, which seems to be what everyone else is
working on, because, instead of needing to understand how someone's
genes have been expressed in their lifetime, it rides on top of that.
For example, if you synthesize a drug or pharmaceutical with isotopes
that react in an MRI and administer that to someone being imaged, then
you can watch out the distribution of that drug changes over time and
make assumptions about the size/scale/distortion in structures
throughout the body.  Not just the brain.  This means there are lots
of diagnostic methods for cancer prediction that we are not using.

Back to the thing I actually posted on twitter -- 3000 words
later... You can do this with water!  It's actually been done for a
few years now.  Hydrogen and tritum resonate with
[Nuclear Magnetic Resonance (NMR)](https://en.wikipedia.org/wiki/Nuclear_magnetic_resonance)
But deuterium doesn't and therefore disperses differently throughout
the brain.  Especially as time goes on.  That means you can take
MRI images with natural levels of deuterium, using those as control.
Then titrate deuterium into someone's brain and watch out it
interacts.  The stronger the magnetization of the MRI, the better.
Most MRI's are 1.5 Tesla or 3 Tesla.  6 Tesla would better.

As the deuterium penetrates into neuronal structures in the brain, you
get a better idea of the shape of the brain because you've basically
injected noise into the system. The deuterium doesn't resonate and
therefore the water vibrates less in areas with more deuterium. You
can observe the path chemicals would take as they penetrate someone's
brain because you may be able to measure the local deuterium quantity
as the water begins to vibrate less and less in those areas.

Furthermore, you can use a little known effect called
[Magnetization Transfer (MT)](https://en.wikipedia.org/wiki/Magnetization_transfer)
to make even more inferences with the action of Deuterium. This occurs
when hydrogen ions vibrating near protein and macromolecules swap with
hydrogen atoms in those structures.  And (I think) when this it gives
of a specific radiological reaction, which allows it to be detected as
an anomoly. Well the behavior of that anomoly should change in the
presence of deteurium, which should lower the rates of
magnetization transfer.

I don't know if these anomolies produce signal which is strong enough
to be categorially determined as specific protein structures, but some
of the math from XRay Crystallography may prove to be useful here.
Over larger regions, the anomoly of signals from magnetization
transfer should be repeated in some way, across space.  That is, the
signal from magnetization transfer to specific cell structures should
acquire a specific quality.  And if those cell structures are repeated
for a neuron type that includes specific receptors, then you may be
able to map out those cell types or even quantify the amount of those
receptors.

...... But probably not.  I don't know how much of a benefit
magnetization transfer has to offer.  I know that too much deuterium
is poisonous -- 20% of body weight.  And I know that if you use this
methodology, then a person will absorb the deuterium, basically
introducing long term noise.

### Back to Neuronal Fingerprints

But if a drug should have a specific finger print, the by analyzing
that fingerprint (even decades later) you should be able to determine
whether someone was exposed to a specific neurotoxin.  Or if one
specific neurotoxin happened to be applied accross a large population
because it seemed to have attractive pharmacological qualities as
something that could be masked or hidden, then that could be
identified without needing a hair test or much proof at all.

## Does It Really Matter What I Do?

If I do have a right to be mad at the world for what has happened to
me, which I still don't entirely understand, sometimes I think the
best thing I could do to get back at them is to kill myself. I can do
so much for people, but I made $1717 last year and I live in America.
I have been effectively blacklisted and I seem to be systematically
harrassed wherever I go.  Why should I want to help a population of
people that would do that to me, if that is *really* what is going on?
Is it?  Jesus Christ, that's crazy as shit.

But the point is: it doesn't seem to matter how smart or talented you
are.  You can't just "be" the way you want to be.  You have to protect
and shield and enshroud and obfuscate your talents as though they are
something that must be hidden from others.  Especially if they are the
kind of thing that could change the world.  Because if you do not
protect yourself by artifically contorting your situations and
environment for profitability, you will find yourself robbed and
derided as nothing. As a worthless failure.

It's really sad.  It's so easy for many people to get filtered out if
they don't conform.  But the nature of knowledge is such that for any
piece of it to be replicated, it only needs to be incontrovertibly
demonstrated once. From that point, it can be restated and replicated
as truth, on the basis of faith alone.  Yet, after that, the person
who reached those conclusions is no longer necessary.  Perhaps, even
less necessary before.  In some circumstances.

That attitude; I don't believe that's right.
