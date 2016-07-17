---
title: "Stuck in Software Bureacracy"
author:
  name: "David Conner"
  tags: ""
---

I really hate to blog about negative stuff like this.  I have a ton of
more interesting articles I could write.  However, I've notice some
things that are specific to software development that can be used to
reduce someone's apparent productivity. You'll only notice these with
experience.  I'm sure every industry and field has things like this
that are specific to it.

These have happened to me at a few software jobs that I've had.  If
there's another developer who has a problem with you, they can easily
employ some of these tricks and drastically reduce your productivity.
For the most part, the tactics I describe below are just things that
naturally happen all the time in software and there's no malicious
intent.  It's just shit software developers have to deal with and it
happens because a dozen people are working on the same software
product.

However, the following tactics *can be used maliciously*, if a
manipulative software developer wanted to appear more productive.  And
for the most part, if you find this happening to you, you're always
going to seem like you're behind.  And because it involves passive
aggressive behavior, it's very tough to fight.  My point is that there
are lots of little nasty tricks that a manipulative software
programmer can use to trip someone else up.  And there's almost
nothing you can do, except keep your chin up to trudge through all the
shit.

### Stomping On Your Changes

So if several developers are working on features in one project at the
same time, they'll inevitably make changes that conflict.  I'm not
talking about merge conflicts here.  Those are easy to resolve.  Most
of the time, these conflicting changes are harmless and mostly
superficial -- a variable name was changed or two lines of code were
swapped.  Most of these superficial conflicts are automatically
resolved by your source control program.  Not a problem.

However, the dirty little secret is that, out of two developers that
submit conflicting changes, the person that submits their code first
(D-1) doesn't have to fix the conflict.  It's the responsibility of
the second developer (D-2) to pull in the changes written by D-1 and
get their code to function correctly with those changes -- before
submitting them upstream.  D-2 now has to review the changes
introduced by D-1 and understand how they modify the overall behavior
of the application.  D-1 does not have to review/comprehend the
changes introduced by D-2, they keep on trucking and move on to the
next feature.

> With proper software testing in place, it is not hard to understand
> how an application's overall behavior has changed.  That happens
> automatically, when you run your comprehensive test suite.
> Therefore, the consequences of stomping on someone's changes are
> reduced and it quickly becomes apparent who really introduced a bug.

In practice, with teams of 5 or 6, this shit happens all the time.
Everyone is constantly stomping on everyone's changes.  And it's
everyone's shared responsibility to make sure that their changes don't
introduce bugs.

However, if D-1 is consistently the first person to submit, they can
consistently prevent D-2 from making progress.  Furthermore, if D-1
makes changes to the API of a dependency that D-2's changes depend on,
D-2 can easily introduce bugs -- bugs that are clearly D-2's
responsibility to identify and fix.  The problem with this is D-2 is
always cleaning up after D-1, especially if superficial changes were
introduced to a dependency by D-1.

The likelihood of bugs being introduced is magnified if your software
suite does not have comprehensive test coverage.  This one big reason
that I can't stand working on software without a test suite, when
working with other software developers.

Most of the time, this isn't a problem because it happens everyone.
But some people *can* intentionally use this tactic, in combination
with 'Pull Request Hell' to consistently set you back.  For bugs
introduced in by code conflicts, it's really both developers' fault.
Additionally, if you are D-2 and bugs are introduced, it may appear to
be your fault. And good luck trying to explain this to a manager who
either isn't a software developer or isn't actively working in the
project.

Obviously, you don't want to point the finger at someone else for a
software bug, but you also don't want to be unfairly blamed for
someone else's mistake.  Usually, if this is the case, it's a waste of
time.  The most efficient course of action is to just fix it and move
on.  But that costs time and if you continually find yourself in this
position, then D-1 will consistently stay ahead and the only work
you'll find yourself doing is cleaning up.

Consequences of problems introduced by code conflicts will be worse
when working with people who do not communicate well.  If this tactic
is used purposefully, D-1 will not communicate their intent when
making conflicting changes.

### D-1 Introduces Bugs and Doesn't Write Tests

Stomping on your changes is made significantly worse when D-1 doesn't
add new tests for their changes or update existing tests.  When you're
ready to submit features and you pull down changes from other
developers, you'll run the test suite.  Everything passes and seems to
jive with the changes you've made.  In addition to the test suite, you
ran through a few features in the running application.

So you submit your feature, but there's a bug.  Because the bug was
noticed when you submitted your code, when the it's discovered, you're
the one who has to defend yourself.  You haven't clicked through every
single feature in the application.  But changes that were made which
you weren't aware of caused problems.

Most of the time, this is just something that happens in software
development.  This is shit that every developer has to trudge through.
And it's why communication is vital to any software team.  Everyone
needs to be aware of the features in development and changes that are
being made.  And so, it's not appropriate to be negative when it
happens.

But D-1 can cause problems for other developers by being lazy,
avoiding proper tests and not communicating well.  But often, when
these problems do occur -- whether intentional or not and most likely
not -- attention is not focused on D-1, who appears to be very
productive.  Instead, the attention is focused on the other software
developers.  This is why it's very important for managers and business
people to at least have a baseline familiarity with software.

### Pull Request Hell

It's important that developers on a team are aware of the changes
being implemented in a project.  Pull Requests (PR) can be a great
place to discuss changes and keep everyone on the same page.  However,
if a developer nitpicks at your pull requests, they can stall the
acceptance of your features, slowing you down.  I actually welcome
criticism because it means I have a chance to improve at something.

Your organization will likely use accepted features and resolved bugs
to measure software developer performance. So if everytime you submit
a PR for a feature or bug, you have to wait a day or so for even get
feedback, this can slow things down by itself.  Without a developer
that nitpicks your code commits.  But if you're working a simple
feature and have pull requests rejected several times, you'll have to
constantly pause whatever new feature you started to revisit an old
feature.  This context switching can be distracting and time
consuming.  If the criticisms truly lack merit, it's frustrating to
return to each feature you thought you finished.

If your organization uses two-week sprints, then clogging up someone's
pull requests right before the end of a sprint makes it appear that
they did not complete their fair share of work for that sprint.

If your organization requires that each feature be in a separate
branch and that each feature have a separate pull request, this adds
an extra layer of work for each feature that you complete.  Everytime
one of your pull requests is rejected, you have to stop what you're
doing, rebase changes other developers have completed, fix whatever is
wrong, push your feature back up and update the pull request.  After
you update the pull request, you then have to wait for other
developers to get feedback, which can set you back another day.  Until
then, you've got to constantly check the PR to see if it's been
updated.

### Reassigning Features Before You've Completed Them

It's frustrating to be working on a feature and before you can
complete it, it's either reassigned or finished by someone else who
didn't communicate to you that they were working on it.  This
basically means that all the time that you were working on it was
wasted and you have to throw away your changes.

Sometimes it makes sense, like when it's a high priority feature or
bug that needs to be completed ASAP and you've got other work to
complete.  But it *can* be used to waste your time and drain your
productivity.  Usually reassigning a feature is a decision made by a
manager.
