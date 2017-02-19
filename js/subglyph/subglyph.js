// Unicode substitution cipher

Subglyph = function(options) {
  this.dictionary = options && options['dictionary'] || {};

  this.glyphText = function(text, options) {
    // iterate over an element and replace text with selected dictionary
  };

  this.glyphIt = function(el, options) {
    var html = el.innerHTML;
    var insideTag = false;
    var insideEncoding = false;

    // memoize htmlTree into shadowDom
    // - notate status of memoization in data-subglyph of tag

    var sg = this;
    var newHTML = _.reduce(html, function (memo,char) {
      var charIsAlphanum = /[a-zA-Z0-9]/.test(char);
      var newChar = char;

      switch (char) {
        case '<': insideTag = true; break;
        case '>': insideTag = false; break;
        case '&': insideEncoding = true; break;
        case ';': insideEncoding = false; break;
        default:
          if (charIsAlphanum) {
            if (!(insideTag || insideEncoding)) {
              //TODO: fix to sample from dictionary by key
              var dict = Object.keys(sg.dictionary[char]);
              var dictIndex = Math.floor(Math.random() * dict.length);
              newChar = dict[dictIndex];
            }
          }
      }

      return memo + newChar;
    }, "");

    return newHTML;
  };
};

Subglyph.prototype = {
  constructor: Subglyph,

  // return the origin (a la the 'kernel' from abstract algebra)
  // - the function in a space that gets you to the same point/region in the space every time
  oneToOneDictionary: function() {
    return {
      'a': {'a': 9},
      'b': {'b': 9},
      'c': {'c': 9},
      'd': {'d': 9},
      'e': {'e': 9},
      'f': {'f': 9},
      'g': {'g': 9},
      'h': {'h': 9},
      'i': {'i': 9},
      'j': {'j': 9},
      'k': {'k': 9},
      'l': {'l': 9},
      'm': {'m': 9},
      'n': {'n': 9},
      'o': {'o': 9},
      'p': {'p': 9},
      'q': {'q': 9},
      'r': {'r': 9},
      's': {'s': 9},
      't': {'t': 9},
      'u': {'u': 9},
      'v': {'v': 9},
      'w': {'w': 9},
      'x': {'x': 9},
      'y': {'y': 9},
      'z': {'z': 9},
      'A': {'A': 9},
      'B': {'B': 9},
      'C': {'C': 9},
      'D': {'D': 9},
      'E': {'E': 9},
      'F': {'F': 9},
      'G': {'G': 9},
      'H': {'H': 9},
      'I': {'I': 9},
      'J': {'J': 9},
      'K': {'K': 9},
      'L': {'L': 9},
      'M': {'M': 9},
      'N': {'N': 9},
      'O': {'O': 9},
      'P': {'P': 9},
      'Q': {'Q': 9},
      'R': {'R': 9},
      'S': {'S': 9},
      'T': {'T': 9},
      'U': {'U': 9},
      'V': {'V': 9},
      'W': {'W': 9},
      'X': {'X': 9},
      'Y': {'Y': 9},
      'Z': {'Z': 9},
      '0': {'0': 9},
      '1': {'1': 9},
      '2': {'2': 9},
      '3': {'3': 9},
      '4': {'4': 9},
      '5': {'5': 9},
      '6': {'6': 9},
      '7': {'7': 9},
      '8': {'8': 9},
      '9': {'9': 9}
    }
  }
};
