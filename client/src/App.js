import './App.css';
import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
import Canvas from './Canvas'


//const model = await tf.loadLayersModel('model/model.json')


class App extends Component {
  render() {
    return (
      <div className="App">
        <Canvas />
      </div>
    )
  }
}

export default App;
