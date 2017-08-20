
- (1) solve cymatics of simple, regular 2D polygons first.
  - refer to "Spectral Geometry: Analysis on Manifolds via Laplacian" for their 
    example of modeling a 2D drum
    - this should provide enough info to get cymatics working via a circle or a square
      - circle would be easiest, which would likely allow for changing parameters

- (2) once the eigenvalues are found for a given set of parameters... then simulating
  sand on the surface is easy. 
  - regions of the texture have either more or less resonant vibration. 
  - the particles at those coordinates can be simulated to move with brownian motion
    where their velocity is coupled to the amount of resonance at that point.
  - the same cymatics patterns that show up in online videos should emerge on the surface 

- (3) allow the user to click and drag any 2D surface on the canvas
  - this constructs a 2D polygon, which must be pretty simple
  - user also designates the region of the polygon that receives external energy
    - i.e. the point(s) in a cymatics experiment where the energy from sound waveform 
      enters the glass
  - then, the algorithm attempts to learn the eigenvalues for each point of the polygon
    - it will be difficult and maybe not parallelizable, but it should be able to do this
      by combining various eigenvalue 
    - not actually sure if this is possible... 
      - are the eigenvalues specific to the spectrum of the audio waveform? 
      - if so, it will be difficult to run the algorithm and identify values of frequencies
        which will work well
    - usually the cymatics experiments have pure sine tones or simple additive sine oscillation
