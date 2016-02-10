---
title: "Appistack"
type: project
date: 2013-01-01
repo_url: "https://github.com/appistack/appistack"
project_url: "https://dcunited001.github.io/appistack"
categories: ['Gems']
display_order: 1
headline: A Containerized Hackathon Template
excerpt:
author:
  name: "David Conner"
tags: "ruby rails ios android angular hackathon"
---

Appistack is a technology stack template for startups and API-driven applications.

### Designed with Hackathons in mind

Appistack enables developers to hit the ground running with an API and
single page app deployed to Heroku/Divshot in less than an hour.  If
you follow the deploy instructions below, you'll have a publicly
facing Rails API with user registration and a single-page Angular app
with CORS configured.  And you can do this all for free, with
[Heroku](https://www.heroku.com/), [Sendgrid](https://sendgrid.com/)
and [Divshot](https://divshot.com/).  So get the CRUD out of the way
and start building.

### Appistack Project Templates

#### [appistack-rails](https://github.com/appistack/appistack-rails)

An API-only implementation of Rails with token authentication.

#### [appistack-ng](https://github.com/appistack/appistack-ng)

An AngularJS/Bootstrap soundboard app, with great examples for
webaudio and canvas.

#### [appistack-swift](https://github.com/appistack/appistack-swift)

An iOS soundboard app written in *bloody edge* Swift 2.0.  Requires
XCode7 Beta 4.  Set up to work with Appistack Rails.  Includes
Login/Signup.

#### [appistack-droid](https://github.com/appistack/appistack-droid)

An Android soundboard app with Waveform and FFT audion
Visualizers. Set up to work with Appistack Rails.  Includes
Login/Signup.

#### [appistack-ionic](https://github.com/appistack/appistack-ionic)

An ionic implementation of the Angular app

other project templates could include: Backbone, Ember, React, iOS
(Objective-C), Django

## Using Appistack

#### It's Both For Noobs and not For Noobs

While this is a great example of a containerized Single Page App that
can easily be deployed to multiple environments, you still have to
know Rails, Angular and/or iOS to get much out of this.

Additionally, if you aren't familiar with how these templates are laid
out, you're not going to be able to jump right in and hack on them.
And that's an unfortunate paradox of most programming tools -- and
especially templates/dotfiles -- they're incredibly powerful, but *at
least as complicated* as the problem-domain they help solve.
Occasionally, a well crafted interface and mix of tools will reduce
the problem complexity, but it can never be eliminated.

In other words, just having the tools doesn't help much.  You have to
know how to use them.  I'm providing these to show how I solve these problems as well as to
reuse them myself in the future.  But I'm also posting them online bc
they could be very useful to anyone who wants to quickly iterate on new
ideas. *Do More Faster*, right?

#### Using Git Submodules

While this project is a collection of git submodules, that's really to
centralize the docs and repositories in one place.  I'd recommend
against using gitmodules, unless you're really familiar with
them. Instead, just fork the templates you need, not the Appistack
repository.  Replacing git submodules is really confusing.

#### Pulling in Upstream Changes from an Appistack Template

Sidenote: So far, I've kept the commits atomic on each template
project.  This has been helpful, as I can chose to cherry pick commits
onto a personal project from the appistack template upstream.  Once I
use Appistack to start a new project, I woudn't usually plan on
rebasing in upstream changes from the templates.  However, since I'm
finalizing the templates, it's been convenient to distribute selective
changes across both projects.

In these projects forked from Appistack, I have two git remotes:
origin and appistack.  So, once I make changes to Appistack, I can
just `git fetch appistack` on the fork project, find the atomic
commits I need and cherry pick them. It's stll kind of a pain to
maintain changes across two sets of projects, so I don't plan on doing
this for long.

## Deploying to Heroku & Divshot

#### 1) Determine Configuration

As you deploy the API and Angular templates, you'll need to configure
settings like API, Assets and Client location across each project.

If you're going to use a domain name, get that set up with your DNS
provider now.  However, you don't need one, as you can deploy to
Heroku and Divshot for free without one.

#### 2) Deploy Your API

Follow the [Appistack Rails 4.2 Deploy Instructions](https://github.com/appistack/appistack-rails#deploying-to-heroku).

#### 3) Deploy Your Single Page App

Follow the
[Appistack Angular Configuration Instructions](https://github.com/appistack/appistack-ng#configuring-divshot)
to get setup.
[Divshot Deploy Instructions](https://github.com/appistack/appistack-ng#deploying-to-divshot)
can be found here.A

#### 4) Configure Mobile Clients

You can try connecting to your API using additional Appistack client
templates, like the
[iOS/Swift](https://github.com/appistack/appistack-swift) client.

## Appistack Goals

Because these template projects are intended to be [relevantly] used
again in the future, they are written in bleeding edge versions of the
frameworks, like Rails 4.2, Angular 1.4 and Swift 2.0.

#### Generic Feature Set

The features are fairly generic.  That is, for the most part,
Appistack only has the features that every startup application would
need to begin with.  The API has token-based authentication, which is
a must for Android/iOS apps.  The client apps all have user
registration & login built into them.  The Angular app already
includes UI for email confirmation and password reset flows.

There are just three models in each app: Users, Artists and Sounds.
You'll need to rip out the code for Artist & Sounds, as your app will
likely use a different set of models.  However, I wanted to
demonstrate Appistack's modular architecture in a very interactive
way.  Also, there's some great examples of how to use WebAudio/Canvas
together to implement custom audio in the web, with graphics.

#### Generic Technical Implementation

The technical implementation is designed to be as generic as possible,
so you can just fork the projects and build on top of them.  This way,
you can hit the ground running instead of spending a ton of time
ripping code out.

There are a few features missing, like user profile pictures.  This is
because the technical implementation for these features is usually
specific to the technology used.  A feature like profile pictures has
backend technical implementation details that are determined and
constrained by design decisions on the frontend.  So, instead I've
added Gravatar to the API, which returns a gravatar_url along with
each user.

#### Limited Testing Implementation

Testing is highly opinionated and each team will test using different
technologies. That's why there is mostly no testing included in the
projects.  Some teams will opt for full-stack integration testing,
loading separate projects in containers.  Others will want to mock the
API responses to run acceptance tests on each client.  The Angular
project has a few basic Protractor tests written using ngMockE2E.  The
Angular project can actually run without the API server because all
the API responses have been mocked.  The Rails project has a few basic
unit tests included, but the idea is that you'll be able to easily add
in testing however you prefer it.

#### Generic API between Server/Clients

The API is designed so that both the API or clients can easily be
replaced.  You can easily run a Django or Clojure API and connect the
same Angular app to it.  Or you can build a Backbone app and easily
connect it to your API -- with no changes required to format of the
API responses.  Any API implementation will need to be configured to
return authentication/registration responses in the format of
DeviseTokenAuth.  NgTokenAuth is used by the Angular app and there are
non-Angular implementations for the same DeviseTokenAuth API
responses.

#### Containerized for Sweet Devops

*All configuration* for each Appistack project is specified with
environment variables.  For now, technically the API is the only
template to use environment variables, but the others all have
configuration files set up.  Examples of configuration values are:
static assets url, api url, sendgrid configuration, etc.

This is part of the [Twelve Factor](http://12factor.net/) methodology,
which greatly simplifies deployment.  Twelve-factor also greatly
simplifies automation and orchestration of your application later on.
For example, you can easily run your projects inside Docker
containers, which can be snapped together like lego pieces and
deployed into various environments.

So when you need to configure Amazon S3 or host your Angular
Application on a CDN, these application templates are ready to be
configured to do that.  And for the most part, all you need to change
are environment variables and configuration files.

#### Separated Concerns

In addition to being a template for startups, Appistack is a good
example of the benefits of separated concerns in your architecture.
Your API should be an great API and that's it.  It should create
resources and serve data to various clients, which all expect
interactions with the API to occur in a common language.  When your
API becomes concerned with solving too many problems, your application
becomes less technically agile.  Down the road, it becomes harder to
try new technologies and scalability becomes a problem.

Great example: your API should not give a !@#$ about caching
client-side HTML page fragments.  If your application server uses
memcached to cache HTML views, have fun scaling that !@#$. It's a hard
problem to solve and very expensive.  Scalability is hard enough when
you're sharding your data sources and distributing your services, so
why would you want an unnecessary caching layer to add another
dimension of complexity?  Client-side caching is not a problem your
API should be concerned with, nor should it be concerned with managing
or building your static assets.  Fortunately API-driven Single-Page
Apps, many problems are much simpler.  If your API does actually
*need* a caching layer for JSON responses, then congratulations -- you
probably make a lot more money than me.

Another advantage in separating your API/Client is your backend
developers only need to worry about the API and your frontend
developers can focus on the frontend.  Both the development of backend
and frontend can proceed independently.  Designers will find it easier
to work in a frontend-only project.

#### Got 99 Problems, But Cross-Origin-Resource-Sharing Ain't One

Obviously, Single Page Apps (SPA's) have a lot to offer: improved
developer productivity, more flexible frontend frameworks, and a more
responsive user experience.  However, the alluring simplicity of
single-page apps comes with several new problems you'll need to
resolve, including CORS, static asset configuration (user uploaded
assets on S3), token-based authentication and others.

When starting a new app, most developers and productivity-minded
people will prefer to build it with the simplest tools.  "Just get it
to work" is the mantra -- and it's not all that wrong. There are a ton
of problems specific to SPA's that you won't need to spend weeks
solving if you're just using Rails or Django.  But further down the
road, the benefits of an architecture with an API & SPA will greatly
outweigh an architecture with just a monolithic Rails server.

But, the prevailing attitude is always "just get it working."  Just
get something in the user's hands that they can use to test the
validity of an idea.  The problem with this attitude is not that it's
wrong, but that it sets up an inevitable problem down the road, where
you have to migrate from the Monolithic Rails architecture to a Single
Page App.  And in my experience, *transitions like these never
happen.* Or if it does, it takes months.  From a business perspective,
it's really hard to justify such a lengthy transition, when it
requires a ton of time/money and produces little immediate benefit to
your customers.

However, if there were a framework where all these complex SPA
problems are already solved -- and they're not really that complex --
a ton of time can be saved using something like Appistack as a
starting point.  Frontend frameworks are !@#$'ing magical.  Both for
the developer and for the customer.  And if your frontend isn't
entangled in your API code, it's a lot easier to experiment with a
variety of technologies.
