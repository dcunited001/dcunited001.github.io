---
title: "Two Projects That Would Save the World"
author:
  name: "David Conner"
tags: "supercomputing bioinformatics biology savingtheworld chemistry"
---

### So I'm a guy with a TON of ideas

It's kind of a burden actually.  I have all these great ideas and no means of executing on them all.  And definitely no time to complete all of them.  So $#@! it, I'll just give them away.  They're just pipe dreams anyway.

I just finished watching the first week of Coursera's Epigenetics course from the University of Melbourne.  I just took the first quiz and got a 90, although it was multiple choice.  It's too bad that I was two weeks late and won't receive credit.

### Here's my ideas, posed as questions.

I'm sure these questions have been asked before and that someone has proposed similar methods as well for finding the answers.

- What chemicals can invade a cell's nucleus?
- What are the differences in DNA methylation between various types of human cells?  At various points in their development?

I believe these are two questions which can be answered without the need for significant advances in computing power.

### One of my passions is Bioinformatics

Maybe you've heard of it.  I'm surprised we haven't focused more research onto Bioinformatics.  Unfortunately, we just don't have the computational power to make the big breakthroughs just yet, but it's coming.

I once read that we need **100 petaflops** to simulate all the molecules within a single cell **in real-time**.  For reference, the current fastest is [Tianhe-2](https://en.wikipedia.org/wiki/TOP500#Top_10_ranking), a Chinese supercomputer capable of 33-54 petaflops.	 In very recent news, China may be planning to turn Tianhe-2 [into a 100 petaflop system](http://www.hpcwire.com/2014/03/20/peek-chinas-plans-top-supercomputer-shows-slowdown/#/).  We should break the exaflop barrier around 2017.

<img class="img-responsive" alt="Exaflop" src="http://6lli539m39y3hpkelqsm3c2fg.wpengine.netdna-cdn.com/wp-content/uploads/2014/03/China_supercomputer_traj.png">

My point is that big things are coming soon.  Once we break the exaflop barrier, we can simulate groups of cells and extracellular communication.  We could even simulate cellular neural networks.

### Bioinformatic Discoveries

There are tons of discoveries that await us with bioinformatics.  It's important to note that these discoveries will be made using computer models that will never be completely accurate.  They must always be verified with studies.  That said, they will give us important leads which will allow us to more wisely invest our resources for research.

What kind of questions will bioinformatics answer?

- How do the mutations in genes shared between species account for the differences in their functions?
- What are the long-term effects of prescription medication?
- What action does a chemical have on cellular processes?
- How does a mutation in a particular region effect the action of proteins?
- Does a prescription medication actually work as intended?
- How does a prescription medication cause its side effects?
- How well does a prescription medication perform against genetic variations of a protein?
- What molecules affect the active site for a protein?
- What molecules affect modulate the action of a protein?
- What functional regions of proteins are shared between genes?  Are there genes with undiscovered functions which share similar regions?

Anyway, back to my proposed projects

## What chemicals can invade a cell's nucleus?

Formaldehyde is one such chemical.  It's found in cigarette smoke and when it invades a cell's nucleus, it bends and breaks the DNA.  Additionally, many chemicals eventually degrade into chemicals including formaldehyde, such as aspartame.

- What other chemicals are *nuclear permeable*?
- What chemicals degrade into byproducts which are nuclear permeable?
- Which nuclear permeable chemicals have effects on DNA?

#### Why answer this question?

I recently learned from the **Epigenetics** course that **ALL** forms of cancer that have been studied have shown aberrations in DNA methylization.  Yes - *all* forms of cancer.  Changes in DNA methylization can cause changes in genetic transcription, replication and expression.

In order to directly affect DNA methylization, a chemical would need to cross a cell's nucleus.  So, determine those chemicals - prevent cancer.  However, I can also imagine chemicals which indirectly affect methylization by interfering with a cell's own processes, but those chemicals and pathways would be much more difficult to determine.

#### How to answer this question?

I'm starting to get into subjects I don't know as well as I'd like to.  However, I feel like I understand enough about this to know where to start looking.

Chemical properties determining nuclear permeability should be well known.  Computer simulations of chemical properties can determine the likelihood of an agent crossing the nucleus, but these simulations should not require astronimic amounts of computation.

Similarity between chemicals would be useful as well, but I'm guessing that similarity based on electrochemical properties would be very difficult to work into an algorithm.

Additionally, information about chemical degradation pathways should be considered.  Many molecules are not dangerous themselves, but naturally break down into others that are.  Some molecules can be altered by the body's own enzymes.

Many of the chemical properties in question may be obtained from databases online.  These databases could be used to source a list of chemicals.  Chemicals that are most important to understand are those present in the food supply and in household products.

### What are the differences in DNA methylation between various types of human cells?

Some quick [googling](http://www.illumina.com/applications/epigenetics/sequencing_based_methylation_analysis.ilmn) shows that the technology is available to sequence DNA including methylation.

#### Why answer this question?

Combining existing genome data and our current understanding of each gene's function with methylation data will certainly allow us to deduce further knowledge about how life works.

We'll be able to see which genes are only active in certain cell types, those active in all cell types and those that are deactivated.  Additionally, we can deduce further information by examining the genes that are active from the beginning and those that are activated during different stages of life.

If these techniques haven't already been thoroughly explored, they will prove extremely useful in determining the functions of genes.  And more important, these techniques will allow us to zoom out a bit to understand which genes are related and perhaps why.

#### How to answer this question?

I'm getting tired now.  Maybe I'll finish this later.
