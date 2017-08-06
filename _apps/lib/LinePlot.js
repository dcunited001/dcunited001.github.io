class LinePlot {
  constructor(context, size, options = {}) {
    this._size = size;
    this._rolling = options.rolling ? true : false;
    this._currentIndex = size - 1;

    this._lineColor = options.lineColor || vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this._lineWidth = options.lineWidth || 10;

    this._pos = new Float32Array(size * 2);
    this._max = options.max || { value: 1, dynamic: false };
    this._min = options.min || { value: 0, dynamic: false };

    if (this._max.dynamic) {
      this._max.index = 0;
      this._max.age = 0;
      this._max.expiresAfter = options.max.expiresAfter || this._size;
    }
    if (this._min.dynamic) {
      this._min.index = 0;
      this._min.age = 0;
      this._min.expiresAfter = options.min.expiresAfter || this._size;
    }

    this._buffers = this.prepareBuffers(context, this._pos);
    this._vertexArray = this.prepareVertexArray(context, this._buffers);

    this._program = options.program;
    this.setUniformLocations(context);

    this._transformProgram = options.transformProgram;
    this._transformFeedback = context.createTransformFeedback();
    this._transformVertexArray = this.prepareTransformVertexArray(context, this._buffers);
    this._transformUniformLocations = {};
    this.setTransformUniformLocations(context);

    this._drawVertexArray = this.prepareDrawVertexArray(context, this._buffers);
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

  encodeTransform(context, options = {}) {
    // update data in buffers
    this.writeBuffers(context);

    context.enable(context.RASTERIZER_DISCARD);
    context.bindTransformFeedback(context.TRANSFORM_FEEDBACK, this._transformFeedback);
    context.useProgram(this._transformProgram);
    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, this._buffers.posTransformed);
    context.bindVertexArray(this._vertexArray);

    var scaledWidth = this._lineWidth / options.resolution[1];
    context.uniform1f(this._transformUniformLocations.u_lineWidth, scaledWidth); // scale for resolution
    context.uniformMatrix4fv(this._transformUniformLocations.u_projection, true, this.getTransformationMatrix());

    context.beginTransformFeedback(context.POINTS);
    context.drawArraysInstanced(context.POINTS, 0, this._size, 1);
    context.endTransformFeedback();
    context.disable(context.RASTERIZER_DISCARD);

    context.bindBufferBase(context.TRANSFORM_FEEDBACK_BUFFER, 0, null);
    context.bindVertexArray(null);
    context.useProgram(null);
  }

  encode(context, options = {}) {
    // TODO: vertex shader to transform x/y from that function's space to the screen space

    context.useProgram(this._program);

    context.viewport(0.0, 0.0, options.resolution[0], options.resolution[1]);

    if (options.beforeEncode) {
      options.beforeEncode(context, this);
    }

    if (options.encodeClear) {
      options.encodeClear(context, this);
    }

    context.uniform4fv(this._uniformLocations.u_lineColor, this._lineColor);
    context.bindVertexArray(this._drawVertexArray);

    if (options.encodeDraw) {
      options.encodeDraw(context,this);
    } else {
      context.drawArrays(context.TRIANGLE_STRIP, 0, this._size * 2);
    }

    if (options.afterEncode) {
      options.afterEncode(context, this);
    }
  }

  increment() {
    this._currentIndex = (this._currentIndex + 1) % this._size;
  }

  push(data) {
    this.increment();
    this.setDataPoint(this._currentIndex, data);

    this.updateMax(data[1]);
    this.updateMin(data[1]);
  }

  updateMax(value) {
    if (this._max.dynamic) {
      if (value > this._max.value) {
        this._max.value = value;
        this._max.index = this._currentIndex;
        this._max.age = 0;
      } else {
        if (this._max.age > this._max.expiresAfter) {
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

          this._max.value = newMax;
          this._max.age = newAge;
          this._max.index = newIndex;
        } else {
          this._max.age++;
        }
      }
    } else {
      this._max.value = (value > this._max ? value : this._max.value);
    }
  }

  updateMin(value) {
    if (this._min.dynamic) {
      if (value < this._min.value) {
        this._min.value = value;
        this._min.index = this._currentIndex;
        this._min.age = 0;
      } else {
        if (this._min.age > this._min.expiresAfter) {
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

          this._min.value = newMin;
          this._min.age = newAge;
          this._min.index = newIndex;
        } else {
          this._min.age++;
        }
      }
    } else {
      this._min.value = (value < this._min ? value : this._min.value);
    }
  }

  writeBuffers(context) {
    context.bindBuffer(context.ARRAY_BUFFER, this._buffers.pos);

    // rearrange the circular buffer so it can be drawn with triangle strips
    var posCopy = new Float32Array(this._size * 2);
    posCopy.set(this._pos.subarray((this._currentIndex + 1) * 2, this._size * 2), 0);
    posCopy.set(this._pos.subarray(0, (this._currentIndex + 1) * 2), (this._size - this._currentIndex - 1) * 2);
    context.bufferData(context.ARRAY_BUFFER, posCopy, context.STATIC_DRAW);

    context.bindBuffer(context.ARRAY_BUFFER, null);
  }

  prepareBuffers(context, pos) {
    var vertexPosBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosBuffer);
    context.bufferData(context.ARRAY_BUFFER, pos, context.STATIC_DRAW);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    var vertexPosTransformedBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, vertexPosTransformedBuffer);
    context.bufferData(context.ARRAY_BUFFER, this._size * 8 * Float32Array.BYTES_PER_ELEMENT, context.STREAM_COPY);
    context.bindBuffer(context.ARRAY_BUFFER, null);

    return {
      pos: vertexPosBuffer,
      posTransformed: vertexPosTransformedBuffer,
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
    context.vertexAttribPointer(vertexPosIdx, 4, context.FLOAT, false, 32, 0);
    context.enableVertexAttribArray(vertexPosIdx);

    var vertexPosIdx2 = 1;
    context.vertexAttribPointer(vertexPosIdx2, 4, context.FLOAT, false, 32, 16);
    context.enableVertexAttribArray(vertexPosIdx2);

    context.bindBuffer(context.ARRAY_BUFFER, null);
    context.bindVertexArray(null);

    return vertexArray;
  }

  prepareDrawVertexArray(context, buffers) {
    var vertexArray = context.createVertexArray();
    context.bindVertexArray(vertexArray);

    var vertexPosIdx = 0;
    context.bindBuffer(context.ARRAY_BUFFER, buffers.posTransformed);
    context.vertexAttribPointer(vertexPosIdx, 4, context.FLOAT, false, 0, 0);
    context.enableVertexAttribArray(vertexPosIdx);

    context.bindBuffer(context.ARRAY_BUFFER, null);
    context.bindVertexArray(null);

    return vertexArray;
  }

  getTransformationMatrix() {
    // TODO: update to draw a scanning graph

    var tCurrent = this.getDataPoint(this._currentIndex)[0];
    var tEarliest = this.getDataPoint((this._currentIndex + 1) % this._size)[0];
    var tRange = tCurrent - tEarliest;
    var tMid = tEarliest + tRange/2;

    var yMin = this._min.value;
    var yMax = this._max.value;
    var yRange = yMax - yMin;

    var translate = mat4.fromValues(
      2/tRange, 0, 0, 2*(-tEarliest - tRange/2)/tRange,
      0, 2/yRange, 0, 2*(-yMin - yRange/2)/yRange,
      0, 0, 1, -0.0001,
      0, 0, 0, 1
    );

    return translate;
  }
}

export { LinePlot };