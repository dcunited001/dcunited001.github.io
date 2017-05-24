"use strict";

class LinePlot {
  constructor(context, size, options = {}) {
    this._size = size;
    this._rolling = options.rolling ? true : false;
    this._currentIndex = size;

    this._lineColor = options.color || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this._lineWidth = options.lineWidth || 5;

    this._pos = new Float32Array(size * 2);
    this._max = { value: 1, dynamic: false } || options.max;
    this._min = { value: 0, dynamic: false } || options.min;

    if (this._max.dynamic) { this._max.index = 0; this._max.age = 0; }
    if (this._min.dynamic) { this._min.index = 0; this._min.age = 0; }

    this._buffers = this.prepareBuffers(context, this._pos);
    this._vertexArray = this.prepareVertexArray(context, this._buffers);

    this._transformFeedback = context.createTransformFeedback();
    this._transformVertexArray = prepareTransformVertexArray();

    this._transformUniformLocations = {};
    this._uniformLocations = {};
  }

  getDataPoint(n) {
    return [
      this._pos[n * 2],
      this._pos[n * 2 + 1]
    ];
  }

  setDataPoint(n, d) {
    this._pos[n * 2] = d[0];
    this._pos[n * 2 + 1] = d[1];
  }

  get pos() { return this._pos; }
  set pos(pos) { this._pos = pos; }
  get buffers() { return this._buffers; }
  set buffers(buffers) { this._buffers = buffers; }
  get vertexArray() { return this._vertexArray; }
  set vertexArray(vertexArray) { this._vertexArray = vertexArray; }

  get program() { return this._program; }
  set program(program) { this._program = program; }
  get transformProgram() { return this._transformProgram; }
  set transformProgram(transformProgram) { this._transformProgram = transformProgram; }

  get uniformLocations() { return this._uniformLocations; }
  get transformUniformLocations() { return this._transformUniformLocations; }

  setUniformLocations(context) {
    this._uniformLocations = {
      u_lineColor: context.getUniformLocation(this._program, 'u_lineColor')
    }
  }

  setTransformUniformLocations(context) {
    this._transformUniformLocations = {
      u_lineWidth: context.getUniformLocation(this._transformProgram, 'u_lineWidth'),
      u_projection: context.getUniformLocation(this._transformProgram, 'u_projection')
    }
  }

  encodeTransform(context, program) {
    context.useProgram(this._transformProgram);
    context.enable(context.RASTERIZER_DISCARD);
    context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, this._transformFeedback);
    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this.buffers.posTransformed);
    context.bindVertexArray(this._transformVertexArray);

    context.uniform1i(this._uniformLocations.u_lineWidth, this._lineWidth);
    context.uniformMatrix4fv(this._uniformLocations.u_projection, getTransformationMatrix());

    context.beginTransformFeedback(context.POINTS);
    context.drawArrays(context.POINTS, 0, this._size);
    context.endTransformFeedback();
    context.disable(context.RASTERIZER_DISCARD);

    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    context.bindVertexArray(null);
    context.useProgram(null);
  }

  encode(context) {
    // TODO: vertex shader to transform x/y from that function's space to the screen space

    context.uniform4fv(this._uniformLocations.u_lineColor, this._lineColor);

    // if (rolling)
    // draw calls for (0 .. current index)
    // draw calls for (current index .. size)

    // else
    // TODO: later

  }

  increment() {
    this._currentIndex = (this._currentIndex + 1) % this._size;
  }

  push(data) {
    this.increment();
    setDataPoint(this._currentIndex, data);

    updateMax();
    updateMin();
  }

  updateMax(value) {
    if (this._max.dynamic) {
      if (value > this._max.value) {
        this._max.value = value;
        this._max.index = this._currentIndex;
        this._max.age = 0;
      } else {
        if (this._max.age > this._size) {
          // find the new max & index
          var newMax = Number.NEGATIVE_INFINITY;
          var newAge = 0;
          var newIndex = this._size - 1;

          for (var i = 0; i < this._size; i++) {
            var thisIndex = (this._currentIndex + i) % this._size;
            var data = this.getDataPoint(thisIndex);
            if (data[1] > newMax) {
              newMax = data[1];
              newAge = this._size - i - 1;
              newIndex = i;
            }
          }

          this._max = {
            value: newMax,
            age: newAge,
            index: newIndex
          }

        } else {
          this._max.age++;
        }
      }
    } else {
      this._max.value = (value > this._max ? value : this._max);
    }
  }

  updateMin(value) {
    if (this._min.dynamic) {
      if (value < this._min.value) {
        this._min.value = value;
        this._min.index = this._currentIndex;
        this._min.age = 0;
      } else {
        if (this._min.age > this._size) {
          // find the new min & index
          var newMin = Number.POSITIVE_INFINITY;
          var newAge = 0;
          var newIndex = this._size - 1;

          for (var i = 0; i < this._size; i++) {
            var thisIndex = (this._currentIndex + i) % this._size;
            var data = this.getDataPoint(thisIndex);
            if (data[1] < newMin) {
              newMin = data[1];
              newAge = this._size - i - 1;
              newIndex = i;
            }
          }

          this._min = {
            value: newMin,
            age: newAge,
            index: newIndex
          }

        } else {
          this._min.age++;
        }
      }
    } else {
      this._min.value = (value < this._min ? value : this._min);
    }
  }

  prepareBuffers(context, pos) {
    var vertexPosBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
    context.bufferData(context.ARRAY_BUFFER, pos, context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexPosTransformedBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
    context.bufferData(context.ARRAY_BUFFER, new Float32Array(this._size * 2), context.STATIC_COPY);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return {
      pos: vertexPosBuffer,
      posTransformed: vertexPosTransformedBuffer
    };
  }

  prepareVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.pos);
    context.vertexAttribPointer(vertexPosIdx, 2, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    context.bindVertexArray(null);
    return vertexArray;
  }

  prepareTransformVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.posTransformed);
    context.vertexAttribPointer(vertexPosIdx, 8, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    context.bindVertexArray(null);
    return vertexArray;
  }

  getTransformationMatrix() {
    var xmin = this.getDataPoint(this._currentIndex)[0];
    var xmax = this.getDataPoint((this._currentIndex + 1) % this._size)[0];
    var xrange = xmax - xmin;

    var ymin = this._min.value;
    var ymax = this._max.value;
    var yrange = ymax - ymin;

    var translate = matrix4x4.fromValues(
      1, 0, 0, -xmin,
      0, 1, 0, -ymin,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    var scale = matrix4x4.fromValues(
      1/xrange, 0, 0, 0,
      0, 1/yrange, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );

    return translate.multiply(scale);
  }
}
