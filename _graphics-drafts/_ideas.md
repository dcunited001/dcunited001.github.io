---
title: "Graphics Ideas"
---

- mesh parameterization X Voxellated data
  - morph interpolation X Voxels

- utilization of inferred volumetric dtata from stereo-3D data or
  streamed 3D data across time
  - e.g. expected volumetric inferrence from interpolation of inferred
    morph vs. actual volumetric change
  - this may be more useful on global/local features other than volume

- inference of lighting artifacts from Stereo3D streaming data
  - infer/construct surfaces w/ a temporal model & estimate distance
    to visible pixels/voxels (w/ Stereo3D Depth Attachment?)
  - Also estimate change to visible pixels across time. These values
    can be reduced to a sampling of (x1, y1, x2, y2) domain
    - can they really? (x,y,z) sampling instead
  - (finish) identify patterns of composite images that vary linearly
    w/ distance, but at a different rate than most inference data
- 

