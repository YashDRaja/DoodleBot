import axios from 'axios';
import { React, useState, useRef, useEffect } from "react";
import { Stage, Layer, Line } from 'react-konva';
import * as tf from '@tensorflow/tfjs';
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton
} from "@chakra-ui/react";

export default function SinglePlatform({
  title,
  ctaText,
  ...rest
}) {
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
      
    </Flex>
  );
}