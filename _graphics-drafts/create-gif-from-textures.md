
- Capture texture data in (i % n) frames and store in an ArrayBuffer
- [use ArrayBuffer/View pattern to convert to UInt8](https://hacks.mozilla.org/2011/12/faster-canvas-pixel-manipulation-with-typed-arrays/)
- each frame, [append final UInt8 array to the GIF using gif.js](https://github.com/jnordberg/gif.js/)

it's pretty simple, but is there a design-naive way to do this? so that i can have a 
method on the Application class that accepts a function, which is run every (i % n)
frames and collects the ImageData in gif.js. 

- i want a preview image for each animation, without thinking about how to 
  specifically adapt each animation to collect the preview image
- i also want to be able to add a button & input, so users can create a GIF
  while running the animation, regardless of the user's browser size, resolution,
  etc. etc.
