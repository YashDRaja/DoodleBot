import axios from 'axios';
import { React, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Stage, Layer, Line } from 'react-konva';
import * as tf from '@tensorflow/tfjs';
import {
  Button, Flex, Text, Center, VStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody,
  useDisclosure, Table, Thead, Tbody, Tfoot, Tr, Th, Td,
} from "@chakra-ui/react";

export default function SinglePlatform({
  ...rest
}) {

  let history = useHistory();
  const [tool, setTool] = useState('pen');
  const [lines, setLines] = useState([]);
  const [coords, setCoords] = useState([]);
  const [preds, setPreds] = useState([]);
  const [model, setModel] = useState();
  const [classNames, setClassNames] = useState();
  const [target, setTarget] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [paused, setPaused] = useState(true);
  const [over, setOver] = useState(false);
  const [pastTargets, setPastTargets] = useState([]);
  const [won, setWon] = useState(false);
  const [[m, s], setTime] = useState([0, 20]);
  const [probs, setProbs] = useState([]);
  const [curTime, setCurTime] = useState();
  const [futureTime, setFutureTime] = useState();
  const [gamesPlayed, setGamesPlayed] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDrawing = useRef(false);
  
  const loadModel = async () => {
    let curmodel = await tf.loadLayersModel('https://raw.githubusercontent.com/YashDRaja/predictive-whiteboard/main/model/model.json');
    curmodel.predict(tf.zeros([1, 28, 28, 1]));
    setModel(curmodel);
  }
  
  const loadClassNames = async () => {
    let arr = [];
    fetch('https://raw.githubusercontent.com/YashDRaja/predictive-whiteboard/main/model/class_names.txt')
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
      setProbs(findTopValues(pred, 5));
      const names = getClassNames(indices);
      setPreds(names);
      if (names[0] === target) {
        setWon(true);
      }
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
      outp.push(i);
      if (outp.length > count) {
        outp.sort((a, b) => {
            return inp[b] - inp[a];
        });
        outp.pop();
      }
    }
    return outp;
  }

  const findTopValues = (inp, count) => {
    var outp = [];
    let indices = findIndicesOfMax(inp, count);
    for (var i = 0; i < indices.length; i++) {
      outp[i] = inp[indices[i]]
    }
    return outp
  }

  const preprocess = (imgData) => {
    return tf.tidy(() => {
      let tensor = tf.browser.fromPixels(imgData, 1);
      const resized = tf.image.resizeBilinear(tensor, [28, 28]).toFloat();
      const offset = tf.scalar(255.0);
      const normalized = tf.scalar(1.0).sub(resized.div(offset));
      const batched = normalized.expandDims(0);
      return batched;
    })
  }

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setCoords(coords.concat({x: pos.x, y: pos.y}));
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  }

  const handleMouseMove = (e) => {
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setCoords(coords => [...coords, {x: point.x, y: point.y}]);
    let lastLine;
    try {
      lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    } catch(e) {
      console.log(e);
    }
  }

  const handleMouseUp = (e) => {
    getFrame(e);
    isDrawing.current = false;
  }

  const clearCanvas = () => {
    setLines([]);
    setCoords([]);
  }

  const tick = () => {
    if (paused || over) return;
    let time = new Date(curTime);
    let newTime = new Date(futureTime);
    let diff = (newTime.getTime() - time.getTime())/1000;
    if (diff <= 0) {
      setOver(true);
      clearCanvas();
      reset();
      let newGame = {
        round: round,
        given_word: target,
        guessed_word: preds.length > 0 ? preds[0] : ''
      }
      setGamesPlayed(gamesPlayed => [...gamesPlayed, newGame]);
      setRound(round + 1);
      onOpen();
    } else {
      setTime([m, diff]);
      let timeToSet = new Date();
      setCurTime(timeToSet.toString());
    }
  }

  const reset = () => {
    setTime([0, 20]);
    setPaused(true);
    setOver(false);
  }

  const closeModal = () => {
    let randomItem = classNames[Math.floor(Math.random()*classNames.length)];
    while (pastTargets.includes(randomItem)) {
      randomItem = classNames[Math.floor(Math.random()*classNames.length)];
    }
    setPastTargets(pastTargets => [...pastTargets, randomItem]);
    setTarget(randomItem);
    setWon(false);
    setPreds([]);
    let time = new Date();
    setCurTime(time.toString());
    let newTime = new Date(time.getTime());
    newTime.setSeconds(newTime.getSeconds() + 20);
    setFutureTime(newTime.toString());
    onClose();
    setPaused(false);
  }

  const closeLastGame = () => {
    axios.post('http://localhost:3001/game/create',
                          {game_type: 'AI', score: score, rounds: gamesPlayed},
                          { withCredentials: true })
          .then((response) => {
            if (response.data.error) {
              console.log(response.data.error);
            } else {
              onClose();
              history.push('/games-played');
            }
          })
          .catch((e) => console.log(e));
  }

  useEffect(() => {
    loadModel();
    loadClassNames();
    onOpen();
  }, [tool, onOpen]);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 10);
    return () => clearInterval(timerID);
  });

  useEffect(() => {
    if (won) {
      reset();
      let newGame = {
        round: round,
        given_word: target,
        guessed_word: preds.length > 0 ? preds[0] : ''
      }
      setGamesPlayed(gamesPlayed => [...gamesPlayed, newGame]);
      setScore(score + 1);
      clearCanvas();
      setRound(round + 1);
      onOpen();
    }
  }, [won, onOpen]);

  return (
    <Flex
      align="center"
      justify={{ base: "center", md: "space-around", xl: "space-between" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="3xl">
            {
              round === 1 ? 'Tutorial' :
              round === 11 ? 'Game Results' :
              `Round ${round - 1} Results`
            }
          </ModalHeader>
          <ModalBody pb={2}>
              {
                round === 1 ? <Text color="#474B4F" fontSize="xl">Welcome to the game</Text> :
                round === 11 ? (
                <Center>
                  <VStack>
                    <Text color="#474B4F" fontSize="xl">Here are your game results</Text>
                    <Table variant="simple" size="md">
                      <Thead>
                        <Tr>
                          <Th>Round</Th>
                          <Th>Target Word</Th>
                          <Th>AI's Final Guess</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {
                          gamesPlayed.map((game) => {
                            return (
                              <Tr>
                                <Td>{game.round}</Td>
                                <Td>{game.given_word}</Td>
                                <Td isNumeric>{game.guessed_word}</Td>
                              </Tr>
                            )
                          })
                        }
                      </Tbody>
                      <Tfoot>
                        <Tr>
                          <Th></Th>
                          <Th>Final Score</Th>
                          <Th isNumeric>{score}</Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </VStack>
                </Center>
                ) : won ? (
                  <Center>
                    <VStack>
                      <Text color="#474B4F" fontSize="xl">
                        Nice  ! The AI was able to predict that you drew {preds[0]} with an accuracy of:
                      </Text>
                      <Text color="#064C2E" fontWeight="bold" fontSize="5xl">
                        {probs[0].toFixed(4)*100}%
                      </Text>
                    </VStack>
                  </Center>
                ) :
                <Text color="#474B4F" fontSize="xl">Ouch, you ran out of time. Better luck next time!</Text>
              }
          </ModalBody>
          <ModalFooter>
              {
                round === 11 ? (
                  <Button colorScheme="green" onClick={closeLastGame}>
                    Close
                  </Button>
                ) : (
                  <Button colorScheme="green" onClick={closeModal}>
                    Continue to Round {round}
                  </Button>
                )
              }
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      <Flex
        align="center"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "column" }}
        wrap="no-wrap"
        minH="70vh"
        mb={16}
        mr={4}
        {...rest}
      >
        <Flex
          justify="center"
          direction="center"
          minW={window.innerWidth/3}
          wrap="no-wrap"
          color="white"
        >
          <Button onClick={clearCanvas} colorScheme="green" w="100%" borderRadius="1rem 1rem 0 0">Clear</Button>
        </Flex>
        <div style={{backgroundColor: "#ffffff", borderRadius: "0 0 1rem 1rem"}}>
          <Stage
            width={window.innerWidth/3}
            height={window.innerHeight*3/4}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke="#0A864F"
                  strokeWidth={10}
                  tension={0.3}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </Flex>
      <Flex
        align="center"
        minW="12vw"
        justify={{ base: "center", md: "space-around", xl: "space-between" }}
        direction={{ base: "column-reverse", md: "column" }}
        wrap="no-wrap"
        ml={4}
        {...rest} 
      >
        <Center mb="4" w="100%" borderWidth="1px" bg="white" borderRadius="2xl" p="5" overflow="hidden">
          <Text color="#86C232" fontWeight="bold" fontSize="5xl">
            {`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
          </Text>
        </Center>
        <Center mb="4" mt="4" w="100%" borderWidth="1px" bg="white" borderRadius="2xl" p="5" overflow="hidden">
          <VStack>
            <Text color="#474B4F" fontWeight="bold" fontSize="3xl">Target Word</Text>
            <Text color="#064C2E" fontWeight="bold" fontSize="4xl">{target !== "" ? target : <p>&nbsp;</p>}</Text>
          </VStack>
        </Center>
        <Center mb="4" mt="4" w="100%" borderWidth="1px" bg="white" borderRadius="2xl" p="5" overflow="hidden">
          <VStack>
            <Text color="#474B4F" fontWeight="bold" fontSize="3xl">AI's Guess</Text>
            <Text color="#064C2E" fontWeight="bold" fontSize="4xl">{preds.length > 0 ? preds[0] : <p>&nbsp;</p>}</Text>
          </VStack>
        </Center>
        <Center mt="4" w="100%" borderWidth="1px" bg="white" borderRadius="2xl" p="5" overflow="hidden">
          <VStack>
            <Text color="#474B4F" fontWeight="bold" fontSize="3xl">Score</Text>
            <Text color="#064C2E" fontWeight="bold" fontSize="4xl">{score}</Text>
          </VStack>
        </Center>
      </Flex>
    </Flex>
  );
}