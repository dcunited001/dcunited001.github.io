

intuitive with a few concepts here:
- rendering 3D, requires shift from 3D to 2D
  - rendering 4D requires shift from 4D => 3D => 2D
  - rendering 5D requires shift from 5D => 4D => 3D => 2D
  - ad infinitum

i was wrong on other concepts:
- e.g. assuming that for higher dimensions,
  - it would be harder to identify regular polytopes,
  - the HD equivalent of platonic solids

### cross product is different

the rules differ, as cross product does not generalize to higher dimensions
- and really the cross product just happens to fit in 2D (and 3D?)

math needed for HD Geometry (in each dimension)
- vector-matrix & matrix-matrix
- cross product
- homogenous coordinates
- rotations
- affine transformations
- look-at transformation
- perspective transformation
- projections

there is no 4D cross product:
- instead, we need to find something that's orthogonal
  - multiply two vectors would give us a plane
  - can't multiple 3 vectors
- to find something orthogonal, need the normals of 3 vectors
  - to do this, we take the determinant:

        | a0 b0 right |
a x b = | a1 b1 up    |
        | a2 b2 back  |

            | a0 b0 c0 right |
            | a1 b1 c1 up    |
a x b x c = | a2 b2 c2 back  |
            | a3 b3 c3 charm |

where right, up, back, cross are unit vectors in the direction of each axis

[Normal Vectors in Higher Dimensional Spaces](https://ef.gy/linear-algebra:normal-vectors-in-higher-dimensional-spaces)

[Normals on hypersurfaces in n-dimensional space](https://en.wikipedia.org/wiki/Normal_(geometry)#Hypersurfaces_in_n-dimensional_space)



