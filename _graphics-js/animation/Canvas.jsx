import * as React from 'react';

"use strict";

class Canvas extends React.Component {

  render() {
    return (
      <div id="main-canvas-container" class="canvas-container">
        <canvas id="main-canvas" class="wide-canvas" height="{this.props.height}"></canvas>
      </div>
    );
  }

}