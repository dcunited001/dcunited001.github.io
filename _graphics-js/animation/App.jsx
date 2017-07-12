import * as React from 'react';

"use strict";

// two way data binding
// https://objectpartners.com/2017/04/24/two-way-data-binding-in-reactjs-part-i/

class App extends Component {

  // TODO: set up refs to handle UI events

  function render() {
    return (
    <ControlBar position="top">
      <!--<div class="btn-group navbar-left">-->
      <!--<button id="btn-play-pause" class="btn btn-primary navbar-btn" onclick="togglePause()"><i class="fa fa-lg fa-pause"></i></button>-->
      <!--<button id="btn-activate-mic" class="btn btn-primary navbar-btn" onclick="activateMic()"><i class="fa fa-lg fa-microphone"></i></button>-->
      <!--<button id="btn-reset" class="btn btn-primary navbar-btn" onclick="setResetParticles()"><i class="fa fa-lg fa-refresh"></i></button>-->

      <!--<button type="button" class="btn btn-primary navbar-btn dropdown-toggle" data-toggle="dropdown">-->
      <!--<span class="caret"></span>-->
      <!--<span class="sr-only">Toggle Dropdown</span>-->
      <!--</button>-->
      <!--</div>-->
    </ControlBar>
    <Canvas height="500" />
    <div id="canvas-ui-bar-bottom" class="navbar navbar-inverse navbar-graphics navbar-graphics-bottom">
      <div class="container">

      </div>
    </div>
    <ControlBar position="bottom">
    </ControlBar>
      <ControlContainer>
        <div class="row">
          <ControlGroup>
            <!-- TODO: use react-bootstrap for UI and connect to an App ref (bad design, but simple) -->

            <div class="col-sm-6">
              <ControlLabel htmlFor="particle-count">Particle Count</ControlLabel>
              <input id="particle-count" type="range" min="16" max="5120" step="16" value="512"/>

              <ControlLabel htmlFor="time-dialation">Time "Dialation"</ControlLabel>
              <input id="time-dialation" type="range" min="0.00625" max="2.0" step="0.00625" value="0.05"/>

              <label for="r-coefficient">R-Force Coefficient:</label>
              <input id="r-coefficient" type="range" min="0.001" max="10.0" step="0.0001" value="0.1"/>

              <label for="field-size">Field Effect Size:</label>
              <input id="field-size" type="range" min="1.0" max="300.0" step="1.0" value="75.0"/>

              <label for="max-field-lines">(rename)</label>
              <input id="max-field-lines" type="range" min="0.0" max="10.0" step="1.0" value="1.0"/>
            </div>
          </ControlGroup>
        </div>

      </ControlContainer>
    )
  }
}