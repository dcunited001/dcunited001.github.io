
### My current intuition (thoughts from 10/19 livestream)

### Solutions for NavierStokes are not Guaranteed, but sometimes may exist.

The overview of the #Intuition here: adding the #Viscosity to the
#NavierStokes equations results in an invalid construction. It is
confusing because there are some configurations of the N/S equations
that may result in examples of exact/potential solutions, but I don't
believe that existence is guaranteed for those solutions. This is
counterintuitive, since analytical methods can usually refine
approximated solutions; their approximations may even deceptively
proceed towards some singular point in solution-space; #SobolevSpaces
may even filter the solution-space of the PDE such that it appears
that more and more singular regions are left remaining.

However, i believe the N/S equations are fundamentally flawed in how
they non-localize the viscosity throughout the space of the PDE. For
particle-based fluid systems (thus non-ideal fluid) viscosity results
from particle-particle interactions. it is localized. That said,
Navier-Stokes *IS* still a mathematic albeit non-physical equation in
its own right and the question of whether there are solutions or not
is not related to how the idealized fluid connects to fluids whose
mechanics are dependent on particle interactions

still, assume that there are non-linear systems who do not have
precise, extant and/or unique solutions. why then, do the proofs
assume that the navier-stokes equation has solutions and that one must
start from this basis and work towards solutions. THUS, i believe the
challenge of Navier-Stokes is primarily one of **logic**, related to
proof-construction, instead of difficulty related to PDE's, algebraic
geometry, complicated means of differential inequalities, etc. the
challenge lies in figuring out how to disprove the existence of N/S
solutions, given that doing so, one must start from the faulty
assumption -- or "non-assumption" -- that N/S has solutions whatsoever
and from there work towards the negation of all solution space. this
is confounded by the existence of precise N/S solutions or solution
candidates in special cases (e.g. for special configurations of the
PDE's initial values). therefore my *intuition* here tells me that
solutions sometimes exist, may or may not be unique, but cannot be
guaranteed, which is counterintuitive, considering that N/S equations
can always be approximated by analytical methods.



# Navier Stokes

### (content from original posts)

So this new #ArsTechnica article covers #NavierStokes and
#TurbulentFlows in depth, for which there are many unsolved
problems. However, my rambling idea to revolutionize
#ChemicalEngineering by measuring changes in #Photon #Polarization
requires dealing with Navier-Stokes and turbulent flows. In the posts
& stream, there are some #NOVEL #IDEAS (i think?) for
#AnalyticalMethods in handling such flows, albeit producing additional
solutions/methods. I wonder if anyone associated with the tagged
#VirginiaTech pages even bothered to notice this... ?? Certainly, no
one mentioned it to me.

In particular, applying #MachineLearning to an experimental version of
example the #LaminarFlow regions exhibiting something like
#PhaseChange into #TurbulentFlows is why i mentioned #Kinematics in
the #Livestream. See the second pic i uploaded to understand which
example from the article i'm talking abou. The author mentions it as a
problem of theory/math, whereas I'm referring to a similar experiment
where a <200nm capillary-like tube would provide a basis for
collecting data Polarization & #SpectralDistortion that indicates how
components of the fluid moves through space and for which turbulent
regions will refract/polarize light in completely different ways IN
THE REGION BOUNDED BY THE PHASE CHANGE AND TRACKABLE WITH KINEMATIC
METHODS -- e.g. #Displacement & #Deformation.

Once refined with machine learning, this data could allow a
generalization from analytically-processed, refined data, connected to
the space of numerical solutions .... not unlike with Nash's work on
#AnalyticGeometry (see pic three) .  Furthermore, #PerturbationMethods
on the #AnalyticMachineLearning (not those applied to the theoretical
physical systems mentioned in the article) could accelerate bridging
this gap from analytic reflection on experimental data to theoretical
models -- or perhaps would be useful in getting much closer to the
answer of whether complete theoretical, numerical solutions exist
regardless of whether all numerical cases are tractable (they are not)

https://arstechnica.com/science/2018/10/turbulence-the-oldest-unsolved-problem-in-physics/

- these methods may not allow data science to bridge from machine
  learning models to validate Navier-Stokes' smoothness/completeness
  conjectures (by bridging them to numerical constructions via Nash
  Functions)
  - however, the techniques used to gather the data, along with the
    data science for analysis, is still very useful in identifying
    fingerprints of solute composition via kinematic inference with
    displacement/deformation.
  - for any and every stage of chemical reactions engineered for
    lab-scale or industrial scale, there are many reasons to assume
    such a mechanism to be limited in its viability. however, it might
    be exceedingly valuable for the production and sorting of
    nanotubes and nano-spheres, since their specialized shape/size
    would have a characteristic impact on the fluid's optical
    refraction. for the simplist nanotubes, other sorting techniques
    would likely be more effective.
