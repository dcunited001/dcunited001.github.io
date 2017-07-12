# N-to-N Complete Graph with slider that filters edges & propagation/selection factor

- single force 2D particle system using brownian/field
- particles have several n-to-n texture representing triangular matrices:
- (1) each value in the matrix is a edge threshold
- (2) each value in the matrix is a probability of propagation from node
- or a probability of propagation through a node

- basically, you have a n-complete graph reduced to edges with value > m
- this is a randomly connected graph
- then you can do communication matrices to propagate signals through the
graph, so that edges become highlighted when active
- must draw edges(lines or triangle strips) as primatives in a consistent order...
- when a signal reaches a node, it can either terminate, randomly select a single edge
to propagate through, or randomly select multiple edges to propagate through
- the last method is probably not GPU friendly

- it may be easier or more visually appealing to construct a graph w/
2D delauney triangulation
- this way, signals always propagate towards local nodes
- but you have to iterate over the 2D delauney triangles to construct the
texture representing the graph AND logically persist information between
a graph that's constantly producing/destroying edges
- but you should be able to map any delauney graph to a data structure that can
hold the n-complete graph

- UI sliders:
- (1) # particles, rCoefficient, etc.
- (2) threshold for edges to render & calculate
- (3) probability/rate of new signals to randomly emerge
- (4) age of static signals to disappear
- if selecting a random value for a node to connect to and checking whether
there's a valid edge, then propagating the signal if so and waiting otherwise
- (5) distance permitted for transmission b/w connected nodes
- frag shader to cull out edges b/w nodes(particles) on the n-complete graph
that exceed the max distance
- (6) probability for signals to propagate (and edge selection, etc)

- this should probably be several animations, since the design for those based on a
randomly filtered n-complete graph differs significantly those based on graphs
constructed from delauney triangulation

- there should be some clever use of the scan algorithm on the graph's triangular
matrix that enables you to compact a list of edges for each node, but very quickly
- this would involve at least one map-reduce on the triangular texture to
aggregate it to a form where a 2D array of node ID's can be extracted from
the resulting texture
- then you can use scan/compact to remove nils and construct a graph of compacted
edge ID's for fast computation/selection with CPU
- however, this is not possible/easy on WebGL because the data returned is likely
not sparse
