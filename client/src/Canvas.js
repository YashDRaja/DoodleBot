import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import * as tf from '@tensorflow/tfjs';

const Canvas = props => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [coords, setCoords] = useState([]);
  //const [tempCoords, setTempCoords] = useState([]);
  const [model, setModel] = useState();
  const loadModel = async () => {
    console.log('loading');
    let curmodel = await tf.loadLayersModel('https://raw.githubusercontent.com/zaidalyafeai/zaidalyafeai.github.io/master/sketcher/model2/model.json');
    curmodel.predict(tf.zeros([1, 28, 28, 1]));
    setModel(curmodel);
  }
  const loadClassNames = async () => {
    let arr = [];
    fetch('https://raw.githubusercontent.com/zaidalyafeai/zaidalyafeai.github.io/master/sketcher/model2/class_names.txt')
    .then((r) => {return r.text()})
    .then(text => {
      const lst = text.split(/\n/);
      for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i];
        arr[i] = symbol;
      }
      setClassNames(arr);
    });
  }
  const [classNames, setClassNames] = useState();
  const isDrawing = useRef(false);

  const getMinBox = () => {
    let coorX = coords.map((p) => {
      return p.x
    });
    let coorY = coords.map((p) => {
      return p.y
    });
    let min_coords = {
      x: Math.min.apply(null, coorX),
      y: Math.min.apply(null, coorY)
    }
    let max_coords = {
      x: Math.max.apply(null, coorX),
      y: Math.max.apply(null, coorY)
    }
    return {
      min: min_coords,
      max: max_coords
    }
  }

  const getImageData = (e) => {
    const mbb = getMinBox();
    const dpi = window.devicePixelRatio;
    const imgData = e.target.getStage()
                            .getChildren()[0]
                            .getCanvas()
                            .getContext()
                            .getImageData(
                              mbb.min.x * dpi,
                              mbb.min.y * dpi,
                              (mbb.max.x - mbb.min.x) * dpi,
                              (mbb.max.y - mbb.min.y) * dpi
                            );

    for(var i = 0; i < imgData.data.length; i += 4) {
        if (imgData.data[i] === 0 &&
            imgData.data[i + 1] === 0 &&
            imgData.data[i + 2] === 0 &&
            imgData.data[i + 3] === 0) {

          imgData.data[i] = 255;
          imgData.data[i + 1] = 255;
          imgData.data[i + 2] = 255;
          imgData.data[i + 3] = 255;
        }
    }
    return imgData;
  }

  const getFrame = (e) => {
    if (coords.length >= 2) { 
      const imgData = getImageData(e);
      const pred = model.predict(preprocess(imgData)).dataSync();
      const indices = findIndicesOfMax(pred, 5);
      const probs = findTopValues(pred, 5);
      const names = getClassNames(indices);
      console.log(probs);
      console.log(names);
    }
  }
  
  const getClassNames = (indices) => {
    var output = [];
    for (var i = 0; i < indices.length; i++)
      output[i] = classNames[indices[i]];
    return output;
  }

  const findIndicesOfMax = (inp, count) => {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
      outp.push(i); // add index to output array
      if (outp.length > count) {
        outp.sort((a, b) => {
            return inp[b] - inp[a];
        }); // descending sort the output array
        outp.pop(); // remove the last index (index of smallest element in output array)
      }
    }
    return outp;
  }

  const findTopValues = (inp, count) => {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show 5 greatest scores
    for (var i = 0; i < indices.length; i++)
      outp[i] = inp[indices[i]]
    return outp
  }

  function preprocess(imgData) {
    return tf.tidy(() => {
      //convert to a tensor
      let tensor = tf.browser.fromPixels(imgData, 1);
      
      //resize 
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
      
      //normalize 
      const offset = tf.scalar(255.0);
      const normalized = tf.scalar(1.0).sub(resized.div(offset));

      //We add a dimension to get a batch shape
      const batched = normalized.expandDims(0);
      return batched;
    })
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setCoords(coords.concat({x: pos.x, y: pos.y}));
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    // if (tempCoords.length > 10) {
    //   setCoords(coords.concat(tempCoords));
    //   setTempCoords([]);
    // }

    // setTempCoords(tempCoords.concat({x: point.x, y: point.y}));
    setCoords(coords => [...coords, {x: point.x, y: point.y}]);

    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = (e) => {
    //setCoords(coords.concat(tempCoords));
    //setTempCoords([]);
    getFrame(e);
    isDrawing.current = false;
  };

  useEffect(() => {
    loadModel();
    loadClassNames();
  }, [tool]);

  const clearCanvas = () => {
    setLines([]);
    setCoords([]);
  }

  return (
    <div>
      <button onClick={clearCanvas}>Clear canvas</button>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#000000"
              strokeWidth={10}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === 'eraser' ? 'destination-out' : 'source-over'
              }
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default Canvas