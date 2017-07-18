"use strict";

class ShaderPrefix {
  constructor(version, options = {}) {
    this._version = version;
    this._extensions = options.extensions || {};
    this._precisions = options.precisions || {};
    this._defines = options.defines || {};
  }

  get version() { return this._version; }
  get extensions() { return this._extensions; }
  get precisions() { return this._precisions; }
  get defines() { return this._defines; }

  generate(input = {}) {
    var version = input.version || this.version,
      precisions = Object.assign({}, this.precisions, input.precisions),
      extensions = Object.assign({}, this.extensions, input.extensions),
      defines = Object.assign({}, this.defines, input.defines);

    return [this.constructor.generateVersion(version),
      this.constructor.generateExtensions(extensions),
      this.constructor.generatePrecisions(precisions),
      this.constructor.generateDefines(defines)
    ].join('\n\n');
  }

  static generateVersion(version) {
    return `#version ${version}`;
  }

  static generatePrecisions(precisions) {
    return Object.entries(precisions).map(([k,v]) => {
      return `precision ${v} ${k}`;
    }).join('\n');
  }

  static generateExtensions(extensions) {
    return Object.entries(extensions).map(([k,v]) => {
      return `#extension ${v} ${k}`;
    }).join('\n');
  }

  static generateDefines(defines) {
    return Object.entries(defines).map(([k,v]) => {
      return `#define ${k} ${v}`
    }).join('\n')
  }
}

export { ShaderPrefix };