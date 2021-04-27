import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';


const Canvas = props => {
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [coords, setCoords] = useState([]);
  const isDrawing = useRef(false);

  // const getMinBox = () => {
  //   let coorX = coords.map((p) => {
  //     return p.x
  //   });
  //   let coorY = coords.map((p) => {
  //     return p.y
  //   });
  //   let min_coords = {
  //     x: Math.min.apply(null, coorX),
  //     y: Math.min.apply(null, coorY)
  //   }
  //   let max_coords = {
  //     x: Math.max.apply(null, coorX),
  //     y: Math.max.apply(null, coorY)
  //   }
  //   return {
  //     min: min_coords,
  //     max: max_coords
  //   }
  // }

  // const getImageData = () => {
  //   const mbb = getMinBox();
  //   const dpi = window.devicePixelRatio;
  //   const imgData = canvas.contextContainer
  //                         .getImageData(
  //                           mbb.min.x * dpi,
  //                           mbb.min.y * dpi,
  //                           (mbb.max.x - mbb.min.x) * dpi,
  //                           (mbb.max.y - mbb.min.y) * dpi);
  //   return imgData;
  // }

  // const getFrame = () => {
  //   if (coords.length >= 2) { 
  //     const imgData = getImageData()
  //     const pred = model.predict(preprocess(imgData)).dataSync()
  //     const indices = findIndicesOfMax(pred, 5)
  //     const probs = findTopValues(pred, 5)
  //     const names = getClassNames(indices)
  //     setTable(names, probs)
  //   }
  // }

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
    setCoords(coords.concat({x: point.x, y: point.y}));
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = (e) => {
    isDrawing.current = false;
    console.log(coords);
    // console.log(e.target.getStage().getChildren()[0].getCanvas().getContext().getImageData(
    //                             mbb.min.x * dpi,
    //                             mbb.min.y * dpi,
    //                             (mbb.max.x - mbb.min.x) * dpi,
    //                             (mbb.max.y - mbb.min.y) * dpi));
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
      >
        <Layer>
          <Text text="Just start drawing" x={5} y={30} />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
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