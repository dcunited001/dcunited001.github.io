

#### Spiel on Strange Overwatch Team Search Feature Behavior

#Overwatch #PS4 sooo, precisely 2:00 minutes after login, available
"find a team" matches are limited to ~8 results (40,000,000
installs). toggle ps4 internet on/off? i get a normal result count
... for 2:00 until same thing (with ZERO overlap in teams)
#BermudaTriangle #Region?

lol, no i'm afraid that's possible.. there is no "bermuda triangle
region" on Sony's network LOL but yet, this bug where a strangely
restricted set of teams emerge responds predictably to the "monkey
with a hammer" troubleshooting technique of "turn the internet on and
off again"

regardless, it must be different servers -- sharded data: usually
datasets returned for some query via different shards will predictably
contain #DiscreteSubsets. without more complicated joins (or
complicated redundancy w overlap of shard data), there are ZERO common
set members

that much is clear: it's not retrieving the data from the same source,
since there are ZERO teams listed in both types of sets. after 2:00 of
connection to #Overwatch I'm consistently downgraded from the data
source where games are plentiful, seemingly more balanced and etc

it could just be unbalanced load balancing, but why can i not get a
less constrained set of teams until I toggle my network on/off and why
would the game connect to a different load-balanced resource (which
should be transparent) after the 1st or 2nd search.

it's all good, i'm just happy knowing that i can consistently be
unpredictable. i mean *if* that's intentional rerouting to a
restricted set of stacked games ... that's impressive, but it wouldn't
stand up to a monkey with a hammer. it's not though; there is no
"Bermuda Triangle Region"

### Sharding Data

- (also referred to as partitions)

sharding data most widely occurs at the data-access layer (SQL, NoSQL,
etc) and organizes data by some attribute (e.g. last names
A-C;D-F;G-J; etc) then routing requests to that data to the
appropriate source. it gets tricky with models that stochastically
form many-to-many records to be joined across the shards.

sharded data (or at least the column which is sharded) is usually
split #DISCRETE #Subsets because when they overlap whatsoever, it
yields architectural headaches related to #Atomicity or #CapTheorum
#Consistency.

https://en.wikipedia.org/wiki/Equivalence_class

sharding also emerges when software begins to scale in the cloud,
where requests to services are regularly routed towards a particular
shard. usually this isn't worth the headache, especially if you don't
need hundreds of registered services with guaranteed coverage and
distribution of load -- particularly when data accessed by those
services is specific, expensive and can't be distributed so that it is
"equidistant" from any service container handling any request.

The notion of a #Cover from #Topology, #CategoryTheory and
#SheafTheary can help guarantee whether a node in a replicaSet has
it's position covered and, thus, the load will be distributed evenly
across the cluster or replicas.

https://en.wikipedia.org/wiki/Cover_(topology)#open_cover

#### Sharding in Stream Processing

Sharding is moreso usful for sharding #StreamProcessing when users or
objects on a network tend to become registered to regularly use
specific stream processing entry points. in this case, you're probably
deploying thousands of nodes with fan-in, etc in the chain of stream
processing services.

![Picture of chart with "stream data platform"]()

#### E.G. a newsfeed algorithm at scale

 #NewsFeed is an example where stream processing would begin to
 accumulate such scale. this would produce:

- counts of likes and page views that need to be totaled and averaged
- shared interests or mutual inclusion of relationships to objects
  created by users
- approximating the ranking/sorting of top current interests

In that picture, imagine that central "stream data platform" component
contains a chains of services in container -- like converging strands
in a thread -- where data is unpacked, operated upon quickly, and
passed to the next service in the chain (maybe in the same
container/box and maybe not) Most operations are incredibly simple and
data flow usually reduces in volume as it progresses further into the
stream (it converges). Some nodes will push data out to the data
stores of the application; some clone the data they receive and fan it
out to listening nodes; some #MapReduce across the chunks of data they
receive (e.g. average, sum, variance, entropy)

anyways, the focus here is on the "threads" or "web" of a stream
processing system, which must have data available to operate on, when
they receive their input. so if they receive a chunk pointing to a
specific user, but can't access that user's data efficiently
(viz. immediately), then you'd end up with bottlenecks. the ideas
behind this architecture borrow heavily from functional programming
with ideas like immutability and idempotency. Beyond certain scales,
the #CAPTheorum starts imposing itself, since the threads/chains of
nodes must be organized like shards to distribute the load, while
being mapped to inputs relevant to their partition/shard.

### Configuration and Meta-Configuration

- really, a problem that is largely circumvented by avoiding mutating
  the state of the stream processing network

partitioned stream processing nodes requires solving difficult issues
related to propagating configuration to new branches of nodes
instantiated to expand the total processing of the network. the
network should expand such that it redistributes/captures the overflow
when dynamically scaling in response to unpredictable load. to do so,
the network needs to collect a ton of real-time data from
nodes/tiers/etc.

Finally, theres a problem of getting the network to respond
structurally, while being capable of remapping itself. When the nodes
in the network mostly converge with flows mostly directed forwards,
then this problem is much simpler. It still results in a major
configuration management problem: how do you decide streams are
responsible for specific partitions of data, while ensuring:

- complete coverage of the inbound requests
- the network can scale to match load
- it propagates map-reduced values accurately and without bottlenecks
- when the structure of the network changes, the "meta"
  configuration-data is manageable enough for scaling to be automated

similar to #ServiceDiscovery, you can register stream-processing
segments as they're provisioned. to distribute the load evenly, so
that the network requires the least amount of rebalancing, you tend to
partition segments to cover subsets of users or other models. the
subsets are registered so that high-volume and low-volume
users/records are grouped together (or grouped with records of similar
variance, etc)

but the question is: how do users ultimately become grouped together
and does it matter for fair performance in algorithms? because you
could just as easily create subsets of users and place them in the
#Timbuktu stream queue (obviously not referring to overwatch here lol)
where they magically aggregate zero's for everything
