---
title: "Graphics Ideas"
---

### Mesh Generation & Mesh Morphs w/ Voxels

- Mesh Parameterization X Voxellated Data
  - Morph Interpolation X Voxels

- utilization of inferred volumetric data from stereo-3D data or
  streamed 3D data across time, applied to generation of mesh morphes
  - e.g. expected volumetric inferrence from interpolation of inferred
    morph vs. actual volumetric change
  - this may be more useful on global/local features other than volume

### Inference of Lighting from Stereo3D

- inference of lighting artifacts from Stereo3D streaming data
  - infer/construct surfaces w/ a temporal model & estimate distance
    to visible pixels/voxels (w/ Stereo3D Depth Attachment?)
  - Also estimate change to visible pixels across time. These values
    can be reduced to a sampling of (x1, y1, x2, y2) domain
    - can they really? (x,y,z) sampling instead
  - (finish) identify patterns of composite images that vary linearly
    w/ distance, but at a different rate than most inference data

### Computer Vision Techs

- connect existing computer vision techniques to utilize inference of
  material composition via database of materials and their
  refractive/spectral properties
  - it would help if augmented with spectra outside of visible light
  - this will fail quite often and may not be possible. it will need
    to permit noise/distortion, but a wider range of color channels
    would be able to significantly augment large-scale feature
    detection (esp for natural objects like butterfly species
    detection)
    - especially for natural objects, whose color is not so tightly
      bound to a set of industrial-friendly chemicals for color
    - but image encoding destroys spectral data, so this can't be
      trained on or run on traditional image formats and probably
      needs to occur in hardware.

