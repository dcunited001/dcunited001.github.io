// Unicode substitution cipher

Subglyph = function(options) {
  this.dictionary = options && options['dictionary'] || {};

  this.glyphText = function(text, options) {
    // iterate over an element and replace text with selected dictionary

  };

  this.glyphIt = function(el, options) {
    var html = el.innerHTML;
    var insideTag = false;

    // memoize htmlTree into shadowDom
    // - notate status of memoization in data-subglyph of tag

    _.reduce(html, function (memo,char) {
      var charIsAlphanum = /[a-zA-Z0-9]/.test(char);
      var newChar = char;

      if (char == '<') {
        insideTag = true;
      } else if (char == '>') {
        insideTag = false;
      } else if (charIsAlphanum) {
        if (!insideTag) {
          var dict = this.dictionary[char];
          var dictIndex = Math.floor(Math.random() * dict.length);
          newChar = dict[dictIndex];
        }
      }

      return memo + newChar;
    }, "");
  };
};

toggleSubglyph = function() {

};
