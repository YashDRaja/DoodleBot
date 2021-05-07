import { React, useState, useContext, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { Field, Form, Formik } from "formik";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Spacer,
  Input,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import axios from 'axios';
import { AuthContext } from '../../helpers/AuthContext'

export default function History({
  ...rest
}) {
  const [playHistory, setPlayHistory] = useState([])


  useEffect(() => {
    let playHistory;
    axios.get('http://localhost:3001/game/profile', { withCredentials: true })
      .then((response) => {

        if (response.data.error) {
          setPlayHistory([
          <Box align="center" minW="70vw" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
            USER NOT LOGGED IN
          </Box>
          ])
        } else {
          //games = response.data.map((game) => {
          let games = [];
          if (response.data.length == 0) {
            games.push(
              <Box align="center" minW="70vw" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                No games played
              </Box>
            )
          }
          for (let i = 0; i < response.data.length; i++) {
            games.push(
              <Box minW="70vw" borderWidth="1px" borderRadius="lg" bg="#f5ffed">
                
                <Flex>
                  <Stack alignItems="center" p={3}>
                   <Box h="10">
                    Given Word:
                    </Box>
                    <Box h="10">
                    {response.data[i].given_word}
                    </Box>
                  </Stack>
                  <Spacer />
                  <Stack alignItems="center" p={3}>
                    <Box  h="10">
                    Guessed Word:
                    </Box>
                    <Box  h="10">
                    {response.data[i].guessed_word}
                    </Box>
                  </Stack>
                  <Spacer />
                  <Stack alignItems="center" p={3}>
                    <Box h="10">
                    Game Type:
                    </Box>
                    <Box h="10">
                    {response.data[i].game_type}
                    </Box>
                  </Stack>
                  <Spacer />
                  <Stack alignItems="center" p={3}>
                    <Box h="10">
                    Game Date:
                    </Box>
                    <Box h="10">
                    {response.data[i].createdAt.slice(0,10)}
                    </Box>
                  </Stack>
                </Flex>
              </Box>

            )
          }
          setPlayHistory(games);
          //console.log(response.data);
        }
      }).catch((e) => {
        console.log(e);
      })


  }, []);


  return (
    <Flex
      align="flex-start"
      justify={{ base: "center", md: "start", xl: "flex-start" }}
      direction={{ base: "column-reverse", md: "row" }}
      wrap="no-wrap"
      minH="70vh"
      px={8}
      mb={16}
      {...rest}
    >
      <Stack>
        {playHistory}
      </Stack>
    </Flex>
  );
}