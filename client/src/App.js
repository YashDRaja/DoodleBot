import './App.css';
import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import CanvasDraw from "react-canvas-draw";


//const model = await tf.loadLayersModel('model/model.json')



/*
function getMinBox(){
  var coorX = coords.map((p) => {return p.x});
  var coorY = coords.map((p) => {return p.y});
  //find top left corner 
  var min_coords = {
   x : Math.min.apply(null, coorX),
   y : Math.min.apply(null, coorY)
  }
  //find right bottom corner 
  var max_coords = {
   x : Math.max.apply(null, coorX),
   y : Math.max.apply(null, coorY)
  }
  return {
   min : min_coords,
   max : max_coords
  }
}
*/

class App extends Component {

  state = {
    savedData: {},
    color: "#ffc600",
    width: 400,
    height: 400,
    brushRadius: 1,
    lazyRadius: 0
  };

  render() {
    return (
      <div className="App">

        <CanvasDraw
            brushColor={this.state.color}
            brushRadius={this.state.brushRadius}
            lazyRadius={this.state.lazyRadius}
            canvasWidth={this.state.width}
            canvasHeight={this.state.height}
            ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
            onChange = {() => {
              this.setState({savedData: this.saveableCanvas.getSaveData()});
              const {lines, width, height} = JSON.parse(this.state.savedData);
              console.log(lines);
            }} />

      </div>
    )
  }
}

export default App;
